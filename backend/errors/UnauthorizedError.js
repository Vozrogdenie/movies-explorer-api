import { constants } from 'http2';

export default class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}
