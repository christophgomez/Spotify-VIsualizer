<template>
  <div>
		<div class="md-title">Spotify</div>
    <md-button @click='openWindow()' class="md-raised">Link Spotify Account</md-button>
    <span class="md-error" v-if="link===false"><br><br>There was an error linking your spotify account</span>
  </div>
</template>

<script>
/* eslint-disable */
import SpotifyService from '@/services/SpotifyService';

export default {
  name: "SignUp",
  components: {},
  data() {
    return { 
      access_token: '',
      refresh_token: '',
      link: true,
      authWindow: Window
    }
  },
  created() {
    this.authWindow = window;
    var self = this;
		this.authWindow.checkToken = function() {
			self.getToken();
		}
  },
  methods: {
    async getToken() {
      if(localStorage.access_token) {
        this.token = localStorage.access_token;
        this.$router.replace({name: 'visualizer'});
      } else {
        this.link = false;
      }
    },
    async openWindow() {
      const response = await SpotifyService.link();
      var url = (response.data.redirect);
      window.open(url, '_blank', "height=500,width=500,toolbar=no,menubar=no,scrollbars=no,location=no,status=no left=300 top=200");
    },
  }
};
</script>

<style scoped>
.md-card {
  z-index:1;
}
.md-card-content {
  padding: 50px;
}
.md-button {
  background-color:#42b983;
  color:white;
}
</style>
