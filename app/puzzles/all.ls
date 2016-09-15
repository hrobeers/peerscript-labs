{ Script } = require 'bitcore-lib'
runner = require '../script-runner' .createRunner('Puzzles')

describe 'Puzzles', ->
  runner 'x + 5 = 6',
          Script('OP_5 OP_ADD OP_6 OP_EQUAL'),
          Script('OP_1')
