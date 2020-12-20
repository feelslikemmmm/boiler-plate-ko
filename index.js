const express = require('express');
const app = express();
const port = 3000;
const { User } = require('./models/User');
const bodyParser = require('body-parser');

const config = require('./config/key');

//Application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.urlencoded({ extended: true }));

//Application/json 타입을 분석해서 가져올 수 있도록 옵션설정
app.use(bodyParser.json());

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

app.post('/register', (req, res) => {
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

app.listen(port, () => console.log(`hello express port ${port}`));
