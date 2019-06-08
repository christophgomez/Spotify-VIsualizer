<template>
	<div id="menu">
		<input type="checkbox" id="menuToggler" class="input-toggler" @click='active=true'/>
  		<label for="menuToggler" class="menu-toggler">
    		<span :class="{menu_toggler_line_Dark: isDark===true, menu_toggler_line_Light: isDark===false}"></span>
    		<span :class="{menu_toggler_line_Dark: isDark=== true, menu_toggler_line_Light: isDark===false}"></span>
    		<span :class="{menu_toggler_line_Dark: isDark===true, menu_toggler_line_Light: isDark===false}"></span>
  		</label>

    <vs-sidebar parent='body' default-index="1" class="sidebarx" spacer v-model="active">
      <div class="header-sidebar" slot="header" style='text-align:center;'>
        <h3>
          <img src="../assets/logo.png" alt="Logo" height="32" width="32">
        </h3>
      </div>

      <vs-sidebar-group title="Visualizations">
        <ul style='text-align:left;position:relative;left:-4em; list-style: none;'>
              <li style='text-align:left'>
                <vs-radio v-model='activeVisual' vs-value='Capsules' style='text-align:left;width:100%'>Capsules</vs-radio>
              </li>
              <li>
                <vs-radio v-model='activeVisual' vs-value='Three' style='left:-.75em;text-align:left'>Lamp (Work in progress)</vs-radio>
              </li>
            </ul>
        </vs-sidebar-group>

        
        <vs-sidebar-group index=2.2 title='Settings'>

          <div v-if="activeVisual==='Capsules'">

          <vs-sidebar-group title='Capsule Amount'>
            <vs-input-number v-model='capsuleAmount' style='background:white'/>
          </vs-sidebar-group>

          <vs-sidebar-group title='Capsule Colors'>
            <vs-sidebar-group title='Presets'></vs-sidebar-group>
            <vs-sidebar-group title='Custom'>
              <div v-for='(color, index) in colors' :key='index' style='display:inline-block'>
                <ColorSwatch :color='color' :isSelected='getSelectedColor(color)' @click.native='toggleSelectedColor(color)'></ColorSwatch>
              </div>
              <br>
              <vs-button type='line' color='dark' size='small' style='float:left;' @click='toggleAllColors(false)'>Select All</vs-button>
              <vs-button type='line' color='danger' size='small' style='margin-left:10px;float:left;' @click='toggleAllColors(true)'>None</vs-button>
            </vs-sidebar-group>
          </vs-sidebar-group>

          <vs-sidebar-group title='Background Color'>
            <ul style='text-align:left;position:relative;left:-4em; list-style: none;'>
              <li style='text-align:left'>
                <vs-radio v-model='backgroundColor' vs-value='Dark' style='text-align:left' @click="changeBg('Dark')">Dark</vs-radio>
              </li>
              <li>
                <vs-radio v-model='backgroundColor' vs-value='Light' style='text-align:left' @click="changeBg('Light')">Light</vs-radio>
              </li>
            </ul>
          </vs-sidebar-group>
          </div>
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
        <vs-button icon="reply" color="danger" type="flat" @click='logout()'>Logout</vs-button>
        <vs-button icon="keyboard_arrow_left" color="primary" type="border" @click='active=false'></vs-button>
      </div>
    </vs-sidebar>

	</div>
</template>

<script>
import SpotifyService from '@/services/SpotifyService';
import {EventBus} from '../eventbus';
import ColorSwatch from '@/components/ColorSwatch';

