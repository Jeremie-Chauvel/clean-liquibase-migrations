export class NoChangeLeftException extends Error {
  constructor(message) {
    super(message)
    this.name = 'NoChangeLeft'
  }
}
