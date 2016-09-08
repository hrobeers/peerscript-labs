#
# Helper functions for test project
#

module.exports =

  # require for app modules to work both in nodejs and browser
  app-require: (path) ->
    try
      # browser
      require path
    catch
      # npm test
      require '../app/'+path

  # pipable log function
  log: (str) ->
    console.log str
    str
