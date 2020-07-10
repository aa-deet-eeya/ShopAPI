const express = require('express')
const router = express.Router() 

router.get('/', (req, res)=>{
    res.status(200).json({
        message: "Cart was fetched"

    })
})

router.post('/', (req ,res)=>{
    res.status(200).json({
        message : "Cart created"
    })
})

router.get('/:productId', (req, res)=>{
    res.status(200).json({
        message : "Product fetched",
        id : req.params.productId
    })
})

router.delete('/:productId' , (req, res)=>{
    res.status(200).json({
        message : "Product deleted from cart",
        id : req.params.productId
    })
})


module.exports = router 