import React, { Component } from 'react';
import AFRAME from 'aframe';
import 'aframe-gif-shader';


class AFrameWaterTankPage extends Component {
    componentDidMount() {
        AFRAME.registerComponent('wireframe', {
            dependencies: ['material'],
            init: function () {
                this.el.components.material.material.wireframe = true;
            }
        });
    }

    render() {
        return (
            <a-scene>
                <a-entity position="3 1.5 5" rotation="0 45 0">
                    <a-camera></a-camera>
                </a-entity>
                {/* <a-box                   
                    position="0 0.3 0"
                    rotation="0 0 0"                    
                    depth="2"
                    height="2"
                    width="2"
                    material="shader:gif;src:url(https://media1.giphy.com/media/JXHhI4o9NCf8k/giphy.gif?cid=3640f6095c5155c139712f5377ec1339);opacity:.1"
                >
                </a-box> */}
                
                {/* <a-box                   
                    position="0 0.7 0"
                    rotation="0 0 0"                    
                    depth="2"
                    height="2"
                    width="2"
                    material="shader:gif;src:url(https://media1.giphy.com/media/JXHhI4o9NCf8k/giphy.gif?cid=3640f6095c5155c139712f5377ec1339);color:yellow;opacity:.2"
                >
                </a-box> */}

                <a-plane position="0 1.3 0" rotation="-90 0 0" width="2" height="2" 
                    material="shader:gif;side:double;src:url(https://media1.giphy.com/media/JXHhI4o9NCf8k/giphy.gif?cid=3640f6095c5155c139712f5377ec1339);transparent:true;opacity:.5;"
                ></a-plane>
               
                <a-plane position="0 1.9 0" rotation="-90 0 0" width="2" height="2" 
                    material="shader:gif;side:double;src:url(https://media1.giphy.com/media/JXHhI4o9NCf8k/giphy.gif?cid=3640f6095c5155c139712f5377ec1339);transparent:true;color:yellow;opacity:.5;"
                ></a-plane>

                <a-box                   
                    position="0 1.3 0"
                    rotation="0 0 0"                    
                    depth="2"
                    height="2"
                    width="2"
                    color="lightblue"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWMFz1eQ3xeEKz0AI7CT_CeffVozOZwqjCXnAQJPSi5RNsjXZmIA"
                    material="opacity:.4"
                >
                </a-box>

                {/* <a-entity
                    geometry="primitive: box; width: 2; height: 2; depth: 2"
                    position="0 1 0"
                    rotation="0 0 0"
                    material="color: black"                    
                    wireframe
                >
                </a-entity> */}
                
                {/* <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
                <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder> */}
                <a-plane position="0 0 0" rotation="-90 0 0" width="10" height="10" color="#7BC8A4"></a-plane>
                <a-sky color="#ECECEC"></a-sky>
            </a-scene>        
        );
    }
}

export default AFrameWaterTankPage;
