import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import asyncLoadingComponent from 'components/loading/AsyncLoadingComponent';

import routes from 'globals/routes';

import './Main.css';


const AsynchHowToJsHtmlAnimationPage = asyncLoadingComponent(() => import('pages/HowToJsHtmlAnimationPage'));
const AsyncClockPage = asyncLoadingComponent(() => import('pages/ClockPage'));
const AsyncWavePage = asyncLoadingComponent(() => import('pages/WavePage'));
const AsyncPaperJsCandyCrushPage = asyncLoadingComponent(() => import('pages/PaperJsCandyCrushPage'));
const AsyncWaterSurfacePage = asyncLoadingComponent(() => import('pages/WaterSurfacePage'));
const AsyncThreeScenePage = asyncLoadingComponent(() => import('pages/ThreeScenePage'));


class Main extends Component {
    render() {
        return (
            <main id="main">
                <Switch>
                    <Route exact path={routes.howToJsHtmlAnimation} component={AsynchHowToJsHtmlAnimationPage} />
                    <Route exact path={routes.clock} component={AsyncClockPage} />
                    <Route exact path={routes.wave} component={AsyncWavePage} />
                    <Route exact path={routes.paperJsCandyCrush} component={AsyncPaperJsCandyCrushPage} />
                    <Route exact path={routes.waterSurface} component={AsyncWaterSurfacePage} />
                    <Route exact path={routes.threeScene} component={AsyncThreeScenePage} />
                    <Route component={AsynchHowToJsHtmlAnimationPage} />
                </Switch>
            </main>
        );
    }
}

export default Main;