const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    desc : {
        type : String,
    },
    
});

module.exports = mongoose.model("Category", categorySchema);