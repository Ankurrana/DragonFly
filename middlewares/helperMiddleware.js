module.exports = function(req,res,next){
	// if(req.session.passport.user != undefined)
	// 	console.log(req.session.passport.user);
	next();
}