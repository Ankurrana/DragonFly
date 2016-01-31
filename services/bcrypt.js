var bcrypt = require('bcrypt-nodejs');


exports.cryptPasswordSync = function(password){
  return bcrypt.hashSync(password);
}

exports.comparePasswordSync = function(password,PasswordHash){
  return bcrypt.compareSync(password,PasswordHash);
}

exports.cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);
    bcrypt.hash(password, salt,null,function(err, hash) {
      return callback(err, hash);
    });
  });
};

exports.comparePassword = function(password, userPassword, callback) {
   bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
      if (err) 
        return callback(err);
      return callback(null, isPasswordMatch);
   });
};


// console.log(exports.cryptPasswordSync('asdf'));

// exports.cryptPassword('asdf',function(err,hash){
//   if(err)
//       console.log('Error');
//   else
//       console.log(hash);
// })

// exports.comparePassword('asdf','$2a$10$1Rce2YpIaTFNcknZzIcvtuZeVCUK0kldGRTzFjxI7YDkg8eji2cDy',function(err,fd){
//   if(err) console.log(err);
//   console.log(fd);
// })