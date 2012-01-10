var url = require('url'),
    express = require('express'),
    short = require('short'),
    app = express.createServer(),
    port = process.env.PORT || 8080,
    domain = "http://192.168.1.111";

short.connect("mongodb://localhost/short");

app.get('/api/*', function (req, res) {
  if (req.url === '/favicon.ico') {
    return;
  }
  var removeApi = req.url.slice(5),
      URL = removeApi,
      options = {length: 7};
  short.generate(URL, options, function (error, shortURL) {
    if (error) {
      console.error(error);
    }
    else {
      var tinyUrl = [domain, ":", port, "/", shortURL.hash].join("");
      console.log(["URL is ", shortURL.URL, " ", tinyUrl].join(""));
      res.end(tinyUrl);
    }
  });
});

app.get('*', function (req, res) {
  if (req.url === '/favicon.ico') {
    return;
  }
  var visitor = req.connection.remoteAddress,
      hash = req.url.slice(1),
      options = {visitor: visitor};
  short.retrieve(hash, options, function (error, shortURLObject) {
    if (error) {console.error(error);
    } else {
      if (shortURLObject) {
        res.redirect(shortURLObject.URL, 302);
      }
      else {
        res.send('URL not found!', 404);
        res.end();
      }
    }
  });
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});

/* EOF */