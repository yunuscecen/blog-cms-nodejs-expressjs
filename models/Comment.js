const mongoose = require('mongoose');
const commentShema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    approveComment : {
        type : Boolean,
        default : false
    },
    date : {
        type : Date,
        default : Date.now()
    }
    
});

module.exports = mongoose.model("Comment", commentShema);