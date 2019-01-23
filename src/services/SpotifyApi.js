/* eslint-disable */
import axios from 'axios';
const config = require('../../config/settings');
const baseURL = process.env.baseURL || config.baseURL;
const port = process.env.PORT || config.serverPort;
export default () => {
	return axios.create({
		baseURL: baseURL+port+'/spotify',
	});
};