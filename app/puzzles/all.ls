{ Script } = require 'bitcore-lib'
run = require '../script-runner'

describe 'Puzzles', ->
  specify 'x + 5 = 6', (done) ->
    run this,
      lock: Script('OP_5 OP_ADD OP_6 OP_EQUAL')
      unlock: Script('OP_1')
