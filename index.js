const consola = require('consola')
const argv = require('yargs/yargs')(process.argv.slice(2)).argv
const tinify = require('tinify')
// tinify.key = 'wBl6vvBHjDBQFq9JNCLyVKc7CnpMkJ1D'
const fs = require('fs')

let key = argv.key,
  from = argv.from,
  to = argv.to,
  files

if (from) {
  files = fs.readdirSync(from)
}

if (!key) {
  consola.error('--key argument required')
} else if (!from) {
  consola.error('--from argument required')
} else if (!to) {
  consola.error('--to argument required')
} else if (!files.length || files.length === 0) {
  consola.error('files required')
} else {
  tinify.key = key
  files.forEach(async (i) => {
    let source = tinify.fromFile(`${ from }\\${ i }`)
    await source.toFile(`${to}\\${i}`)
    consola.info(i)
  })
}
