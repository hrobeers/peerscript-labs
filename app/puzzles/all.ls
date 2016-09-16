{ Script } = require 'bitcore-lib'
run = require '../script-runner'

describe 'Puzzles', ->
  specify 'x + 5 = 6', (done) ->
    run Script('OP_5 OP_ADD OP_6 OP_EQUAL'),
        Script('OP_1'),
        this
