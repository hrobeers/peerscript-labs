{ Script } = require 'bitcore-lib'
run = require '../script-runner'

describe 'Puzzles', ->
  specify 'x + 5 = 6', (done) ->
    run this,
      lock: Script 'OP_5 OP_ADD OP_6 OP_EQUAL'
      unlock: Script 'OP_1'

  specify 'x * 2 = 16', (done) ->
    run this,
      lock: Script 'OP_DUP OP_ADD OP_16 OP_EQUAL'
      unlock: Script 'OP_NOP'

  specify 'if statement', (done) ->
    run this,
      lock: Script ''
            .add Script 'OP_5 OP_ADD'
            .add Script 'OP_IF'
            .add Script   'OP_RETURN'
            .add Script 'OP_ELSE'
            .add Script   'OP_TRUE'
            .add Script 'OP_ENDIF'
      unlock: Script 'OP_NOP'

  specify 'obfuscated stack', (done) ->
    run this,
      lock: Script 'OP_DEPTH OP_3 OP_EQUALVERIFY'
            .add Script 'OP_ROT OP_DUP OP_3 OP_EQUALVERIFY'
            .add Script 'OP_ADD OP_8 OP_EQUALVERIFY'
            .add Script 'OP_TRUE OP_EQUAL'
      unlock: Script 'OP_NOP'
