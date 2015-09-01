var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http')
var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();
var server_ = http.createServer(app);

var io = require('socket.io')(server);

app.set('socket',io)
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});
var uuid = require('node-uuid');
var registry = {};
io.on('connection',function(socket){
    console.log("Client connected")
    //Commands from web/mobile app
    socket.on('angela.client.command',function(data){
        //Quando mando un comando, gli assegno un uuid univoco
        //In questo modo quando mi arriva l'output vedo a quale comando corrisponde
        var cmd = {
            id : uuid.v4(),
            cmd : data.cmd
        }
        console.log("The app sent a new command",cmd)
        var fake_output = {
            id : cmd.id,
            output : '(Dummy response to command '+data.cmd+')'
        }
        registry[cmd.id] = cmd; 
        console.log("Emitting the following command to the device",cmd)
        socket.emit('angela.client.command',cmd) //This is echoed to devices
        socket.emit('angela.terminal.output',fake_output)//
    })
    socket.on('angela.terminal.output',function(data){
        console.log("A physical client returned this output ",data);
        socket.emit('angela.terminal.output',data) //Echoed to clients
    })
})

app.set('port', process.env.PORT || 9999);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

io.listen(server);
