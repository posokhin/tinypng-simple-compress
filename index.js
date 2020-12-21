#!/usr/bin/env node

const fs = require('fs')
const consola = require('consola')
const argv = require('yargs/yargs')(process.argv.slice(2)).argv
const tinify = require('tinify')

let key = argv.key, from = argv.from, to = argv.to

const getFilesize = (filename) => {
  const stats = fs.statSync(filename)
  return parseInt(stats.size / 1024) + ' kb'
}

const tinifyImages = (from, to) => {
  const files = fs.readdirSync(from)
  if (!files || !files.length || files.length === 0) {
    consola.error('Files not found')
    return false
  }
  files.forEach(async (i) => {
    let source = tinify.fromFile(`${ from }/${ i }`)
    await source.toFile(`${to}/${i}`)
    consola.success(`${ i } ${ getFilesize(`${from}/${i}`) } => ${ getFilesize(`${to}/${i}`) }`)
  })
}

if (!key) {
  consola.error('--key argument is required')
} else if (!from) {
  consola.error('--from argument is required')
} else if (!to) {
  consola.error('--to argument is required')
} else {
  tinify.key = key
  tinifyImages(from, to)
}
