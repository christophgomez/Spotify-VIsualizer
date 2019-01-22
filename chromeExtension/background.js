/* eslint-disable */
var background = {
	init: () => {
		background.port = null;
		chrome.browserAction.onClicked.addListener(background.navToWebsite);
		chrome.runtime.onConnect.addListener(background.onConnect);
	},
	navToWebsite() {
		chrome.tabs.update({
			url: "http://localhost:8080"
		});
		background.stream = null;
		chrome.tabs.getSelected(null, () => {
			chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
				if (chrome.runtime.lastError != undefined) {
					error = chrome.runtime.lastError.message
					chrome.runtime.lastError = undefined;
					console.log(error);
					return error;
				}
				background.stream = stream;
				background.createAudio(background.stream);
			});
		});
	},
	createAudio(stream) {
		background.audio = new AudioObject(stream);
		background.audio.jsNode.onaudioprocess = () => {
			// retreive the data from the first channel
			if (background.audio !== null) {
				background.audio.audioAnalyser.getByteFrequencyData(background.audio.bands);
				if (background.port !== null) {
					console.log('posting data');
					background.port.postMessage({
						type: "frequency_data",
						frequency_data: background.audio.bands
					});
				} else {
					console.log('background port null');
				}
			} else {
				console.log('background audio null');
			}
		};
	},
	terminateAudio() {
		background.audio = null;
	},
	onConnect(port) {
		background.port = port;
		background.port.onMessage.addListener((msg) => {
			if (msg.data === 'hello') {
				console.log('message received from content script');
				background.port.postMessage({ data: 'hello' });
			}
			if (msg.type === "fs") {
				chrome.windows.getCurrent((window) => {
					var id = window.id;
					chrome.windows.update(id, {
						state: msg.data
					});
				});
			}
			if (msg.type === "initAudio") {
				//background.createAudio(background.stream);
			}
			if (msg.type === "terminateAudio") {
				background.audio.audioContext = null;
			}
		});
		background.port.onDisconnect.addListener((port) => {
			background.port = null;
			background.audio = null;
		})
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
