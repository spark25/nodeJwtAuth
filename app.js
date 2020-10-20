const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); //Express json parser
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://spark:Spark@25@cluster0.5vesi.mongodb.net/jwt-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => { app.listen(3000); console.log('App ready!'); })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes)


// //setting cookie

// app.get('/set-cookie', (req, res) => {
//   res.cookie('newuser', 'sumit');
//   res.cookie('isEmployee', 'sumit', {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//     // secure: true
//   }); // maxAge= Expiry, httpOnly, secure= cookie will only be set over http
//   res.send('cookie has been set')
// })

// app.get('/read-cookies', (req, res) => {

//   const cookies = req.cookies
//  res.json(cookies)
// })