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
