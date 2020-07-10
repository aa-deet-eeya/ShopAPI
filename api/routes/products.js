const express = require('express') 
const router = express.Router() 
const mongoose = require('mongoose')

const Product = require('../DB/Schema')

router.get('/', (req, res, next)=>{
    res.status(200).json({
        msg : "GET req"
    })

}) 


router.post('/', (req, res, next)=>{
    //const product = {
    //    name : req.body.name ,
    //    price : req.body.price
    //}

    const product = new Product({
        _id : new mongoose.Types.ObjectId() ,
        name : req.body.name ,
        price : req.body.price
    })

    product.save().then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })

    res.status(201).json({
        msg : "POST req" ,
        createdProduct: product
    })

}) 

router.get('/:id', (req, res, next)=>{
    res.status(200).json({
        message : "This shiz works" ,
        id : req.params.id
    })
})

router.patch('/:id' , (req, res)=>{
    res.status(200).json({
        message : "Updated product"
    })
})

router.delete('/:id', (req,res)=>{
    res.status(200).json({
        message : "Deleted" ,
        id : req.params.id 
    })
})

module.exports = router 