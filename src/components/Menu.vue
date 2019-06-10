<template>
  <div id="menu">
    <input type="checkbox" id="menuToggler" class="input-toggler" @click="active=true">
    <label for="menuToggler" class="menu-toggler">
      <span
        :class="{menu_toggler_line_Dark: settings.capsuleSettings.isDark===true, menu_toggler_line_Light: settings.capsuleSettings.isDark===false}"
      ></span>
      <span
        :class="{menu_toggler_line_Dark: settings.capsuleSettings.isDark=== true, menu_toggler_line_Light: settings.capsuleSettings.isDark===false}"
      ></span>
      <span
        :class="{menu_toggler_line_Dark: settings.capsuleSettings.isDark===true, menu_toggler_line_Light: settings.capsuleSettings.isDark===false}"
      ></span>
    </label>

    <vs-sidebar parent="body" default-index="1" class="sidebarx" spacer v-model="active">
      <div class="header-sidebar" slot="header" style="text-align:center;">
        <h3>
          <img src="../assets/logo.png" alt="Logo" height="32" width="32">
        </h3>
      </div>

      <vs-sidebar-group title="Visualizations">
        <ul style="text-align:left;position:relative;left:-4em; list-style: none;">
          <li style="text-align:left">
            <vs-radio
              v-model="activeVisual"
              vs-value="Capsules"
              style="text-align:left;width:100%"
            >Capsules</vs-radio>
          </li>
          <li>
            <vs-radio
              v-model="activeVisual"
              vs-value="Lamp"
              style="left:-.75em;text-align:left"
            >Lamp</vs-radio>
          </li>
        </ul>
      </vs-sidebar-group>

      <vs-sidebar-group index="2.2" title="Settings">
        <div v-if="activeVisual==='Capsules'">
          <vs-sidebar-group title="Capsule Amount">
            <vs-input-number v-model="settings.capsuleSettings.capsuleAmount" style="background:white"/>
          </vs-sidebar-group>

          <vs-sidebar-group title="Capsule Colors">
            <vs-sidebar-group title="Presets"></vs-sidebar-group>
            <vs-sidebar-group title="Custom">
              <div v-for="(color, index) in settings.capsuleSettings.colors" :key="index" style="display:inline-block">
                <ColorSwatch
                  :color="color"
                  :isSelected="getSelectedColor(color)"
                  @click.native="toggleSelectedColor(color)"
                ></ColorSwatch>
              </div>
              <br>
              <vs-button
                type="line"
                color="dark"
                size="small"
                style="float:left;"
                @click="toggleAllColors(false)"
              >Select All</vs-button>
              <vs-button
                type="line"
                color="danger"
                size="small"
                style="margin-left:10px;float:left;"
                @click="toggleAllColors(true)"
              >None</vs-button>
            </vs-sidebar-group>
          </vs-sidebar-group>

          <vs-sidebar-group title="Background Color">
            <ul style="text-align:left;position:relative;left:-4em; list-style: none;">
              <li style="text-align:left">
                <vs-radio
                  v-model="settings.capsuleSettings.backgroundColor"
                  vs-value="Dark"
                  style="text-align:left"
                  @click="changeBg('Dark')"
                >Dark</vs-radio>
              </li>
              <li>
                <vs-radio
                  v-model="settings.capsuleSettings.backgroundColor"
                  vs-value="Light"
                  style="text-align:left"
                  @click="changeBg('Light')"
                >Light</vs-radio>
              </li>
            </ul>
          </vs-sidebar-group>
        </div>
        <div v-else-if="activeVisual==='Lamp'">
          <vs-sidebar-group title="Post-processing Effects">
            <div style='diaply:inline-block;margin-left:1em;'>
            <p style='display:inline-block;margin-right:.5em'>Bloom</p>
            <toggle-button v-model="settings.lampSettings.bloom" /><br>
            <p style='display:inline-block;margin-right:.5em'>God Rays</p>
            <toggle-button v-model="settings.lampSettings.godrays"/>
            </div>
          </vs-sidebar-group>
        </div>
      </vs-sidebar-group>

      <vs-sidebar-group index="4" title="Info">
        <vs-sidebar-item index="4.3" icon="help">Help</vs-sidebar-item>
        <vs-sidebar-item index="4.4" icon="help">About</vs-sidebar-item>
      </vs-sidebar-group>

      <div class="footer-sidebar" slot="footer">
        <vs-button icon="reply" color="danger" type="flat" @click="logout()">Logout</vs-button>
        <vs-button icon="keyboard_arrow_left" color="primary" type="border" @click="active=false"></vs-button>
      </div>
    </vs-sidebar>
  </div>
