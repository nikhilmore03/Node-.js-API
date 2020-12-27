const express=require('express');
const router=express.Router();
const checkAuth=require("../middleware/check-auth")
const ProductController=require('../controller/product')

//Multer package is used for uploading file
const multer=require('multer');

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads/')
    },
   
    filename:(req,file,callback)=>{
        callback(null, new Date().toDateString()+file.originalname)
    }
});

const fileFilter=(req,file,callback)=>{
    if(file.mimetype==='image/jpeg' ||file.mimetype==='image/png'){
        callback(null,true);
    }
    else{
        callback(new Error('PNG and JPEG files allowed'),false);
    }
}

const uploads=multer({storage:storage,limits:{
    fileSize:1024*1024*5 //5 Mb
},
    fileFilter:fileFilter
});

router.get('/',ProductController.getall_product);

router.get('/:id',ProductController.get_product_details);

router.post('/',checkAuth,uploads.single('productImage'),ProductController.create_product);

router.delete("/:id",checkAuth,ProductController.delete_product);

router.patch('/:id',checkAuth,ProductController.edit_product);

module.exports=router;