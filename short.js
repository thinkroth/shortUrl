   var url = require('url'),
  mongoose = require('mongoose'),
   express = require('express'),
     short = require('./short/lib/short'),
       app = express.createServer(),
      port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/short");


// TODO: Add basic auth here

app.get('/api/*', function (req, res) {
	if (req.url === '/favicon.ico') {
		return;
	}
	var removeApi = req.url.slice(5),
	    URL = removeApi;
	short.gen(URL, function (error, shortURL) {
		if (error) {console.error(error);
		} else {
			var URL = shortURL.URL,
			    hash = shortURL.hash,
				tiny_url = "http://127.0.0.1:" + port + "/" + hash;
			console.log("URL is " + URL + " " + tiny_url);
			res.end(tiny_url);
        }
	});
});

app.get('*', function (req, res) {
	if (req.url === '/favicon.ico') {
		return;
	}
	var hash = req.url.slice(1);
	
	short.get(hash, function (error, shortURLObject) {
		if (error) {console.error(error);
		} else {
			if (shortURLObject) {
				var URL = shortURLObject[0].URL;
				res.writeHead(302, {
					"Location" : URL
				});
				res.end();
			} else {
				res.writeHead(200, { "Content-Type" : "text/html" });
				res.write("URL not found!");
				res.end();
			}
		}
	});
});

app.listen(port, function () {
	console.log('Server running on port ' + port);
});