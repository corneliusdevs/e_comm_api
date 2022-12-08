const router = require("express").Router()
const ProdImgSchema = require ("../models/Product")




router.post("/productupload", (req, res)=>{
   

   const cat = typeof req.body.categories !== "undefined" && typeof req.body.categories !== null ? req.body.categories?.split(" ") : ""
   
        console.log(cat);
        let newCat = [];
        let str
        cat.forEach(element => {
            str = element.trim().toLowerCase()
            str = str.replaceAll(",", "")
            str = str.replaceAll(".", "")
            str = str.replaceAll(" ", "")
            str !== "" && newCat.push(str)
        });

        const size = typeof req.body.size !== "undefined" && typeof req.body.size !== null ? req.body.size.split(" ") : ""
        console.log(size);
        let newSize = [];
         Array.isArray(size)  && size.length && size.forEach(element => {
         str = element.trim().toLowerCase()
            str = str.replaceAll(",", "")
            str = str.replaceAll(" ", "")
            if(str !== "" && str !== " "  && str.length !== 0) newSize.push(str);
        });

        const color =  typeof req.body.color !== "undefined" && typeof req.body.color !== null ? req.body.color.split(" ") : ""
        console.log(color);
        let newColor = [];
        Array.isArray(color)  && color.length && color.forEach(element => {
         str = element.trim().toLowerCase()
            str = str.replaceAll(",", "")
            str = str.replaceAll(".", "")
            str = str.replaceAll(" ", "")
            if(str !== "" && str !== " "  && str.length >= 3) newColor.push(str);
        });
       
       let newProd;
       
           if (newColor.length === 0 && newSize.length === 0){
            
            newProd = new ProdImgSchema({
               title: req.body.name,
               desc: req.body.description,
               categories: newCat,
               price: req.body.price,
               img: req.body.image
         })
        }if(newColor.length === 0 && newSize.length !== 0){

            newProd = new ProdImgSchema({
               title: req.body.name,
               desc: req.body.description,
               categories: newCat,
               size: newSize,
               price: req.body.price,
               img: req.body.image
         })
            
         }if(newColor.length !== 0 && newSize.length === 0){
            newProd = new ProdImgSchema({
               title: req.body.name,
               desc: req.body.description,
               categories: newCat,
               color: newColor,
               price: req.body.price,
               img: req.body.image
         })
         }else{
            newProd = new ProdImgSchema({
               title: req.body.name,
               desc: req.body.description,
               categories: newCat,
               size: newSize,
               color: newColor,
               price: req.body.price,
               img: req.body.image
         })
         }

   try{
     const savedProd = newProd.save()
     res.status(201).json({
      mssg: "product saved",
      savedProd
     })
   }catch(err){
     console.log(err)
     res.status(500).json(err)
   }
})



module.exports = router