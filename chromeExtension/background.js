/* eslint-disable */
var background = {
	init: () => {
		background.port = null;
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
			if (msg.type === "close")
				chrome.tabs.getSelected(function (tab) {
					chrome.tabs.remove(tab.id, function () {});
				});
			/*if (msg.type === "term") {
				background.stream = null;
				background.audio.audioContext = null;
				background.audio = null;
			}
			if (msg.type === "init") {
				background.navToWebsite();
			}*/
		});
	},
	navToWebsite() {
		chrome.tabs.update({
			url: "http://localhost:8080"
		});
		background.stream = null;
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
	},
	createAudio(stream) {
		background.audio = new AudioObject(stream);
		background.audio.jsNode.onaudioprocess = () => {
			// retreive the data from the first channel
			background.audio.audioAnalyser.getByteFrequencyData(background.audio.bands);
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					type: "frequency_data",
					frequency_data: background.audio.bands
				});
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
