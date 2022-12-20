const router = require("express").Router()
const Product = require("../models/Product");
const ProductImg = require("../models/ProductImg")
const {verifyTokenAndAdmin} = require("./verifyToken")

//CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res)=>{
          
            const docs = req.body.products;
            if(docs.length > 5){
                return res.status(401).json("Ooops! You Can't upload more than 5 products at a time!")
            }
             let products = []
             
            docs.forEach(product => {
                let transformedProd = {
                    
                    title: product.title.toLowerCase(),
                    ...product
                }
                const newProduct = new Product({
                    ...transformedProd
                    })

                 products.push(newProduct)
                  
                })
                let i = 0; 
                while(i < products.length){
                    try{
                        const savedProduct = await products[i].save()
                    }catch(err){
                       
                       return res.status(401).json({
                         error: err,
                         mssg: "Invalid fields or product exists",
                         product: products[i]
                       })
                    }
                    i++;
                }
                return res.status(200).json({
                    mssg: "successfully added"
                })
            })

//UPDATE PRODUCTS
router.put("/:id",  verifyTokenAndAdmin, async (req, res)=>{
       
    const parameters = {
        ...req.body.parameters
    }
 
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: parameters
        }, {new: true})

        return res.status(201).json({
            mssg: "operation succesful",
            updatedProduct
        })
    }catch(err){
         if(err.kind === "ObjectId"){
            return res.status(500).json("Invalid Product Id")
         }
         return res.status(500).json(err)
    }})


// GET PRODUCT
router.get("/:id", async(req, res)=>{



    try{
      const product = await Product.findOne({_id: req.params.id});
      return res.status(200).json(product)
    }catch(err){
        if(err.kind === "ObjectId"){
            return res.status(500).json("Invalid Product Id")
         }
         return res.status(500).json(err)
    }
})


// GET FIND PRODUCTS MATCHING A CONDITION
router.get("/search/:searchString", async(req, res)=>{

   try{
       const searchTerm = req.params.searchString.toLowerCase()
       const pages = req.query.p || 0
        const productsPerPage = 20
   
    let products = await Product.find({
        $or: [{
            title: searchTerm
        }, {
            categories: searchTerm
        }]
    }).skip(pages * productsPerPage).limit(productsPerPage);
     
   
       
       if (products.length === 0) {
        return res.status(404).json(products)
      }else{
        return res.status(200).json(products)
      }
   }catch(err){
      return res.status(500).json(err)
   }

})


//GET ALL PRODUCTS
router.get("/", async (req, res)=>{
    
    try{

        let products;
        const pages = req.query.p || 0
        const productsPerPage = 20
        const qNew = req.query.new;
        const qCategories = req.query.categories
        
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).skip(pages * productsPerPage).limit(productsPerPage)
        }else if(qCategories){
            products = await Product.find({categories: {
                $in: qCategories
            }}).skip(pages * productsPerPage).limit(productsPerPage)
        }
        else{
             products = await Product.find().skip(pages * productsPerPage).limit(productsPerPage)
        }
        
        const count = await Product.find().count()

        return res.status(200).json({
            products,
            count
        })

      }catch(err){
           return res.status(500).json(err)
      }

    // try{

    //     let products;
    //     const pages = req.query.p || 0
    //     const productsPerPage = 2
    //     const qNew = req.query.new;
    //     const qCategories = req.query.categories
        
    //     if(qNew){
    //         products = await Product.find().sort({createdAt: -1}).skip(pages * productsPerPage).limit(2)
    //     }else if(qCategories){
    //         products = await Product.find({categories: {
    //             $in: qCategories
    //         }}).skip(pages * productsPerPage).limit(2)
    //     }
    //     else{
    //          products = await Product.find().skip(pages * productsPerPage).limit(2)
    //     }
        

    //     return res.status(200).json(products)

    //   }catch(err){
    //        return res.status(500).json(err)
    //   }
})

//DELETE Product
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{

    try{
       const deletedProduct = await Product.findByIdAndDelete(req.params.id)
       return res.status(200).json({
        mssg: 'operation successful',
        deletedProduct
       })
    }catch(err){
        if(err.kind === "ObjectId"){
            return res.status(500).json("Invalid Product Id")
         }
         return res.status(500).json(err)
    }
})

module.exports = router