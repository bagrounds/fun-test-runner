#!/usr/bin/env node
;(() => {
  'use strict'

  /* imports */
  const runner = require('..')
  const tests = require('./tests')
  const subject = runner

  runner({ tests, subject }, (error, result) => {
    error && console.error(error)
    console.log(result)
  })
})()

