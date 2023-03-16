import { constants } from 'http2';
import bcrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/user.js';
import BadRequestError from '../errors/BadRequestError.js';
import ConflictError from '../errors/ConflictError.js';
import NotFoundError from '../errors/NotFoundError.js';

dotenv.config();
const NODE_ENV = process.env.NODE_ENV || 'dev';
const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret';

export const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrpt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      }).then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
        data: {
          _id: user._id,
          email: user.email,
        },
      }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
          } else if (err.code === 11000) {
            next(new ConflictError('Email уже существует'));
          } else {
            console.log(err);
            next(err);
          }
        });
    });
};

export const getMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

export const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email: email, name: name })
    .then((user) => {
      if (user) return res.send(user);
      return next(new NotFoundError('Пользователь с указанным _id не найден.'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        console.log(err);
        next(err);
      }
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token, name: user.name, email: user.email });
    })
    .catch((err) => {
      next(err);
    });
};
