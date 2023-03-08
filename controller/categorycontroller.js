const Category = require("../models/category_schema");




//load add category
const loadAddCategory = async (req, res) => {
    try {
      res.render("admin/addCategory", { layout: "admin_layout" });
    } catch (error) {
      console.log(error.message);
    }
  };





  //add new category
  
  const addNewCategory = async (req, res, next) => {
    const category = req.body;
    console.log(category);
    category.categoryName = category.categoryName
      .split(" ")
      .join(" ")
      .toLowerCase();
    let categorydb = await Category.findOne({
      categoryName: category.categoryName,
    });
    console.log(categorydb);
    if (categorydb) {
      if (category.categoryName == categorydb.categoryName) {
        res.render("admin/addCategory", {
          layout: "admin_layout",
          categorystatus: "category already exist",
        });
      }
    } else {
      category.image = req.file.filename;
      const data = new Category(category);
      data.save();
      res.render("admin/addCategory", { layout: "admin_layout" });
    }
  };
  





  //list category
  
  const listCategory = async (req, res, next) => {
    Category.find({})
      .lean()
      .then((data) => {
        res.render("admin/categoryList", { layout: "admin_layout", data });
      })
      .catch((error) => {
        res.status(400).json({ messageError: error });
        res.render("admin/admin", { layout: "admin_layout" });
      });
  };
  




  //edit category
  
  const editCategory = async (req, res) => {
    try {
      const id = req.query.id;
      const data = await Category.findById({ _id: id }).lean();
      if (data) {
        res.render("admin/editCategory", { layout: "admin_layout", data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  




  //update category
  
  const updateCategory = async (req, res) => {
    const category = req.body;
    category.categoryName = category.categoryName
      .split(" ")
      .join("_")
      .toLowerCase();
    let categorydb = await Category.findOne({
      $and: [
        { _id: { $ne: category.id } },
        { categoryName: category.categoryName },
      ],
    });
    if (categorydb) {
      if (categorydb.categoryName == category.categoryName) {
        res.render("admin/addCategory", {
          layout: "admin_layout",
          categorystatus: "category already exist",
        });
      }
    } else {
      try {
        if(req.file){
          await Category.updateOne(
            { _id: req.body.id },
            {
              $set: {
                categoryName: req.body.categoryName,
                description: req.body.description,
                status: req.body.status,
                image: req.file.filename,
              },
            }
          );
        }else{
          await Category.updateOne(
            { _id: req.body.id },
            {
              $set: {
                categoryName: req.body.categoryName,
                description: req.body.description,
                status: req.body.status,
               
              },
            }
          );

        }
        
        await Category.find({})
          .lean()
          .then((data) => {
            res.render("admin/categoryList", { layout: "admin_layout", data });
          });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  




  
  //delete category
  
  const deleteCategory = async (req, res) => {
    try {
      const id = req.params.id;
      await Category.deleteOne({ _id: id });
      Category.find({})
        .lean()
        .then((data) => {
          res.render("admin/categoryList", { layout: "admin_layout", data });
        });
    } catch (error) {
      console.log(error.message);
    }
  };





  module.exports={

    loadAddCategory,
  addNewCategory,
  listCategory,
  editCategory,
  updateCategory,
  deleteCategory,

  }