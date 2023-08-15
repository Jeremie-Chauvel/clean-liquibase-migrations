import fs from 'node:fs'
import process from 'node:process'
import yaml from 'js-yaml'
import pico from 'picocolors'

import { removeDuplicateUniqueConstraints } from './remove-duplicate-unique-constraints'
import { NoChangeLeftException } from './exception'

const filepath = process.argv[2]
if (!filepath) {
  console.error(
    `${pico.red('Please provide a filepath')}, eg. backend/src/main/resources/db/changelog/changes/20230814181902.yaml`,
  )
  process.exit(1)
}

console.log(
  `Processing file: ${filepath}`,
)

try {
  const doc = yaml.load(fs.readFileSync(filepath, 'utf8'))
  const newDoc = removeDuplicateUniqueConstraints(doc)
  fs.writeFileSync(filepath, yaml.dump(newDoc), 'utf8')
  console.log(pico.green(pico.bold(`Successfully cleaned up: ${filepath}`)))
}
catch (e) {
  if (e instanceof NoChangeLeftException) {
    console.error(pico.red(pico.bold('No changes left after cleaning up! Aborting')))
    process.exit(1)
  }
  console.error(e)
  process.exit(1)
}
