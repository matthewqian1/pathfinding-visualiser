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
            currentRow.push([]);
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
                    return <div> 
                        {row.map((node, nodeIdx) => <Node></Node>)}
                    </div>

                })}

            </div>
        )
    }
}