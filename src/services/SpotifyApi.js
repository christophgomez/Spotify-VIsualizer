/* eslint-disable */
import axios from 'axios';
var config;
if (process.env.NODE_ENV !== 'production') {
	config = require('../config/settings');
}
const baseURL = process.env.baseURL || config.baseURL;
const port = process.env.PORT || config.serverPort;
export default () => {
	return axios.create({
		baseURL: baseURL+port+'/spotify',
	});
};