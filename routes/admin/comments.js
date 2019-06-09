const router = require('express').Router();
const commentController = require('../../controllers/admin/comment');
const { isAuthenticated, isAdmin } = require('../../middleware/authenticated');
router.all('/*', isAuthenticated, isAdmin,(req, res, next) => {
    next();
});


router.get("/",commentController.getComments);
router.post("/approve-comment", commentController.updateApproveComment); 
router.delete("/:id", commentController.deleteComment); 
router.post("/:id", commentController.postComment); 




module.exports = router;