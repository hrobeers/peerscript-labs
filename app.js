(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("bitcore-ppc.js", function(exports, require, module) {
// Copyright (c) 2016 hrobeers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// Running this file patches bitcore-lib to work on the peercoin blockchain.
// * Sets peercoin as the default network.
// * Patches bitcore-lib.Transaction to include peercoin's timestamp.

'use strict';

var bitcore = require('bitcore-lib');

//
// Set peercoin as default network
//

bitcore.Networks.add({
    name: 'peercoin',
    alias: 'ppcoin',
    pubkeyhash: 0x37,
    privatekey: 0xb7,
    scripthash: 0x75,
    xpubkey: 0x0488b21e,
    xprivkey: 0x0488ade4,
  });

bitcore.Networks.add({
    name: 'peercoin-testnet',
    alias: 'ppcoin-test',
    pubkeyhash: 0x6f,
    privatekey: 0xef,
    scripthash: 0xc4,
    xpubkey: 0x043587cf,
    xprivkey: 0x04358394,
  });

bitcore.Networks.defaultNetwork = bitcore.Networks.get('peercoin');


//
// Overwrite transaction serialization to include peercoin's timestamp
//

var Transaction = bitcore.Transaction;
var Input = Transaction.Input;
var Output = Transaction.Output;

var _ = require('lodash');

Transaction.prototype.toBufferWriter = function(writer) {
  writer.writeUInt32LE(this.version);

  // ppcoin: if no timestamp present, take current time (in seconds)
  var timestamp = this.timestamp ? this.timestamp : new Date().getTime()/1000;
  writer.writeUInt32LE(timestamp);

  writer.writeVarintNum(this.inputs.length);
  _.each(this.inputs, function(input) {
    input.toBufferWriter(writer);
  });
  writer.writeVarintNum(this.outputs.length);
  _.each(this.outputs, function(output) {
    output.toBufferWriter(writer);
  });
  writer.writeUInt32LE(this.nLockTime);
  return writer;
};

var checkArgument = function(condition, argumentName, message, docsPath) {
  if (!condition) {
    throw new bitcore.errors.InvalidArgument(argumentName, message, docsPath);
  }
};

Transaction.prototype.fromBufferReader = function(reader) {
  checkArgument(!reader.finished(), 'No transaction data received');
  var i, sizeTxIns, sizeTxOuts;

  this.version = reader.readUInt32LE();

  // ppcoin: deserialize timestamp
  this.timestamp = reader.readUInt32LE();

  sizeTxIns = reader.readVarintNum();
  for (i = 0; i < sizeTxIns; i++) {
    var input = Input.fromBufferReader(reader);
    this.inputs.push(input);
  }
  sizeTxOuts = reader.readVarintNum();
  for (i = 0; i < sizeTxOuts; i++) {
    this.outputs.push(Output.fromBufferReader(reader));
  }
  this.nLockTime = reader.readUInt32LE();
  return this;
};

});

require.register("config.js", function(exports, require, module) {
// PeerScript-labs configuration file
//
// This file specifies the addresses and outputs the scripts should spend from or redeem to.
// Make sure not to push changes to this file in to source control to guarantee your privacy.
// This file should already be added to .gitignore

module.exports = {
  // The address to redeem funds to.
  // Used for creating the redeem Transaction
  redeemAddress: 'n1aFBt9ow45dEpEzYSsEr9epff2mML1cbt',

  // The raw transaction to redeem from (hex encoded, use "getrawtransaction to get it")
  redeemTransaction: '0100000056dde0570237c62f168a8e110b06a100e9010a667bcc1c9a78599735af565a9f6c8db99e480200000048473044022037ce8702f2fc4645f6e4345cb542393b12a9c78b339738c24585d40901ecfdb302206db4ab9ba82d973e038b1567b5fbc0d919abb842fe122c116d277757744162be01ffffffff4cc5e53cfce1de29c59b01ae90959c514f23e4ef7c8ccf46e18aac9cd9097136000000006c493046022100a94d3ff90b1b3d7bc992800376df5a23648ba264c7de94651c232ac7ebfedc300221008547c38bbe33ca25a236c19957d6385935e6738e3f1d959d2b80f0e2c3f9841a0121031ede890b89e56930768d41c0b46ab7416d0cb8a9f56cce71c321f6ae03004b33ffffffff0260a0821d000000001976a9145588e371c904f7a4d288c8b977090270686804d688ac005ed0b20000000017a9142a02dfd19c9108ad48878a01bfe53deaaf30cca48700000000',

  // Configure for testnet
  testnet: true,
}

});

;require.register("contracts/all.ls", function(exports, require, module) {
describe('Smart Contracts', function(){
  describe('Escrow and dispute mediation', function(){
    return specify('Coming soon', function(done){
      return done();
    });
  });
  describe('Assurance contracts', function(){
    return specify('Coming soon', function(done){
      return done();
    });
  });
  describe('Using external state', function(){
    return specify('Coming soon', function(done){
      return done();
    });
  });
  describe('Trading across chains', function(){
    return specify('Coming soon', function(done){
      return done();
    });
  });
  return describe('And more', function(){
    return specify('Coming soon', function(done){
      return done();
    });
  });
});
});

;require.register("initialize.js", function(exports, require, module) {
// Include the tests to be run
require('../test/all');

// Make sure buffer is compiled into vendor.js
require('buffer');

document.addEventListener('DOMContentLoaded', function() {
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    mocha.run();
  }
});

});

