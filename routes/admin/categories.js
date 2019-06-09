const router = require('express').Router();
const categoryController = require('../../controllers/admin/category');
const { isAuthenticated, isAdmin } = require('../../middleware/authenticated');

router.all('/*', isAuthenticated,isAdmin ,(req, res, next) => {
    next();
});
router.get("/", categoryController.getCategories);
router.delete("/:id",categoryController.deleteCategory);
router.post("/create", categoryController.postCategory);
router.get("/edit/:id",categoryController.editCategory);
router.put("/edit/:id",categoryController.editPostCategory);
module.exports = router;