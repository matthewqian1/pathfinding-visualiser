import './Node.css';
import { Component } from "react";

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {isStart, isFinish} = this.props;
        const extraClassName = isFinish ? 'node-finish': isStart ? 'node-start': '';
        const classes = `node ${extraClassName}`
        return <div className={classes}></div>
    }
}
