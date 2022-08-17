var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

var userSchmea=new Schema({
    name:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
});

userSchmea.pre('save',async function(next){
    if(this.password || this.isModified('password')){
        try {
            var hash=await bcrypt.hash(this.password,10);
            this.password=hash;
            next();
        } catch (error) {
            next(error);
        }
    }
    else{
        next();
    }
});

userSchmea.methods.verifyPassword=async function(password){
    try {
        var result=await bcrypt.compare(password,this.password);
        return result;
    } catch (error) {
        next(err);
    }
}

userSchmea.methods.userJSON=function(token){
    return{
        name:this.name,
        email:this.email,
        token:token
    }
}

userSchmea.methods.signToken=async function(){
    var payload={
        email:this.email,
        userId:this.id
    }

    try {
        var token=await jwt.sign(payload,'thisisasecret');
        return token;
    } catch (error) {
        return error;
    }
}




var User=mongoose.model('User',userSchmea);
module.exports=User;