export default {
  name: 'Menu',
  components: {
    ColorSwatch
  },
  data() {
    return {
      music: false,
      visualizations: false,
      settings: false,
      active: false,
      activeVisual: 'Capsules',
      backgroundColor: 'Dark',
      isDark: true,
      colors: [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B',
        ],
      selectedColors: ['#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B',],
      capsuleAmount: 200,
    }
  },
  created() {
    this.getPlaylists();

    if(localStorage.active_visual) {
      this.activeVisual = localStorage.active_visual;
    } else {
      localStorage.setItem('active_visual', "Capsules");
    }

    if(localStorage.capsule_bg){
      if(localStorage.capsule_bg === 'Dark') {
        this.isDark = true;
        this.backgroundColor = 'Dark';
      } else {
        this.isDark = false;
        this.backgroundColor = 'Light';
      }
    }

    if(localStorage.capsule_amount) {
      this.capsuleAmount = localStorage.capsule_amount;
    }

    if(localStorage.capsule_colors) {
      var COLORS = JSON.parse(localStorage.capsule_colors);
      this.selectedColors = [];
		  for (var i = 0; i < COLORS.length; i++) {
			  let symb = '#';
			  let color = `${symb}${COLORS[i]}`;
			  this.selectedColors[i] = color;
		  }
    }
  },
  methods: {
    getSelectedColor(field) {
      return this.selectedColors.includes(field);
    },
    toggleAllColors(clear) {
      this.selectedColors = [];
      if(clear) {
        var colors = [];
        if(this.isDark) {
          colors.push("ffffff");
        } else {
          colors.push("000000");
        }
        localStorage.setItem('capsule_colors', JSON.stringify(colors));
        EventBus.$emit('changeColors', colors);
      } else {
        for(var i = 0; i < this.colors.length;i++) {
          this.selectedColors.push(this.colors[i]);
        }
        var colors = [];
        for(var i = 0; i < this.selectedColors.length;i++) {
          var color = this.selectedColors[i];
          color = color.replace('#','');
          colors.push(color);
        }
        localStorage.setItem('capsule_colors', JSON.stringify(colors));
        EventBus.$emit('changeColors', colors);
      }
    },
    toggleSelectedColor(color) {
      if(this.selectedColors.length === 1 && (this.selectedColors.includes("#ffffff") || this.selectedColors.includes('#000000'))) {
        this.selectedColors.pop();
      }
      if(this.selectedColors.includes(color)) {
        this.selectedColors = this.arrayRemove(this.selectedColors, color);
      } else {
        this.selectedColors.push(color);
      }
      var colors = [];
      for(var i = 0; i < this.selectedColors.length;i++) {
        var color = this.selectedColors[i];
        color = color.replace('#','');
        colors.push(color);
      }
      if(colors.length === 0) {
        if(this.isDark) {
          colors.push("ffffff");
        } else {
          colors.push("000000");
        }
      }
      localStorage.setItem('capsule_colors', JSON.stringify(colors));
      EventBus.$emit('changeColors', colors);
    },
    arrayRemove(array, value) {
      return array.filter(function(ele) {
        return ele !== value;
      });
    },
    logout() {
      this.active = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('capsule_bg');
      var colors = ['F44336',
        'E91E63',
        '9C27B0',
        '673AB7',
        '3F51B5',
        '2196F3',
        '03A9F4',
        '00BCD4',
        '009688',
        '4CAF50',
        '8BC34A',
        'CDDC39',
        'FFEB3B',
        'FFC107',
        'FF9800',
        'FF5722',
        '795548',
        '9E9E9E',
        '607D8B',];
      localStorage.setItem('capsule_colors', JSON.stringify(colors));
      localStorage.removeItem('device_id');
      localStorage.removeItem('email');
      this.$router.push({name: 'home'})
    },
    changeBg(color) {
      if(color==="Dark") {
        this.isDark = true;
        localStorage.setItem('capsule_bg', 'Dark');
      } else {
        this.isDark = false;
        localStorage.setItem('capsule_bg', 'Light');
      }
      if(this.selectedColors.length === 0) {
        var colors = [];
        if(this.isDark) {
          colors.push("ffffff");
        } else {
          colors.push("000000");
        }
        localStorage.setItem('capsule_colors', JSON.stringify(colors));
        EventBus.$emit('changeColors', colors);
      }
      EventBus.$emit('changeBg', color);
    },
    async getPlaylists() {
      const response = await SpotifyService.getPlaylists(localStorage.access_token, this.playlistOffset);
      if(response.data.success === true) {
          for(let i = 0; i < response.data.playlists.items.length; i++) {
            this.playlists.push(response.data.playlists.items[i])
          }
          if(response.data.playlists.next !== null) {
            this.morePlaylists = true;
          } else {
            this.morePlaylists = false;
          }
      }
      if(this.playlistOffset !== 0) {
        this.lessPlaylists = true;
      }
    },
    async playPlaylist(uri){
      await SpotifyService.playPlaylist(localStorage.access_token, uri);
    },
    async getRecent() {
      const response = await SpotifyService.getRecentlyPlayed(localStorage.access_token);
      if(response.data.success === true) {
        console.log('success');
        this.recentlyPlayed = [];
        for(let i = 0; i < response.data.items.items.length; i++) {
          this.recentlyPlayed.push(response.data.items.items[i].track);
        }
      }
    },
    async getPlaylistTracks(id) {
      this.tracks = [];
      if(id !== this.playlistId) {
        this.trackOffset = 0;
        this.playlistId = id;
      }
      const response = await SpotifyService.getPlaylistTracks(localStorage.access_token, id, this.trackOffset);
      if(response.data.success === true) {
        for(let i = 0; i < response.data.tracks.items.length; i++) {
          this.tracks.push(response.data.tracks.items[i]);
        }
        if(response.data.tracks.next !== null) {
          this.moreTracks = true;
        } else {
          this.moreTracks = false;
        }
      }
      if(this.trackOffset !== 0) {
        this.lessTracks = true;
      }
    },
    getMoreTracks() {
      this.trackOffset += 20;
      this.getPlaylistTracks(this.playlistId);
    },
    getLessTracks(){
      this.trackOffset -= 20;
      if(this.trackOffset <= 0) {
        this.trackOffset = 0;
        this.lessTracks = false;
      }
      this.getPlaylistTracks(this.playlistId);
    },
    getMorePlaylists() {
      this.playlists = [];
      this.playlistOffset += 5;
      this.getPlaylists();
    },
    getLessPlaylists() {
      this.playlists = [];
      this.playlistOffset -= 5;
      if(this.playlistOffset <= 0) {
        this.playlistOffset = 0;
        this.lessPlaylists = false;
      }
      this.getPlaylists();
    }
  },
  watch: {
    capsuleAmount: (val) => {
      EventBus.$emit('changeCapsuleAmount', val);
      localStorage.setItem('capsule_amount', val);
    },
    activeVisual: (val) => {
      EventBus.$emit('changeVisual', val);
      localStorage.setItem('active_visual', val);
    }
  }
}
</script>

