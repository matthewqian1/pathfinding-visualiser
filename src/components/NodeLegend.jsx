import './NodeLegend.css';
import { Component } from "react";
import Node from './Node';

export default class NodeLegend extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getSingleLegend(name, isStart, isFinish, isBlock, isVisited) {
        const node = <Node
        isBlock={isBlock}
        isStart={isStart}
        isFinish={isFinish}
        isVisited={isVisited}
        shortestPath={false}
        ></Node>
        return <div className='legendComponent'>
            <div>{name}</div>
            {node}
        </div>
    }

    render() {

        return <div className='legend'>
            {this.getSingleLegend('Start', true, false, false, false)}
            {this.getSingleLegend('End', false, true, false, false)}
            {this.getSingleLegend('Block', false, false, true, false)}
            {this.getSingleLegend('Visited', false, false, false, true)}
            {this.getSingleLegend('Unvisited', false, false, false, false)}
        </div>
    }
}
