var pb = require('./peerassets_pb');
var bitcore = require('bitcore-lib');
var Buffer = require('buffer').Buffer;
var Script = bitcore.Script;
var Transaction = bitcore.Transaction;
var Input = Transaction.Input;
var Output = Transaction.Output;

var minTagFee = 10000; // 0.01PPC
var txnFee = 10000;   // 0.01PPC

// P2TH info
// PPC mainnet:
//  PAprod: PAprodbYvZqf4vjhef49aThB9rSZRxXsM6 - U624wXL6iT7XZ9qeHsrtPGEiU78V1YxDfwq75Mymd61Ch56w47KE
//  PAtest: PAtesth4QreCwMzXJjYHBcCVKbC4wjbYKP - UAbxMGQQKmfZCwKXAhUQg3MZNXcnSqG5Z6wAJMLNVUAcyJ5yYxLP
// PPC testnet:
//  PAprod: miHhMLaMWubq4Wx6SdTEqZcUHEGp8RKMZt - cTJVuFKuupqVjaQCFLtsJfG8NyEyHZ3vjCdistzitsD2ZapvwYZH
//  PAtest: mvfR2sSxAfmDaGgPcmdsTwPqzS6R9nM5Bo - cQToBYwzrB3yHr8h7PchBobM3zbrdGKj2LtXqg7NQLuxsHeKJtRL

var deckSpawnTagHash = undefined;
setup = function(PPCtestnet, PAtest) {
  // Setup the deck spawn tag hash
  if (!PPCtestnet && !PAtest)
    deckSpawnTagHash = 'PAprodbYvZqf4vjhef49aThB9rSZRxXsM6';
  else if (!PPCtestnet && PAtest)
    deckSpawnTagHash = 'PAtesth4QreCwMzXJjYHBcCVKbC4wjbYKP';
  else if (PPCtestnet && !PAtest)
    deckSpawnTagHash = 'miHhMLaMWubq4Wx6SdTEqZcUHEGp8RKMZt';
  else if (PPCtestnet && PAtest)
    deckSpawnTagHash = 'mvfR2sSxAfmDaGgPcmdsTwPqzS6R9nM5Bo';

  // Add getUnspentOutput function to Transaction object
  Transaction.prototype.getUnspentOutput = function(outputIndex) {
    var output = this.outputs[outputIndex];
    return new Transaction.UnspentOutput({
      outputIndex: outputIndex,
      satoshis: output.satoshis,
      script: output.script,
      txId: this.id,
      address: output.script.toAddress().toString()
    });
  }
};
setup(); // Defaults to mainnet & PAprod


//
// Deck spawn functions
//

var createDeckSpawnTransaction = function(utxo, shortName, numberOfDecimals, issueModes) {
  var deckSpawnTxn = new Transaction()
  .from(utxo)                           // vin[0]: Owner signature
  .to(deckSpawnTagHash, minTagFee)      // vout[0]: Deck spawn P2TH
  .addData(createDeckSpawnMessage(shortName, numberOfDecimals, issueModes))  // vout[1]: Asset data
  // free format from here, typically a change Output
  .to(utxo.address, utxo.satoshis-minTagFee-txnFee);  // vout[2]

  return deckSpawnTxn;
};

var decodeDeckSpawnTransaction = function(transaction) {
  // Test for validity
  // TODO: error handling
  var inputs = transaction.inputs
  var outputs = transaction.outputs;
  if (outputs.length < 2) return undefined;
  if (!outputs[0].script.isPublicKeyHashOut()) return undefined;
  if (!outputs[1].script.isDataOut()) return undefined;

  var retVal = decodeDeckSpawnMessage(outputs[1].script.getData());
  retVal.assetId = transaction.id;
  retVal.owner = inputs[0].script.toAddress().toString();

  return retVal;
}


//
// Card transfer functions
//

var createCardTransferTransaction = function(utxo, amountsMap, deckSpawnTxn) {
  var receivers = [];
  var amounts = [];
  for (a in amountsMap)
  {
    receivers.push(a);
    amounts.push(amountsMap[a]);
  }

  var cardTransferTxn = new Transaction()
  .from(utxo)                             // vin[0]: Sending party signature
  .to(assetTag(deckSpawnTxn), minTagFee)  // vout[0]: Asset P2TH
  .addData(createCardTransferMessage(amounts, deckSpawnTxn));  // vout[1]: Transfer data

  // vout[2] - vout[n+2] -> the receivers
  for (i=0; i<receivers.length; i++)
    cardTransferTxn.to(receivers[i], amounts[i]);  // vout[2]-vout[n+2]: Receiving parties

  // free format from here, typically a change Output
  cardTransferTxn.to(utxo.address, utxo.satoshis-minTagFee-minTagFee-txnFee);  // vout[3]

  return cardTransferTxn;
}

