/* eslint-disable */
var inject = {
	init: () => {
		inject.frequency_data = null;
		inject.connect();
	},
	connect: () => {
		// inject.port = chrome.runtime.connect({name: "contentScript"});
		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			if (msg.type === 'frequency_data') {
				inject.frequency_data = msg.frequency_data;
				inject.transfer(inject.frequency_data)
			}
		});
		window.addEventListener("message", (event) => {
			// We only accept messages from ourselves
			if (event.source != window)
				return;
			if (event.data.type === "fullscreenRequest")
				inject.fullscreenRequest(event.data.data);
			if (event.data.type === "close") {
				chrome.runtime.sendMessage({ type: 'close' });
			}
			/*if (event.data.type === "init")
				chrome.runtime.sendMessage({ type: "init" });
			if (event.data.type === "term")
				chrome.runtime.sendMessage({ type: "term" });*/
		});
		window.onbeforeunload = () => {
			chrome.runtime.sendMessage({
				type: 'leaving'
			});
			inject.frequency_data = null;
			chrome.runtime.onMessage.removeListener(() => {
				window.removeEventListener("message");
			});
		}
	},
	transfer: (frequency_data) => {
		var data = {
			type: "frequency_data",
			data: frequency_data
		};
		window.postMessage(data, "*");
	},
	fullscreenRequest: (request) => {
		chrome.runtime.sendMessage({ type: "fs", data: request });
		var data = {
			type: "fullScreenDone"
		};
		window.postMessage(data, "*");
	}
}
inject.init();