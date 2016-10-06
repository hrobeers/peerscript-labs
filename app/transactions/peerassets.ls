pa = require './peerassets-lib'

{ Transaction, Script, PrivateKey } = require 'bitcore-lib'

asset-owner-private-key = new PrivateKey()

utxo = new Transaction.UnspentOutput {
  outputIndex: 0
  satoshis:100000
  address:asset-owner-private-key.to-public-key().to-address()
  script:Script.buildPublicKeyHashOut asset-owner-private-key.to-public-key()
  txId:'5d2fe2bd42b8de6451d42709b4a2f7f97f15485090b932b081d147e9d4cc754b'
}

pa.setup true, true

describe 'PeerAssets', ->
  specify 'Deck spawn', (done) ->
    deck-spawn-txn = pa.createDeckSpawnTransaction utxo, 'hello', 2, true
    console.warn 'Deck Spawn: ' + deck-spawn-txn.serialize(true)
    done()
