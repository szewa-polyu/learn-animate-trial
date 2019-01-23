import React, { Component } from 'react';
import * as THREE from 'three';

import * as dat from 'dat.gui';

import Ocean from 'pages/WaterSurfacePage/js/Ocean';
import OrbitControls from 'pages/WaterSurfacePage/js/controls/OrbitControls';

import './WaterSurfacePage.css';


// https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean2.html
class WaterSurfacePage extends Component {
    constructor(props) {
        super(props);

        // ref
        this.mount = null;
        this.setMountRef = (mount) => { this.mount = mount; };

        // constants
        this.types = {
            'float': 'half-float',
            'half-float': 'float'
        };

        // Three.js stuff
        this.hash = document.location.hash.substr(1);
        if (!(this.hash in this.types)) {
            this.hash = 'half-float';
        }

        this.lastTime = (new Date()).getTime();

        this.ms_Renderer = null;
        this.ms_Camera = null;
        this.ms_Scene = null;
        this.ms_Controls = null;
        this.ms_Ocean = null;

        this.frameId = null;
    }

    componentDidMount() {
        this.init();
        this.resizeAccordingToMount();
        window.addEventListener('resize', this.handleWindowResize);
        this.start();
    }

    componentWillUnmount() {
        this.stop();
        window.removeEventListener('resize', this.handleWindowResize);
        this.mount.removeChild(this.ms_Renderer.domElement);        
    }

    changeType = (n) => {
        document.location.hash = n;
        document.location.reload();
        return false;
    }

    init = () => {
        // renderer
        this.ms_Renderer = new THREE.WebGLRenderer();
        this.ms_Renderer.setPixelRatio(window.devicePixelRatio);
        this.ms_Renderer.context.getExtension('OES_texture_float');
        this.ms_Renderer.context.getExtension('OES_texture_float_linear');
        this.mount.appendChild(this.ms_Renderer.domElement);

        // scene
        this.ms_Scene = new THREE.Scene();
        this.ms_Camera = new THREE.PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 300000);
        //this.ms_Camera.position.set(450, 350, 450);
        this.ms_Camera.position.set(0, 0, 500);
        this.ms_Camera.lookAt(0, 0, 0);