require.register("puzzles/all.js", function(exports, require, module) {
var Script = require('bitcore-lib').Script;
var run = require('../script-runner');

describe('Puzzles', function() {
  specify('x + 5 = 6', function(done) {
    run(this, {
      lock: Script('OP_5 OP_ADD OP_6 OP_EQUAL'),
      unlock: Script('OP_1')
    });
  });

  specify('x * 2 = 16', function(done) {
    run(this, {
      lock: Script('OP_DUP OP_ADD OP_16 OP_EQUAL'),
      unlock: Script('OP_NOP')
    });
  });

  specify('if statement', function(done) {
    run(this, {
      lock: Script('OP_5 OP_ADD')
            .add(Script('OP_IF'))
            .add(Script(  'OP_RETURN'))
            .add(Script('OP_ELSE'))
            .add(Script(  'OP_TRUE'))
            .add(Script('OP_ENDIF')),
      unlock: Script('OP_NOP')
    });
  });

  specify('obfuscated stack', function(done) {
    run(this, {
      lock: Script('OP_DEPTH OP_3 OP_EQUALVERIFY')
            .add(Script('OP_ROT OP_DUP OP_3 OP_EQUALVERIFY'))
            .add(Script('OP_ADD OP_8 OP_EQUALVERIFY'))
            .add(Script('OP_TRUE OP_EQUAL')),
      unlock: Script('OP_NOP')
    });
  });
});

});

require.register("script-runner.ls", function(exports, require, module) {
var chai, assert, expect, should, ref$, Transaction, Script, Input, Output, Interpreter, findIndex, config, createRedeemTransaction;
chai = require('chai');
assert = chai.assert, expect = chai.expect, should = chai.should;
ref$ = require('bitcore-lib'), Transaction = ref$.Transaction, Script = ref$.Script;
Input = Transaction.Input, Output = Transaction.Output;
Interpreter = Script.Interpreter;
findIndex = require('prelude-ls').findIndex;
config = require('./config');
module.exports = function(ctx, scripts){
  var done, groupName, scriptName, outputScript, unlockScript, redeemScript, redeemTxn;
  done = ctx.test.callback;
  groupName = ctx.test.parent.title;
  scriptName = ctx.test.title;
  outputScript = scripts.lock;
  unlockScript = scripts.unlock;
  console.log(
  '\n' + groupName + ': ' + scriptName + '\n' + '  Lock script: ' + outputScript.toString() + '\n' + '  P2SH output: ' + outputScript.toScriptHashOut().toString() + '\n' + '  P2SH address: ' + outputScript.toScriptHashOut().toAddress().toString());
  assert(Interpreter().verify(unlockScript, outputScript), 'Incorrect solution Script');
  console.log(
  '  Unlock script: ' + unlockScript.toString() + '\n');
  redeemScript = function(s){
    return s.add(outputScript);
  }(
  function(s){
    return s.add(outputScript.toBuffer().length);
  }(
  function(s){
    return s.add(unlockScript);
  }(
  Script())));
  redeemTxn = createRedeemTransaction(redeemScript, outputScript);
  if (redeemTxn) {
    console.log(
    '  Redeem script: ' + redeemScript.toString() + '\n' + '  Redeem txn: ' + redeemTxn.toString());
  }
  return done();
};
createRedeemTransaction = function(redeemScript, prevOutputScript){
  var unspentTxn, prevOutputIndex, prevOutput, input;
  if (!config.redeemTransaction) {
    return undefined;
  }
  unspentTxn = Transaction(config.redeemTransaction);
  prevOutputIndex = findIndex(function(o){
    return o.script.toString() === prevOutputScript.toScriptHashOut().toString();
  })(
  unspentTxn.outputs);
  if (!prevOutputIndex) {
    return undefined;
  }
  prevOutput = unspentTxn.outputs[prevOutputIndex];
  input = Input({
    prevTxId: unspentTxn.id,
    outputIndex: prevOutputIndex,
    sequenceNumber: 'ffffffff',
    script: redeemScript,
    output: prevOutput
  });
  return new Transaction().addInput(input).to(config.redeemAddress, prevOutput.satoshis - 10000);
};
});

;require.register("transactions/all.ls", function(exports, require, module) {
describe('Transactions', function(){
  return require('./p2pkh');
});
});

;require.register("transactions/p2pkh.ls", function(exports, require, module) {
var Transaction;
Transaction = require('bitcore-lib').Transaction;
describe('P2PKH', function(){
  return specify('Coming soon', function(done){
    var transaction;
    transaction = new Transaction().fee(100);
    transaction.serialize(true);
    return done();
  });
});
});

;require.alias("assert/assert.js", "assert");
require.alias("buffer/index.js", "buffer");
require.alias("crypto-browserify/index.js", "crypto");
require.alias("events/events.js", "events");
require.alias("process/browser.js", "process");
require.alias("punycode/punycode.js", "punycode");
require.alias("querystring-es3/index.js", "querystring");
require.alias("stream-browserify/index.js", "stream");
require.alias("string_decoder/index.js", "string_decoder");
require.alias("util/util.js", "sys");
require.alias("url/url.js", "url");
require.alias("vm-browserify/index.js", "vm");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map