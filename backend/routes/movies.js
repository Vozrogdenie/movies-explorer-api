import { Router } from 'express';
import {
  getMovies,
  createMovies,
  deleteMovies,
} from '../controllers/movies.js';
import auth from '../middlewares/auth.js';
import { validateCreateMovieId, validateGetMovieId } from '../validation/movies.js';

const routerMovies = Router();

routerMovies.get('/', auth, getMovies);
routerMovies.post('/', auth, validateCreateMovieId, createMovies);
routerMovies.delete('/:movieId', auth, validateGetMovieId, deleteMovies);

export default routerMovies;
