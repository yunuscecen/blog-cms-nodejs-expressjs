const Category = require('../../models/Category');
exports.getIndex = (req,res) => {
    res.render("admin/pages/dashboard");
};
