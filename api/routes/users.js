const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../DB/userSchema')
const { route } = require('./products')

router.get('/', (req, res, next) => {
    userModel.find()
        .select('_id email')
        .exec()
        .then(result => {
            //console.log(result) 
            res.status(200).json({
                success: true,
                result: result.map(user => {
                    return {
                        _id: user._id,
                        email: user.email,
                        request: {
                            url: `http://localhost:3000/users/${user._id}`
                        }
                    }
                })
            })
        })
        .catch(error => {
            //console.log(error)
            res.status(500).json({
                success: false,
                message: "Server Error",
                error
            })
        })
})

router.post('/signup', (req, res, next) => {
    userModel.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(422).json({
                    success: false,
                    message: "email already exists"
                })

            } else {

                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            error
                        })
                    } else {
                        const user = new userModel({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })

                        user.save()
                            .then(result => {
                                //console.log(result) 
                                res.status(201).json({
                                    success: true,
                                    message: "User Created",
                                    result: {
                                        _id: result._id
                                    }

                                })
                            })
                            .catch(error => {
                                //console.log(error)
                                res.status(500).json({
                                    success: false,
                                    message: "Server Error",
                                    error
                                })
                            })
                    }
                })

            }
        })
        .catch(error => {
            //console.log(error)
            res.status(500).json({
                success: false,
                message: "Server Error",
                error
            })
        })

})

router.post('/login', (req, res, next) => {
    userModel.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user)
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Authorization failed"
                })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    //console.log(err)
                    if (err) {
                        res.status(401).json({
                            success: false,
                            message: "Authorization failed"
                        })
                    } else if (result) {
                        const token = jwt.sign(
                        {
                            email : user.email ,
                            userId : user._id
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn : "2h"
                        })
                        res.status(200).json({
                            success: true,
                            message: "Authorization successful" ,
                            token
                        })
                    } else {
                        res.status(401).json({
                            success: false,
                            message: "Authorization failed"
                        })
                    }
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Server Error",
                error
            })
        })
})

router.get('/:userId', (req, res, next) => {
    userModel.findById(req.params.userId)
        .select('_id email')
        .exec()
        .then(user => {
            console.log(user)
            if (user) {
                res.status(200).json({
                    success: true,
                    message: "User found",
                    User: user,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/users/${user._id}`
                    }
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "Error 404 : user not found"
                })
            }
        })
        .catch(error => {
            //console.log(error)
            res.status(500).json({
                success: false,
                message: "Server Error",
                error
            })
        })
})


router.delete('/:userId', (req, res, next) => {
    userModel.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            //console.log(result)
            res.status(200).json({
                success: true,
                message: "User successfully deleted"
            })
        })
        .catch(error => {
            //console.log(error)
            res.status(500).json({
                success: false,
                message: "Server Error",
                error
            })
        })
})

module.exports = router;