const express = require('express') 
const router = express.Router() 
const mongoose = require('mongoose')
const authenticate = require('../auth/authenticate')
const admin = require('../auth/admin')

const {Product} = require('../DB/Schema')

router.get('/', (req, res, next)=>{
    Product.find().select('name price _id').exec()
        .then( items=>{
            console.log(items)
            if(items.length > 0) {
                res.status(200).json({
                    count : items.length ,
                    products : items.map(item=>{
                        return {
                            _id : item._id ,
                            name : item.name ,
                            price : item.price ,
                            request : {
                                type : "GET" ,
                                url : `http://localhost:3000/products/${item._id}`
                            }
                        }
                        
                    }),
                    
                })
            } else {
                res.status(404).json({
                    error : "DB empty"
                })
            }
        
        })
        .catch(err=>{
            console.log("DB Error in fetching all items")
            res.status(500).json(err)
        })

}) 


router.post('/', admin , (req, res, next)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId() ,
        name : req.body.name ,
        price : req.body.price
    })

    product.save().then(item=>{
        console.log(item)
        res.status(201).json({
            success : true ,
            createdProduct : {
                name : item.name ,
                price : item.price ,
                _id : item._id 
            } ,
            request : {
                type : "POST" ,
                url : `http:localhost:3000/products/${item._id}`
            }
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            success : false ,
            error : err
        })
    })

    // /res.status(201).json({
        // msg : "POST req" ,
        // createdProduct: product
    // /})

}) 

router.get('/:id', (req, res, next)=>{
    const id = req.params.id
    Product.findById(id)
        .select('name _id price')
        .exec()
        .then(item =>{
            //console.log(`\nFrom DB: ${item}`)
            if (item) {
                res.status(200).json({
                    success : true ,
                    item ,
                    request : {
                        type : "GET" ,
                        url : `http:localhost:3000/products/${item._id}`
                    }
                })    
            } else {
                res.status(404).json({
                    success : false ,
                    error : "404 Not found"
                })
            }
            
        })
        .catch(err=>{
            //console.log(err)
            res.status(500).json({
                success : false ,
                error : err
            })
        })
    //res.status(200).json({
    //    message : "This shiz works" ,
    //    id : req.params.id
    //})
})

router.patch('/:id', admin , (req, res)=>{
    const id = req.params.id 
    const operation = {}
    if (req.body.name) {
        operation.name = req.body.name
    }

    if (req.body.price) {
        operation.price = req.body.price
    }

    //res.json({operation})
    Product.update({ _id : id}, { $set: operation }).exec()
        .then(result=>{
            console.log(result)
            res.status(200).json({
                success : true ,
                result ,
                request : {
                    type : "PATCH" ,
                    url : `http://localhost:3000/products/${id}`
                }
            })
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json({
                success: false ,
                error
            })
        })
})

router.delete('/:id', admin ,(req,res)=>{
    const id = req.params.id 

    Product.remove({_id : id}).exec()
        .then(result=>{
            res.status(200).json({
                success : true ,
                result
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
    //    message : "Deleted" ,
    //    id : req.params.id 
    //})
})

module.exports = router 