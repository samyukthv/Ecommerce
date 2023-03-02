const isLogin = async (req, res, next) => {
  try {
    if (req.session.userid) {
     userdata=req.session.userid
    } else {
      userdata= false
        res.redirect('/')
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.userid) {
       
      res.redirect("/");
    }else{
        
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};



module.exports = {
  isLogin,
  isLogout,
};
