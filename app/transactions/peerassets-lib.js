var pb = require('./peerassets_pb');
var bitcore = require('bitcore-lib');
var Script = bitcore.Script;
var Transaction = bitcore.Transaction;
var Input = Transaction.Input;
var Output = Transaction.Output;

var minTagFee = 5000; // 0.005PPC
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
  if (!PPCtestnet && !PAtest)
    deckSpawnTagHash = 'PAprodpH5y2YuJFHFCXWRuVzZNr7Tw78sV';
  else if (!PPCtestnet && PAtest)
    deckSpawnTagHash = 'PAtestVJ4usB4JQwZEhFrYRgnhKh8xRoRd';
  else if (PPCtestnet && !PAtest)
    deckSpawnTagHash = 'miYNy9BbMkQ8Y5VaRDor4mgH5b3FEzVySr';
  else if (PPCtestnet && PAtest)
    deckSpawnTagHash = 'mwqncWSnzUzouPZcLQWcLTPuSVq3rSiAAa';
};
setup(); // Defaults to mainnet & PAprod

module.exports = {
  setup: setup,
  createDeckSpawnTransaction: function(utxo, shortName, numberOfDecimals, issueOnce) {
    var deckSpawnTxn = new Transaction()
    .from(utxo)                           // vin[0]
    .to(deckSpawnTagHash, minTagFee)      // vout[0]
    .addData(new Buffer(createDeckSpawnMessage(shortName, numberOfDecimals, issueOnce)))  // vout[1]
    // free format from here, typically a change Output
    .to(utxo.address, utxo.satoshis-minTagFee-txnFee);  // vout[2]

    return deckSpawnTxn;
  },
  createCardTransferTransaction: function(utxo, receiver, amount) {

  },
  createCardBurnTransaction: function(utxo, amount) {

  }
}

createDeckSpawnMessage = function(shortName, numberOfDecimals, issueOnce) {
  var ds = new pb.DeckSpawn();
  ds.setVersion(1);
  ds.setShortName(shortName);
  ds.setNumberOfDecimals(numberOfDecimals);
  ds.setIssueOnce(issueOnce);
  return ds.serializeBinary();
}
