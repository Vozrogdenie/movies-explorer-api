import { constants } from 'http2';

export default class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
  }
}
