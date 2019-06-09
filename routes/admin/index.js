const router = require('express').Router();
const adminController = require('../../controllers/admin/index');
const { isAuthenticated } = require('../../middleware/authenticated');

router.all('/*', isAuthenticated ,(req, res, next) => {
    next();
});
router.get("/", adminController.getIndex);
module.exports = router;