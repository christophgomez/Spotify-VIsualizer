/* eslint-disable */
var inject = {
	init: () => {
		inject.connect();
		window.addEventListener("message", (event) => {
			// We only accept messages from ourselves
			if (event.source != window)
				return;
			/*if (event.data.type === "initbg") {
				inject.connect();
			}
			if (event.data.type === "terminatebg") {
				inject.disconnect();
			}*/
			if (event.data.type === "fullscreenRequest")
				inject.fullscreenRequest(event.data.data);
		});
	},
	disconnect: () => {
		inject.port.disconnect();
	},
	connect: () => {
		inject.port = chrome.runtime.connect({ name: "contentScript" });
		console.log('connected to chrome runtime');
		inject.port.onDisconnect.addListener(() => {
			console.log('Disconnected from chrome runtime');
		})
		inject.port.onMessage.addListener((msg) => {
			if(msg.type === 'frequency_data') {
				inject.transfer(msg.frequency_data)
			}
		});
	},
	transfer: (frequency_data) => {
		var data = {
			type: "frequency_data",
			data: frequency_data
		};
		window.postMessage(data, "*");
	},
	fullscreenRequest: (request) => {
		inject.port.postMessage({ type: "fs", data: request });
		var data = {
			type: "fullScreenDone"
		};
		window.postMessage(data, "*");
	}
}
inject.init();