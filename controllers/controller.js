/*var News = require('../models/newsModel.js');*/


exports.scrape = function(req, res){
    //make a request to the NYT site to grab articles
    request('https://www.nytimes.com/section/world/americas', function(err, response, html){
        //Load the html body from request into cheerio
        const $ = cheerio.load(html);

        //For each element with a "story" class
        $('.story-body').each(function(i, element){
            // Save the text of the title
            const headline = $(this).find("h2").text();
            // Save the link for the story
            const link = $(this).children("a").attr("href");
            // Save the text summary for the story
            const summary = $(this).find("p").text();

            console.log(headline);
            console.log(link);
            console.log(summary);
		})
	})
};