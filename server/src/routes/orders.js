import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";


const router = express.Router();


router.post("/", async(req,res)=>{

try{

const {
invoice,
items,
subtotal,
tax,
total,
customerId,
customerName
}=req.body;


// decrease stock

for(const item of items){

const product = await Product.findById(item.productId);

if(product){

product.stock -= item.qty;

if(product.stock < 0){
product.stock = 0;
}

await product.save();

}

}


// update customer

if(customerId){

await Customer.findByIdAndUpdate(
customerId,
{
$inc:{
orders:1,
totalSpent:total
}
}
)

}



const order = await Order.create({
invoice,
items,
subtotal,
tax,
total,
customerId,
customerName
});


res.json(order);


}catch(error){

res.status(500).json({
message:error.message
})

}

});



router.get("/", async(req,res)=>{

const orders = await Order
.find()
.sort({createdAt:-1});


res.json(orders);


});


export default router;