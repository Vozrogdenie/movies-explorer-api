import { Joi, celebrate } from 'celebrate';
import { regExpUrl } from '../utils/regex.js';

export const validateCreateMovieId = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(regExpUrl).required(),
    trailer: Joi.string().regex(regExpUrl).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    trailerLink: Joi.string().regex(regExpUrl).required(),
    thumbnail: Joi.string().regex(regExpUrl).required(),
    movieId: Joi.number().required(),
  }),
});

export const validateGetMovieId = celebrate({
  params: Joi.object({
    movieId: Joi.string().hex().length(24).required(),
  }).required(),
});
