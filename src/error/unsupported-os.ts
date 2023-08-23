export class UnsupportedOsError extends Error {
  static {
    this.prototype.name = 'UnsupportedOsError';
  }
}
