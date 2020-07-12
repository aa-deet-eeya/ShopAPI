const mongoose = require('mongoose')

const Productschema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId ,
    name : {type : String, required : true} ,
    price : {type : Number, required : true} ,
}) 

const CartSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId ,
    CartName : {type :String , required : true },
    CartItems : [{        
        product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required : true } ,
        quantity : {type : Number, default: 1} 
    }]
 
})

module.exports = {
    Product : mongoose.model('Product', Productschema) ,
    Cart : mongoose.model('Cart', CartSchema)            
}