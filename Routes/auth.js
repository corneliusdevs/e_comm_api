const router = require("express").Router()
const dotenv = require("dotenv");
dotenv.config()
const CryptoJS = require("crypto-js") 
const User = require("../models/User")
const jwt = require("jsonwebtoken")

//LOGIN ROUTE
router.post("/login", async(req,res)=>{
    try{
        const user = await User.findOne({username: req.body.username.toLowerCase()});
        
        // if usernam is invalid
        if(!user){
            return res.status(401).json({
                mssg: "wrong credentials"
            })
        }

        const hashedPassword = CryptoJS.AES.decrypt( user.password , process.env.PASSWORD_KEY);

        const savedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
         
        // if password is invalid
        if(savedPassword !== req.body.password){
            
            return res.status(401).json({
                mssg: "wrong credentials"
            })
        }
        
         
        // if username and password are valid
       const {_id, username, isAdmin, ...others} = user._doc
       
       // generate access token
       const accessToken =  jwt.sign({
          id: user._id,
          isAdmin: user.isAdmin
       }, process.env.ACCESS_TOKEN_SEC, {expiresIn: "3d"} )
      
        res.status(200).json({
            userId: _id,
            username,
            isAdmin,
            accessToken: accessToken
        })
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
     

})

//REGISTER ROUTE
router.post("/register", async (req,res)=>{
    
    const userExists = await User.find({username: req.body.username.toLowerCase()})

    const userExists2 = await User.find({email: req.body.email})
    // check if the username already exists to avoid duplicate fields in db
    if(userExists.length !== 0 || userExists2.length !== 0){
       return res.status(501).json({
         mssg: "user exists. please use a different username"
       })
    } else{

        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_KEY).toString()
    });
    
    try{
        const savedUser = await newUser.save();
        const {password, others} = savedUser
        res.status(201).json({
            ...others,
            mssg: `Thanks for signing Up ${req.body.username}`
        })
    }catch(err){
        res.status(500).json(err)
    }

}  
    

})
module.exports = router