# Copyright (c) 2016 hrobeers
# Distributed under the MIT software license, see the accompanying
# file COPYING or http://www.opensource.org/licenses/mit-license.php.

chai = require 'chai'
{ assert, expect, should } = chai

{ Transaction, Script } = require 'bitcore-lib'
{ Input, Output } = Transaction
{ Interpreter } = Script

{ find-index } = require 'prelude-ls'

config = require './config'

module.exports = (ctx, scripts) ->
  done = ctx.test.callback
  groupName = ctx.test.parent.title
  scriptName = ctx.test.title

  outputScript = scripts.lock
  unlockScript = scripts.unlock

  # Print output script information
  '\n' + groupName + ': ' + scriptName + '\n' +
  '  Output script: ' + outputScript.toString() + '\n' +
  '  P2SH output: ' + outputScript.toScriptHashOut().toString() + '\n' +
  '  P2SH address: ' + outputScript.toScriptHashOut().toAddress().toString()
  |> console.log

  Interpreter().verify(unlockScript, outputScript)
  |> assert _, 'Incorrect solution Script'

  # If successfull, print redeem information
  '  Unlock script: ' + unlockScript.toString() + '\n'
  |> console.log

  redeemScript = Script()
  |> (s) -> s.add unlockScript
  |> (s) -> s.add outputScript.toBuffer().length
  |> (s) -> s.add outputScript

  redeemTxn = create-redeem-transaction redeemScript, outputScript
  if (redeemTxn)
    '  Redeem script: ' + redeemScript.toString() + '\n' +
    '  Redeem txn: ' + redeemTxn.toString()
    |> console.log

  done()

create-redeem-transaction = (redeem-script, prev-output-script) ->
  if (!config.redeem-transaction) then return undefined

  unspent-txn = Transaction config.redeem-transaction

  prev-output-index = unspent-txn.outputs
  |> find-index (o) -> o.script.toString() == prev-output-script.toScriptHashOut().toString()

  if (prev-output-index < 0) then return undefined

  prev-output = unspent-txn.outputs[prev-output-index]

  input = Input {
    prevTxId: unspent-txn.id
    outputIndex: prev-output-index
    sequenceNumber: 'ffffffff'
    script: redeem-script
    output: prev-output
  }

  new Transaction()
  .addInput input
  .to(config.redeem-address, prev-output.satoshis-10000) # Spend all minus txn fee (10000 satoshis)
