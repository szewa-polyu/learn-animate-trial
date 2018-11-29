import React, { Component } from 'react';
import paper, { Point } from 'paper';

import Ball from 'containers/paperJsCandyCrush/ball';

import { getAbsoluteUrlFromRelativeUrl } from 'utils/setStaticResourcesPath';
import { getRandomArbitrary, getRandomIntInclusive } from 'utils/math/random';

import './PaperJsCandyCrushPage.css';


// http://paperjs.org/examples/candy-crash/
class PaperJsCandyCrushPage extends Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();

        this.balls = [];

        //this.numBalls = 1;
        this.numBalls = 18;
        this.ballImgUrl = getAbsoluteUrlFromRelativeUrl('images/wsd_mascot.png');

        this.registerPaper = this.registerPaper.bind(this);
        this.deregisterPaper = this.deregisterPaper.bind(this);
        this.initiateBalls = this.initiateBalls.bind(this);

        this.handleFrame = this.handleFrame.bind(this);
    }

    componentDidMount() {        
        this.registerPaper();        
    }

    componentWillUnmount() {
        this.deregisterPaper();
    }

    registerPaper() {
        const canvas = this.canvasRef.current;
        paper.setup(canvas);

        this.initiateBalls(paper.view);

        paper.view.onFrame = this.handleFrame;
    }

    deregisterPaper() {
        paper.view.onFrame = null;
    }

    /* event handlers */

    initiateBalls(view) {
        const balls = this.balls;
        for (let i = 0; i < this.numBalls; i++) {
            const randomPosition = Point.random();            
            const position = new Point({
               x: randomPosition.x * view.size.width,
               y: randomPosition.y * view.size.height
            });
                        
            // Important
            // initial speed
            // const initialSpeed = getRandomArbitrary(0, 10);
            const initialSpeed = getRandomArbitrary(0, 10);
            const vector = new Point({
                angle: getRandomArbitrary(0, 360),
                length: initialSpeed
            });            
            const radius = getRandomArbitrary(60, 120);
            const angularSpeed = getRandomArbitrary(-0.01, 0.01);
            const sizeChangePeriod = getRandomIntInclusive(50, 100);
            balls.push(new Ball(radius, position, vector, angularSpeed, sizeChangePeriod, this.ballImgUrl));
        }
    }

    /* end of event handlers */

    handleFrame(event) {
        const balls = this.balls;
        for (let i = 0; i < balls.length - 1; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                balls[i].react(balls[j]);
            }
        }
        for (let i = 0, l = balls.length; i < l; i++) {
            balls[i].iterate();
        }
    }

    render() {        
        return (
            <div id="myCanvasContainer">
                <canvas id="myCanvas" ref={this.canvasRef} />
            </div>
        );
    }
}

export default PaperJsCandyCrushPage;