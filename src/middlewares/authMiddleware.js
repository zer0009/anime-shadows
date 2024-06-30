const jwt = require('jsonwebtoken')
const User = require('../models/user')


// module.exports = async (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     try {
//       const decoded = jwt.verify(token, config.jwtSecret);
//       const user = await User.findById(decoded.userId);
//       if (!user) {
//         throw new Error();
//       }
//       req.user = user;
//       next();
//     } catch (err) {
//       res.status(401).json({ error: 'Please authenticate.' });
//     }
//   };


module.exports = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token ,process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    }catch(e){
        res.status(401).send({error: 'Please authenticate.'})
    }

}
