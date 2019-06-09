const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const postSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    postBody : {
        type : String,
        required : true
    },
    allowComments : {
        type : Boolean,
        default : true,
    },
    postImage : {
        type : String,
        required : true
    },
    publishPost : {
        type : Boolean,
        default : true,
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    unpublish : {
        type : Boolean,
        default : false
    },  
    slug : {
        type : String,
    },
    comments : [{
        type : mongoose.Schema.ObjectId,
        ref : "Comment"
    }],
    date : {
        type : Date,
        default : Date.now
    }
});

postSchema.plugin(URLSlugs('title', {
    field : 'slug'
}));
module.exports = mongoose.model("Post", postSchema);