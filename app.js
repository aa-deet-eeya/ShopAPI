const express = require('express') 
const app = express() 
const morgan = require('morgan')

const productRoutes = require('./api/routes/products') 
const cartRoutes = require('./api/routes/cart')

app.use(morgan('dev'))

app.use('/products' , productRoutes)
app.use('/cart' , cartRoutes)

app.use((req,res, next)=>{
    const error = new Error('Not found') 
    error.status = 404

    next(error)
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500) 
    res.json({
        error : {
            message : err.message
        }
    })
})

module.exports = app 