const express = require('express') 
const app = express() 
const morgan = require('morgan')
const cors = require('cors') 
const mongoose = require('mongoose')
require('dotenv').config()

const productRoutes = require('./api/routes/products') 
const cartRoutes = require('./api/routes/cart')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true ,
    useUnifiedTopology: true
})

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())


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