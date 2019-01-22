/* eslint-disable */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
var request = require('request');
var config = require('./config/settings');
//var history = require('connect-history-api-fallback');

const my_client_id = config.spotifyClientId;
const my_client_secret = config.spotifyClientSecret;

// Set up the app
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const spotifyRoutes = require('./expressRoutes/spotifyRoutes.js')(app, io);
app.use('/spotify', spotifyRoutes);

/*// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist');

// 1st call for unredirected requests 
app.use(staticFileMiddleware);

// Support history api 
app.use(history({
	index: '/dist/index.html'
}));

// 2nd call for redirected requests
app.use(staticFileMiddleware);*/

// Listen for connections to the port
server.listen(config.serverPort, () => console.log('Server listening on port ' + config.baseURL+config.serverPort));
