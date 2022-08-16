var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');

var userSchema=new Schema({
    name:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true}
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(this.password && this.isModified('password')){
        var hash=await bcrypt.hash(this.password,10);
        this.password=hash;
        next();
    }
    else{
        next();
    }
});

userSchema.methods.verifyPassword=async function(password){
    try {
        var result=await bcrypt.compare(password,this.password);
        console.log(password,this.password,result);
        return  result;
    }catch (error) {
        return error;
    }
}

userSchema.methods.signToken=async function(){
    console.log(this);
    var payload={
        userId:this.id,
        email:this.email
    }
    try {
        var token=await jwt.sign(payload,'thisisasecret');
        return token;
    } catch (error) {
        return error;
    }
}

userSchema.methods.userJSON=function(token){
    return{
        name:this.name,
        email:this.email,
        token:token
    }
}

var User=mongoose.model('User',userSchema);
module.exports=User;