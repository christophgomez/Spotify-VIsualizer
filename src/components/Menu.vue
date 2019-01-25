<template>
	<div id="menu">
		<input type="checkbox" id="menuToggler" class="input-toggler" @click='active=!active'/>
  		<label for="menuToggler" class="menu-toggler">
    		<span class="menu-toggler__line"></span>
    		<span class="menu-toggler__line"></span>
    		<span class="menu-toggler__line"></span>
  		</label>
    <vs-sidebar parent="body" default-index="1" color="primary" class="sidebarx" spacer v-model="active">

      <div class="header-sidebar" slot="header">
        <h3>Spotilize</h3>
      </div>
      <vs-sidebar-group index=1 title="Music">
        <vs-sidebar-group index=1.1 title='Playlists'>
          <h4>Coming Soon</h4>
        </vs-sidebar-group>
        <!--<vs-sidebar-group title="Store">
          <vs-sidebar-item index="2.1" icon="store">
            Store
          </vs-sidebar-item>
          <vs-sidebar-item index="2.2" icon="nature_people">
            Nature
          </vs-sidebar-item>
          <vs-sidebar-item index="2.3" icon="style">
            Style
          </vs-sidebar-item>
        </vs-sidebar-group>-->
        <vs-sidebar-group index=1.2 title='Recently Played'>
          <h4>Coming Soon</h4>
        </vs-sidebar-group>
        <vs-sidebar-group index=1.3 title='For You'>
          <h4>Coming Soon</h4>
        </vs-sidebar-group>
      </vs-sidebar-group>

      <vs-sidebar-group index=2 title='Visualizations'>
        <h4>Coming Soon</h4>
      </vs-sidebar-group>

      <vs-sidebar-group index=3 title='Settings'>
        <h4>Coming Soon</h4>
      </vs-sidebar-group>

      <vs-sidebar-group index=4 title='Info'>
        <vs-sidebar-item index=4.3 icon="help">
          Help
        </vs-sidebar-item>
        <vs-sidebar-item index=4.4 icon="help">
          About
        </vs-sidebar-item>
      </vs-sidebar-group>

      <div class="footer-sidebar" slot="footer">
        <b-btn @click='logout()'>Logout</b-btn>
        <!--<vs-button icon="settings" color="primary" type="border"></vs-button>-->
      </div>

    </vs-sidebar>
		<!--<aside class="sidebar">
      <div class='sidebar-content'>
        <h3>Spotilize</h3>
        <span class="sidebar_line"></span>
        <br>
        <ul>
          <li>
            <b-btn :variant="'link'" @click="toggle('music')">Music</b-btn>
            <ul class='submenu' :class='{show: music}'>
              <li>Coming Soon</li>
            </ul>
          </li>
          <li>
            <b-btn :variant="'link'" @click="toggle('visualizations')">Visualizations</b-btn>
            <ul class='submenu' :class='{show: visualizations}'>
              <li>Coming Soon</li>
            </ul>
          </li>
          <li>
            <b-btn :variant="'link'" @click="toggle('settings')">Settings</b-btn>
            <ul class='submenu' :class='{show: settings}'>
              <li>Coming Soon</li>
            </ul>
          </li>
          <li><b-btn :variant="'link'">About</b-btn></li>
    		  <li><b-btn :variant="'link'" @click='logout()'>Logout</b-btn></li>
        </ul>
      </div>
		</aside>-->
	</div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      music: false,
      visualizations: false,
      settings: false,
      active: false
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.$router.replace({name: 'home'});
     /*var data = {
				type: "close",
			}
      window.postMessage(data, "*");*/
    },
    toggleAllFalseExcept(type) {
      switch(type){
        case 'music':
          this.visualizations = false;
          this.settings = false;
          break;
        case 'visualizations':
          this.music = false;
          this.settings = false;
          break;
        case 'settings':
          this.visualizations = false;
          this.music = false;
      }
    },
    toggle(type) {
      switch(type) {
        case 'music':
          this.toggleAllFalseExcept('music');
          if(this.music === true) {
            this.music = false;
          } else {
            this.music = true;
          }
          break;
        case 'visualizations':
          this.toggleAllFalseExcept('visualizations');
          if(this.visualizations === true) {
            this.visualizations = false;
          } else {
            this.visualizations = true;
          }
          break;
        case 'settings':
          this.toggleAllFalseExcept('settings');
          if(this.settings === true) {
            this.settings = false;
          } else {
            this.settings = true;
          }
          break;
      }
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
.sidebarx {
  font-family: 'Nunito', sans-serif;
  background-color: rgba(66,185,131, .3);
}

.group h4 {
  font-size: 1em !important;
}

.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}
.header-sidebar h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.header-sidebar h4 > button {
  margin-left: 10px;
}
.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.footer-sidebar > button {
  border: 0px solid rgba(0,0,0,0) !important;
  border-left: 1px solid rgba(0,0,0,0.07) !important;
  border-radius: 0px !important;
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
  line-height: .6rem;
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

/*.input-toggler:checked ~ .sidebar {
  transform: translateX(0);
  background-position: 0 0;
}*/

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

/*.input-toggler:checked ~ .menu-toggler .menu-toggler__line {
  transition-delay: .25s, 0s;
}*/

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

/*.input-toggler:checked ~ .menu-toggler .menu-toggler__line {
  background: white;
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line:nth-child(1) {
  transform: translateX(260px) translateY(calc(10px / 5 * 2)) rotate(-45deg);
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line:nth-child(2) {
  opacity: 0;
}

.input-toggler:checked ~ .menu-toggler .menu-toggler__line:nth-child(3) {
  transform:  translateX(260px) translateY(calc(10px / 5 * -2)) rotate(45deg);
}*/

.input-toggler:hover{
    opacity:1;
}

@keyframes slidein {
  from {left: -200%; right:200%;}
  to {left: 0; right: 0;}
}
</style>