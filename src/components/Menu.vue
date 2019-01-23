<template>
	<div id="menu">
		<input type="checkbox" id="menuToggler" class="input-toggler" />
  		<label for="menuToggler" class="menu-toggler">
    		<span class="menu-toggler__line"></span>
    		<span class="menu-toggler__line"></span>
    		<span class="menu-toggler__line"></span>
  		</label>
		<aside class="sidebar">
      <div class='sidebar-content'>
        <h3>Spotify Visualizer</h3>
        <span class="sidebar_line"></span>
        <br>
        <b-btn :variant="'link'">Music</b-btn>
        <b-btn :variant="'link'">Visualizations</b-btn>
        <b-btn :variant="'link'">Settings</b-btn>
        <b-btn :variant="'link'">About</b-btn>
    		<b-btn :variant="'link'" @click='logout()'>Logout</b-btn>
      </div>
		</aside>
	</div>
</template>

<script>
export default {
  name: 'Menu',
  methods: {
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      var data = {
				type: "close",
			}
      window.postMessage(data, "*");
    }
  }
}
</script>

<style scoped>
:root {
  --sidebar-width: 300px;
  --toggler-size: 35px;
}
.sidebar-content {
  margin-top:5em;
}
.sidebar {
  width: 300px;
  transform: translateX(calc(300px * -1));
  color: rgba(255,255,255,1);
  background-size: 400% 400%;
  background-color: rgba(66,185,131, .3);
  background-position: 90% 90%;
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  justify-items: center;
  text-align: justify;
  -moz-text-align-last: center;
  text-align-last: center;
  position: absolute;
  top: 0;
  bottom: 0;
  transition: transform .6s, background-position 1s .6s;
  overflow-x: hidden;
}


button {
  display:block;
  color:white;
  text-align:center;
  font-size: 1.3em;
  text-align: justify;
  -moz-text-align-last: center;
  text-align-last: center;
  margin: 1.5em auto;
}

button:hover {
  color: white;
}
#logout {
  bottom: 1em;
}
.input-toggler:checked ~ .sidebar {
  transform: translateX(0);
  background-position: 0 0;
}

.menu-toggler {
  display: block;
  width: 35px;
  height: 35px;
  position: fixed;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 1;
}
.sidebar_line {
  height: 1px;
  background: white;
  position: absolute;
  left: 5px;
  right: 5px;
}
.menu-toggler__line {
  height: calc(35px / 5);
  background: white;
  position: absolute;
  left: 0;
  right: 0;
  transition-property: transform, opacity;
  transition-duration: .5s, .25s;
  transition-delay: 0s, .5s;
  animation-name: slidein;
  animation-duration: .2s;
  animation-iteration-count:1;
  animation-timing-function: ease-in-out;
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line {
  transition-delay: .25s, 0s;
}

.menu-toggler__line:nth-child(2) {
  top: calc(35px / 5 * 2);
animation-duration: .3s;
}

.menu-toggler__line:nth-child(3) {
  top: calc(35px / 5 * 4);
  animation-duration:.4s;
}

.input-toggler {
  display: none;
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line {
  background: white;
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line:nth-child(1) {
  transform: translateY(calc(35px / 5 * 2)) rotate(45deg);
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line:nth-child(2) {
  opacity: 0;
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line:nth-child(3) {
  transform: translateY(calc(35px / 5 * -2)) rotate(-45deg);
}

.input-toggler:hover{
    opacity:1;
}

@keyframes slidein {
  from {left: -200%; right:200%;}
  to {left: 0; right: 0;}
}
</style>