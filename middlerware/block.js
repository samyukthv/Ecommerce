const User=require('../models/user_schema')


const ifBlocked=async(req,res,next)=>{
    try {
        
        if(req.session.userid){
          
            console.log(req.session.userid);
            const userdata=req.session.userid
            const userSt= await User.findOne({email:userdata})
            if(userSt.status){

               
            }
            
            else{
              
                res.render('user/login',{blocked:" OOPSS!! Your account got blocked"})
            }
        }else{
           

        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    ifBlocked
}