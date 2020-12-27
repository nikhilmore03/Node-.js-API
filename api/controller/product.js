const Product=require('../models/product');
const mongoose=require('mongoose');

exports.create_product=(req,res,next)=>{
    console.log(req.file);
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })
    product.save()
    .then(result=>{
        console.log(result);
         res.status(201).json({
        message:'Created product successfully',
        createdProduct:{
            name:result.name,
            price:result.price,
            _id:result._id,
            productImage:result.productImage,
            request:{
                type:"GET",
                url:'http://localhost:3000/products/'+result._id
            }
        }
    });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   
}

//Get all product details
exports.getall_product=(req,res,next)=>{

    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log(doc);
        const response={
            count:doc.length,
            products:doc.map(doc=>{
                return {
                    name:doc.name,
                    price:doc.price,
                    productImage:doc.productImage,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
  
}

exports.get_product_details=(req,res,next)=>{
    const id=req.params.id;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log("From Database",doc);
        if(doc){
        res.status(200).json({
            product:doc,
            request:{
                type:'GET',
                description:"Get all products",
                url:'http://localhost:3000/products/'
            }
        });
        }
        else{
            res.status(404).json({message:"no valid entry found"});
        }
    })
    .catch(err=>{
         console.log(err);
        res.status(404).json({error:err});
    });
  
}

//Delete proct details
exports.delete_product=(req,res,next)=>{
    const id=req.params.id;
    Product.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json({
            result:{
                message:'Product deleted successfully',
                request:{
                type:"POST",
                url:'http://localhost:3000/products/',
                data:{
                    name:"String",
                    price:"Number"
                }
            }
        }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}


//Edit product details
exports.edit_product=(req,res,next)=>{
    const id=req.params.id;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set :updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:'Product details updated',
            request:{
                type:"GET",
                url:'http://localhost:3000/products/'+ id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}