const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model
const User = require('../models/User');

//Login
router.get('/login',(req,res)=>{res.render('login')});

//Register
router.get('/register',(req,res)=>{res.render('register')});


//Register Handle
router.post('/register',(req,res)=>{
    const { name, email,password,password2} = req.body;
    
    // Error in filling fields

    let errors = [];

    if(!name || !email || !password || !password2)
    {
        errors.push({msg : 'Please fill in all the field'});
    }

    // Password Matching
    if(password !== password2)
    {
        errors.push({msg : 'Passwords do not match'});
    }

    //Password lenght > 6
    if(password.length< 6)
    {
        errors.push({ msg : 'Password must be atleast 6 characters'});
    }

    if(errors.length > 0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        // Validation Passed

        User.findOne({ email : email})
            .then(user => {
                if(user)
                {
                    errors.push({msg : 'User Email already exists'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hashing Password

                    bcrypt.genSalt(10,(err,salt)=>
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            if(err) throw err;

                            // Setting password to hash
                            newUser.password = hash;

                            // Saving the User
                            newUser.save()
                                .then(user =>{
                                    req.flash('success_msg','You are now registered.');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }
                            
                    ));
                }
            });
    }
});

//Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req,res,next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }

        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});


module.exports = router;