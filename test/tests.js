;(() => {
  'use strict'

  /* imports */
  const { t, not, throwsWith } = require('fun-predicate')
  const { sync } = require('fun-test')
  const { fun } = require('fun-type')

  const id = x => x
  const k = x => () => x
  const noop = () => {}
  const anError = () => Error('Boom!')
  const toss = () => { throw anError() }
  const repeat = (n, x) => Array.apply(null, { length: n }).map(k(x))

  const tests = [
    [
      { predicate: fun, contra: k }
    ],
    [
      [{ subject: '', tests: [t] }, noop, 'extra param'],
      [{ subject: '', tests: [t] }, ''],
      [{ subject: '', tests: [''] }, noop],
      [{ subject: '', tests: t }, noop],
      [{ subject: '' }, noop],
      [{ tests: [t] }, noop],
      [{}, noop],
      ['', noop],
      ['', '']
    ].map(x => ({ predicate: throwsWith(x), contra: k })),
    [
      [{ subject: '', tests: [{ predicate: id, contra: k }].map(sync) }, noop],
      [{ subject: '', tests: [{ predicate: t, contra: k }].map(sync) }, noop],
      [{ subject: toss, tests: [{ predicate: t }].map(sync) }, noop],
      [{ subject: '', tests: [(x, cb) => cb(anError())] }, noop],
      [{ subject: '', tests: [(x, cb) => cb(null, true)] }, noop],
      [{ subject: '', tests: repeat(10, (x, cb) => cb(null, true)) }, noop]
    ].map(x => ({ predicate: not(throwsWith)(x), contra: k }))
  ].reduce((a, b) => a.concat(b), [])

  /* exports */
  module.exports = tests.map(sync)
})()

