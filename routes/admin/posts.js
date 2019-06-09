const router = require('express').Router();
const postController = require('../../controllers/admin/post');
const { isAuthenticated, isAdmin } = require('../../middleware/authenticated');
router.all('/*', isAuthenticated,(req, res, next) => {
    next();
});
router.get("/", isAdmin,postController.getIndex);
router.get("/my-posts", postController.myPosts);
router.get("/my-posts/edit/:id", postController.getEditPost);
router.put("/my-posts/edit/:id", postController.putEditPost);
router.delete("/my-posts/:id", postController.deletePost);
router.post("/unpublish-post/:id", postController.unpublishPost);
router.get("/create", postController.getPostCreate);
router.post("/create", postController.postPostCreate);
router.post("/publish-post", postController.postPublishPost);
router.post("/allow-comments", postController.postAllowComments);

module.exports = router;