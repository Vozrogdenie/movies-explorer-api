import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UnauthorizedError from '../errors/UnauthorizedError.js';

// const NODE_ENV = 'production';
// const JWT_SECRET = '3140021d0be7e318fa645c1f42d1b94b03f6c21c9df1a77c0f33bee90c4a86f5';
dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

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
