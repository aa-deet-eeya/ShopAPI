const express = require('express') 
const router = express.Router() 
const mongoose = require('mongoose')

const Product = require('../DB/Schema')

router.get('/', (req, res, next)=>{
    Product.find().exec()
        .then( items=>{
            console.log(items)
            if(items.length > 0) {
                res.status(200).json(items)
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


router.post('/', (req, res, next)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId() ,
        name : req.body.name ,
        price : req.body.price
    })

    product.save().then(item=>{
        console.log(item)
        res.status(201).json({
            success : true ,
            createdProduct : item
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
        .exec()
        .then(item =>{
            console.log(`\nFrom DB: ${item}`)
            if (item) {
                res.status(200).json(item)    
            } else {
                res.status(404).json({
                    error : "404 Not found"
                })
            }
            
        })
        .catch(err=>{
            //console.log(err)
            res.status(500).json({
                error : err
            })
        })
    //res.status(200).json({
    //    message : "This shiz works" ,
    //    id : req.params.id
    //})
})

router.patch('/:id' , (req, res)=>{
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
                result
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

router.delete('/:id', (req,res)=>{
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