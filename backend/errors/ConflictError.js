import { constants } from 'http2';

export default class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}
