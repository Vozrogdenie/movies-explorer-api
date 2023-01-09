import mongoose from 'mongoose';
import bcrpt from 'bcryptjs';
import { regExpEmail } from '../utils/regex.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (email) => email.match(regExpEmail),
      message: () => 'Некорректный email',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); }
      return bcrpt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};
const User = mongoose.model('user', userSchema);
export default User;
