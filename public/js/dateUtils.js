app.service('dateUtil',function(){
	this.format = function(date){
		//Recives a date object and returns a date in the specified format // format not yet supported!
		var d = new Date(date);
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return year + '-' + monthIndex+1 + '-' + day
	}
})