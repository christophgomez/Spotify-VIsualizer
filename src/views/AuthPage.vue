<template>
  <div id="auth">
    <div v-if='success===true' class='success'>
      <div style='margin-top:10%;'>
        <h1>Spotify Link Successful!</h1>
        <hr>
        <p>Click the Spotilize Chrome Extension button in the browser toolbar now!</p>
        <p>You'll do that everytime you want to use the app from now on.</p>
        <small>(Forget the app URL!! It won't work if you don't click that button. Trust me!)</small><br><br>
        <p>Still reading? Click that button!</p>
      </div>
    </div>
    <div v-if='success===false' class='fail'>
      <div style='margin-top:10%;'>
        <h1>Uh oh!</h1>
        <hr>
        <p>Something went wrong linking your Spotify Account</p><font-awesome-icon icon='frown' size="3x"/> <br><br><p>Please go back and try again</p>
      </div>
    </div>
  </div>
</template>

<script>
import SpotifyService from '@/services/SpotifyService';

export default {
  name: 'Auth',
  data () {
    return {
      success: Boolean,
      code: null
    }
  },
  mounted() {
    /*window.onbeforeunload = function () {
      window.opener.checkToken();
    }*/
    if(this.$route.query.code) {
      this.code = this.$route.query.code;
      this.exchange();
    }
    if(this.$route.query.error) {
      this.success = false;
    }
  },
  methods: {
    async exchange() {
      var code = this.code;
      const response = await SpotifyService.exchange({code});
      if(response.data.success === true) {
        this.success = true;
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
      } else {
        this.success = false;
      }
    },
    cont() {
      this.$router.replace({name: 'visualizer'});
    }
  }
}
</script>

<style scoped>
#auth {
  width:100%;
  height: 100%;
  margin: 0 auto;
  background: #13242f;
}
hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 1em auto;
    padding: 0;
    width: 25%;
}
.md-button {
  background-color:#42b983;
  color:black;
  border:none;
}
.fail {
  color: white;
  width: 100%;
  text-align:center;
  height: 100%;
  padding: 10px;
  position: relative;
}
.success {
  color: white;
  width: 100%;
  text-align:center;
  height: 100%;
  padding: 10px;
  position: relative;
}
#auth:before {
  background-size: 100%;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY3g9IjUwJSIgY3k9IiIgcj0iOTUlIj48c3RvcCBvZmZzZXQ9IjIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjAiLz48c3RvcCBvZmZzZXQ9Ijk1JSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==');
  background-image: -moz-radial-gradient(center, ellipse cover, rgba(0, 0, 0, 0) 20%, #000000 95%);
  background-image: -webkit-radial-gradient(center, ellipse cover, rgba(0, 0, 0, 0) 20%, #000000 95%);
  background-image: radial-gradient(ellipse cover at center, rgba(0, 0, 0, 0) 20%, #000000 95%);
  position: absolute;
  content: "";
  z-index: 0;
  opacity: 0.9;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}
#auth:after {
  	position: absolute;
  	content: "";
  	z-index: 0;
  	opacity: 0.8;
  	height: 100%;
  	width: 100%;
  	left: 0;
  	top: 0;
}
</style>

