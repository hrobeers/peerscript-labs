{ app-require } = require './test-utils'

bitcore = require 'bitcore-lib'
app-require 'lib/bitcore-ppc/bitcore-ppc'
config = app-require 'config'
if (config.testnet)
  bitcore.Networks.defaultNetwork = bitcore.Networks.get 'peercoin-testnet'

app-require 'puzzles/all'
app-require 'transactions/all'
app-require 'contracts/all'
