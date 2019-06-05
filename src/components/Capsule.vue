<template>
  <div id="capsuleCanvas" :class="{dark: isDark === true, light: isDark === false}" ref="capsule">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import Capsule from "@/util/Capsule.js";
import {EventBus} from '../eventbus';

export default {
  name: "CapsuleCanvas",
  data() {
    return {
      NUM_CAPSULES: 200,
      capsules: [],
      height: null,
      width: null,
      ratio: null,
      ctx: null,
      bands: null,
      requestid: null,
      canvas: HTMLElement,
      isDark: true,
    };
  },
  beforeDestroy() {
    this.capsules = [];
    this.bands = null;
    this.ctx = null;
    this.canvas = null;
    window.cancelAnimationFrame(this.requestid);
  },
  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener('resize', this.resizeCanvas, false);

    if(localStorage.capsule_bg)
    {
      if(localStorage.capsule_bg === 'Dark') {
        this.darkBg();
      } else {
        this.lightBg();
      }
    } else {
      localStorage.setItem('capsule_bg', 'Dark');
      this.darkBg();
    }

    if(localStorage.capsule_amount) {
      this.NUM_CAPSULES = localStorage.capsule_amount;
    }

    EventBus.$on('changeBg', (data) => {
			if(data==='Dark') {
				this.darkBg();
			} else {
				this.lightBg();
			}
    });

    EventBus.$on('changeColors', (data) => {
      this.changeColors(data);
    });

    EventBus.$on('changeCapsuleAmount', (data) => {
      this.changeCapsuleAmount(data);
    });

    window.onbeforeunload = function(){
      window.cancelAnimationFrame(this.requestid);
    }

    this.resizeCanvas();
  },
  methods: {
    darkBg() {
      this.isDark = true;
      this.ctx.globalCompositeOperation = "lighter";
    },
    lightBg() {
      this.isDark = false;
      this.ctx.globalCompositeOperation = "source-over";
    },
    resizeCanvas() {
      this.ratio = window.devicePixelRatio;
      this.height = window.innerHeight;
      this.width = window.innerWidth;

      //scale the canvas
      if (this.canvas !== null && this.canvas !== undefined) {
        this.canvas.setAttribute("height", this.height * this.ratio);
        this.canvas.setAttribute("width", this.width * this.ratio);
      }
      this.capsules = [];
      window.cancelAnimationFrame(this.requestid);
      this.setup();
    },
    changeColors() {
      cancelAnimationFrame(this.requestid);
      this.setup();
    },
    changeCapsuleAmount(amount) {
      this.NUM_CAPSULES = amount;
      cancelAnimationFrame(this.requestid);
      this.setup();
    },
    setup() {
      console.log("Setup ran");
      this.capsules = [];
      var i, j, capsule, x, y;
      for (i = 0; i < this.NUM_CAPSULES; i++) {
        x = this.random(this.width);
        y = this.random(this.height);
        capsule = new Capsule(x, y, JSON.parse(localStorage.capsule_colors));
        capsule.energy = this.random(capsule.band / 256);
        this.capsules.push(capsule);
      }
      this.requestid = requestAnimationFrame(this.update);
    },
    update() {
      // Clear the canvas
      this.ctx.clearRect(
        0,
        0,
        this.width * this.ratio,
        this.height * this.ratio
      );

      // Draw the capsules
      if (this.bands !== null && this.capsules !== null) {
        let capsule;
        for (let j = 0; j < this.capsules.length; j++) {
          capsule = this.capsules[j];

          // Set the width of the capsule
          if (this.bands !== undefined && this.bands !== null) {
            capsule.energy = this.bands[capsule.band] / 256;
          }

          // recycle capsules
          if (capsule.y < -capsule.size * capsule.level * capsule.scale) {
            capsule.reset();
            capsule.x = this.random(this.width);
            capsule.y =
              this.height + capsule.size * capsule.scale * capsule.level;
          }
          
          // Move the capsule to a new
          capsule.move();
          capsule.draw(this.ctx);
        }
        this.requestid = requestAnimationFrame(this.update);
      }
    },
    random(min, max = undefined) {
      if (!this.isNumber(max)) (max = min || 1), (min = 0);
      return min + Math.random() * (max - min);
    },
    isNumber(object) {
      return typeof object == "number";
    }
  }
};
</script>

<style scoped>
#canvas {
  z-index: -1;
}
#capsuleCanvas {
	height: 100%;
}

.dark {
  color: white;
	background: #13242f;
}

.dark::before {
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

.dark::after {
  background: url("https://s.cdpn.io/1715/noise-1.png");
  position: absolute;
  content: "";
  z-index: 0;
  opacity: 0.8;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.light {
  background-color: white;
}

.light::before {
  background-size: 100%;
  background-image: -moz-radial-gradient(center, ellipse cover, rgba(255, 255, 255, 1) 20%, #ffffff 95%);
  background-image: -webkit-radial-gradient(center, ellipse cover, rgba(255, 255, 255, 1) 20%, #ffffff 95%);
  background-image: radial-gradient(ellipse cover at center, rgba(255, 255, 255, 1) 20%, #ffffff 95%);
  position: absolute;
  content: "";
  z-index: 0;
  opacity: 0.9;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.light::after {
  background: url("https://s.cdpn.io/1715/noise-1.png");
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
