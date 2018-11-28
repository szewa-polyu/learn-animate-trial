import React, { Component } from 'react';

import './WavePage.css';


class WavePage extends Component {
    constructor(props) {
        super(props);
        
        this.canvasRef = React.createRef();

        this.animationFrameHandle = null;

        this.draw = this.draw.bind(this);
        this.undraw = this.undraw.bind(this);
        this.calculateWaveDisplacement = this.calculateWaveDisplacement.bind(this);
        this.drawWaveParticle = this.drawWaveParticle.bind(this);

        this.spatialFreq = 10;
        this.temporalFreq = 1;
        this.numberOfPoints = 200;
        this.amplitudeMultiplier = 0.5;
        this.wavingFunc = Math.sin;
        this.waveMoveDirection = 1;  // plus / minus 1
        this.waveParticleSize = 5;
        this.timeStampMultiplier = 0.001;
    }

    componentDidMount() {
        this.draw(0);
    }

    componentWillUnmount() {
        this.undraw();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#Notes
    draw(timeStamp) {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
                
        for (let i = 0; i < this.numberOfPoints; i++) {
            const x = i / this.numberOfPoints;
            const y = this.calculateWaveDisplacement(x, timeStamp * this.timeStampMultiplier);    
            
            this.drawWaveParticle(ctx, canvas.width * x, canvas.height * 0.5 + canvas.height * y, this.waveParticleSize);
        }
        
        this.animationFrameHandle = requestAnimationFrame(this.draw);                
    }

    undraw() {
        cancelAnimationFrame(this.animationFrameHandle);
    }

    calculateWaveDisplacement(x, t) {
        return this.amplitudeMultiplier * this.wavingFunc(this.spatialFreq * x + this.waveMoveDirection * this.temporalFreq * t);
    }
    
    drawWaveParticle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke(); 
    }
    
    render() {        
        return (
            <div>            
                <canvas height={500} width={1000} ref={this.canvasRef} />
            </div>
        );
    }
}

export default WavePage;