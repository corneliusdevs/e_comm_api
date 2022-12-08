const router = require("express").Router();
const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const CryptoJS = require("crypto-js")
const dotenv = require("dotenv")

dotenv.config()

// UPDATE USER DETAILS
router.put("/:id", verifyTokenAndAuthorization, 
   async (req, res)=>{
    if(req.body.password){
       req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_KEY).toString()
       
       try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
           },{new: true})

        return res.status(200).json(updatedUser)
       }catch(err){
           return res.status(500).json(err)
       }
       
    }
})

//Delete USER
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
   try{
      await User.findByIdAndDelete(req.params.id)
     return res.status(200).json({
        mssg: "User has been successfully deleted"
     })
   }catch(err){
     return res.status(500).json(err)
   }
})

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
      const savedUser = await User.findById(req.params.id)
      if(savedUser){

        const {password, ...others} = savedUser._doc
        return res.status(200).json(others)
      }else{
        return res.status(401).json({
            mssg: "User does not exist"
        })
      }
      
    }catch(err){
        return res.status(500).json(err)
    }
})

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
     const query = req.query.new
     try{
       const users = query? await User.find({}, {password: 0}).sort({_id: -1}).limit(5) : await User.find({}, {password: 0})

       return res.status(200).json(users)
     }catch(err){
        return res.status(500).json(err)
     }
})

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async(req, res)=>{
  try{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1 ))
    
    const data = await User.aggregate([
      {$match: { createdAt: {$gte: lastYear}}},

      {$project: {
         month: {$month: "$createdAt"}
      }},

      {$group: {
        _id: "$month",
        totalOrders: {$sum: 1},
      }}
    ])

     return res.status(200).json(data)
  }catch(err){
    res.status(500).json(err)    
  }
})


module.exports = router