        // Initialize Orbit control
        this.ms_Controls = new OrbitControls(this.ms_Camera, this.ms_Renderer.domElement);
        this.ms_Controls.userPan = false;
        this.ms_Controls.userPanSpeed = 0.0;
        this.ms_Controls.minDistance = 0;
        this.ms_Controls.maxDistance = 2000.0;
        this.ms_Controls.minPolarAngle = 0;
        this.ms_Controls.maxPolarAngle = Math.PI * 0.495;
        let gsize = 512;
        let res = 1024;
        let gres = res / 2;
        let origx = - gsize / 2;
        let origz = - gsize / 2;
        this.ms_Ocean = new Ocean(this.ms_Renderer, this.ms_Camera, this.ms_Scene,        
            {
                USE_HALF_FLOAT: this.hash === 'half-float',
                INITIAL_SIZE: 256.0,
                INITIAL_WIND: [10.0, 10.0],
                INITIAL_CHOPPINESS: 1.5,
                CLEAR_COLOR: [1.0, 1.0, 1.0, 0.0],
                GEOMETRY_ORIGIN: [origx, origz],
                SUN_DIRECTION: [- 1.0, 1.0, 1.0],
                OCEAN_COLOR: new THREE.Vector3(0.004, 0.016, 0.047),
                SKY_COLOR: new THREE.Vector3(3.2, 9.6, 12.8),
                EXPOSURE: 0.35,
                GEOMETRY_RESOLUTION: gres,
                GEOMETRY_SIZE: gsize,
                RESOLUTION: res
            });
        this.ms_Ocean.materialOcean.uniforms.u_projectionMatrix = { value: this.ms_Camera.projectionMatrix };
        this.ms_Ocean.materialOcean.uniforms.u_viewMatrix = { value: this.ms_Camera.matrixWorldInverse };
        this.ms_Ocean.materialOcean.uniforms.u_cameraPosition = { value: this.ms_Camera.position };
        this.ms_Scene.add(this.ms_Ocean.oceanMesh);
        const gui = new dat.GUI();
        gui.add(this.ms_Ocean, "size", 100, 5000).onChange(function (v) {
            this.object.size = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "choppiness", 0.1, 4).onChange(function (v) {
            this.object.choppiness = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "windX", - 15, 15).onChange(function (v) {
            this.object.windX = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "windY", - 15, 15).onChange(function (v) {
            this.object.windY = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "sunDirectionX", - 1.0, 1.0).onChange(function (v) {
            this.object.sunDirectionX = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "sunDirectionY", - 1.0, 1.0).onChange(function (v) {
            this.object.sunDirectionY = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "sunDirectionZ", - 1.0, 1.0).onChange(function (v) {
            this.object.sunDirectionZ = v;
            this.object.changed = true;
        });
        gui.add(this.ms_Ocean, "exposure", 0.0, 0.5).onChange(function (v) {
            this.object.exposure = v;
            this.object.changed = true;
        });
    };

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    };

    stop = () => {
        cancelAnimationFrame(this.frameId);
    };   

    animate = () => {  
        let currentTime = new Date().getTime();
        this.ms_Ocean.deltaTime = (currentTime - this.lastTime) / 1000 || 0.0;        
        this.lastTime = currentTime;
        this.ms_Ocean.render(this.ms_Ocean.deltaTime);
        this.ms_Ocean.overrideMaterial = this.ms_Ocean.materialOcean;
        if (this.ms_Ocean.changed) {
            this.ms_Ocean.materialOcean.uniforms.u_size.value = this.ms_Ocean.size;
            this.ms_Ocean.materialOcean.uniforms.u_sunDirection.value.set(this.ms_Ocean.sunDirectionX, this.ms_Ocean.sunDirectionY, this.ms_Ocean.sunDirectionZ);
            this.ms_Ocean.materialOcean.uniforms.u_exposure.value = this.ms_Ocean.exposure;
            this.ms_Ocean.changed = false;
        }
        this.ms_Ocean.materialOcean.uniforms.u_normalMap.value = this.ms_Ocean.normalMapFramebuffer.texture;
        this.ms_Ocean.materialOcean.uniforms.u_displacementMap.value = this.ms_Ocean.displacementMapFramebuffer.texture;
        this.ms_Ocean.materialOcean.uniforms.u_projectionMatrix.value = this.ms_Camera.projectionMatrix;
        this.ms_Ocean.materialOcean.uniforms.u_viewMatrix.value = this.ms_Camera.matrixWorldInverse;
        this.ms_Ocean.materialOcean.uniforms.u_cameraPosition.value = this.ms_Camera.position;
        this.ms_Ocean.materialOcean.depthTest = true;
        //this.ms_Scene.__lights[1].position.x = this.ms_Scene.__lights[1].position.x + 0.01;
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    };

    renderScene = () => {
        this.ms_Renderer.render(this.ms_Scene, this.ms_Camera);
    };

    resize = (inWidth, inHeight) => {
        this.ms_Camera.aspect = inWidth / inHeight;
        this.ms_Camera.updateProjectionMatrix();
        this.ms_Renderer.setSize(inWidth, inHeight);
        this.renderScene();
    };

    resizeAccordingToMount = () => {
        this.resize(this.mount.clientWidth, this.mount.clientHeight);
    }

    /* event handlers */
    
    handleWindowResize = () => {
        this.resizeAccordingToMount();
    };

    /* end of event handlers */

    render() {
        return (
            <div>
                <div id="info">
                    <a href="http://threejs.org" target="_blank" rel="noopener">
                        three.js
                    </a> - webgl ocean simulation
                    <br />
                    current simulation framebuffers type is <span>{this.hash}</span>
                    <br />                    
                    change type to <span>
                        {
                            this.hash && 
                            <a 
                                href="#"
                                onClick={() => { return this.changeType(this.types[this.hash]); }}
                            >
                                {this.types[this.hash]}
                            </a>
                        }          
                    </span>
                </div>
                <div
                    style={{ width: '1000px', height: '1000px' }}
                    ref={(mount) => { this.mount = mount }}
                />
            </div >
        );
    }
}

export default WaterSurfacePage;
