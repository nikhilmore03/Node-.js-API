const express=require('express');
const router=express.Router();
const checkAuth=require('../middleware/check-auth')
const OrderController=require('../controller/order')

//Get list of all orders
router.get('/',checkAuth,OrderController.getall);

//Get specific order with ID
router.get('/:orderId',checkAuth,OrderController.getorder_details);

//Edit specific order
router.patch('/:orderId',checkAuth,OrderController.edit_order)

//Delete specific order
router.delete('/:orderId',checkAuth,OrderController.delete_order);

//Create new Order
router.post('/',checkAuth,OrderController.create_order);

module.exports=router;