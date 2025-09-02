const Cart = require("../../model/CartModel");
const Product = require("../../model/ProductModel");
const cloudinary = require('cloudinary').v2;

exports.addproduct = async (req, res) => {

  try {
    const {
      productName, Description, ProductType, Price,gstPercentage, countInStock, PackageContain, Fit, Fabric, Pattern, Packof, sizes, Bestsller
    } = req.body
    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
    let imageurl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
        return result.secure_url

      })
    )


    const product = new Product({
      productName, Description,gstPercentage, ProductType, Price, countInStock, PackageContain, Fit, Fabric, Pattern, Packof, sizes: JSON.parse(sizes), Bestsller, images: imageurl,
      user: req.user._id
    })
    const createProduct = await product.save()
    res.status(200).json(createProduct)
  } catch (error) {
    res.status(500).json(error);

  }
}
exports.editproduct = async (req, res) => {
  try {
    const {
      productName,
      Description,
      ProductType,
      Price,
      countInStock,
      PackageContain,
      Fit,
      Fabric,
      Pattern,
      Packof,
      sizes,
      Bestsller,
    } = req.body;

    // Fetch product from DB
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update basic fields
    product.productName = productName || product.productName;
    product.Description = Description || product.Description;
    product.ProductType = ProductType || product.ProductType;

    product.Price = Price || product.Price;
    product.countInStock = countInStock || product.countInStock;
    product.PackageContain = PackageContain || product.PackageContain;
    product.Fit = Fit || product.Fit;
    product.Fabric = Fabric || product.Fabric;
    product.Pattern = Pattern || product.Pattern;
    product.Packof = Packof || product.Packof;
    product.Bestsller = Bestsller !== undefined ? Bestsller : product.Bestsller;

    // Handle sizes (array or JSON string)
    if (sizes) {
      product.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
    }

    // Handle images (from req.files)
    const files = req.files || {};
    const existingImages = product.images || [];

    const updatedImages = await Promise.all(
      ["image1", "image2", "image3", "image4"].map(async (key, index) => {
        if (files[key]?.[0]) {
          const uploaded = await cloudinary.uploader.upload(files[key][0].path, {
            resource_type: "image",
          });
          return uploaded.secure_url;
        } else {
          return existingImages[index] || null;
        }
      })
    );

    // Remove null values and update
    product.images = updatedImages.filter(Boolean);

    // Save updated product
    const updatedProduct = await product.save();
    await Cart.updateMany(
  { "products.productId": product._id },
  {
    $set: {
      "products.$[elem].productName": updatedProduct.productName,
      "products.$[elem].Price": updatedProduct.Price,
      "products.$[elem].images": updatedProduct.images[0], // assuming single image or you want the first
    },
  },
  {
    arrayFilters: [{ "elem.productId": updatedProduct._id }],
    multi: true,
  }
);

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

exports.deleteproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    console.log(product);

    if (product) {
      await product.deleteOne()
      res.status(200).json(product)
    }
    else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });

  }
}

exports.getallproduct = async (req, res) => {

  try {
    const { ProductType, Pattern, Fabric, Fit, sizes, minPrice, maxPrice, sortBy, search ,limit} = req.query
    let query = {}
   
     if(ProductType && ProductType.toLocaleLowerCase() !== "all"){
      query.ProductType={$in:ProductType.split(",")}
    }
    if(Pattern){
      query.Pattern={$in:Pattern.split(",")}
    }
     if(Fabric){
      query.Fabric={$in:Fabric.split(",")}
    }
     if(Fit){
      query.Fit={$in:Fit.split(",")}
    }
     if(sizes){
      query.sizes={$in:sizes.split(",")}
    }
    if(minPrice||maxPrice){
      query.Price={}
        if(minPrice) query.Price.$gte=Number(minPrice)
       if(maxPrice) query.Price.$lte=Number(maxPrice)

    }
    if(search){
      query.$or=[
        {productName:{$regex:search,$options:"i"}},
         {Description:{$regex:search,$options:"i"}}
      ]
    }
    let sort={}
    if(sortBy){
      switch(sortBy){
        case"priceASc":
              sort={Price:1}
              break
        case"priceDesc":
              sort={Price:-1}
              break
        case "newProduct":
            sort = { createdAt: -1 }; 
             break;
        default:
            break
      }

    }
        query.countInStock = { $gt: 0 }

    let product=await Product.find(query).sort(sort).limit(Number(limit)||0)
    
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.getsingleproduct=async(req,res)=>{
try {
  const product=await Product.findById(req.params.id)
  console.log(product);
  
  if(product){
res.status(200).json(product)
  }
  else{
    res.status(404).json({message:"product not found"})
  }
} catch (error) {
  res.status(500).json(error)
}
}
exports.getsimilerproduct=async(req,res)=>{
try {
  const {id}=req.params
const product=await Product.findById(id)
  if(product){
    const similerproduct= await Product.find({
      _id:{$ne:id},
      ProductType:product.ProductType,
      countInStock: { $gt: 0 },
    })
    console.log(similerproduct.length);
    
res.status(200).json(similerproduct)
  }
  else{
    res.status(404).json({message:"product not found"})
  }
  
} catch (error) {
  res.status(500).json(500)

}}

exports.bestsellerproduct=async(req,res)=>{
try {
   const { ProductType, Pattern, Fabric, Fit, sizes, minPrice, maxPrice, sortBy, search ,limit} = req.query
    let query = {Bestsller:true}
   
     if(ProductType && ProductType.toLocaleLowerCase() !== "all"){
      query.ProductType={$in:ProductType.split(",")}
    }
    if(Pattern){
      query.Pattern={$in:Pattern.split(",")}
    }
     if(Fabric){
      query.Fabric={$in:Fabric.split(",")}
    }
     if(Fit){
      query.Fit={$in:Fit.split(",")}
    }
     if(sizes){
      query.sizes={$in:sizes.split(",")}
    }
    if(minPrice||maxPrice){
      query.Price={}
        if(minPrice) query.Price.$gte=Number(minPrice)
       if(maxPrice) query.Price.$lte=Number(maxPrice)

    }
    if(search){
      query.$or=[
        {productName:{$regex:search,$options:"i"}},
         {Description:{$regex:search,$options:"i"}}
      ]
    }
    let sort={}
    if(sortBy){
      switch(sortBy){
        case"priceASc":
              sort={Price:1}
              break
        case"priceDesc":
              sort={Price:-1}
              break
        case "newProduct":
            sort = { createdAt: -1 }; 
             break;
        default:
            break
      }

    }
    query.countInStock = { $gt: 0 }
    const bestsellerproduct= await Product.find(query).sort(sort).limit(Number(limit)||0)
 
  if(bestsellerproduct){
res.status(200).json(bestsellerproduct)

  }
  else{
        res.status(404).json({message:"product not found"})

  }
} catch (error) {
  res.status(500).json(error)
}
}


exports.newproduct=async(req,res)=>{
try {
  const newproduct=await Product.find().sort({createdAt:-1})
  if(newproduct){
res.status(200).json(newproduct)

  }
  else{
        res.status(404).json({message:"product not found"})

  }
} catch (error) {
  res.status(500).json(error)
}
}