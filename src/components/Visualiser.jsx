import { Component } from "react";
import Node from "./Node";
import PriorityQueue from "./PriorityQueue";
import './Visualiser.css';

export default class Visualiser extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            numRows: 10,
            numCols: 10,
            start: [0, 0],
            finish: [9, 9]
        };
    }

    componentDidMount() {
        const nodes = [];
        const {numRows, numCols, start, finish} = this.state;
        for (let row = 0; row < numRows; row++) {
        const currentRow = [];
        for (let col = 0; col < numCols; col++) {
            const node = {
                col,
                row,
                isStart: row === start[0] && col === start[1],
                isFinish: row === finish[0] && col === finish[1],
                isVisited: false,
                distance: Infinity,
                parent: null,
                shortestPath: false
            }
            node.distance = node.isStart ? 0 : Infinity;

            currentRow.push(node);
        }
        nodes.push(currentRow);
        this.setState({nodes});
        }
    }
    

    djikstras = async(state) => {
        const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
        const {start, finish, nodes} = state;
        var queue = new PriorityQueue();
    
        queue.enqueue([nodes[start[0]][start[1]], 0]);
        while (!queue.isEmpty()) {
            await delay(10);
            this.setState({nodes});
            const currentNode = queue.dequeue();
            if (currentNode.isVisited) {
                continue;
            }
            currentNode.isVisited = true;
            const dist = currentNode.distance + 1;
            for (const neighbour of this.getNeigbours(currentNode, nodes)) {
                if (dist < neighbour.distance) {
                    neighbour.parent = currentNode;
                    neighbour.distance = dist;
                }
                queue.enqueue([neighbour, neighbour.distance]);
            }

            
        }
        console.log('done djikstras');
        this.buildPath(nodes[finish[0]][finish[1]], nodes);
        console.log('done build path');
        console.log(nodes);
        
    }

    buildPath = async(finishNode, nodes) => {
        const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
        var currentNode = finishNode;

        while (currentNode !== null) {
            await delay(20);
            this.setState({nodes});
            currentNode.shortestPath = true;
            currentNode = currentNode.parent;
        }
    }

    getNeigbours(currentNode, nodes) {
        let x = currentNode.row;
        let y = currentNode.col;
        const combos = [[x+1, y],[x-1, y], [x,y+1], [x,y-1]];
        const neighbours = [];
        for (const combo of combos) {
            if (this.inBounds(combo[0], combo[1])) {
                const node = nodes[combo[0]][combo[1]];
                if (!node.isVisited) {
                    neighbours.push(node);
                }
                
            }
        }
        return neighbours;
        
    }

    inBounds(x, y) {
        const {numRows, numCols} = this.state;
        if (x >= 0 && x < numRows && y >= 0 && y < numCols) {
            return true;
        }
        return false;
    }




    

    render() {
        const {nodes} = this.state;
        return (
            <div>
                <button onClick={() => this.djikstras(this.state)}>Start</button>
                <button onClick={() => this.componentDidMount()}>Reset</button>
            <div className="grid">
                {nodes.map((row, rowIdx) => {
                    return <div key={rowIdx}> 
                        {row.map((node, nodeIdx) =>    
                        { 
                            const {isStart, isFinish, isVisited, shortestPath} = node;
                            return (<Node onClick = {() => console.log('hello')}
                            isStart={isStart}
                            isFinish={isFinish}
                            isVisited={isVisited}
                            shortestPath={shortestPath}
                            ></Node>)})}
                    
                    </div>

                })}

            </div>
            </div>
        )
    }
}