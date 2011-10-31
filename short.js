   var url = require('url'),
  mongoose = require('mongoose'),
   express = require('express'),
     short = require('short'),
       app = express.createServer(),
      port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/short");

// TODO: Add basic auth here


app.get('/api/*', function(req, res){
  if (req.url === '/favicon.ico') {
	  return;
	}
  var removeApi = req.url.slice(5);
  var URL = removeApi;
  short.gen(URL, function(error, shortURL) {
       if (error) {
           console.error(error);
       } else {
           short.get(shortURL.hash, function(error, shortURLObject) {
               if (error) {
                   console.error(error);
               } else {
                    var URL = shortURLObject[0].URL
                    var hash = shortURLObject[0].hash;
					var tiny_url = "http://127.0.0.1:" + port + "/" + hash;
                    console.log(URL + " " + tiny_url);	
		  					res.end("http://127.0.0.1:" + port + "/" + hash);
               };
           });
       }
  });  
});

app.get('*', function(req, res) {
	if (req.url === '/favicon.ico') {
			return;
		}
	var hash = req.url.slice(1),	
		ipAddress = req.connection.remoteAddress;
		console.log(ipAddress + " viewed " + hash);
		
		short.get(hash, function(error, shortURLObject) {
			if (error) {
				console.error(error);
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
			};
		});
});

app.listen(port, function() {
	console.log('Server running on port ' + port);
});