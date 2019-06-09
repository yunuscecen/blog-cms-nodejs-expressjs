const Post = require('../../models/Post');
const Comment = require('../../models/Comment');


module.exports.getComments = async (req,res) => {
    const comments = await Comment.find({}).populate("user");
    if(comments){
        
        res.render("admin/pages/comments",{
            comments : comments
        });    

    }
    
    
}
module.exports.postComment = async (req,res) => {
    const postId = req.params.id;
    const getPost = await Post.findOne({ _id : postId });
    if(getPost){
        const newComment = new Comment({
            user : req.user._id,
            comment : req.body.comment
        })
        getPost.comments.push(newComment);
        const saveComment = await getPost.save();
        if(saveComment){
            const saveComment = await newComment.save();
            if(saveComment){
                req.flash("success-message", "Your comment has been submitted for review.");
                res.redirect(`/${getPost.slug}`);
            }
        }
    }
}

module.exports.updateApproveComment = async (req,res) => {
    if(req.user.isAdmin){
        const findAndUpdate = await Comment.findByIdAndUpdate(req.body.commentId, { $set : { approveComment : req.body.data } });
        if(findAndUpdate) return res.json({ success : true })
       
    }
    
    
} 

module.exports.deleteComment = async (req,res) => {
    if(req.user.isAdmin){
        const findAndDelete = await Comment.findByIdAndDelete(req.params.id);
        if(findAndDelete){
            const findAndUpdatePost = await Post.findOneAndUpdate({ comments : req.params.id }, { $pull : { comments : req.params.id } });
            if(findAndUpdatePost){
                req.flash("success-message", "Comment Deleted successfuly");
                res.redirect("/admin/comments");
            }
            
        }
    }
}