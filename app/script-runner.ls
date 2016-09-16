chai = require 'chai'
{ assert, expect, should } = chai

{ Transaction, Script } = require 'bitcore-lib'
{ Interpreter } = Script

module.exports = (outputScript, redeemScript, ctx) ->
  done = ctx.test.callback
  groupName = ctx.test.parent.title
  scriptName = ctx.test.title

  # Print output script information
  '\n' + groupName + ': ' + scriptName + '\n' +
  '  Output script: ' + outputScript.toString() + '\n' +
  '  P2SH output: ' + outputScript.toScriptHashOut().toString()
  |> console.log

  Interpreter().verify(redeemScript, outputScript)
  |> assert _, 'Incorrect solution Script'

  # If successfull, print redeem information
  '  Redeem script: ' + redeemScript.toString() + '\n'
  |> console.log

  done()
