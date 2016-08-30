module.exports = {
  // See http://brunch.io for documentation.
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app|test)/,
        'app.js': /^app/,
        'test.js': /^test/
      }
    },
    stylesheets: {joinTo: 'app.css'},
    // templates: {joinTo: 'app.js'}
  }
}