</template>

<script>
import SpotifyService from "@/services/SpotifyService";
import { EventBus } from "../eventbus";
import ColorSwatch from "@/components/ColorSwatch";
import { ToggleButton } from 'vue-js-toggle-button';

export default {
  name: "Menu",
  components: {
    ColorSwatch,
    ToggleButton
  },
  data() {
    return {
      music: false,
      visualizations: false,
      settings: false,
      active: false,
      activeVisual: "Capsules",
      settings: {
        capsuleSettings: {
          backgroundColor: "Dark",
          isDark: true,
          colors: [
            "#F44336",
            "#E91E63",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#2196F3",
            "#03A9F4",
            "#00BCD4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
            "#795548",
            "#9E9E9E",
            "#607D8B"
          ],
          selectedColors: [
            "#F44336",
            "#E91E63",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#2196F3",
            "#03A9F4",
            "#00BCD4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
            "#795548",
            "#9E9E9E",
            "#607D8B"
          ],
          capsuleAmount: 200
        },
        lampSettings : {
          bloom: false,
          godrays: false
        }
      }
    };
  },
  created() {
    if (localStorage.active_visual) {
      this.activeVisual = localStorage.active_visual;
    } else {
      localStorage.setItem("active_visual", "Capsules");
    }

    if (localStorage.capsule_bg) {
      if (localStorage.capsule_bg === "Dark") {
        this.settings.capsuleSettings.isDark = true;
        this.settings.capsuleSettings.backgroundColor = "Dark";
      } else {
        this.settings.capsuleSettings.isDark = false;
        this.settings.capsuleSettings.backgroundColor = "Light";
      }
    }

    if (localStorage.capsule_amount) {
      this.settings.capsuleSettings.capsuleAmount = localStorage.capsule_amount;
    }

    if (localStorage.capsule_colors) {
      var COLORS = JSON.parse(localStorage.capsule_colors);
      this.settings.capsuleSettings.selectedColors = [];
      for (var i = 0; i < COLORS.length; i++) {
        let symb = "#";
        let color = `${symb}${COLORS[i]}`;
        this.settings.capsuleSettings.selectedColors[i] = color;
      }
    }

    if(localStorage.lampBloom) {
      if(localStorage.lampBloom === "true") {
        this.settings.lampSettings.bloom = true;
      } else {
        this.settings.lampSettings.bloom = false;
      }
    }

    if(localStorage.lampRays) {
      if(localStorage.lampRays === "true") {
        this.settings.lampRays = true;
      } else {
        this.settings.lampRays = false;
      }
    }
  },
  methods: {
    getSelectedColor(field) {
      return this.settings.capsuleSettings.selectedColors.includes(field);
    },
    toggleAllColors(clear) {
      this.settings.capsuleSettings.selectedColors = [];
      if (clear) {
        var colors = [];
        if (this.settings.capsuleSettings.isDark) {
          colors.push("ffffff");
        } else {
          colors.push("000000");
        }
        localStorage.setItem("capsule_colors", JSON.stringify(colors));
        EventBus.$emit("changeColors", colors);
      } else {
        for (var i = 0; i < this.settings.capsuleSettings.colors.length; i++) {
          this.settings.capsuleSettings.selectedColors.push(this.colors[i]);
        }
        var colors = [];
        for (var i = 0; i < this.settings.capsuleSettings.selectedColors.length; i++) {
          var color = this.settings.capsuleSettings.selectedColors[i];
          color = color.replace("#", "");
          colors.push(color);
        }
        localStorage.setItem("capsule_colors", JSON.stringify(colors));
        EventBus.$emit("changeColors", colors);
      }
    },
    toggleSelectedColor(color) {
      if (
        this.settings.capsuleSettings.selectedColors.length === 1 &&
        (this.settings.capsuleSettings.selectedColors.includes("#ffffff") ||
          this.settings.capsuleSettings.selectedColors.includes("#000000"))
      ) {
        this.settings.capsuleSettings.selectedColors.pop();
      }
      if (this.settings.capsuleSettings.selectedColors.includes(color)) {
        this.settings.capsuleSettings.selectedColors = this.arrayRemove(this.selectedColors, color);
      } else {
        this.settings.capsuleSettings.selectedColors.push(color);
      }
      var colors = [];
      for (var i = 0; i < this.settings.capsuleSettings.selectedColors.length; i++) {
        var color = this.settings.capsuleSettings.selectedColors[i];
        color = color.replace("#", "");
        colors.push(color);
      }
      if (colors.length === 0) {
        if (this.settings.capsuleSettings.isDark) {
          colors.push("ffffff");
        } else {
          colors.push("000000");
        }
      }
      localStorage.setItem("capsule_colors", JSON.stringify(colors));
      EventBus.$emit("changeColors", colors);
    },
    arrayRemove(array, value) {
      return array.filter(function(ele) {
        return ele !== value;
      });
    },
    logout() {
      this.active = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("capsule_bg");
      var colors = [
        "F44336",
        "E91E63",
        "9C27B0",
        "673AB7",
        "3F51B5",
        "2196F3",
        "03A9F4",
        "00BCD4",
        "009688",
        "4CAF50",
        "8BC34A",
        "CDDC39",
        "FFEB3B",
        "FFC107",
        "FF9800",
        "FF5722",
        "795548",
        "9E9E9E",
        "607D8B"
      ];
      localStorage.setItem("capsule_colors", JSON.stringify(colors));
      localStorage.removeItem("device_id");
      localStorage.removeItem("email");
      this.$router.push({ name: "home" });
    },
    changeBg(color) {
      if (color === "Dark") {
        this.settings.capsuleSettings.isDark = true;
        localStorage.setItem("capsule_bg", "Dark");
      } else {
        this.settings.capsuleSettings.isDark = false;
        localStorage.setItem("capsule_bg", "Light");
      }
      if (this.settings.capsuleSettings.selectedColors.length === 0) {
        var colors = [];
        if (this.settings.capsuleSettings.isDark) {
          colors.push("ffffff");
        } else {
          colors.push("000000");
        }
        localStorage.setItem("capsule_colors", JSON.stringify(colors));
        EventBus.$emit("changeColors", colors);
      }
      EventBus.$emit("changeBg", color);
    },
  },
  computed: {
    capsuleAmount() {
      return this.settings.capsuleSettings.capsuleAmount;
    },
    lampBloom() {
      return this.settings.lampSettings.bloom;
    },
    lampGodRays() {
      return this.settings.lampSettings.godrays;
    }
  },
  watch: {
    capsuleAmount: val => {
      EventBus.$emit("changeCapsuleAmount", val);
      localStorage.setItem("capsule_amount", val);
    },
    activeVisual: val => {
      EventBus.$emit("changeVisual", val);
      localStorage.setItem("active_visual", val);
    },
    lampBloom: val => {
      EventBus.$emit('toggleLampBloom', val);
      localStorage.setItem('lampBloom', val);
    },
    lampGodRays: val => {
      EventBus.$emit('toggleLampRays', val);
      localStorage.setItem('lampRays', val);
    }
  }
};
</script>

