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
