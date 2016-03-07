module.exports = function(req,res,next){
	if(!req.isAuthenticated()){
		if(req.session.redirect_to != null)
			req.session.redirect_to =  req.session.redirect_to + req.path;
		else
			req.session.redirect_to = req.path;
		console.log(req.session.redirect_to);
		res.redirect('/login');
	}
	else
		next();
}
