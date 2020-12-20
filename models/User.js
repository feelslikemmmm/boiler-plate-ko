const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true, //trim은 공백이나 빈칸을 없애주는 역할을 한다
    unique: 1, //중복되는 이메일 없도록 유니크 설정
  },
  password: {
    type: String,
    minLength: 5,
  },
  lastname: {
    type: String,
    maxLength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    //token 유효기간
    type: Number,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