<style scoped>
:root {
  --sidebar-width: 550px;
  --toggler-size: 35px;
}
.sidebarx {
  font-family: "Nunito", sans-serif;
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
  border: 0px solid rgba(0, 0, 0, 0) !important;
  border-left: 1px solid rgba(0, 0, 0, 0.07) !important;
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
  transition-duration: 0.5s, 0.25s;
  transition-delay: 0s, 0.5s;
  animation-name: slidein;
  animation-duration: 0.2s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}

.menu_toggler_line_Light:nth-child(2) {
  top: calc(35px / 5 * 2);
  animation-duration: 0.3s;
}

.menu_toggler_line_Light:nth-child(3) {
  top: calc(35px / 5 * 4);
  animation-duration: 0.4s;
}

.menu_toggler_line_Dark {
  height: calc(35px / 5);
  background: white;
  position: absolute;
  left: 0;
  right: 0;
  transition-property: transform, opacity;
  transition-duration: 0.5s, 0.25s;
  transition-delay: 0s, 0.5s;
  animation-name: slidein;
  animation-duration: 0.2s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}

.menu_toggler_line_Dark:nth-child(2) {
  top: calc(35px / 5 * 2);
  animation-duration: 0.3s;
}

.menu_toggler_line_Dark:nth-child(3) {
  top: calc(35px / 5 * 4);
  animation-duration: 0.4s;
}

.input-toggler {
  display: none;
}

.input-toggler:hover {
  opacity: 1;
}

@keyframes slidein {
  from {
    left: -200%;
    right: 200%;
  }
  to {
    left: 0;
    right: 0;
  }
}

.vs-select {
  width: 100%;
}
@media (max-width: 550px) {
  .vs-select {
    width: 100%;
  }
}
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}
</style>