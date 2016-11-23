/**
 * fun-test-runner is a test runner for fun tests.
 *
 * @module fun-test-runner
 */
;(function () {
  'use strict'

  /* imports */
  var async = require('async')
  var testAnythingProtocol = require('test-anything-protocol')

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
  function funTestRunner (options, callback) {
    var fut = options.fut
    var testSuite = options.testSuite

    var series = Object.keys(testSuite).map(function (testKey, index) {
      var currentTest = testSuite[testKey]

      return function (cb) {
        currentTest(fut, function reporter (error) {
          tap.test({
            ok: !error,
            description: '- ' + testKey,
            number: index + 1
          })

          cb()
        })
      }
    })

    var numTests = series.length

    tap.plan(numTests)

    async.series(series, function (error) {
      if (error) {
        tap.diagnostic(error)
        tap.bail()
      }

      callback(error)
    })
  }

  function producer (error, result) {
    error && console.error(error)

    console.log(result)
  }
})()

