const multer = require('multer')


//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + '.jpg' 
      cb(null, file.fieldname + '-' + unique)
    }
  })


  module.exports=upload= multer({storage:storage})
  