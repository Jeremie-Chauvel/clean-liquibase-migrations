import pico from 'picocolors'
import { NoChangeLeftException } from './exception'

export function removeDuplicateUniqueConstraints(doc) {
  const uselessChanges = []
  const changes = doc.databaseChangeLog

  for (let index = 0; index + 1 < changes.length; index++) {
    const firstChange = changes[index]
    const secondChange = changes[index + 1]
    if (
      firstChange.changeSet.changes[0].dropUniqueConstraint
      && secondChange.changeSet.changes[0].addUniqueConstraint
      && firstChange.changeSet.changes[0].dropUniqueConstraint.constraintName
        === secondChange.changeSet.changes[0].addUniqueConstraint.constraintName
    ) {
      console.warn(
        `${pico.yellow('Duplicate drop and add unique constraint detected')}: ${pico.bold(firstChange.changeSet.changes[0].dropUniqueConstraint.constraintName)}`,
      )
      uselessChanges.push(firstChange, secondChange)
    }
  }
  uselessChanges.forEach((change) => {
    const index = doc.databaseChangeLog.indexOf(change)
    doc.databaseChangeLog.splice(index, 1)
  })
  if (doc.databaseChangeLog.length === 0)
    throw new NoChangeLeftException('No change left after removing duplicate unique constraints')

  return doc
}
