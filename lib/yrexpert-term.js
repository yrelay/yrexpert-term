var yrexpertTerm = function(params) {

  var https = require('https');
  var http = require('http');
  var url = require('url');
  var fs = require('fs');
  var io = require('socket.io');
  var spawn = require('child_process').spawn
  var path = require("path"); 

  var dump = function(dataStr) {
    var result = '';
    console.log("================\r\n" + dataStr + "\r\n");
    for (var i=0; i<dataStr.length; i++) result = result + ":" + dataStr.charCodeAt(i);
    console.log("=================\r\n" + result + "\r\n=================\r\n");
  };

  var options = {
    key: fs.readFileSync(params.webServer.options.key),
    cert: fs.readFileSync(params.webServer.options.cert)
  };

  var wsCallback = function(req, res){
    var uri = url.parse(req.url).pathname;
    if (params.log) console.log("incoming url from " + req.connection.remoteAddress +": " + uri);

    var fileName = params.webServer.rootPath + uri;
    if (params.log) console.log("fetching " + fileName);
    fs.exists(fileName, function(exists) {  
      if(!exists) {
        if (params.log) console.log(fileName + " not found");
        res.writeHead(404, {"Content-Type": "text/plain"});  
        res.write("404 Not Found\n");  
        res.end();  
        return;  
      }  
      fs.readFile(fileName, "binary", function(err, file) {  
        if(err) {  
          res.writeHead(500, {"Content-Type": "text/plain"});  
          res.write(err + "\n");  
          res.end();  
          return;  
        }
        contentType = "text/plain";
        if (params.log) console.log("fileName = " + fileName);
        if (fileName.indexOf(".js") !== -1) contentType = "application/javascript";
        if (fileName.indexOf(".css") !== -1) contentType = "text/css";
        if (fileName.indexOf(".jpg") !== -1) contentType = "image/jpeg";
        if (fileName.indexOf(".html") !== -1) contentType = "text/html";
        res.writeHead(200, {"Content-Type": contentType});  
        res.write(file, "binary");  
        res.end();  
      });  
    });
  };

  var server;
  if (params.webServer.ssl) {
    server = https.createServer(options, wsCallback);
  }
  else {
    server = http.createServer(wsCallback);
  }

  server.listen(params.webServer.port);
  var io = io.listen(server);
  var logLevel = params.socketioLogLevel || 0;
  io.set('log level', logLevel);
  io.sockets.on('connection', function(client){
    if (params.log) console.log("connection event");
    client.connected = true;
    var addLF = params.addLF;
    var outputBuffer = [];
    var m;
    if (client.handshake && params.log) console.log("incoming socket connection from " + JSON.stringify(client.handshake.address));
    var m = spawn(params.spawnYRexpert.command, params.spawnYRexpert.arguments);
    m.isRunning = true;
    m.stdin.setEncoding = 'utf-8';
    m.echo = params.echo;
    m.error = false;

    m.stderr.on('data', function(data) {
      // Modification by Christopher Edwards for Centos / RHEL: 26 June 2014
      //m.error = true;
      var escData = data.toString();
      if (escData.indexOf('tcgetattr') !== -1 ) {
        m.error = false;
        escData = '';
      }
      else {
        m.error = true;
      }
      // end of modification
      if (params.log) console.log('Error: ' + data);
      client.emit('data', escData)
    });

    m.stdout.on('data', function (data) {
      var escData = data.toString();
      if (params.log) console.log('from M: ' + escData);
      if (params.exitString && escData.indexOf(params.exitString) !== -1) {
        setTimeout(function() {
          client.emit('data', escData);
        },1);
        client.connected = false;
        m.kill();
        return;
      }
      if (!m.error) {
        setTimeout(function() {
          client.emit('data', escData);
        },1);
      }
      if (escData.indexOf("[5i") !== -1) {
        addLF = false;
      }
    });

    m.on("exit",function(code,signal) {
      if (params.log) console.log("Back-end process has exited");
    });

    client.on('data', function(message){
      if (params.log) console.log('from browser: ' + JSON.stringify(message));
      if (!client.connected) return;

      if (typeof message === 'object') {
        if ("code" in message) {
          if (params.log) console.log("code = " + message.code);
          message = String.fromCharCode(message.code)
        }
      }
      if (params.log) dump(message);
      if (m.isRunning) {
        if (message === '\r') {
          if (params.log) console.log('CR received - addLF = ' + addLF);
          if (addLF) {
            message = '\r\n';
            if (params.log) console.log('CRLF sent to M');
          }
          else {
            if (params.log) console.log('CR sent to M');
          }
        }
        m.stdin.write(message);
      }
      else {
        client.send("Back-end routine has terminated");
        client.json.send({exit: 1});
      }
    });

    client.on('disconnect', function(){
      if (params.log) console.log("Client disconnected - sending kill to child process");
      if (m.isRunning) {
        m.kill();
        m.isRunning = false;
      }
      client.connected = false;
    });
  });
};

module.exports = {

  start: function(params) {
    yrexpertTerm(params);
  }
};


