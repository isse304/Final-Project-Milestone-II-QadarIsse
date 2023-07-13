const { Pool } = require('pg');
const pool = new Pool({
  user: 'qadar',
  host: 'db.bit.io',
  database: 'qadar/shiftNotes',
  password: 'v2_3vvCt_TzKn8HrA6WaVTbJDY53chVc', // key from bit.io database page connect menu
  port: 5432,
  ssl: true,
});


 

const firebase = require('@firebase/app');
const firebaseAuth = require('@firebase/auth');
const firebaseConfig = {
  apiKey: "AIzaSyCieHbHD7fTr3uzun8zmNBzb7_uX0_gvNA",
  authDomain: "lul-care.firebaseapp.com",
  projectId: "lul-care",
  storageBucket: "lul-care.appspot.com",
  messagingSenderId: "534217686225",
  appId: "1:534217686225:web:8208e3d1b6a399314459f0",
  measurementId: "G-ZL3TM28MDY"
};
firebase.initializeApp(firebaseConfig);

const auth = firebaseAuth.getAuth();
//auth.languageCode = 'fr_FR'; //Sending verification emails only in french

//Sends verification emails in the same language as the language used in the
//user's device
auth.useDeviceLanguage();

//Function wrapping all the signup parts including the email verification email
//triggered once the user clicks on the signup button
 signUpFunction = (req, res) => {
email = req.body.mail;
password = req.body.password;

  firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log('Signed Up Successfully !');
      //res.render("./login");
    })
    .catch(error => {
      console.error(error)

      res.send(`<script>alert("Couldn't make account: ${error.message}"); window.location.href = "/signup";</script>;`)

    })
}

 signInWithEmailFunction = (req, res) => {

  const { email, password } = req.body;


  firebaseAuth.signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      if (req.session.userUID) { // req.session represents the current session. If views is already defined 
        res.render('/forms');
          //res.render('./forms');
      var user = userCredential.user;
      console.log("welcome "+ user.uid);
      } else { // req.session.views is undefined (falsy), so create it on the fly
        req.session.userUID = 1;
      }
    })
    .catch((error) => {
      res.send(`<script>alert("Could not Log in: ${error.message}"); window.location.href = "/login";</script>;`)
    });
      //Signed in successfully
    
   
}
const logout = (req, res) => {
  auth.signOut().then(() => {
    console.log("Log-out successful.");
  }).catch((error) => {
    console.log(error);
  });
}





const addShiftNote = (req, res) => {
  const { name, breakfast, lunch, dinner, activities, shift_summary } = req.body;

  pool.query('INSERT INTO "shift_notes" (name, breakfast, lunch, dinner, activities, shift_summary)  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, breakfast, lunch, dinner, activities, shift_summary],
    (error, results) => {
      if (error) {
        console.log(`Error: ${error}`);
      } else {
        console.log('success');

      }
    })
};

const listResults = (req, res) => {
  pool.query('SELECT * from "shift_notes"',
    (error, results) => {
      if (error) {
        console.log(`Error: ${error}`);
      } else {
        console.log(JSON.stringify(results.rows));
        res.render('listResults', { success: results.rows });
      }
    })
};

const update = (req, res) => {
 const {select, name, breakfast, lunch, dinner, activities, shift_summary } = req.body;
  pool.query('UPDATE "shift_notes" SET name = $2, breakfast = $3, lunch = $4, dinner = $5, activities = $6, shift_summary = $7 WHERE name = $1',
   [select, name, breakfast, lunch, dinner, activities, shift_summary],
    (error, results) => {
      if (error) {
        console.log(`Error: ${error}`);
        console.log(req.body);
      } else {
          console.log(req.body);
      console.log("Succesfully updated Form");
        res.redirect("listResults");
      }
    }
  )
};
const deleteEntry = (req, res) => {
  const name = req.body.name;
  pool.query('DELETE FROM "shift_notes" WHERE name = $1', [name],
    (error, results) => {
      if (error) {
        console.log(`Error: ${error}`);
        console.log(req.body);
      } else {
        console.log("Deleted Entry");
        res.redirect("listResults");
      }
    }
  )
};


//fetching excel
const readXlsxFile = require('read-excel-file/node')

// File path.
readXlsxFile("certified-1-2bed-afh-2.xlsx").then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
  console.log(rows[919]);

//fetch works in console only
})




exports.deleteEntry = deleteEntry;
exports.update = update;
exports.addShiftNote = addShiftNote;
exports.signInWithEmailFunction = signInWithEmailFunction;
exports.signUpFunction = signUpFunction;
exports.listResults = listResults;
exports.logout = logout;

