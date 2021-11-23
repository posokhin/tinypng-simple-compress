#!/usr/bin/env node

const fs = require('fs')
const consola = require('consola')
const argv = require('yargs/yargs')(process.argv.slice(2)).argv
const tinify = require('tinify')

let key = argv.key, from = argv.from, to = argv.to

const getFilesize = (path) => {
  if (!fs.statSync(path).isDirectory()) {
    const stats = fs.statSync(path)
    return parseInt(`${stats.size / 1024}`) + ' kb'
  }
}

const tinifyImages = (from, to) => {
  const ls = fs.readdirSync(from)
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to)
  }
  if (ls && ls.length > 0) {
    ls.forEach(async (i) => {
      const isDirectory = fs.statSync(`${ from }/${ i }`).isDirectory()
      if (isDirectory) {
        to = `${ to }/${ i }`
        from = `${ from }/${ i }`
        tinifyImages(from, to)
      } else {
        const localFrom = from
        const localTo = to
        await tinify.fromFile(`${ from }/${ i }`).toFile(`${ to }/${ i }`)
        consola.success(`${ i } ${ getFilesize(`${ localFrom }/${ i }`) } => ${ getFilesize(`${ localTo }/${ i }`) }`)
      }
    })
  }
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
