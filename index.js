const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://nakwon:khn1010jnw@boilerplate.rkxri.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('mongoDB Connected..!'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello express');
});

app.listen(port, () => console.log(`hello express port ${port}`));
