const router = require("express").Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")
const Order = require("../models/Order")

// CREATE ORDERS
router.post("/", verifyTokenAndAuthorization, async(req, res)=>{
    const newOrder = new Order(req.body)
    try{
        const savedOrder = await newOrder.save()
        return res.status(201).json(savedOrder)
    }catch(err){
       return res.status(500).json(err)
    }
})

// GET ORDER
router.get("/:orderId", verifyTokenAndAuthorization, async(req, res)=>{
      try{
           
         const order = await Order.findById(req.params.orderId)
         return res.status(200).json(order)

      }catch(err){
        return res.status(500).json(err)
      }
})

//GET ALL USER ORDERS
router.get("/user/:userId", verifyTokenAndAuthorization, async (req, res)=>{

    try{
       const userOrders = await Order.find({userId: req.params.userId})
       return res.status(200).json(userOrders)
    }catch(err){
       return res.status(500).json(err)
    }
})

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    let allOrders;

    const qNew = req.query.new;
   const pages = req.query.p || 0
   const ordersPerPage = 4
   try{
      if(qNew){
         allOrders = await Order.find().sort({createdAt: -1}).skip(pages * ordersPerPage).limit(10)
      }else{
         allOrders = await Order.find().skip(pages * ordersPerPage).limit(10)
      }
      

      return res.status(200).json(allOrders)
   }catch(err){
       return res.status(500).json(err)
   }
})


//UPDATE ORDER

router.put("/:id", verifyTokenAndAdmin, async(req, res)=>{
   try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
           $set: req.body
        }, {new: true})

        return res.status(201).json(updatedOrder)
   }catch(err){
      return res.status(500).json(err)
   }
})

//DELETE ORDER
router.delete("/:orderId", verifyTokenAndAdmin, async(req, res)=>{
   try{
      const deletedOrder = await Order.findByIdAndDelete(req.params.orderId)
      return res.status(201).json({
         mssg: "Order Has Been Deleted",
         deletedOrder
      })
   }catch(err){
      return res.status(500).json(err)
   }
})

// GET YEARLY INCOME
router.get("/stats/month", verifyTokenAndAdmin, async(req, res)=>{
   try{

      const date = new Date();
      const lastMonth = new Date(date.setMonth(date.getMonth()-1))
      const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
      
      const income = await Order.aggregate(
         [
            { $match: { createdAt: { $gte: previousMonth }}},

            { $project: {
               month: {$month: "$createdAt"},
               sales: "$amount"
            }},

            { $group:{
             _id: "$month",
             total: {
               $sum: "$sales"
             }
            }}
         ]
      )
      return res.status(200).json(income)
   }catch(err){
      res.status(500).json(err)
   }

})


module.exports = router