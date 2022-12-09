const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express();
const dotenv = require("dotenv")

const userRoute = require("./Routes/user")
const authRoute = require("./Routes/auth")
const productRoute = require("./Routes/product")
const cartRoute = require("./Routes/cart")
const orderRoute = require("./Routes/order")
const checkOutRoute = require("./Routes/stripe")
const prodImgRoute = require("./Routes/prodImgRoute")
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit:"10mb", extended: true, parameterLimit: 50000}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
dotenv.config();




// connect to mongodb 
const connectDb = async ()=>{
   try{
     const conn = await mongoose.connect(process.env.MONGO_O_URL)
     console.log(`MongoDB connected: ${conn.connection.host}`)
   }catch(error){
     console.log(error);
     process.exit(1)
   }   
}






app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)

app.use("/api/checkout", checkOutRoute)
app.use("/api/uploads", prodImgRoute)

const PORT = process.env.PORT || 3000

connectDb().then(()=>{
    app.listen(PORT , ()=>{
        console.log("E-commerce server running")
    })
})

// try{
//     mongoose.connect(process.env.MONGO_O_URL)
//     .then(()=>
//         console.log("db connection succesful")
//     )
// }catch(err){
//    console.log(err)
// }

// app.listen(process.env.PORT || 5000, ()=>{
//     console.log("E-commerce server running")
// })
