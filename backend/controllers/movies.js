import BadRequestError from '../errors/BadRequestError.js';
import ForbiddenError from '../errors/ForbidenError.js';
import NotFoundError from '../errors/NotFoundError.js';
import Movie from '../model/movies.js';

export function getMovies(req, res, next) {
  Movie.find({}).populate(['owner']).sort({ createdAt: -1 })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      console.log(err.message);
      next(err);
    });
}

export function createMovies(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    trailerLink,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    trailerLink,
    movieId,
    owner: req.user._id,
  })
    .then((movies) => {
      const moviesDocument = movies;
      const newMovies = moviesDocument.toObject();
      newMovies.owner = { _id: req.user._id };
      res.send({ data: newMovies });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err);
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        console.log(err.message);
        next(err);
      }
    });
}

export function deleteMovies(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movies) => {
      if (!movies) {
        return next(new NotFoundError('Фильм с указанным _id не найдена.'));
      }
      if (movies.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Forbiden'));
      }
      return movies.remove()
        .then((deletedMovies) => res.send({ data: deletedMovies }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Передан некорректный id'));
          } else {
            console.log(err);
            next(err);
          }
        });
    });
}
