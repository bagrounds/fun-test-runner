/**
 *
 * @module fun-test-runner
 */
;(function () {
  'use strict'

  /* imports */
  var fn = require('fun-function')
  var async = require('fun-async')
  var object = require('fun-object')
  var scalar = require('fun-scalar')
  var tap = require('test-anything-protocol')
  var stringify = require('stringify-anything')

  /* exports */
  module.exports = fn.curry(run)

  /**
   * Run each test with the provided subject. Logs output to console in Test
   * Anything Protocol format.
   *
   * @function module:fun-test-runner.run
   *
   * @param {Object} options - all input parameters
   * @param {*} options.subject - to test
   * @param {Array<Function>} options.tests - (subject, cb) ~> [Error, Boolean]
   *
   * @param {Function} callback - handle results
   */
  function run (options, callback) {
    console.log(tap.plan(options.tests.length))

    var input = {
      subject: options.subject,
      number: 0
    }

    async.composeAll(
      options.tests.map(lift)
    )(input, callback)

    function lift (test) {
      return function (options, callback) {
        test(options.subject, function (error, result) {
          if (error) {
            throw error
          }
          callback(
            error,
            fn.compose(fn.tee(report), object.ap({
              number: scalar.sum(1),
              result: fn.k(result),
              test: fn.k(test)
            }))(options)
          )
        })
      }
    }
  }

  function report (options) {
    console.log(tap.test({
      number: options.number,
      ok: options.result,
      description: stringify(options.test)
    }))
  }
})()