var decodeCardTransferTransaction = function(transaction) {
  // Test for validity
  // TODO: error handling
  var inputs = transaction.inputs;
  var outputs = transaction.outputs;
  if (outputs.length < 3) return undefined;
  if (!outputs[0].script.isPublicKeyHashOut()) return undefined;
  if (!outputs[1].script.isDataOut()) return undefined;

  var retVal = {};
  var msg = decodeCardTransferMessage(outputs[1].script.getData());
  retVal.numberOfDecimals = msg.numberOfDecimals;
  retVal.from = inputs[0].script.toAddress().toString();

  retVal.to = {};
  for (i=0; i<msg.amounts.length; i++)
  {
    // Test for validity
    if (!outputs[2+i].script.isPublicKeyHashOut() && !outputs[2+i].script.isScriptHashOut()) return undefined;
    retVal.to[outputs[2+i].script.toAddress().toString()] = msg.amounts[i];
  }

  return retVal;
}


//
// Exports
//

module.exports = {
  setup: setup,
  ISSUE_MODE: pb.DeckSpawn.MODE,
  createDeckSpawnTransaction: createDeckSpawnTransaction,
  decodeDeckSpawnTransaction: decodeDeckSpawnTransaction,
  createCardTransferTransaction: createCardTransferTransaction,
  decodeCardTransferTransaction: decodeCardTransferTransaction,
  createCardBurnTransaction: function(utxo, amount) {

  }
}


//
// Internal functions
//

var createDeckSpawnMessage = function(shortName, numberOfDecimals, issueModes) {
  var ds = new pb.DeckSpawn();
  ds.setVersion(1);
  ds.setShortName(shortName);
  ds.setNumberOfDecimals(numberOfDecimals);

  if (typeof issueModes == 'number') {
    ds.setIssueMode(issueModes);
  }
  else if (issueModes.length && typeof issueModes[0] == 'number') {
    var issueMode = 0;
    for (var i=0; i<issueModes.length; i++)
      issueMode = issueMode ^ issueModes[i];
    ds.setIssueMode(issueMode);
  }
  else {
    return undefined; // TODO: imlement array of strings & error handling
  }

  return new Buffer(ds.serializeBinary());
}

var decodeDeckSpawnMessage = function(message) {
  var ds = pb.DeckSpawn.deserializeBinary(new Uint8Array(message));
  var issueMode = ds.getIssueMode();

  return {
    version: ds.getVersion(),
    shortName: ds.getShortName(),
    numberOfDecimals: ds.getNumberOfDecimals(),
    issueMode: issueMode,
    getIssueModes: function() {
      var issueModes = [];
      for (var mode in pb.DeckSpawn.MODE)
        if (issueMode & pb.DeckSpawn.MODE[mode])
          issueModes.push(mode);
      return issueModes;
    }
  }
}

var assetTag = function(deckSpawnTxn) {
  // Create the compressed address for deckSpawnTxn.id
  var binaryTxnId = Buffer.from(deckSpawnTxn.id, 'hex');
  var bn = bitcore.crypto.BN.fromBuffer(binaryTxnId);
  return new bitcore.PrivateKey(bn).toPublicKey().toAddress();
}

var createCardTransferMessage = function(amounts, deckSpawnTxn) {
  var decoded = decodeDeckSpawnTransaction(deckSpawnTxn);
  if (!decoded) return undefined;

  var ct = new pb.CardTransfer();
  ct.setAmountsList(amounts);
  ct.setNumberOfDecimals(decoded.numberOfDecimals);

  return new Buffer(ct.serializeBinary());
}

var decodeCardTransferMessage = function(message) {
  var ds = pb.CardTransfer.deserializeBinary(new Uint8Array(message));

  return {
    amounts: ds.getAmountsList(),
    numberOfDecimals: ds.getNumberOfDecimals()
  }
}
