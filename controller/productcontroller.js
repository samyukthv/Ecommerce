const Product = require("../models/product_schema");
const Category = require("../models/category_schema");

//load add product

const loadAddProduct = async (req, res) => {
  const category = await Category.find({}).lean();
  try {
    res.render("admin/addProduct", { layout: "admin_layout", category });
  } catch (error) {
    console.log(error.message);
  }
};

//add product

const addProduct = async (req, res) => {
  const product = req.body;

  const category= await Category.findOne({categoryName:req.body.categoryName})
  
  console.log(product);
  const imageName = [];
  for (file of req.files) {
    imageName.push(file.filename);
  }
  product.image = imageName;
  product.categoryId=category._id
  const products = new Product(product);
  products.save();
  console.log(products);
  res.render("admin/addProduct", { layout: "admin_layout" });
};



// list product

const listProduct = async (req, res, next) => {
  try {
    const data= await Product.find({}).populate('categoryId').lean()
     console.log(data);
    
      
      res.render("admin/productList", { layout: "admin_layout", data });
  } catch (error) {
    res.status(400).json({ messageError: error });
      res.render("admin/admin", { layout: "admin_layout" });
  }
 
}   
   
    
      
    

const blockProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: false });
    Product.find({})
      .lean()
      
        res.render("admin/productList", { layout: "admin_layout" });
   
  } catch (error) {
    console.log(error.message);
  }
};

const unblockProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: true });
    Product.find({})
      .lean()
     
        res.render("admin/productList", { layout: "admin_layout" });

  } catch (error) {
    console.log(error.message);
  }
};

const editProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await Product.findById({ _id: id }).lean();
    const catData = await Category.find({}).lean();
    //   console.log(data)
    if (data) {
      res.render("admin/editProduct", {
        layout: "admin_layout",
        data,
        catData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};



const updateProduct = async (req, res) => {
  try {

   const  category =await Category.findOne({categoryName:req.body.categoryName})

console.log(category);


console.log(req.files);
    const imageName = [];
    for (file of req.files) {
      imageName.push(file.filename);
    }
    console.log(imageName);
    if (req.files) {
      await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            productName:req.body.productName,
            stock:req.body.stock,
            price:req.body.price,
            categoryId:category._id,
            description: req.body.description,
            status: req.body.status,
            image: imageName,
          },
        }
      );
    } else {
      await Product.updateOne(
        { _id: req.params.id },
        {
          $set: {
            productName:req.body.productName,
            price:req.body.price,
            stock:req.body.stock,
            categoryId:category._id,
            description: req.body.description,
            status: req.body.status,
          
          },
        }
      );
    }
    res.redirect("/admin/productList");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadAddProduct,
  listProduct,
  addProduct,
  blockProduct,
  unblockProduct,
  editProduct,
  updateProduct,
};
