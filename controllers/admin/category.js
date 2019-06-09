const Category = require('../../models/Category');
exports.getIndex = (req,res) => {
    res.render("admin/pages/dashboard");
};

exports.getCategories = async (req,res) => {
    const allCategories = await Category.find();
    res.render("admin/pages/category/categories", {
        categories : allCategories
    });
}

exports.postCategory = async (req,res) => {
    const newCategory = new Category({
        name : req.body.name,
        desc : req.body.description
    }); 
    const result = await newCategory.save();
    if(result){
        req.flash("success-message","Category created successfuly");
        res.redirect("/admin/categories");
    }
}

exports.editCategory = async (req,res) => {
    const categoryId = req.params.id;
    const getCategory = await Category.findById(categoryId);
    if(getCategory){
        res.render("admin/pages/category/edit-category.pug", {
            category : getCategory
        });
    }
}

exports.editPostCategory = async (req,res) => {
    const categoryId = req.params.id;
    const getEditedCategory = await Category.findOneAndUpdate({ _id : categoryId }, { $set : { name : req.body.name, desc : req.body.description } });
    if(getEditedCategory){
        req.flash("success-message", "Category updated successfuly");
        res.redirect("/admin/categories");
    }
}

exports.deleteCategory = async (req,res) => {
    const categoryId = req.params.id;
    if(req.user.isAdmin){
        const deleteCat = await Category.findOneAndDelete({ _id : categoryId });
        if(deleteCat) {
            req.flash("success-message","Category deleted successfuly");
            res.redirect("/admin/categories");
        }
    }
}