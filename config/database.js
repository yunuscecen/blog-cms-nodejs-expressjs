if(process.env.NODE_ENV === "production"){
    module.exports = require('./production-database');
}else {
    module.exports = require('./development-database');
}