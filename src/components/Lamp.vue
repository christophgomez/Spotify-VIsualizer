<template>
  <div id="LampVisual" class="dark">
    <canvas id="lampCanv"></canvas>
  </div>
</template>

<script>
import Stats from "stats.js";
window.THREE = require("three");
require("three/examples/js/loaders/OBJLoader");
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/utils/ShadowMapViewer");
require("three/examples/js/shaders/CopyShader");
require("three/examples/js/shaders/LuminosityHighPassShader");
require("three/examples/js/postprocessing/EffectComposer");
require("three/examples/js/postprocessing/RenderPass");
require("three/examples/js/postprocessing/ShaderPass");
require("three/examples/js/postprocessing/UnrealBloomPass");
import { EventBus } from "../eventbus";

export default {
  data() {
    return {
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      objMesh: THREE.Object3D,
      canvas: HTMLElement,
      sphere: {},
      clock: THREE.Clock,
      group: THREE.Object3D,
      lights: [],
      render: null,
      stats: null,
      controls: null,
      FXAAShader: {
        uniforms: {
          tDiffuse: { value: null },
          resolution: { value: new THREE.Vector2(1 / 1024, 1 / 512) }
        },
        vertexShader: `
				void main() {
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `
				uniform sampler2D tDiffuse;
	  			uniform vec2 resolution;

				#define FXAA_REDUCE_MIN   (1.0/128.0)
	  			#define FXAA_REDUCE_MUL   (1.0/8.0)
				#define FXAA_SPAN_MAX     8.0

				void main() {
					vec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;
					vec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;
					vec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;
					vec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;
					vec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );
					vec3 rgbM  = rgbaM.xyz;
					vec3 luma = vec3( 0.299, 0.587, 0.114 );

					float lumaNW = dot( rgbNW, luma );
					float lumaNE = dot( rgbNE, luma );
					float lumaSW = dot( rgbSW, luma );
					float lumaSE = dot( rgbSE, luma );
					float lumaM  = dot( rgbM,  luma );
					float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );
					float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );

					vec2 dir;
					dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
					dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

					float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );

					float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );
					dir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX), max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * resolution;
					vec4 rgbA = (1.0/2.0) * (
        			texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (1.0/3.0 - 0.5)) +
					texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (2.0/3.0 - 0.5)));
    				vec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (
					texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (0.0/3.0 - 0.5)) +
      			texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (3.0/3.0 - 0.5)));
    				float lumaB = dot(rgbB, vec4(luma, 0.0));

					if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {

						gl_FragColor = rgbA;

					} else {
						gl_FragColor = rgbB;

					}

				}`
      },
      RaysShader: {
        uniforms: {
          tDiffuse: { value: null }
        },
        vertexShader: `
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `
				uniform sampler2D tDiffuse;
    			varying vec2 vUv;

				void main() {

			 		vec4 cTextureScreen = texture2D( tDiffuse, vUv );
		    
		   		vec2 custom_glFragCoord = vUv;
		   		vec2 position = custom_glFragCoord / 2.0;
		   		vec2 temp_position = position;
		   		vec3 accumulation = vec3(0.0);
		   		int iterations = 128;
		   		float contrast = 0.8;
		   		vec2 movement = vec2(1.0);

			 		float fadefactor = 1.0/float(iterations);
		   		float multiplier = 1.4;
		   		for( int i=0; i<128; i++ ) {
		      		 vec3 texturesample = texture2D(tDiffuse,position+temp_position).xyz;
		       		accumulation += multiplier*smoothstep(0.1,1.0,texturesample*texturesample);
		       		multiplier *= 1.0-fadefactor;
		       		temp_position += ((movement*0.25)-position)/float(iterations);
		   		};

		   		accumulation /= float(iterations);

		   		vec3 color = texture2D(tDiffuse,custom_glFragCoord).rgb+(accumulation*(contrast/(1.0+dot(position,position))));

			 		gl_FragColor =  vec4( color, cTextureScreen.a );

				}`
      },
      animationRequest: null,
      active: false,
      NUM_BANDS: 256,
      bands: null
    };
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.animationRequest);
  },
  created() {
    EventBus.$on("activateLamp", () => {
      this.init();
      this.active = true;
      this.update();
    });

    EventBus.$on("deactivate", () => {
      this.active = false;
      window.cancelAnimationFrame(this.animationRequest);
    });

    EventBus.$on('bandData', (data) => {
      if(this.active)
        this.bands = data;
    })

    window.onbeforeunload = function() {
      window.cancelAnimationFrame(this.animationRequest);
    };
  },
  mounted() {},
  methods: {
    init() {
      this.stats = new Stats();
      this.stats.showPanel(0);
      this.canvas = document.getElementById("LampVisual");
      this.canvas.append(this.stats.dom);
      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.group = new THREE.Object3D();
      this.scene.add(this.group);
      this.camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        1,
        200.0
      );
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.enableDamping = true;
      this.controls.rotateSpeed = 0.08;
      this.controls.autoRotateSpeed = 0.08;
      this.controls.zoomSpeed = 2.0;
      this.controls.maxPolarAngle = Math.PI / 2.1;
      this.controls.minPolarAngle = 0.0;

      this.camera.position.set(0, 40, 20);
      this.camera.lookAt(this.scene.position);

      this.render = this.initRenderer(this.scene, this.camera);

      this.onResize();

      const lights = this.initLights(this.scene);

      const manager = new THREE.LoadingManager();

      const loader = new THREE.OBJLoader(manager);

      var addObjToScene = object => {
        this.objMesh = object;
        this.objMesh.rotation.x = Math.PI / 2;
        this.objMesh.position.y = 5;
        this.objMesh.scale.set(1, 1, 1);

        object.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xf1f1f1,
              roughness: 0.3,
              metalness: 0.7
            });
            child.geometry.computeVertexNormals();
            child.castShadow = true;
          }
        });

        var sphereGeom = new THREE.SphereBufferGeometry(1.5, 32, 32);
        var sphereMat = new THREE.MeshStandardMaterial({
          color: 0x000000,
          emissive: 0xffffff
        });

        const sphere = new THREE.Mesh(sphereGeom, sphereMat);
        sphere.position.y = 5;
        this.sphere = {
          obj: sphere, 
          band: Math.floor(this.random(this.NUM_BANDS))
        }
        //this.scene.add(sphere);
        this.scene.add(this.objMesh);
      };

      loader.load(
        "https://gitcdn.xyz/repo/prinzipiell/codepen/master/geometry/subdivisionMesh01.obj",
        addObjToScene
      );

      const floor = this.addFloor(this.scene);
    },
    update() {
      if(this.active && this.scene !== null) {
        this.onResize();

        this.stats.begin();
        this.controls.update();

        this.scene.rotation.y = Math.cos(Date.now() * 0.0001);
        this.scene.rotation.x = Math.sin(Date.now() * 0.0001);

        if(this.bands !== null && this.bands !== undefined) {
          for(var i = 0; i < this.lights.length; i++) {
            var light = this.lights[i];
            light.obj.power = (this.bands[light.band] / 256) * 50;
          }
        }

        this.render(this.scene, this.camera);
        this.stats.end();
        this.animationRequest = window.requestAnimationFrame(this.update);
      } else {
        return;
      }
    },
    initRenderer(scene, camera) {
      const canvas = document.getElementById("lampCanv");
      const width = window.innerWidth;
      const height = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        canvas: canvas,
        depth: false,
        powerPreference: "high-performance"
      });

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const renderPass = new THREE.RenderPass(scene, camera);
      const fxaaPass = new THREE.ShaderPass(this.FXAAShader);
      fxaaPass.uniforms["resolution"].value.set(1 / width, 1 / height);

      const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(width, height),
        3,
        1,
        0.75
      );

      const raysPass = new THREE.ShaderPass(this.RaysShader);

      const effectComposer = new THREE.EffectComposer(renderer);
      effectComposer.addPass(renderPass);
      effectComposer.addPass(fxaaPass);
      effectComposer.addPass(bloomPass);
      effectComposer.addPass(raysPass);

      /*window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = renderer.getPixelRatio();
        const newWidth = Math.floor(width / pixelRatio);
        const newHeight = Math.floor(height / pixelRatio);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        if (fxaaPass) {
          fxaaPass.uniforms["resolution"].value.set(
            1 / window.innerWidth,
            1 / window.innerHeight
          );
        }
        effectComposer.setSize(newWidth, newHeight);
      });*/

      const render = (scene, camera) => {
        ///effectComposer.render(scene, camera);
        renderer.render(scene, camera);
      };

      render.renderer = renderer;

      return render;
    },
    addFloor(scene) {
      const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x990033 });
      const floor = new THREE.Mesh(
        new THREE.CubeGeometry(1000, 2, 1000),
        floorMaterial
      );
      floor.position.y = 0;
      floor.receiveShadow = true;
      scene.add(floor);
    },
    initLights(scene) {
      const c = 0xffffff;
      const sphere = new THREE.SphereBufferGeometry( 0.25, 16, 8 );

      for(var i = -2; i <= 2; i++) {
        const p = new THREE.PointLight(c, 1.5, 20, 2);
        //p.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial( { color: c })));
        p.position.x = i;
        p.position.y = 9;
        p.castShadow = true;
        this.addLight(p);
        scene.add(p);
      }

      var ambientLight = new THREE.AmbientLight(0x400040, 0.7);
      //scene.add(ambientLight);

      scene.fog = new THREE.FogExp2(0x000000, 0.001);
    },
    addLight(light) {
      var light = {
        obj: light,
        band: Math.floor(this.random(this.NUM_BANDS))
      }
      this.lights.push(light);
    },
    onResize() {
      const canvas = this.render.renderer.domElement;
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      if (this.canvas.width !== width || this.canvas.height !== height) {

        // you must pass false here or three.js sadly fights the browser
        this.render.renderer.setPixelRatio(window.devicePixelRatio);
        this.render.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.controls.update();

        // set render target sizes here
      }
    },
    random(min, max=undefined) {
      if(typeof max != "number")
        max = min || 1, min = 0;

	    return min + Math.random() * (max - min);
    }
  }
};
</script>

<style scoped>
#LampVisual {
  width: 100%;
  height: 100%;
}

.dark {
  color: white;
  background: #13242f;
}

.dark::before {
  background-size: 100%;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY3g9IjUwJSIgY3k9IiIgcj0iOTUlIj48c3RvcCBvZmZzZXQ9IjIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjAiLz48c3RvcCBvZmZzZXQ9Ijk1JSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==");
  background-image: -moz-radial-gradient(
    center,
    ellipse cover,
    rgba(0, 0, 0, 0) 20%,
    #000000 95%
  );
  background-image: -webkit-radial-gradient(
    center,
    ellipse cover,
    rgba(0, 0, 0, 0) 20%,
    #000000 95%
  );
  background-image: radial-gradient(
    ellipse cover at center,
    rgba(0, 0, 0, 0) 20%,
    #000000 95%
  );
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

#lampCanv {
  height: 100vh;
  width: 100vw;
  display: block;
}
</style>
