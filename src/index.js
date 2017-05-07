/**
 *
 * @module fun-test-runner
 */
;(function () {
  'use strict'

  /* imports */
  var Task = require('data.task')
  var fn = require('fun-function')
  var array = require('fun-array')
  var tap = require('test-anything-protocol')

  /* exports */
  module.exports = fn.curry(runner)

  /**
   *
   * @function module:fun-test-runner.runner
   *
   * @param {Array<Function>} tests - [subject -> Task(Boolean)]
   * @param {*} subject - to be tested
   *
   * @return {Task} of results
   */
  function runner (tests, subject) {
    return fn.compose(
      array.fold(
        combine,
        init,
        tests.map(embelish)
      ),
      lift
    )(subject)

    function init (subject) {
      return new Task(function (onError, onSuccess) {
        console.log(tap.plan(tests.length))
        onSuccess(subject)
      })
    }

    function lift (s) {
      return [0, s]
    }

    function combine (t1, t2) {
      return function (s) {
        return t1(s).chain(t2)
      }
    }
  }

  function embelish (test) {
    return function (pair) {
      return test(pair[1])
        .map(lift)
        .chain(report)

      function lift (x) {
        return [pair[0] + 1, pair[1], x, test]
      }
    }
  }

  function report (result) {
    console.log(tap.test({
      ok: result[2],
      number: result[0],
      description: result[3].name
    }))

    return Task.of(result)
  }
})()

