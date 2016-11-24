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

require.register("lib/bitcore-ppc/bitcore-ppc.js", function(exports, require, module) {
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

require.register("lib/peerassets/peerassets.js", function(exports, require, module) {
var pb = require('./peerassets_pb');
var bitcore = require('bitcore-lib');
var Buffer = require('buffer').Buffer;
var Script = bitcore.Script;
var Transaction = bitcore.Transaction;
var Input = Transaction.Input;
var Output = Transaction.Output;

var minTagFee = 10000; // 0.01PPC
var txnFee = 10000;   // 0.01PPC

// P2TH info
// PPC mainnet:
//  PAprod: PAprodbYvZqf4vjhef49aThB9rSZRxXsM6 - U624wXL6iT7XZ9qeHsrtPGEiU78V1YxDfwq75Mymd61Ch56w47KE
//  PAtest: PAtesth4QreCwMzXJjYHBcCVKbC4wjbYKP - UAbxMGQQKmfZCwKXAhUQg3MZNXcnSqG5Z6wAJMLNVUAcyJ5yYxLP
// PPC testnet:
//  PAprod: miHhMLaMWubq4Wx6SdTEqZcUHEGp8RKMZt - cTJVuFKuupqVjaQCFLtsJfG8NyEyHZ3vjCdistzitsD2ZapvwYZH
//  PAtest: mvfR2sSxAfmDaGgPcmdsTwPqzS6R9nM5Bo - cQToBYwzrB3yHr8h7PchBobM3zbrdGKj2LtXqg7NQLuxsHeKJtRL

var deckSpawnTagHash = undefined;
setup = function(PPCtestnet, PAtest) {
  // Setup the deck spawn tag hash
  if (!PPCtestnet && !PAtest)
    deckSpawnTagHash = 'PAprodbYvZqf4vjhef49aThB9rSZRxXsM6';
  else if (!PPCtestnet && PAtest)
    deckSpawnTagHash = 'PAtesth4QreCwMzXJjYHBcCVKbC4wjbYKP';
  else if (PPCtestnet && !PAtest)
    deckSpawnTagHash = 'miHhMLaMWubq4Wx6SdTEqZcUHEGp8RKMZt';
  else if (PPCtestnet && PAtest)
    deckSpawnTagHash = 'mvfR2sSxAfmDaGgPcmdsTwPqzS6R9nM5Bo';

  // Add getUnspentOutput function to Transaction object
  Transaction.prototype.getUnspentOutput = function(outputIndex) {
    var output = this.outputs[outputIndex];
    return new Transaction.UnspentOutput({
      outputIndex: outputIndex,
      satoshis: output.satoshis,
      script: output.script,
      txId: this.id,
      address: output.script.toAddress().toString()
    });
  }
};
setup(); // Defaults to mainnet & PAprod

var createDeckSpawnTransaction = function(utxo, shortName, numberOfDecimals, issueModes) {
  var deckSpawnTxn = new Transaction()
  .from(utxo)                           // vin[0]: Owner signature
  .to(deckSpawnTagHash, minTagFee)      // vout[0]: Deck spawn P2TH
  .addData(createDeckSpawnMessage(shortName, numberOfDecimals, issueModes))  // vout[1]: Asset data
  // free format from here, typically a change Output
  .to(utxo.address, utxo.satoshis-minTagFee-txnFee);  // vout[2]

  return deckSpawnTxn;
};

var decodeDeckSpawnTransaction = function(transaction) {
  // Test for validity
  // TODO: error handling
  var inputs = transaction.inputs
  var outputs = transaction.outputs;
  if (outputs.length < 2) return undefined;
  if (!outputs[0].script.isPublicKeyHashOut()) return undefined;
  if (!outputs[1].script.isDataOut()) return undefined;

  var retVal = decodeDeckSpawnMessage(outputs[1].script.getData());
  retVal.assetId = transaction.id;
  retVal.owner = inputs[0].script.toAddress().toString();

  return retVal;
}

var createCardTransferTransaction = function(utxo, receiver, amount, deckSpawnTxn) {
  var cardTransferTxn = new Transaction()
  .from(utxo)                             // vin[0]: Sending party signature
  .to(receiver, minTagFee)                // vout[0]: Receiving party
  .to(assetTag(deckSpawnTxn), minTagFee)  // vout[1]: Asset P2TH
  .addData(createCardTransferMessage(amount, deckSpawnTxn))  // vout[2]: Transfer data
  // free format from here, typically a change Output
  .to(utxo.address, utxo.satoshis-minTagFee-minTagFee-txnFee);  // vout[3]

  return cardTransferTxn;
}

var decodeCardTransferTransaction = function(transaction) {
  // Test for validity
  // TODO: error handling
  var inputs = transaction.inputs;
  var outputs = transaction.outputs;
  if (outputs.length < 3) return undefined;
  if (!outputs[0].script.isPublicKeyHashOut() && !outputs[0].script.isScriptHashOut()) return undefined;
  if (!outputs[1].script.isPublicKeyHashOut()) return undefined;
  if (!outputs[2].script.isDataOut()) return undefined;

  var retVal = decodeCardTransferMessage(outputs[2].script.getData());
  retVal.from = inputs[0].script.toAddress().toString();
  retVal.to = outputs[0].script.toAddress().toString();

  return retVal;
}

module.exports = {
  setup: setup,
  ISSUE_MODE: pb.DeckSpawn.MODE,
  createDeckSpawnTransaction: createDeckSpawnTransaction,
  decodeDeckSpawnTransaction: decodeDeckSpawnTransaction,
  createCardTransferTransaction: createCardTransferTransaction,
  decodeCardTransferTransaction: decodeCardTransferTransaction,
  createCardBurnTransaction: function(utxo, amount) {

  }
}

var createDeckSpawnMessage = function(shortName, numberOfDecimals, issueModes) {
  var ds = new pb.DeckSpawn();
  ds.setVersion(1);
  ds.setShortName(shortName);
  ds.setNumberOfDecimals(numberOfDecimals);

  if (typeof issueModes == 'number') {
    ds.setIssueMode(issueModes);
  }
  else if (issueModes.length && typeof issueModes[0] == 'number') {
    var issueMode = 0;
    for (var i=0; i<issueModes.length; i++)
      issueMode = issueMode ^ issueModes[i];
    ds.setIssueMode(issueMode);
  }
  else {
    return undefined; // TODO: imlement array of strings & error handling
  }

  return new Buffer(ds.serializeBinary());
}

var decodeDeckSpawnMessage = function(message) {
  var ds = pb.DeckSpawn.deserializeBinary(new Uint8Array(message));
  var issueMode = ds.getIssueMode();

  return {
    version: ds.getVersion(),
    shortName: ds.getShortName(),
    numberOfDecimals: ds.getNumberOfDecimals(),
    issueMode: issueMode,
    getIssueModes: function() {
      var issueModes = [];
      for (var mode in pb.DeckSpawn.MODE)
        if (issueMode & pb.DeckSpawn.MODE[mode])
          issueModes.push(mode);
      return issueModes;
    }
  }
}

var assetTag = function(deckSpawnTxn) {
  // Create the compressed address for deckSpawnTxn.id
  var binaryTxnId = Buffer.from(deckSpawnTxn.id, 'hex');
  var bn = bitcore.crypto.BN.fromBuffer(binaryTxnId);
  return new bitcore.PrivateKey(bn).toPublicKey().toAddress();
}

var createCardTransferMessage = function(amount, deckSpawnTxn) {
  var decoded = decodeDeckSpawnTransaction(deckSpawnTxn);
  if (!decoded) return undefined;

  var ct = new pb.CardTransfer();
  ct.setAmount(amount);
  ct.setNumberOfDecimals(decoded.numberOfDecimals);

  return new Buffer(ct.serializeBinary());
}

var decodeCardTransferMessage = function(message) {
  var ds = pb.CardTransfer.deserializeBinary(new Uint8Array(message));

  return {
    amount: ds.getAmount(),
    numberOfDecimals: ds.getNumberOfDecimals()
  }
}

});

;require.register("lib/peerassets/peerassets_pb.js", function(exports, require, module) {
/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.CardTransfer', null, global);
goog.exportSymbol('proto.DeckSpawn', null, global);
goog.exportSymbol('proto.DeckSpawn.MODE', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.DeckSpawn = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.DeckSpawn, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.DeckSpawn.displayName = 'proto.DeckSpawn';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.DeckSpawn.prototype.toObject = function(opt_includeInstance) {
  return proto.DeckSpawn.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.DeckSpawn} msg The msg instance to transform.
 * @return {!Object}
 */
proto.DeckSpawn.toObject = function(includeInstance, msg) {
  var f, obj = {
    version: msg.getVersion(),
    shortName: msg.getShortName(),
    numberOfDecimals: msg.getNumberOfDecimals(),
    issueMode: msg.getIssueMode(),
    assetSpecificData: msg.getAssetSpecificData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.DeckSpawn}
 */
proto.DeckSpawn.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.DeckSpawn;
  return proto.DeckSpawn.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.DeckSpawn} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.DeckSpawn}
 */
proto.DeckSpawn.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setVersion(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setShortName(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumberOfDecimals(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setIssueMode(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAssetSpecificData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.DeckSpawn} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.DeckSpawn.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.DeckSpawn.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.DeckSpawn.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getVersion();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getShortName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getNumberOfDecimals();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getIssueMode();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getAssetSpecificData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.DeckSpawn} The clone.
 */
proto.DeckSpawn.prototype.cloneMessage = function() {
  return /** @type {!proto.DeckSpawn} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 version = 1;
 * @return {number}
 */
proto.DeckSpawn.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.DeckSpawn.prototype.setVersion = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string short_name = 2;
 * @return {string}
 */
proto.DeckSpawn.prototype.getShortName = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.DeckSpawn.prototype.setShortName = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 number_of_decimals = 3;
 * @return {number}
 */
proto.DeckSpawn.prototype.getNumberOfDecimals = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.DeckSpawn.prototype.setNumberOfDecimals = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 issue_mode = 4;
 * @return {number}
 */
proto.DeckSpawn.prototype.getIssueMode = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.DeckSpawn.prototype.setIssueMode = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional bytes asset_specific_data = 5;
 * @return {!(string|Uint8Array)}
 */
proto.DeckSpawn.prototype.getAssetSpecificData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 5, ""));
};


/**
 * optional bytes asset_specific_data = 5;
 * This is a type-conversion wrapper around `getAssetSpecificData()`
 * @return {string}
 */
proto.DeckSpawn.prototype.getAssetSpecificData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAssetSpecificData()));
};


/**
 * optional bytes asset_specific_data = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAssetSpecificData()`
 * @return {!Uint8Array}
 */
proto.DeckSpawn.prototype.getAssetSpecificData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAssetSpecificData()));
};


