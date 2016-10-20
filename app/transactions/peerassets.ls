pa = require './peerassets-lib'

{ Transaction, Script, PrivateKey } = require 'bitcore-lib'
{ assert } = require 'chai'

asset-owner-private-key = new PrivateKey()

prev-txn = new Transaction().to(asset-owner-private-key.to-public-key().to-address(), 10000000)
utxo = prev-txn.get-unspent-output 0

pa.setup true, true

describe 'PeerAssets', ->
  specify 'Deck spawn', (done) ->
    asset-short-name = 'hello'
    number-of-decimals = 2

    # Create deck spawn transaction
    deck-spawn-txn = utxo
    |> pa.createDeckSpawnTransaction _, asset-short-name, number-of-decimals, [
      pa.ISSUE_MODE.ONCE,
      pa.ISSUE_MODE.PEG
    ]

    # Decode deck spawn transaction
    decoded-deck-spawn-txn = deck-spawn-txn
    |> pa.decodeDeckSpawnTransaction _

    # Check encoded asset data
    assert.equal decoded-deck-spawn-txn.shortName, asset-short-name, 'Failed to decode asset short name'
    assert.equal decoded-deck-spawn-txn.number-of-decimals, number-of-decimals, 'Failed to decode number of decimals'
    assert decoded-deck-spawn-txn.issue-mode .&. pa.ISSUE_MODE.ONCE, 'Failed to check ONCE flag'
    assert decoded-deck-spawn-txn.issue-mode .&. pa.ISSUE_MODE.PEG, 'Failed to check PEG flag'
    assert.deepEqual decoded-deck-spawn-txn.get-issue-modes(), ['ONCE', 'PEG'], 'Failed to get issue mode list'

    # Make sure bitwise combination of issue modes serializes equally
    deck-spawn-txn2 = utxo
    |> pa.createDeckSpawnTransaction _,
        asset-short-name,
        number-of-decimals,
        pa.ISSUE_MODE.ONCE .^. pa.ISSUE_MODE.PEG
    assert.equal deck-spawn-txn2.serialize(true), deck-spawn-txn.serialize(true)

    done()
