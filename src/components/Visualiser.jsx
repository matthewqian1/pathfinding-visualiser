import { Component } from "react";
import Node from "./Node";
import './Visualiser.css';

export default class Visualiser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
        };
    }

    componentDidMount() {
        const nodes = [];
        for (let row = 0; row < 10; row++) {
        const currentRow = [];
        for (let col = 0; col < 10; col++) {
            const node = {
                col,
                row,
                isStart: row === 0 && col === 0,
                isFinish: row === 9 && col === 9
            }
            currentRow.push(node);
        }
        nodes.push(currentRow);
        this.setState({nodes});
    }
    }

    render() {
        const {nodes} = this.state;
        console.log(nodes);

        return (
            <div className="grid">
                {nodes.map((row, rowIdx) => {
                    return <div key={rowIdx}> 
                        {row.map((node, nodeIdx) =>    
                        { 
                            const {isStart, isFinish} = node;
                            return (<Node 
                            isStart={isStart}
                            isFinish={isFinish}
                            ></Node>)})}
                    
                    </div>

                })}

            </div>
        )
    }
}