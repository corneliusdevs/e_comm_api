const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken")
const Cart = require("../models/Cart")
const router = require("express").Router()

//CREATE CART
router.post("/", verifyTokenAndAuthorization, async(req, res)=>{
    const newCart = new Cart(req.body)
    try{
        const savedCart = await newCart.save()
        return res.status(200).json(savedCart)
    }catch(err){
        if(err.keyPattern){

            return res.status(400).json({
                mssg: "Cart Exists!"
            })
        }
       return res.status(500).json(err)
    } 
})

//UPDATE CART
router.put("/:id",verifyTokenAndAuthorization, async(req, res)=>{

    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,
         {
            $set: req.body
        }, 
        {new:true}
        );
          return res.status(201).json(updatedCart)

    }catch(err){
        return res.status(500).json(err)
    }

})

//DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        const deletedCart = await Cart.findByIdAndDelete(req.params.id)
        return res.status(200).json({
            mssg: "Cart Deleted!",
            deletedCart
        })
    }catch(err){
          return res.status(500).json(err)
    }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization,async (req, res)=>{
    try{
       const cart = await Cart.findOne({userId: req.params.userId})
       return res.status(200).json(cart)
    }catch(err){
        if(err.kind === "ObjectId"){
            return res.status(500).json("Invalid Product Id")
         }
         return res.status(500).json(err)
    }
})

// GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    
    try{

        let carts;
        const pages = req.query.p || 0
        const cartsPerPage = 2
        const qNew = req.query.new;

        
        if(qNew){
            carts = await Cart.find().sort({createdAt: -1}).skip(pages * cartsPerPage).limit(2)
        }
        else{
             carts = await Cart.find().skip(pages * cartsPerPage).limit(2)
        }
        

        return res.status(200).json(carts)

      }catch(err){
           return res.status(500).json(err)
      }
})



module.exports = router