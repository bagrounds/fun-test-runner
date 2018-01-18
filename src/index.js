/**
 *
 * @module fun-test-runner
 */
;(() => {
  'use strict'

  /* imports */
  const curry = require('fun-curry')
  const { plan, test, diagnostic, bail } = require('test-anything-protocol')
  const stringify = require('stringify-anything')
  const { inputs } = require('guarded')
  const { tuple, record, any, arrayOf, fun } = require('fun-type')

  const report = (result, i, t) => test({
    number: i + 1,
    ok: result === true,
    description: stringify(t)
  })

  const reportThrown = (error, i, test) => [
    report(error, i, test),
    diagnostic('Unexpected error thrown by test:'),
    diagnostic(stringify(error)),
    bail()
  ].join('\n')

  const reportFaulty = (result, i, test) => [
    report(result, i, test),
    diagnostic(`Faulty test returned: \`${stringify(result)}\``),
    diagnostic('Tests must return true or false!'),
    bail()
  ].join('\n')

  /**
   * Run each test with the provided subject. Returns output one line at a time
   * by repeatedly calling the provided node-style callback function. Output is
   * in Test-Anything-Protocol (TAP) format.
   *
   * @function module:fun-test-runner.run
   *
   * @param {Object} o - all input parameters
   * @param {*} o.subject - to test
   * @param {Array<Function>} o.tests - [(subject, cb) ~> [Error, Boolean]]
   * @param {Function} callback - node-style (error first) callback function
   */
  const run = ({ subject, tests }, callback) => {
    callback(null, plan(tests.length))

    tests.forEach((test, i) => {
      try {
        test(subject, (error, result) => error
          ? callback(error, bail())
          : (typeof result !== 'boolean')
            ? callback(null, reportFaulty(result, i, test))
            : callback(null, report(result, i, test)))
      } catch (error) {
        callback(null, reportThrown(error, i, test))
      }
    })
  }

  /* exports */
  module.exports = curry(
    inputs(
      tuple([
        record({ subject: any, tests: arrayOf(fun) }),
        fun
      ]),
      run
    )
  )
})()

