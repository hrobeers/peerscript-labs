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
