<template>
<div id='controls'>
	<b-button-toolbar aria-label="Toolbar with button groups">
		<b-button-group size="lg" class="mx-1">
			<b-btn v-if='repeatToggle===1' @click='toggleRepeat()' class='invertedPlaybackControls'><font-awesome-icon icon='redo'/></b-btn>
			<b-btn v-if='repeatToggle===2' @click='toggleRepeat()' class='halfPlaybackControls'><font-awesome-icon icon='redo'/></b-btn>
			<b-btn v-if='repeatToggle===3' @click='toggleRepeat()' class='playbackControls'><font-awesome-icon icon='redo'/></b-btn>
			<b-btn @click='prev' class='invertedPlaybackControls'><font-awesome-icon icon='step-backward' /></b-btn>
		</b-button-group>
		<b-button-group size="lg" class="mx-1">
			<b-btn v-if='paused===true' @click='play()' class='invertedPlaybackControls' style='border-radius:50%;'><font-awesome-icon icon='play' /></b-btn>
			<b-btn v-else-if='paused===false' @click='pause()' class='playbackControls' style='border-radius:50%;'><font-awesome-icon icon='pause'/></b-btn>
		</b-button-group>
		<b-button-group size="lg" class="mx-1">
			<b-btn @click='next' class='invertedPlaybackControls'><font-awesome-icon icon='step-forward' /></b-btn>
			<b-btn v-if='shuffle===false' @click='toggleShuffle()' class='invertedPlaybackControls'><font-awesome-icon icon='random'/></b-btn>
			<b-btn v-if='shuffle===true' class='playbackControls' @click='toggleShuffle()'><font-awesome-icon icon='random'/></b-btn>
		</b-button-group>
		<b-button-group size="lg">
			<b-btn id='fullscreen' class='invertedPlaybackControls screen' @click='toggleFullScreen()' v-if='fullScreen===false'>
				<font-awesome-icon icon=arrows-alt />
			</b-btn>
			<b-btn class='playbackControls screen' @click='toggleFullScreen()' v-if='fullScreen===true'>
				<font-awesome-icon icon=compress-arrows-alt />
			</b-btn>
		</b-button-group>
	</b-button-toolbar>
	</div>
</template>

<script>
import SpotifyService from '@/services/SpotifyService';
import screenfull from 'screenfull';

export default {
	name: 'Controls',
	props: {
		token: String,
		artist: String,
		track: String,
		paused: Boolean,
	},
	data() {
		return {
			shuffle: false,
			repeatToggle: 1,
			fullScreen: false
		}
	},
	mounted() {

	},
	methods: {
		toggleFullScreen() {
			if(this.fullScreen === false) {
				var state = "fullscreen";
				this.fullScreen = true;
			} else {
				var state = "maximized";
				this.fullScreen = false;
			}
			var data = {
				type: "fullscreenRequest",
				data: state,
			}
			window.postMessage(data, "*");
		},
		async play() {
			const response = await SpotifyService.play({access_token: this.token});
			if(response.data.success === true) {
				this.paused = false;
				this.$socket.emit('played');
			}
		},
		async pause() {
			const response = await SpotifyService.pause({access_token: this.token});
			if(response.data.success === true) {
				this.paused = true;
				this.$socket.emit('paused');
			}
		},
		async next() {
			const response = await SpotifyService.nextTrack({access_token: this.token});
			// emit event here
			if(response.data.success === true) {
				setTimeout(() => {
					this.getCurrentlyPlaying();
				}, 300); 
			}
		},
		async prev() {
			const response = await SpotifyService.previousTrack({access_token: this.token});
			// emit event here
			if(response.data.success === true) {
				setTimeout(() => {
					this.getCurrentlyPlaying();
				}, 300); 
			}
		},
		async toggleShuffle() {
			if(this.shuffle === false) {
				const response = await SpotifyService.shuffle({shuffle: true, access_token: this.token});
				if(response.data.success === true) {
					this.shuffle = true;
				}
			} else {
				const response = await SpotifyService.shuffle({shuffle: false, access_token: this.token});
				if(response.data.success === true) {
					this.shuffle = false;
				}
			}
		},
		async toggleRepeat() {
			switch(this.repeatToggle) {
				case 1:
					const response = await SpotifyService.repeat({type: 'track', access_token: this.token});
					if(response.data.success === true) {
						this.repeatToggle = 2;
					}
					break;
				case 2:
					const response2 = await SpotifyService.repeat({type: 'context', access_token: this.token});
					if(response2.data.success === true) {
						this.repeatToggle = 3;
					}
					break;
				case 3: 
					const response3 = await SpotifyService.repeat({type: 'off', access_token: this.token});
					if(response3.data.success === true) {
						this.repeatToggle = 1;
					}
					break;
			}
		},
		async getCurrentlyPlaying() {
      	const response = await SpotifyService.getCurrentlyPlaying(this.token);
			if(response.data.is_playing === false && response.data.body === null) {
			 	this.album = '';
          	this.artist = '';
          	this.track = '';
			 	this.paused = true;
			} else {
				this.album = response.data.object.item.album.name;
				this.artist = response.data.object.item.album.artists[0].name +" | "+this.album;
				this.track = response.data.object.item.name;
				this.paused = !response.data.is_playing;
			}
		 },
	}
}
</script>

<style scoped>
#controls {
	text-align: center;
	height: 60px;
	width: 400px;
	animation-name: slidein;
  animation-duration: .2s;
  animation-iteration-count:1;
  animation-timing-function: ease-in-out;
}
@keyframes slidein {
  from {bottom: -200%}
  to {bottom: 0}
}
.btn-toolbar {
	display: inline-block;
}
.btn{
	background-color: none;
}
.active {
	background-color: #bdf3db
}
.playbackControls{
	color:white;
	background-color:#42b983;
	border:#42b983;
	margin-top:10px;
}
.playbackControls:active {
	outline-color: none;
	border: none;
}
.invertedPlaybackControls:active {
	outline-color: none;
	border: none;
}
.invertedPlaybackControls {
	margin-top:10px;
}
.halfPlaybackControls {
	color: #42b983;
	background: linear-gradient(0deg, #42b983 50%, #ffffff 50%);
	margin-top:10px;
}
</style>