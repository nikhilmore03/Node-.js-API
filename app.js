const express= require('express');
const app=express();
const productRoutes=require('./api/routes/product');
const orderRoutes=require('./api/routes/order');
const userRoutes=require('./api/routes/user');
const morgan=require('morgan')
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


//Connection string to connect with moongose 
mongoose.connect('mongodb+srv://'+ process.env.MONGO_ATLAS_INSTANCE+':'+process.env.MONGO_ATLAS_PW+'@cluster0.yys3z.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
 });

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin",'*');
    res.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"  
    );
    if(req.method==="OPTIONS"){
        res.header("Access-Control-Allow-Methods",'PUT,POST,PATCH,DELETE,GET');
        res.status(200).json({});
    }
    next();
});



app.use('/uploads',express.static('uploads'));


//routing paths
app.use('/products',productRoutes);

app.use('/order',orderRoutes);

app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error=new Error("Request not found");
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports=app;