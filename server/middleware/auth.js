const { User } = require('../models/User');
let auth = (req, res, next) => {
  //인증 처리를 하는곳
  //1.client cookie에서 token을 가져온다
  let token = req.cookies.x_auth;
  //2.token을 복호화 한 후 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //4.user가 없으면 인증 no.
    if (!user) return res.json({ isAuth: false, error: true });
    //3.user가 있으면 인증 Ok.
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
