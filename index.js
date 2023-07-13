/*
  Name: Qadar Isse
  Date: 12/14/2022
  Description: Final Project
  Bugs:None
  Reflection:It was difficult but very rewarding. I enjoyed every
  minute except express
  
  */

//const expressSession = require("express-session");
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./db.js');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set('trust proxy', 1);  // trust first proxy
app.use(session({ // injects session middleware with the given options
  secret: 'Hey Yo', // a secret used to sign the sessionID cookie - put it in repl's Secret tab
  resave: false, // (like we did 5 lines below with mySecret)
  saveUninitialized: true,
  //cookie: {httpOnly: true, secure: true }, // settings for the session ID cookie (httpOnly:true is default,
  name: 'Lul' // shown here just to emphasize its presence => document.cookie
}));
const mySecret = process.env['cookie-top-secret'];
app.use(cookieParser(mySecret));



app.set("view engine", "ejs");
app.listen(3000, () => {
  console.log('server started');
});

app.get('/about', (req, res) => {
  res.render('./about');
});
app.post('/addShiftNote', (req, res) => {
  db.addShiftNote(req, res);

});
app.get('/login', (req, res) => {
  res.render('./login');
});

app.get('/services', (req, res) => {
  res.render('./services');
});

app.get('/contact', (req, res) => {
  res.render('./contact');
});
app.get('/verify', (req, res) => {
  res.render('./verify');

});
app.get('/forms', (req, res) => {
  res.render('./forms');
});

app.get('/signup', (req, res) => {
  res.render('./signup');
});
app.post('/signup', (req, res) => {
  db.signUpFunction(req, res);


  //Sign up succesful
  // if(req.body.password.length > 6 && req.body.mail != null){
  //res.render('./login');
  console.log("Sign up succesful");
  // }
  // else{
  //   alert("Sign up unsuccesful");
  // }
  res.render('./login')




});

app.post('/login', (req, res) => {

  db.signInWithEmailFunction(req, res);

  //   //Login succesful
  // if(req.body.mail.value ==req.body.mail && req.body.password == req.password.value){
  res.render('./forms');
  //    console.log("Login succesful");
  // }

  //   //Login unsuccesful
  // else{
  //    console.log("Login unsuccesful");
  // }


});
app.get('/logout', (req, res) => {
  db.logout();
});
app.get('/listResults', (req, res) => {
  db.listResults(req, res);
});
app.post('/update', (req, res) => {
  db.update(req, res);
});
app.get('/modifyResults', (req, res) => {
  res.render('./modifyResults');
});
app.get('/deleteResults', (req, res) => {
  res.render('./deleteResults');
});
app.post('/deleteEntry', (req, res) => {
  db.deleteEntry(req, res);
});
app.get('/deleteResults', (req, res) => {
  res.render('./deleteResults');
});

app.use(express.urlencoded({ extended: false })); // to populate req.body 
app.use(express.static('public'));


