var url = require('url'),
    express = require('express'),
    short = require('short'),
    app = express(),
    port = process.env.PORT || 8080,
    domain = process.env.DOMAIN || ("http://localhost:" + port);
    mongo = process.env.MONGODB || "mongodb://localhost/short";

short.connect(mongo);

app.get('/api/*', function (req, res) {
  if (req.url === '/favicon.ico') {
    return;
  }
  var removeApi = req.url.slice(5),
      URL = removeApi,
      options = {length: 7};
  short.generate({URL: URL}, options).then(function (shortURL) {
    var tinyUrl = [domain, "/", shortURL.hash].join("");
    console.log(["URL is ", shortURL.URL, " ", tinyUrl].join(""));
    res.send(tinyUrl);
  }, function (error) {
    console.error(error.message);
    res.send(500, 'Internal server error');
  });
});

app.get('*', function (req, res) {
  if (req.url === '/favicon.ico') {
    return;
  }
  var visitor = req.connection.remoteAddress,
      hash = req.url.slice(1),
      options = {visitor: visitor};
  short.retrieve(hash, options).then(function (shortURLObject) {
    if (shortURLObject) {
      res.redirect(302, shortURLObject.URL);
    } else {
      res.send(404, 'URL not found!');
    }
  }, function (error) {
    console.error(error.message);
    if (error instanceof Error && error.message.indexOf('Cannot find Document') !== -1) {
      res.send(404, 'URL not found');
    } else {
      res.send(500, 'Internal server error');
    }
  });
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});

/* EOF */