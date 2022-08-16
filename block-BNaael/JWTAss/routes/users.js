const { json } = require('express');
var express = require('express');
var router = express.Router();
var User=require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',async (req,res,next)=>{
  console.log(req.body);
  try {
    var user=await User.create(req.body);
    console.log(user);
    var token=await user.signToken();
    res.status(201).json({user:user.userJSON(token)});
  } catch (error) {
    console.log('Error:'+error);
    next(error);
  }  
});

router.post('/login',async (req,res,next)=>{
  var email=req.body.email;
  var password=req.body.password;
  if(!email || !password){
  res.status(400).json({err:'Email/Password required'});
  }
  try {
    var user=await User.findOne({email:email});
    if(!user){
    res.status(400).json({err:'User not registered'});
  }
  var result=await user.verifyPassword(password);
  console.log('Password match:'+result);
  if(!result){
    res.status(400).json({err:'Incorrect Password'});
  }
  else{
    var token=await user.signToken();
    console.log('Token:'+token);
    res.json({user:user.userJSON(token)});
  }
  } catch (error) {
    next(error);
  }

});


module.exports = router;
