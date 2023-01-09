import { constants } from 'http2';

export default class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}
