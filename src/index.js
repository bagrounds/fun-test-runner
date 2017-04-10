/**
 *
 * @module fun-test-runner
 */
;(function () {
  'use strict'

  /* imports */
  var nameFunction = require('./lib/name-function')
  var funTest = require('fun-test')
  var stringify = require('stringify-anything')
  var tap = require('test-anything-protocol')(producer)

  /* exports */
  module.exports = runner

  var i = 1

  function runner (options) {
    var testCount = options.tests
      .map(function (array) {
        return array.length
      })
      .reduce(function (a, b) {
        return a + b
      }, 0)

    tap.plan(testCount)

    var testOptions = {
      subject: options.subject,
      reporter: reporter
    }

    return options.tests.map(function (tests) {
      return tests
        .map(funTest.of)
        .reduce(funTest.concat, funTest.empty())
    }).reduce(funTest.concat, funTest.empty())(testOptions)
  }

  function producer (error, message) {
    if (error) {
      throw error
    }

    console.log(message)
  }

  function reporter (stuff) {
    if (stuff.comment) {
      tap.diagnostic(stuff.comment)
    }

    if (stuff.error) {
      reportError(stuff)
    } else {
      reportSuccess(stuff)
    }
  }

  function reportError (stuff) {
    tap.test({
      ok: false,
      description: '- ' + stuff.error.message,
      number: i++
    })
  }

  function reportSuccess (stuff) {
    var message = nameFunction(stuff.action, [stuff.data]) +
      ' => ' +
      stringify(stuff.result)

    tap.test({
      ok: true,
      description: '- ' + message,
      number: i++
    })
  }
})()

