<template>
  <div class="">
  </div>
</template>

<script>
import SpotifyService from '@/services/SpotifyService';

export default {
  name: 'Auth',
  data () {
    return {
      code: null
    }
  },
  created() {
    window.onbeforeunload = function () {
      window.opener.checkToken();
    }
    this.code = this.$route.query.code;
    this.exchange();
  },
  methods: {
    async exchange() {
      var code = this.code;
      const response = await SpotifyService.exchange({code});
      if(response.data.success === true) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      window.close();
    }
  }
}
</script>

<style scoped>
.about{
  text-overflow: hidden;
}
a {
  color: #42b983;
}
button {
   background:none!important;
     border:none; 
     padding:0!important;
     font: inherit;
     color: #42b983;
     /*border is optional*/
     border-bottom:1px solid #42b983; 
     cursor: pointer;
}
button:focus {
  outline: 0;
}
</style>

