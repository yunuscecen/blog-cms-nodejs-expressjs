const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { mongoDbUrl } = require('./config/database.js');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const passport = require('passport');
const methodEverride = require('method-override');
const upload = require('express-fileupload');
// ## Routes Require
const homeRoutes = require('./routes/home/index');
const adminRoute = require('./routes/admin/index');
const adminPostsRoute = require('./routes/admin/posts');
const adminCategoryRoute = require('./routes/admin/categories');
const commentRoute = require('./routes/admin/comments');
var store = new mongoDbStore({
    uri : mongoDbUrl,
    collection : 'mySessions'
})
// ## Express Config
app.set("view engine","pug");
app.set("views","./views");

// ## Route Middlewares
app.use(methodEverride('_method'))
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 3600000
    },
    store : store
}));    
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.successMessage = req.flash('success-message');
    next();
});
app.use(upload());
app.use(express.static(path.join(__dirname,"./public")));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

    
// ## Routes
app.use("/admin", adminRoute);
app.use("/admin/posts", adminPostsRoute);
app.use("/admin/comments", commentRoute);
app.use("/admin/categories", adminCategoryRoute);
app.use(homeRoutes);


const port = process.env.PORT || 3000;
mongoose.connect(mongoDbUrl, { useNewUrlParser : true }).then(() => {
    console.log("Connected Database successfully.");
    app.listen(port);
});