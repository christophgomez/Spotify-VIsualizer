/* eslint-disable */
import axios from 'axios';
var config;
if (process.env.NODE_ENV !== 'production') {
	config = require('../config/settings');
}
const baseURL = config.baseURL || "spotilize.herokuapp.com";
const port = config.serverPort || "";
export default () => {
	return axios.create({
		baseURL: baseURL+port+'/spotify',
	});
};