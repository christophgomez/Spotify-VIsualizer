<template>
	<div id='visualizer' ref='vis'>
		<div id='Visuals'>
			<div v-if='visualSelected.capsules === true'>
				<Capsule ref='Capsule'></Capsule>
			</div>
		</div>

		<b-modal ref="myModalRef" ok-only style='color:black;text-align:center' title='Whoops...'>
			<p>Click the Spotilize extension button in the Chrome toolbar to start the visualizer the press the esc key!</p>
		</b-modal>

	</div>
</template>

<script>
import SpotifyService from '@/services/SpotifyService';
import Capsule from '@/components/Capsule';
import {EventBus} from '../eventbus';

export default {
	components: {
		Capsule
	},
	data() {
		return {
			trackId: '',
			trackName: '',
			trackDuration: 0,
			transferred: false,
			isPaused: false,
			visualSelected: {
				capsules: true,
				three: false
			},
			settings: {
				capsuleSettings: {
					capsuleColors: [],
					backgroundColors: [],
				},
			},
		}
	},
	sockets: {
		playerReady: function(data) {
			if(this.transferred === false) {
				this.transfer();
			}
		},
		stateChanged: function(data) {
			if(data.state.paused !== true && this.trackId !== data.state.track_window.current_track.id) {
				this.trackId = data.state.track_window.current_track.id;
				this.trackName = data.state.track_window.current_track.name;
				if(this.transferred === false) {
					this.transfer();
				}
			}
			if(data.state.paused === true) {
				this.isPaused = true;
			} else {
				this.isPaused = false;
			}
		},
	},
	created() {

		chrome.runtime.sendMessage('jidcihllhnmbjbnoijfepopdpkpgeobe', 'listening', (response) => {
        if(!response) {
          this.$router.replace({name: 'home'});
        } else if(response.listening === false) {
			  this.$refs.myModalRef.show();
        }
		});
		
		this.bands = null;

		window.addEventListener("message", (event) => {

			if (event.source != window)
				return;

			if(event.data.type = "frequency_data")
				this.$refs.Capsule.bands = event.data.data;
				
			if(event.data.type = "fullScreenDone")
				this.$refs.Capsule.sizeCanvas();
		});

		EventBus.$on('changeVisual', (data) => {
			this.cancelAllVisuals();
			switch(data.visual) {
				case 'capsules':
					this.visualSelected.capsules = true;
					break;
			}
		});
	},
	methods: {
		cancelAllVisuals(){
			this.visualSelected.capsules = false;
		},
		setCapsuleSettings(capsuleColors, backgroundColors) {
			this.settings.capsuleSettings.capsuleColors = [];
			this.settings.capsuleSettings.capsuleColors.push(capsuleColors);
			this.settings.capsuleSettings.backgroundColors = [];
			this.settings.capsuleSettings.backgroundColors.push(backgroundColors);
		},
		async transfer() {
			const response = await SpotifyService.transferDevicePlayer({player_id: localStorage.device_id, access_token: localStorage.access_token, play: true});
			if(response.data.success === true) {
				this.$refs.Capsule.setup();
				this.transferred = true;
			}
		},
		async getTrackInfo() {
			const response = await SpotifyService.getTrackInfo(localStorage.access_token, this.trackId);
			if(response.data.success === true) {

			}
		},
		async analyze() {
			const response = await SpotifyService.analyzeTrack(localStorage.access_token, this.trackId);
			if(response.data.success === true) {
				
			}
		},
	}
}
</script>

<style scoped>

</style>
