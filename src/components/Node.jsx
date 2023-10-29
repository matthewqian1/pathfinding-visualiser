import './Node.css';
import { Component } from "react";

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {isBlock, isStart, isFinish, isVisited, shortestPath} = this.props;
        const extraClassName = isBlock ? 'node-block' : isFinish ? 'node-finish': isStart ? 'node-start': shortestPath ? 'node-shortest-path' : isVisited ? 'node-visited' : '';
        const classes = `node ${extraClassName}`;
        return <div className={classes}></div>
    }
}
