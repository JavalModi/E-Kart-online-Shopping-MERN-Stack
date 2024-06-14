const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type, userInfo } = require('os');
const { error } = require('console');

app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect('mongodb+srv://javalmodi:javal4591@cluster0.czwanul.mongodb.net/E-Kart');

// API Creation

app.get('/',(req,res)=>{
    res.send('Express app is running')
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination : './upload/images',
    filename : (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating upload endpoint for images

app.use('/images',express.static('upload/images'))

app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating products

const Product = mongoose.model('Product',{
    id:{
        type:Number,
        required:true,
        },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },

})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({})
    let id
    if(products.length>0){
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0]
        id = last_product.id+1
    }
    else{
        id=1
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product)
    await product.save()
    console.log('Saved')
    res.json({
        success:true,
        name:req.body.name,
    })
})

// crating for deleting products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log('Removed')
    res.json({
        success:true,
        name:req.body.name
    })
})

// Createing api for getting all products

app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({})
    console.log('All product Featched')
    res.send(products)
})

// shema creating for user model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating Endpoint registering for user

app.post('/signup',async(req,res)=>{

    let check = await Users.findOne({email:req.body.email})
    if (check) {
        return res.status(400).json({success:false,errors:'existing user found with same email Id or email Address'})
    }
    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i]=0
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save()

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})

})
// creating endpoint for user login

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email})
    if(user){
        const passCompare = req.body.password === user.password
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:'Wrong Password'})
        }
    }
    else{
        res.json({success:false,errors:'Wrong Email id'})
    }
})

// creating endpoint for newcollection data
app.get('/newcollection',async(req,res)=>{
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8)
    console.log('New Collection Feched')
    res.send(newcollection)
})

app.listen(port,(error)=>{
    if (!error) {
        console.log('Server Running is Port'+port);
    }
    else{
        console.log('Error:'+error);
    }
})