const jwt = require('jsonwebtoken')

module.exports = (req, res, next)=>{
    try {
        req.userData = jwt.verify(req.body.token ,process.env.JWT_ADMIN)
          
        next() ;
    } catch(error) {
        return res.status(401).json({
            success : false ,
            message : "Unauthorized Access"
        })
    }
}