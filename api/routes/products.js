const express = require('express') 
const router = express.Router() 

router.get('/', (req, res, next)=>{
    res.status(200).json({
        msg : "GET req"
    })

}) 


router.post('/', (req, res, next)=>{
    res.status(200).json({
        msg : "POST req"
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