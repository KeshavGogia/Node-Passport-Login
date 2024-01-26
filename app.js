const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport Config

require('./config/passport')(passport);

//Databse Config

const db = require('./config/keys').MongoURI;

//Mongo Connection

mongoose.connect(db)
    .then(()=> console.log('MongoDB Connected'))
    .catch(err => console.log(err));
    

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({extended : false}));

//Express Session
app.use(session({
    secret : 'session',
    resave : true,
    saveUninitialized: true
}));

// Passport Midelware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash

app.use(flash());

// Global Variables 

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Route
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
    } else {
        console.log(`Server listening on Port ${PORT}`);
    }
});
