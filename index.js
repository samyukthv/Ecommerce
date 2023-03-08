const express=require('express')
 const dotenv=require('dotenv').config()
var userRouter = require("./routes/user");
 var logger = require("morgan");
var adminRouter = require("./routes/admin");
const connectdb = require("./config/connection");
const path= require('path')
const handlebars = require("handlebars");
const hbs= require('express-handlebars')
const session=require('express-session')
const nocache=require('nocache')
const bodyParser=require('body-parser')
const app=express()
const ImageZoom=require('js-image-zoom')
const createError = require('http-errors')
const fs = require('fs')

const jquery=require('jquery')
global. jQuery= jquery
const $=jquery

const PORT=process.env.PORT||4000;


const Swal = require('sweetalert2')
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));



//partials and layout connection

app.engine(
    "hbs",
    hbs.engine({
      extname: "hbs",
      defaultLayout: "layout",
      layoutsDir: __dirname + "/views/layouts/",
      partialsDir: __dirname + "/views/partials/",
    })
  );
  

//db connection
connectdb.connection();

app.use(nocache())
  app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}))


app.use("/", userRouter);
app.use("/admin", adminRouter);






handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});


//s.no in the admin table
handlebars.registerHelper("inc", function (value, option) {
  return parseInt(value) + 1;
});



handlebars.registerHelper('multiply', function(x, y) {
  return x * y;
});

handlebars.registerHelper('sum', function(x, y) {
  return x + y;
});


handlebars.registerHelper('formatDate', function(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});



app.listen(PORT,()=>{
    console.log(`server is runnig at PORT ${PORT}`);
});

app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  // console.log(err);
  res.render('user/404');
});



module.exports=app
