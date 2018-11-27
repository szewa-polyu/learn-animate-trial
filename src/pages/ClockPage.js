import React, { Component } from 'react';

import './ClockPage.css';


function UpperCresentMoon(props) {        
    const clockFrameStyle = {
        width: props.outerSize,
        height: props.outerSize,
        backgroundColor: 'brown'
    };
    const clockBodyStyle = {
        width: props.innerSize,
        height: props.innerSize,
        backgroundColor: 'white'
    };
    return (
        <div>
            <div className='circle' style={clockFrameStyle}>                 
                <div className='circle' style={clockBodyStyle} />
            </div>
        </div>
    );
}

function LowerCresentMoon(props) {    
    const clockFrameStyle = {
        width: props.outerSize,
        height: props.outerSize,
        position: 'relative',
        backgroundColor: 'brown'
    };
    const clockBodyStyle = {
        width: props.innerSize,
        height: props.innerSize,
        backgroundColor: 'white',
        position: 'absolute',
        top: '25%',
        left: '25%'
    };
    return (
        <div>
            <div className='circle' style={clockFrameStyle}>                 
                <div className='circle' style={clockBodyStyle} />
            </div>
        </div>
    );
}

class Clock extends Component {    
    render() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        console.log(`hours: ${hours}`);
        console.log(`minutes: ${minutes}`);
        console.log(`seconds: ${seconds}`);

        const angleToRotateForHourHand = 360 * (hours % 12) / 12 + (minutes / 60) * (360 / 12);
        const angleToRotateForMinuteHand = 360 * minutes / 60;
        const angleToRotateForSecondHand = 360 * seconds / 60;

        const props = this.props;
        const halfInnerSize = props.innerSize * 0.5;
        const clockFrameStyle = {
            width: props.outerSize,
            height: props.outerSize            
        };
        const clockBodyStyle = {
            width: props.innerSize,
            height: props.innerSize        
        };
        const hourHandStyle = {
            width: 0.3 * halfInnerSize,
            height: 0.7 * halfInnerSize,
            transform: `translate(-50%) rotate(${angleToRotateForHourHand}DEG)`
        };
        const minuteHandStyle = {
            width: 0.2 * halfInnerSize,
            height: 0.8 * halfInnerSize,
            transform: `translate(-50%) rotate(${angleToRotateForMinuteHand}DEG)`
        };
        const secondHandStyle = {
            width: 0.1 * halfInnerSize,
            height: 0.9 * halfInnerSize,
            transform: `translate(-50%) rotate(${angleToRotateForSecondHand}DEG)`
        };
        return (
            <div>
                <div className='circle clock-frame' style={clockFrameStyle}>                 
                    <div className='circle clock-body' style={clockBodyStyle} />
                    <div className='clock-hands-container'>
                        <div className='clock-hand hour-hand' style={hourHandStyle} />
                        <div className='clock-hand minute-hand' style={minuteHandStyle} />
                        <div className='clock-hand second-hand' style={secondHandStyle} />
                    </div>
                </div>
            </div>
        );
    }
}

class ClockPage extends Component {    
    render() {        
        return (
            <div style={
                {
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    height: '100%'
                }
            }>
                <UpperCresentMoon outerSize={100} innerSize={80} />
                <LowerCresentMoon outerSize={100} innerSize={80} />
                <Clock outerSize={100} innerSize={80} />
            </div>
        );
    }
}

export default ClockPage;