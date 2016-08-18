var fs = require('fs');
var http = require('http');
var path = require('path');
var files;

var contentTypes = {
    '.css': 'text/css',
    '.json': 'application/json',
    '.html': 'text/html',
    '.js': 'application/javascript' ,
    '.jpg': 'image/jpeg'
};

try {
    files = fs.readdirSync('./projects');

} catch(e) {
    console.log('error');
    return;
}

console.log(files);


var server = http.createServer();

server.on('request', function(request, response) {
    request.on('error', function(err) {
        console.log(err);
    });
    response.on('error', function(err) {
        console.log(err);
    });

    var body = '';
    var method = request.method;
    var url = request.url;
    var headers = request.headers;
    console.log(method);
    console.log(url);

    var urlArray = url.split('/');
    console.log(urlArray);

    if (method != 'GET') {
        response.statusCode = 403;
        response.end();
    }

    if (method === 'GET') {
        console.log(files);
        var newPath = './projects' + path.dirname(url) + '/' + urlArray[2];
        console.log(newPath);

        fs.stat(newPath, function(err, stats){
            if(err) {
                console.log('not found2');
                response.statusCode = 404;
                response.end();
                return;
            }

            if(stats.isFile()) {
                console.log('it is a file!');
                var ending = path.extname(newPath);
                var type;
                console.log(ending);

                type = contentTypes[ending];
                console.log(type);
                response.setHeader('Content-Type', type);
                response.statusCode = 200;
                var stream = fs.createReadStream(newPath);
                stream.pipe(response);
                stream.on('error', function(err) {
                    console.log(err);
                    response.statusCode = 500;
                    response.end();
                });
            }
        });
    }
});
server.listen(8080, function() {
    console.log('Server is listening');
});
