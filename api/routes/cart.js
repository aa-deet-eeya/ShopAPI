const express = require('express')
const router = express.Router() 
const mongoose = require('mongoose')

const admin = require('../auth/admin')
const authenticate = require('../auth/authenticate')

const {Cart, Product} = require('../DB/Schema')

router.get('/', admin ,(req, res)=>{
    Cart.find()
        .select('_id CartName CartItems')
        .populate('CartItems.product', '_id name price')
        .exec()
        .then(cart=>{
            console.log(cart)
            res.status(200).json({
                success : true ,
                Cart : cart.map(item=>{
                    return {
                        _id : item._id ,
                        CartName : item.CartName ,
                        CartItems : item.CartItems.map(product=>{
                            return {
                                quantity : product.quantity ,
                                product : product.product ,
                                request : {
                                    ProductUrl : `http://localhost:3000/products/${product.product}`
                                }
                            }
                        }) ,
                        request : {
                            type : "GET" ,
                            CartUrl : `http://localhost:3000/cart/${item._id}`
                        }
                    }
                })
            })
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json({
                success : false ,
                error
            })
        })
    //res.status(200).json({
    //    message: "Cart was fetched"
    //    
    //})
})

router.post('/new', authenticate ,(req, res)=>{
    const _id = new mongoose.Types.ObjectId
    const cart = new Cart({
        _id : _id ,
        CartName : req.body.CartName
    })

    cart.save()
        .then(cart=>{
            //console.log(cart)
            res.status(201).json({
                success : true ,
                request : {
                    type : "POST" ,
                    url :   `http//:localhost:3000/something`
                } ,
                Cart : {
                    _id : cart._id ,
                    CartName : cart.CartName
                }
            }) 
        })
        .catch(error=>{
            //console.log(error)
            res.status(500).json({
                success :false ,
                error
            })
        })
})

router.post('/' , authenticate ,(req, res)=>{
    const _id = req.body._id 
    const item = {
        product : req.body.productId ,
        quantity : req.body.quantity
    }
    Product.findById(item.product)
        .then(product=>{
            if(!product) {
                res.status(404).json({
                    success : false ,
                    error : `Invalid ProductId, no such product found having ${item.product} product Id`
                })
            }
            return Cart.findOneAndUpdate({_id :_id},
                {"$push" : {"CartItems" : item } },
                { new : true}).exec()                   
                    //.catch(error=>{
                    //    console.log(`error : ${error}`)
                    //    res.json({
                    //        success : false ,
                    //        error
                    //    })
                    //})
        })
        .then(cart=>{
            console.log(cart) 
            res.status(200).json({
                success : true ,
                Cart : cart.CartItems.map(item=>{
                    return {
                        quantity : item.quantity ,
                        product : item.product ,
                        request : {
                            url : `http://localhost:3000/products/${item.product}`
                        }
                    }
                })
            })
        })
        .catch(error=>{
            res.status(500).json({
                status : false ,
                error
            })
        })
    
})

router.get('/:CartId', authenticate , (req, res)=>{
    const _id = req.params.CartId
    
    Cart.findById(_id)
        .select('_id CartName CartItems')
        .populate('CartItems.product' , '_id price name')
        .exec()
        .then(cart=>{
            
            if(cart) {
                res.status(200).json({
                    success :true ,
                    Cart : {
                        _id : cart._id ,
                        CartName : cart.CartName ,
                        CartItems : cart.CartItems.map(item=>{
                            return {
                                quantity : item.quantity ,
                                product : item.product ,
                                request : {
                                    url : `http://localhost:300/products/${item.quantity}`
                                }
                            }
                        }) ,
                        request : {
                            type : "GET" ,
                            url : `http://localhost:3000/cart/${cart._id}`
                        }
                    }
                })
            } else {
                res.status(404).json({
                    success : false ,
                    error : '404 Cart not found'
                })
            }
        })
        .catch(error =>{
            res.status(500).json({
                success : false ,
                error
            })
        })
    //if()
    //res.status(200).json({
    //    message : "Product fetched",
    //    id : req.params.productId
    //})
})

router.delete('/:ProductId' , authenticate , (req, res)=>{
    res.status(200).json({
        message : "Product deleted from cart",
        id : req.params.productId
    })
})

router.delete('/del/:CartId' , admin ,(req, res)=>{
    const _id = req.params.CartId

    Cart.remove({_id : _id})
        .exec()
        .then(result=>{
            res.status(200).json({
                success : true ,
                result
            })
        })
        .catch(error=>{
            res.status(500).json({
                success : false ,
                error
            })
        })
})


module.exports = router 