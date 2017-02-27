var News = require('../models/newsModel.js');

exports.create = function(req, res){
	var article = new News({

	});

	entry.save();

	//redirect to home page
	res.redirect('/');
};