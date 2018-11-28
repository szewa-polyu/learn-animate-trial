import React, { Component } from 'react';

import './HowToJsHtmlAnimationPage.css';


// https://www.w3schools.com/howto/howto_js_animate.asp
class HowToJsHtmlAnimationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animationPos: 0,
        };

        this.step = this.step.bind(this);

        this.lastTimeStamp = 0;
        this.animationRunInterval = 50;
        this.animationStopPos = 350;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame#Notes
    step(timeStamp = 0) {
        // stopping case  
        if (this.state.animationPos === this.animationStopPos) {

        } else {
            if (timeStamp - this.lastTimeStamp > this.animationRunInterval) {
                this.setState((prevState) => {
                    const newAnimationPos = prevState.animationPos + 1;
                    return {
                        animationPos: newAnimationPos
                    };
                });            
                this.lastTimeStamp = timeStamp;
            }
                   
            requestAnimationFrame(this.step);
        }        
    }

    render() {
        const animationPos = this.state.animationPos;
        const myAnimationStyle = {
            top: animationPos,
            left: animationPos
        };
        return (
            <div>
                <h1>My First JavaScript Animation</h1>
                <button onClick={this.step}>Click me!</button>
                <div id="myContainer">
                    <div id="myAnimation" style={myAnimationStyle}>
                        My animation will go here
                    </div>
                </div>
            </div>
        );
    }
}

export default HowToJsHtmlAnimationPage;