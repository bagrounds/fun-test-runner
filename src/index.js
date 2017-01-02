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
  function funTestRunner (options, callback) {
    var subject = options.subject
    var tests = options.tests

    tap.plan(tests.length)

    var series = tests.map(function (test, index) {
      return function (cb) {
        test(subject, function reporter (error) {
          tap.test({
            ok: !error,
            description: '- ' + stringify(test, subject),
            number: index + 1
          })

          if (error) {
            tap.diagnostic(error.message)
          }

          cb()
        })
      }
    })

    async.series(series, function (error) {
      if (error) {
        tap.diagnostic('Error: ' + error.message)
      }

      callback(error)
    })
  }

  function producer (error, result) {
    error && console.error(error)

    console.log(result)
  }
})()

