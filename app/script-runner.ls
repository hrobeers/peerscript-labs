# Copyright (c) 2016 hrobeers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

chai = require 'chai'
{ assert, expect, should } = chai

{ Transaction, Script } = require 'bitcore-lib'
{ Interpreter } = Script

module.exports = (ctx, scripts) ->
  done = ctx.test.callback
  groupName = ctx.test.parent.title
  scriptName = ctx.test.title

  outputScript = scripts.lock
  redeemScript = scripts.redeem

  # Print output script information
  '\n' + groupName + ': ' + scriptName + '\n' +
  '  Output script: ' + outputScript.toString() + '\n' +
  '  P2SH output: ' + outputScript.toScriptHashOut().toString() + '\n' +
  '  P2SH address: ' + outputScript.toScriptHashOut().toAddress().toString()
  |> console.log

  Interpreter().verify(redeemScript, outputScript)
  |> assert _, 'Incorrect solution Script'

  # If successfull, print redeem information
  '  Redeem script: ' + redeemScript.toString() + '\n'
  |> console.log

  done()
