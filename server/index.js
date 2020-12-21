const express = require('express');
const app = express();
const port = 5000;
const { User } = require('./models/User');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
//Application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.urlencoded({ extended: true }));

//Application/json 타입을 분석해서 가져올 수 있도록 옵션설정
app.use(bodyParser.json());
app.use(cookieParser());
const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('mongoDB Connected..!'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello express');
});

app.get('/api/hello', (req, res) => {
  res.send('hi client');
});

//회원가입 router
app.post('/api/users/register', (req, res) => {
  //회원가입할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다
  const user = new User(req.body);
  //mongoDB save메소드를 사용해서 user.save를 해주면 req.body의 정보들이 유저모델에 저장된다
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//로그인 router
app.post('/api/users/login', (req, res) => {
  const body = req.body;
  //요청된 이메일을 데이터베이스에서 있는지 찾기
  User.findOne({ email: body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '이메일에 일치하는 유저가 없습니다',
      });
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인하기
    //comparePassword메소드는 User.js에서 정의하였음
    user.comparePassword(body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 일치하지 않습니다.',
        });
      }
      //비밀번호까지 맞다면, 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //token을 저장한다 어디에 ? 쿠키, 로컬스토리지
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//인증 router
app.get('/api/users/auth', auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true 라는 얘기
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//logout router
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      token: '',
    },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});

app.listen(port, () => console.log(`hello express port ${port}`));
