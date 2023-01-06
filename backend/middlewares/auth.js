import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UnauthorizedError from '../errors/UnauthorizedError.js';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV || 'dev';
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';

const handleAuthError = (next) => next(new UnauthorizedError('Необходима авторизация'));

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    req.user = payload;
    return next();
  } catch (err) {
    return handleAuthError(next);
  }
}
