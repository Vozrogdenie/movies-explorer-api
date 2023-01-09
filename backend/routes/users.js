import { Router } from 'express';
import {
  getMe,
  createUser,
  updateProfile,
} from '../controllers/users.js';
import auth from '../middlewares/auth.js';
import {
  validateCreateUser, validateEditUser,
} from '../validation/users.js';

const routerUser = Router();

routerUser.get('/me', auth, getMe);
routerUser.post('/', validateCreateUser, auth, createUser);
routerUser.patch('/me', validateEditUser, auth, updateProfile);

export default routerUser;
