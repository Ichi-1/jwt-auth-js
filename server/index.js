require('dotenv').config()
const express = require('express');
const app = express();
const PORT = 5000;

//dep
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/router.js')
const errorsMiddleware = require('./middleware/errors-middleware.js')

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials:true,
  origin:process.env.CLIENT_URL,
}));
app.use('/api', router);
app.use(errorsMiddleware);



const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    app.listen(PORT, () => console.log(`Server on PORT: ${PORT}`))
  } catch (error) {
    console.log(error);
  }
}

start()