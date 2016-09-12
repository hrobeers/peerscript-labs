# Create and test standard P2PKH scripts & transactions

{ Transaction } = require 'bitcore-lib'

unspent-output = new Transaction.UnspentOutput({
  "txId" : "6f46c18e85d072673b706c627f1c61a9b92f6f437699c7c711a276bef4885842",
  "outputIndex" : 0,
  "address" : "PUcZZBq2qg7z2EM2db8G4X7Z1JoduoBUZx",
  "scriptPubKey" : "76a914dba5a16361d062adb7cc81e752c4dc2062d076fb88ac",
  "satoshis" : 70000
})

describe 'P2PKH', ->
  specify 'Coming soon', (done) ->
    transaction = new Transaction()
    # .from(unspent-output)
    .fee(100)
    transaction.serialize(true) |> console.log
    done()
