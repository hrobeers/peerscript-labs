{ Script } = require 'bitcore-lib'
run = require '../script-runner'

describe 'Puzzles', ->
  specify 'x + 5 = 6', (done) ->
    run this,
      lock: Script('OP_5 OP_ADD OP_6 OP_EQUAL')
      unlock: Script('OP_1')

  specify 'x * 2 = 16', (done) ->
    run this,
      lock: Script('OP_DUP OP_ADD OP_16 OP_EQUAL')
      unlock: Script('OP_NOP')

  specify 'if statement puzzle', (done) ->
    run this,
      lock: Script ''
            .add Script 'OP_1 OP_ADD'
            .add Script 'OP_IF'
            .add Script   'OP_RETURN'
            .add Script 'OP_ENDIF'
      unlock: Script('OP_NOP')