<style scoped>

:root {
  --sidebar-width: 550px;
  --toggler-size: 35px;
}
.sidebarx {
  font-family: 'Nunito', sans-serif;
}

.header-sidebar {
  display: inline-flex;
  align-items: left;
  justify-content: left;
  flex-direction: column;
  width: 100%;
}
.header-sidebar h4 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.menu_toggler_line_Light {
  height: calc(35px / 5);
  background: #6c757d;
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

.menu_toggler_line_Light:nth-child(2) {
  top: calc(35px / 5 * 2);
animation-duration: .3s;
}

.menu_toggler_line_Light:nth-child(3) {
  top: calc(35px / 5 * 4);
  animation-duration:.4s;
}

.menu_toggler_line_Dark {
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

.menu_toggler_line_Dark:nth-child(2) {
  top: calc(35px / 5 * 2);
animation-duration: .3s;
}

.menu_toggler_line_Dark:nth-child(3) {
  top: calc(35px / 5 * 4);
  animation-duration:.4s;
}

.input-toggler {
  display: none;
}

.input-toggler:hover{
    opacity:1;
}

@keyframes slidein {
  from {left: -200%; right:200%;}
  to {left: 0; right: 0;}
}

.vs-select {
  width: 100%
}
@media (max-width: 550px) {
  .vs-select {
    width: 100%
  }
}
</style>