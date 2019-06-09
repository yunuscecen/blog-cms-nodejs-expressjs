const fs = require('fs');
const path = require('path');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const { isEmpty, uploadDir } = require('../../helper/upload-helper');

exports.getIndex = async (req,res) => {
    const allPosts = await Post.find({}).populate("category").populate("user");
    // console.log(allPosts);
    res.render("admin/pages/posts/index", {
        posts : allPosts
    });
}

exports.getPostCreate = async (req,res) => {
    const allCategories = await Category.find({});
    res.render("admin/pages/posts/post-create",{
        categories : allCategories
    });
};

exports.postPostCreate =  async (req,res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({ message : "Please add a title" });
    }

    if(!req.body.postBody){
        errors.push({ message : "Please add post body" });
    }

    if(errors.length > 0){
        const allCategories = await Category.find({});
        res.render("admin/pages/posts/post-create", {
            errors : errors,
            categories : allCategories
    })
    }else {
        let filename = "";
        console.log(req.files);
        if(!isEmpty(req.files)){
            let file = req.files.image;
            filename = Date.now() + "-" + file.name;
            file.mv("./public/common/uploads/" + filename, (err) => {
                if(err) throw err;
            });
        }else {
            req.flash("error","Please add a image");
            res.redirect("/admin/posts/create");
        }
        
        const newPost = Post({
            title : req.body.title,
            desc : req.body.description,
            postBody : req.body.postBody,
            category : req.body.category,
            postImage : filename,
            user :  req.user._id
        });
        const postSaved = await newPost.save();
        if(postSaved) {
            req.flash("success-message", `Post created successfuly.`);
            return res.redirect("/admin/posts");
        }
    }
   
     
};

exports.postPublishPost = async (req,res) => {
    const updatePublishPost = await Post.findByIdAndUpdate(req.body.postId, { $set : { publishPost : req.body.data } });
    if(updatePublishPost) return res.json({ success : true })
   
}

exports.postAllowComments = async (req,res) => {
    const updateAllowComments = await Post.findByIdAndUpdate(req.body.postId, { $set : { allowComments : req.body.data } });
    if(updateAllowComments) return res.json({ success : true })
}

exports.myPosts = async (req,res) => {
    const myPosts = await Post.find({ user : req.user._id }).populate("user").populate("category");
    res.render("admin/pages/posts/my-posts", {
        posts : myPosts
    });
}

exports.deletePost = async (req,res) => {
    let postId = req.params.id;
    const post = await Post.findOne({ user : req.user._id, _id : postId }).populate("comments");
    if(post) {
        fs.unlink(uploadDir + post.postImage, async (err) => {
            if(!post.comments.length < 1){
                post.comments.forEach(comment => {
                    comment.remove();
                });
            }
        const postDelete =  await post.remove();
        if(postDelete){
            req.flash("success-message", "Post deleted successfuly");
            res.redirect("/admin/posts/my-posts");
        }
        });
            
     
        
    }
}

exports.getEditPost = async (req,res) => {
    const postId = req.params.id;
    const allCategories = await Category.find({});
    let postDetail = await Post.findOne({ _id : postId, user : req.user._id });
    if(postDetail && allCategories) {
        res.render("admin/pages/posts/post-edit", {
            post : postDetail,
            categories : allCategories
        })
    }
}

exports.putEditPost = async (req,res) => {
    const postId = req.params.id;
    let errors = [];
    if(!req.body.title){
        errors.push({ message : "Please add a title" });
    }

    if(!req.body.postBody){
        errors.push({ message : "Please add post body" });
    }

    if(errors.length > 0){
        const allCategories = await Category.find({});
        req.flash("error","Please fill in the required fields. ");
        res.redirect(`/admin/posts/my-posts/edit/${postId}`);
    }else {
        
        const post = await Post.findOne ({ _id : postId, user : req.user._id });
        if(post){
            post.title = req.body.title,
            post.desc = req.body.description,
            post.postBody = req.body.postBody,
            post.category = req.body.category

            if(!isEmpty(req.files)) {
                fs.unlink(uploadDir + post.postImage, (err) => console.log(err));
                let file = req.files.image;
                let fileName = Date.now() + "-" + file.name;
                post.postImage = fileName;
                file.mv("./public/common/uploads/" + fileName, (err) => {
                    if(err) throw err;
                })
            }

            const editPost = await post.save();
            if(editPost){
                req.flash("success-message", "Post updated successfuly");
                res.redirect("/admin/posts/my-posts");
            }
            
        }
        
        
       
    }
    
}

exports.unpublishPost = async (req,res) => {
    const getPostId = req.params.id;
    if(req.user.isAdmin){
        const post = await Post.findOne({ _id : getPostId });
        let statu = post.unpublish;
        if(post){
            if(statu){
                post.unpublish = false;
                post.allowComments = true;
                post.publishPost = true;
                const updatePublish = await post.save();
                if(updatePublish){
                    req.flash("success-message", "Post published successfuly");
                    res.redirect("/admin/posts");
                }
            }
            if(!statu){
                post.unpublish = true;
                post.allowComments = false;
                post.publishPost = false;
                const updatePublish = await post.save();
                if(updatePublish){
                    req.flash("success-message", "Post unpublished successfuly");
                    res.redirect("/admin/posts");
                }
            }
        }

        
    }
}