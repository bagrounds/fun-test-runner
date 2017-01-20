/**
 * fun-test-runner is a test runner for fun tests.
 *
 * @module fun-test-runner
 */
;(function () {
  'use strict'

  /* imports */
  var testAnythingProtocol = require('test-anything-protocol')
  var stringify = require('stringify-anything')

  /* exports */
  module.exports = funTestRunner

  var tap = testAnythingProtocol(producer)

  /**
   * funTestRunner is a test runner for fun tests.
   *
   * @function funTestRunner
   * @alias fun-test-runner
   *
   * @param {Object} options all function parameters
   * @param {Function} callback handle results
   */
  function funTestRunner (options) {
    var subject = options.subject
    var tests = options.tests

    tap.plan(tests.length)

    tests.map(function (test) {
      return test(subject)
    })
    .forEach(function (results, index) {
      tap.test({
        ok: !results.error,
        description: '- ' + toString(results.options),
        number: index + 1
      })

      if (results.error) {
        tap.diagnostic(stringify(results.error))
      }
    })
  }

  function producer (error, result) {
    error && console.error(error)

    console.log(result)
  }

  function toString (options) {
    var string = ''

    if (options.transformer) {
      string += stringify(options.transformer)
    }

    string += '(' + stringify(options.input) + ') -> '

    string += 'error should ' + stringify(options.error)

    if (options.result) {
      string += ', result should ' + stringify(options.result)
    }

    return string
  }
})()

