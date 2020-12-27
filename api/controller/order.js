const Order=require('../models/order');
const Product=require('../models/product');
const mongoose=require('mongoose');

//Get all order details
exports.getall=(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(docs=>{
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc=>{
                 return  {
                     _id:doc._id,
                     product:doc.product,
                     quantity:doc.quantity,
                     request:{
                         type:"GET",
                         url:"http://localhost:3000/order/"+doc._id
                     }
                 }
            }),
         
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
 }

 //Get specific order details 
exports.getorder_details=(req,res,next)=>{

    Order.findById(req.params.orderId)
    .select('name price _id')
    .populate('product','name price')
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message:"Order not found"
            })
        }
        res.status(201).json({
            order:order,
            request:{
                type:"GET",
                url:"http://localhost:3000/order"
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

}

//Modify/Edit order
exports.edit_order=(req,res,next)=>{
    const id=req.params.orderId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Order.update({_id:id},{$set :updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:"Order details updated",
            request:{
                type:"GET",
                url:'http://localhost:3000/order/'+ id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}

//Create new order
exports.create_order=(req,res,next)=>{
    Product.findById(req.body.productID)
    .then(product=>{
        if(!product){
            return res.status(500).json({
                message:"Product not found"  
            })
        }
        const order=new Order({
            _id:new mongoose.Types.ObjectId(),
            product:req.body.productID,
            quantity:req.body.quantity,
        })
       return order.save()
        .then(result=>{
            res.status(201).json({
                message:"Order successfully placed",
                createdOrder:{
                    _id:result._id,
                    product:result.product,
                    quantity:result.quantity
                },
                request:{
                    type:"GET",
                    url:"http://localhost:3000/order/"+result._id
                }      
            });
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:"Product not found",
            error:err
        });
    })

}

//Delete existing order
exports.delete_order=(req,res,next)=>{
    Order.remove({_id:req.params.orderId})
    .exec()
    .then(result=>{
        res.status(201).json({
            message:'Order removed successfully',
            request:{
                type:"POST",
                url:"http://localhost:3000/order/",
                body:{
                    productID:"ID",
                    quantity:"Number"
                }
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    })
}

