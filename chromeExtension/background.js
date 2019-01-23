/* eslint-disable */
var background = {
	init: () => {
		chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
			if (message == 'version') {
				const manifest = chrome.runtime.getManifest();
				sendResponse({ type: 'success', version: manifest.version });
			}
		});
		background.port = null;
		background.audio = null;
		background.leaving = false;
		chrome.browserAction.onClicked.addListener(background.navToWebsite);
		// chrome.runtime.onConnect.addListener(background.onConnect);
		chrome.runtime.onMessage.addListener((msg, sender, response) => {
			if (msg.type === "fs") {
				chrome.windows.getCurrent((window) => {
					var id = window.id;
					chrome.windows.update(id, {
						state: msg.data
					});
				});
			}
			if (msg.type === "close") {
				chrome.tabs.getSelected(function (tab) {
					chrome.tabs.remove(tab.id, function () { });
				});
			}
			if (msg.type === "leaving") {
				console.log('recieved leaving');
				background.leaving = true;
			}
			/*if (msg.type === "term") {
				background.stream = null;
				background.audio.audioContext = null;
				background.audio = null;
			}
			if (msg.type === "init") {
				background.navToWebsite();
			}*/
		});
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			// do something here
			let matches = ["://localhost:8080", "://localhost:8080/visualizer"]
			for (let i in matches) {
				if (!tab.url.includes(matches[i]) && background.leaving === true) {
					if (background.stream !== null) {
						if (background.audio !== null) {
							console.log('nulling audio');
							background.audio.jsNode.onaudioprocess = null;
							background.audio.jsNode = null;
							background.audio.bands = null;
							background.audio.audioAnalyser = null;
							background.audio.audioStream = null;
							background.audio.audioContext = null;
							background.audio = null;
						}
						background.stream.getAudioTracks()[0].stop();
						background.stream = null;
					}
				}
			}
		});
	},
	navToWebsite() {
		background.leaving = false;
		chrome.tabs.getSelected((tab) => {
			background.tabId = tab.id
			chrome.tabs.update(background.tabId, {
				url: "http://localhost:8080"
			});
			chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
				if (background.audio !== null) {
					console.log('nulling audio');
					background.audio.jsNode.onaudioprocess = null;
					background.audio.jsNode = null;
					background.audio.audioAnalyser = null;
					background.audio.audioStream = null;
					background.audio.audioContext = null;
					background.audio = null;
				}
				if (chrome.runtime.lastError != undefined) {
					error = chrome.runtime.lastError.message
					chrome.runtime.lastError = undefined;
					console.log(error);
					return error;
				}
				if (background.stream !== null) {
					background.stream = null;
				}
				background.stream = stream;
				background.createAudio(stream);
			});
		});
	},
	createAudio(stream) {
		background.audio = new AudioObject(stream);
		background.audio.jsNode.onaudioprocess = () => {
			// retreive the data from the first channel
			background.audio.audioAnalyser.getByteFrequencyData(background.audio.bands);
			chrome.tabs.query( { active: true, currentWindow: true }, (tabs) => {
				if (background.audio !== null) {
					if (background.audio.bands !== null) {
						chrome.tabs.sendMessage(background.tabId, {
							type: "frequency_data",
							frequency_data: background.audio.bands
						});
					}
				}
			});
		};
	},
	onConnect(port) {
		background.port = port;
		port.onMessage.addListener((msg) => {
			if (msg.type === "fs") {
				chrome.windows.getCurrent((window) => {
					var id = window.id;
					chrome.windows.update(id, {
						state: msg.data
					});
				});
			}
		});
		/*background.port.onDisconnect.addListener((port) => {
			background.port = null;
		})*/
	},
}
background.init();
class AudioObject {
	constructor(stream) {
		this.capture = stream;
		this.audioContext = new AudioContext();
		this.jsNode = this.audioContext.createScriptProcessor(2048, 1, 1);
		this.audioAnalyser = this.audioContext.createAnalyser();
		this.audioAnalyser.fftSize = 512;
		this.audioAnalyser.smoothingTimeConstant = 0.5;
		this.bands = new Uint8Array(this.audioAnalyser.frequencyBinCount);
		this.audioStream = this.audioContext.createMediaStreamSource(this.capture);
		this.audioStream.connect(this.audioAnalyser);
		this.audioStream.connect(this.jsNode);
		this.jsNode.connect(this.audioContext.destination);
		this.audioStream.connect(this.audioContext.destination);
	}
}
