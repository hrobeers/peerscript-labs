# PeerScript labs

PeerScript labs is Peercoin's Area 51 for smart contracts. It is a test ground for the development of specialized Peercoin transaction scripts.
Other projects benefit form PeerScript Labs by integrating scripts developed and proven on this test ground.

Currently these scripts work well on testnet. On mainnet, spending non-standard P2SH transactions are processed at lower rate as the should be processed by the [PARS](https://www.peercointalk.org/index.php?topic=4684.0) nodes.
We are working on getting relaxed P2SH rules into the peercoin protocol, in the mean time you can help these scripts on mainnet by minting using a [PARS client](https://github.com/hrobeers/peercoin-advanced-relay).


## Getting started

### Install (if you don't have them):
* [Node.js](http://nodejs.org): `brew install node` on OS X
* [Brunch](http://brunch.io): `npm install -g brunch`
* Brunch plugins and app dependencies: `npm install`

### Run:
* `npm start` — Watches the project with continuous rebuild. Scripts are run in browser at [http://localhost:3333](http://localhost:3333)
* `npm test` — Runs all scripts in the terminal.

### Solve & create script puzzles:
* All puzzles are defined in`app/puzzles/all.js`.
* To solve a puzzle, figure out the unlock script and run the script in the browser or using `npm test`.
  Unsolved puzzles should reference txnids that lock funds using that puzzle.
  Spend the puzzle by entering the receiving address and the raw transaction in `app/config.js`.
  You can get the raw transaction using `getrawtransaction <txnid>` in your peercoin client.
  If you did the above and solved the puzzle correctly, you should get a raw `Redeem txn` in the javascript console.
  Broadcast that transaction using `sendrawtransaction <txnid>, 1`, the second argument 1 makes sure the transaction is checked for validity.
  After spending a solved puzzle, please consider creating a new puzzle for others to solve.
* To create a puzzle, specify a lock script in `app/puzzles/all.js`.
  Make sure to verify your solution to make sure it works correctly.
  You should get a `P2SH address` in the javascript console, pay to that address using your peercoin client to lock funds with that puzzle.
  Add a comment with the txnid you locked funds with next to the puzzle specification, for others to solve your puzzle.
  Create a pull request to the [PeerScript labs github repo](https://github.com/hrobeers/peerscript-labs) to have your puzzle added.
