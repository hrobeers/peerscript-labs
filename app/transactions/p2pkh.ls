# Create and test standard P2PKH scripts & transactions

{ Transaction } = require 'bitcore-lib'

describe 'P2PKH', ->
  specify 'Coming soon', (done) ->
    transaction = new Transaction()
    # .from(unspent-output)
    .fee(100)
    transaction.serialize(true)
    done()
