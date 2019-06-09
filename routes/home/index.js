const router = require('express').Router();
const homeController = require('../../controllers/home/index');
const { isLoggedIn } = require('../../middleware/authenticated');
router.all('/*', (req, res, next) => {
    next();
});
    
router.get("/logout", homeController.getLogout);
router.get("/about", homeController.getAbout);
router.get("/contact", homeController.getContact);
router.get("/login", isLoggedIn,homeController.getLogin);
router.post("/login", isLoggedIn,homeController.postLogin);
router.get("/register", isLoggedIn,homeController.getRegister);
router.post("/register", isLoggedIn,homeController.postRegister);
router.get("/:slug", homeController.getPost);
router.get("/", homeController.getIndex);

module.exports = router;