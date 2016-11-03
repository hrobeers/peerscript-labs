pa = require '../lib/peerassets/peerassets'

{ Transaction, PrivateKey, Networks, crypto } = require 'bitcore-lib'
{ assert } = require 'chai'
{ Buffer } = require 'buffer'

describe 'PeerAssets tests', ->
  specify 'P2TH', (done) ->
    test-vector = {
      "txnId": "c23375caa1ba3b0eec3a49fff5e008dede0c2761bb31fddd830da32671c17f84",

      "WIF": "UBctiEkfxpU2HkyTbRKjiGHT5socJJwCny6ePfUtzo8Jad9wVzeA",
      "Address":"PRoUKDUhA1vgBseJCaGMd9AYXdQcyEjxu9"
      "testnetWIF": "cU6CjGw3mRmirjiUZfRkJ1aj2D493k7uuhywj6tCVbLAMABy4MwU",
      "testnetAddress": "mxjFTJApv7sjz9T9a4vCnAQbmsqSoL8VWo"
    }

    mainnet = Networks.get 'peercoin'
    testnet = Networks.get 'peercoin-testnet'

    # Hex to BN for compressed key generation
    binaryTxnId = Buffer.from(test-vector.txnId, 'hex')
    bn = crypto.BN.fromBuffer(binaryTxnId)

    priv = new PrivateKey(bn, mainnet)
    assert.equal priv.toWIF(), test-vector.WIF
    assert.equal priv.toAddress().toString(), test-vector.Address

    priv = PrivateKey.fromBuffer(bn, testnet)
    assert.equal priv.toWIF(), test-vector.testnetWIF
    assert.equal priv.toAddress().toString(), test-vector.testnetAddress

    done()