/** @param {!(string|Uint8Array)} value  */
proto.DeckSpawn.prototype.setAssetSpecificData = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * @enum {number}
 */
proto.DeckSpawn.MODE = {
  NONE: 0,
  CUSTOM: 1,
  ONCE: 2,
  MULTI: 4
};


/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CardTransfer = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CardTransfer, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.CardTransfer.displayName = 'proto.CardTransfer';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CardTransfer.prototype.toObject = function(opt_includeInstance) {
  return proto.CardTransfer.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CardTransfer} msg The msg instance to transform.
 * @return {!Object}
 */
proto.CardTransfer.toObject = function(includeInstance, msg) {
  var f, obj = {
    version: msg.getVersion(),
    amount: msg.getAmount(),
    numberOfDecimals: msg.getNumberOfDecimals(),
    assetSpecificData: msg.getAssetSpecificData_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CardTransfer}
 */
proto.CardTransfer.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CardTransfer;
  return proto.CardTransfer.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CardTransfer} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CardTransfer}
 */
proto.CardTransfer.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setVersion(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setAmount(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumberOfDecimals(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAssetSpecificData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.CardTransfer} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.CardTransfer.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CardTransfer.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.CardTransfer.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getVersion();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getAmount();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = this.getNumberOfDecimals();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getAssetSpecificData_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.CardTransfer} The clone.
 */
proto.CardTransfer.prototype.cloneMessage = function() {
  return /** @type {!proto.CardTransfer} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 version = 1;
 * @return {number}
 */
proto.CardTransfer.prototype.getVersion = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.CardTransfer.prototype.setVersion = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint64 amount = 2;
 * @return {number}
 */
proto.CardTransfer.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.CardTransfer.prototype.setAmount = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 number_of_decimals = 3;
 * @return {number}
 */
proto.CardTransfer.prototype.getNumberOfDecimals = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.CardTransfer.prototype.setNumberOfDecimals = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional bytes asset_specific_data = 4;
 * @return {!(string|Uint8Array)}
 */
proto.CardTransfer.prototype.getAssetSpecificData = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 4, ""));
};


