var pb = require('./peerassets_pb');
var bitcore = require('bitcore-lib');
var Script = bitcore.Script;
var Transaction = bitcore.Transaction;
var Input = Transaction.Input;
var Output = Transaction.Output;

var minTagFee = 10000; // 0.01PPC
var txnFee = 10000;   // 0.01PPC

// P2TH info
// PPC mainnet:
//  PAprod: PAprodpH5y2YuJFHFCXWRuVzZNr7Tw78sV - 7A6cFXZSZnNUzutCMcuE1hyqDPtysH2LrSA9i5sqP2BPCLrAvZM
//  PAtest: PAtestVJ4usB4JQwZEhFrYRgnhKh8xRoRd - 79nanGVB5H5cGrpqN69F3v4rjyhXy5DiqF499TB5poF627Z1Gw4
// PPC testnet:
//  PAprod: miYNy9BbMkQ8Y5VaRDor4mgH5b3FEzVySr - 92NRcL14QbFBREH8runJAq3Q1viQiHoqTmivE8SNRGJ2Y1U6G3a
//  PAtest: mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa - 92oB4Eb4GBfutvtEqDZq3T5avC7pnEkPVme23qTb5mDdDesinm6

var deckSpawnTagHash = undefined;
setup = function(PPCtestnet, PAtest) {
  // Setup the deck spawn tag hash
  if (!PPCtestnet && !PAtest)
    deckSpawnTagHash = 'PAprodpH5y2YuJFHFCXWRuVzZNr7Tw78sV';
  else if (!PPCtestnet && PAtest)
    deckSpawnTagHash = 'PAtestVJ4usB4JQwZEhFrYRgnhKh8xRoRd';
  else if (PPCtestnet && !PAtest)
    deckSpawnTagHash = 'miYNy9BbMkQ8Y5VaRDor4mgH5b3FEzVySr';
  else if (PPCtestnet && PAtest)
      deckSpawnTagHash = 'mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa';

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

var createCardTransferTransaction = function(utxo, receiver, amount, deckSpawnTxn) {
  var cardTransferTxn = new Transaction()
  .from(utxo)                             // vin[0]: Sending party signature
  .to(receiver, minTagFee)                // vout[0]: Receiving party
  .to(assetTag(deckSpawnTxn), minTagFee)  // vout[1]: Asset P2TH
  .addData(createCardTransferMessage(amount, deckSpawnTxn))  // vout[2]: Transfer data
  // free format from here, typically a change Output
  .to(utxo.address, utxo.satoshis-minTagFee-minTagFee-txnFee);  // vout[3]

  return cardTransferTxn;
}

var decodeCardTransferTransaction = function(transaction) {
  // Test for validity
  // TODO: error handling
  var inputs = transaction.inputs;
  var outputs = transaction.outputs;
  if (outputs.length < 3) return undefined;
  if (!outputs[0].script.isPublicKeyHashOut() && !outputs[0].script.isScriptHashOut()) return undefined;
  if (!outputs[1].script.isPublicKeyHashOut()) return undefined;
  if (!outputs[2].script.isDataOut()) return undefined;

  var retVal = decodeCardTransferMessage(outputs[2].script.getData());
  retVal.from = inputs[0].script.toAddress().toString();
  retVal.to = outputs[0].script.toAddress().toString();

  return retVal;
}

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
  return new bitcore.PrivateKey(deckSpawnTxn.id).toPublicKey().toAddress();
}

var createCardTransferMessage = function(amount, deckSpawnTxn) {
  var decoded = decodeDeckSpawnTransaction(deckSpawnTxn);
  if (!decoded) return undefined;

  var ct = new pb.CardTransfer();
  ct.setAmount(amount);
  ct.setNumberOfDecimals(decoded.numberOfDecimals);

  return new Buffer(ct.serializeBinary());
}

var decodeCardTransferMessage = function(message) {
  var ds = pb.CardTransfer.deserializeBinary(new Uint8Array(message));

  return {
    amount: ds.getAmount(),
    numberOfDecimals: ds.getNumberOfDecimals()
  }
}
