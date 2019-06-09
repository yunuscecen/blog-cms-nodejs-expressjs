const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const joi = require('@hapi/joi');
const User = require('../../models/User');
const Post = require('../../models/Post');
const moment = require('moment');
const _ = require('underscore');
const registerSchema = joi.object().keys({
    name : joi.string().min(2).max(50).required(),
    email : joi.string().email({ minDomainSegments: 2 }),
    password : joi.string().trim().min(6).required(),
    passwordConfirm : joi.string().trim().min(6).required(),
});

exports.getIndex = async (req,res,next) => {
    const allPosts = await Post.find({ unpublish : false, publishPost : true })
    .sort({ date : 'descending' })
    .populate('user');
    if(allPosts){
        const postsWithDate = allPosts.map(post => {
            moment.locale('tr');
            const newDate = moment(post.date).format("DD MMMM YYYY");
            return {
                title : post.title,
                desc : post.desc,
                author : post.user.name,
                date : newDate,
                slug : post.slug,
               
            }
        });
        res.render("home/pages/index",{
            posts : postsWithDate,
            desc : "Blog for Node JS & Express JS ",
            title : "Node JS",
            heading : "Node JS Blog",
        });
    }
    
    
}

exports.getPost = async (req,res,next) => {
    const postSlug = req.params.slug;
    const getPost = await Post.findOne({ slug : postSlug, unpublish : false, publishPost : true }).populate({ path : "comments", options : { sort : { 'date' : "descending" } } , match : { approveComment : true} ,populate : { path : "user" , model : "User" }}) // , 
    // console.log(getPost.user.name);
    moment.locale("tr");
    const newPostDate = moment(getPost.date).format("DD MMMM YYYY");
    const newGetPost = {
        _id : getPost._id,
        allowComments : getPost.allowComments,
        userName : getPost.user.name,
        title : getPost.title,
        desc : getPost.desc,
        date : newPostDate,
        postImage : getPost.postImage,
        postBody : getPost.postBody,
        comments : getPost.comments.map(comment => {
                moment.locale('tr');
                const newDate = moment(comment.date).format("DD MMMM YYYY");
            return {
                commentBody : comment.comment,
                commentAuthor : comment.user.name,
                commentDate : newDate,
            }
        })
    }
    
    
    if(newGetPost) {
        res.render("home/pages/post", {
            title : newGetPost.title,
            heading : newGetPost.title,
            desc : newGetPost.desc,
            post : newGetPost,
        }) 
    } 
    
}

exports.getAbout = (req,res,next) => {
    res.render("home/pages/about",{
        title : "About Us",
        heading : "About Us",
        desc : "Discover our company."
    });
}

exports.getContact = (req,res,next) => {
    res.render("home/pages/contact",{
        title : "Contact",
        heading : "Contact with us",
        desc : "Do you have question? Contact with us"
    });
}

exports.getLogin = (req,res,next) => {
    res.render("home/pages/login");
}


passport.use(new LocalStrategy( { usernameField : 'email' }, 
    function(email, password, done) {
      User.findOne({ email: email }).then(user => {
            if(!user) return done(null, false, { message : "User not found." });
            bcrypt.compare(password, user.password).then(isSuccess => {
                if(isSuccess){
                    return done(null, user);
                }else {
                    return done(null, false, { message : "Incorrect Password" });
                }
            }).catch(err => console.log(err));
      });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        const newAuthUser = {
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin
        }
      done(err, newAuthUser);
    });
  });




exports.postLogin = (req,res,next) => {

    passport.authenticate('local', {
        successRedirect : "/admin/",
        failureRedirect : "/login",
        failureFlash : true
    })(req,res,next);
  

}

exports.getRegister = (req,res,next) => {
    res.render("home/pages/register");
}

exports.postRegister = async (req,res,next) => {
    const validateResult = joi.validate(req.body, registerSchema);
    if(validateResult.error === null){
        const checkUser = await User.findOne({ email : req.body.email });
        if(checkUser){
            req.flash("error","User already exist. Please try anotherone.");
            res.render("home/pages/register", {
                fields : req.body
            })
        }else {

            if(req.body.password !== req.body.passwordConfirm){
                req.flash("error", "Password fields not match. Please check again");
                res.render("/register", {
                    fields : req.body
                })
            }else {
                const hashedPassword = await bcrypt.hash(req.body.password.trim(), 12);
                // console.log(hashedPassword);
                if(hashedPassword){
                    const newUser = User({
                        name : req.body.name,
                        email : req.body.email,
                        password : hashedPassword
                    });
                    
                    const savedUser = await newUser.save();
                    if(savedUser){
                        req.flash("success-message", "You are registered, please login");
                        res.redirect("/login");
                    }
                }
            }
            
            
        }
        
       
    }else {
        let errorMessage = validateResult.error.details[0].message;
        let errors = [];
        if(errorMessage.includes("name")){
            errors.push("Please check your name again");
        }
        if(errorMessage.includes("password")){
            errors.push("Please check your password again");
        }
        if(errorMessage.includes("email")){
            errors.push("Please check your email again");
        }
        return res.render("home/pages/register", {
            errors : errors,
            fields : req.body
        });
        
    }
    
    
}


exports.getLogout = (req,res) => {
    req.logout();   
    res.redirect('/');
}