/**
 * optional bytes asset_specific_data = 4;
 * This is a type-conversion wrapper around `getAssetSpecificData()`
 * @return {string}
 */
proto.CardTransfer.prototype.getAssetSpecificData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAssetSpecificData()));
};


/**
 * optional bytes asset_specific_data = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAssetSpecificData()`
 * @return {!Uint8Array}
 */
proto.CardTransfer.prototype.getAssetSpecificData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAssetSpecificData()));
};


/** @param {!(string|Uint8Array)} value  */
proto.CardTransfer.prototype.setAssetSpecificData = function(value) {
  jspb.Message.setField(this, 4, value);
};


goog.object.extend(exports, proto);

});

require.register("puzzles/all.js", function(exports, require, module) {
var Script = require('bitcore-lib').Script;
var run = require('../script-runner');

describe('Puzzles', function() {

  specify('x + 5 = 6', function(done) {
    // Testnet txnids locking funds with this script:
    // 100PPC: '339bb7d4fb15e327904a1011073d8e2c3cc145325484c5775482de65599b60cf'
    // 100PPC: '87c1979b914c5c4728d160986e01c56a6826a4f0618498a4f61a12b92848a301'
    // 100PPC: '0df219926f5a0a27481ef367b500d7e32ab5de16df9d66687f2c2e4c33fe250c'
    // 100PPC: '0c066e27b6ade9d2e8c1eb050dc69e410b84e295e296632f2b5e520555513e7e'
    // 100PPC: 'c66504c4f06cb4b632da73697a59c9b74e835563904827fa95f7455238a71f57'
    run(this, {
      lock: Script('OP_5 OP_ADD OP_6 OP_EQUAL'),
      unlock: Script('OP_1')
    });
  });

  specify('x * 2 = 16', function(done) {
    // Testnet txnids locking funds with this script:
    // 500PPC: 'd47cc1c98d62395cebeebe7220a25272ba733e9103c5815bfd454c34a1688612'
    // 500PPC: 'f7f36ed79a4a37bc3d5cc2ecbc804408f8bcc7174c6768bc46f7a155d1afbb35'
    // 500PPC: '7f6b2536bf89fbe9fa1eba6b95758142804267056ec9466dcf7bbc249b074089'
    run(this, {
      lock: Script('OP_DUP OP_ADD OP_16 OP_EQUAL'),
      unlock: Script('OP_NOP')
    });
  });

  specify('if statement', function(done) {
    // Testnet txnids locking funds with this script:
    // 1000PPC: '31be5da0d296bf61a6575aa36785898f7026343eb130a36c8b829a41ded5a67c'
    // 1000PPC: '3d3a68ce1b52293947f4fa2930533ecee84d753d39a843823e8e377c697b2954'
    // 1000PPC: '084e770c4861d30272832e8055c652ae16c7dcb052cc76fb2fdc62bef2b4bcdc'
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
    // Testnet txnids locking funds with this script:
    // 3000PPC: '6ae2c662e91fe2c0850bc1ec2322198ef43d808253faaaf20b757d25aeac7a3c'
    // 3000PPC: '2cd2068412df761c5fddf65287504a141525fe82cf9661c130e2ac3f170723a6'
    // 3000PPC: '225ec1e840e38c5332611181ff038638b6af88b1e4d0d530aa34da58566627e7'
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
  require('./peerassets');
  return require('./peerassets-test');
});
});

;require.register("transactions/peerassets-test.ls", function(exports, require, module) {
var pa, ref$, Transaction, PrivateKey, Networks, crypto, assert, Buffer;
pa = require('../lib/peerassets/peerassets');
ref$ = require('bitcore-lib'), Transaction = ref$.Transaction, PrivateKey = ref$.PrivateKey, Networks = ref$.Networks, crypto = ref$.crypto;
assert = require('chai').assert;
Buffer = require('buffer').Buffer;
describe('PeerAssets tests', function(){
  return specify('P2TH', function(done){
    var testVector, mainnet, testnet, binaryTxnId, bn, priv;
    testVector = {
      "txnId": "c23375caa1ba3b0eec3a49fff5e008dede0c2761bb31fddd830da32671c17f84",
      "WIF": "UBctiEkfxpU2HkyTbRKjiGHT5socJJwCny6ePfUtzo8Jad9wVzeA",
      "Address": "PRoUKDUhA1vgBseJCaGMd9AYXdQcyEjxu9",
      "testnetWIF": "cU6CjGw3mRmirjiUZfRkJ1aj2D493k7uuhywj6tCVbLAMABy4MwU",
      "testnetAddress": "mxjFTJApv7sjz9T9a4vCnAQbmsqSoL8VWo"
    };
    mainnet = Networks.get('peercoin');
    testnet = Networks.get('peercoin-testnet');
    binaryTxnId = Buffer.from(testVector.txnId, 'hex');
    bn = crypto.BN.fromBuffer(binaryTxnId);
    priv = new PrivateKey(bn, mainnet);
    assert.equal(priv.toWIF(), testVector.WIF);
    assert.equal(priv.toAddress().toString(), testVector.Address);
    priv = PrivateKey.fromBuffer(bn, testnet);
    assert.equal(priv.toWIF(), testVector.testnetWIF);
    assert.equal(priv.toAddress().toString(), testVector.testnetAddress);
    return done();
  });
});
});

;require.register("transactions/peerassets.ls", function(exports, require, module) {
var pa, ref$, Transaction, Script, PrivateKey, assert, assetOwnerPrivateKey, prevTxn, utxo, deckSpawnTxn, numberOfDecimals;
pa = require('../lib/peerassets/peerassets');
ref$ = require('bitcore-lib'), Transaction = ref$.Transaction, Script = ref$.Script, PrivateKey = ref$.PrivateKey;
assert = require('chai').assert;
assetOwnerPrivateKey = new PrivateKey();
prevTxn = new Transaction().to(assetOwnerPrivateKey.toPublicKey().toAddress(), 10000000);
utxo = prevTxn.getUnspentOutput(0);
pa.setup(true, true);
deckSpawnTxn = undefined;
numberOfDecimals = 2;
describe('PeerAssets', function(){
  specify('Deck spawn', function(done){
    var assetShortName, unsignedDeckSpawn, decodedDeckSpawnTxn, unsignedDeckSpawn2, deckSpawnTxn2;
    assetShortName = 'hello';
    unsignedDeckSpawn = pa.createDeckSpawnTransaction(utxo, assetShortName, numberOfDecimals, [pa.ISSUE_MODE.ONCE, pa.ISSUE_MODE.CUSTOM]);
    deckSpawnTxn = unsignedDeckSpawn.sign(assetOwnerPrivateKey);
    decodedDeckSpawnTxn = pa.decodeDeckSpawnTransaction(deckSpawnTxn);
    assert.equal(decodedDeckSpawnTxn.owner, assetOwnerPrivateKey.toAddress().toString(), 'Failed to decode asset owner');
    assert.equal(decodedDeckSpawnTxn.shortName, assetShortName, 'Failed to decode asset short name');
    assert.equal(decodedDeckSpawnTxn.numberOfDecimals, numberOfDecimals, 'Failed to decode number of decimals');
    assert(decodedDeckSpawnTxn.issueMode & pa.ISSUE_MODE.ONCE, 'Failed to check ONCE flag');
    assert(decodedDeckSpawnTxn.issueMode & pa.ISSUE_MODE.CUSTOM, 'Failed to check MULTI flag');
    assert.deepEqual(decodedDeckSpawnTxn.getIssueModes(), ['CUSTOM', 'ONCE'], 'Failed to get issue mode list');
    unsignedDeckSpawn2 = pa.createDeckSpawnTransaction(utxo, assetShortName, numberOfDecimals, pa.ISSUE_MODE.ONCE ^ pa.ISSUE_MODE.CUSTOM);
    deckSpawnTxn2 = unsignedDeckSpawn2.sign(assetOwnerPrivateKey);
    assert.equal(unsignedDeckSpawn2.serialize(true), unsignedDeckSpawn.serialize(true));
    return done();
  });
  return specify('Card transfer', function(done){
    var sender, prevTxn, utxo, receiverAddress, amount, transferTxn, decodedTransferTxn;
    sender = new PrivateKey();
    prevTxn = new Transaction().to(sender.toAddress(), 10000000);
    utxo = prevTxn.getUnspentOutput(0);
    receiverAddress = new PrivateKey().toAddress().toString();
    amount = 123;
    transferTxn = pa.createCardTransferTransaction(utxo, receiverAddress, amount, deckSpawnTxn).sign(sender);
    decodedTransferTxn = pa.decodeCardTransferTransaction(transferTxn);
    assert.equal(decodedTransferTxn.from, sender.toAddress().toString(), 'Failed to decode transfer sender');
    assert.equal(decodedTransferTxn.to, receiverAddress, 'Failed to decode transfer receiver');
    assert.equal(decodedTransferTxn.amount, amount, 'Failed to decode transfer amount');
    assert.equal(decodedTransferTxn.numberOfDecimals, numberOfDecimals, 'Failed to decode transfer amount');
    return done();
  });
});
});

;require.alias("assert/assert.js", "assert");
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