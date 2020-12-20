const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; //(salt가 몇글자인지)

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

//mongoose에서 가져온 pre메소드를이용해서 user.save하기전 비밀번호 암호화 실행
userSchema.pre('save', function (next) {
  let user = this;
  //user의 password가 변경될때만
  if (user.isModified('password')) {
    //비밀번호를 암호화 시킨다
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      //hash 암호화된 비밀번호 user.password와 salt를 받아서 user.password를 hash로 교체
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    //비밀번호를 바꾸는게 아니라 다른것을 바꿀때는 next로 user.save()로 보내준다
    next();
  }
});

//comparePassword 메소드 만들기, 역할은 유저가 로그인할떄 입력한 비밀번호와 데이터베이스의 비밀번호가 일치하는지 확인
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword = 12345, 암호화된 비밀번호 = $2b$10$/wtcOeg29qjSCfwcnbELRO5.kDqGDZcxZjH3VXOaQCTAKqLOjV.US
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;
  //jwt를 이용해서 token을 생성하기
  let token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
