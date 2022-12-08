const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SEC, (err, user)=>{
           if(err){
            return res.status(403).json({
                mssg: "Token is not valid"
            })
           }
        req.user = user
        next()
        })
    }else{
        return res.status(401).json({
            mssg: "You're not Authenticated"
        })
    }

}

const verifyTokenAndAuthorization = (req,res, next)=>{
      verifyToken(req, res, ()=>{
        if(req.body.isAdmin){
            if(req.user.isAdmin){
                next()
            }else{
                return res.status(403).json({
                    mssg: "You cannot do that!"
                })
            }
        }
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json({
                mssg: "You're not allowed to do that!"
            })
        }
      })
}

const verifyTokenAndAdmin = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            return res.status(403).json({
                mssg:"You're not authorized"
            })
        }
    })
}

module.exports ={
    verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin
}