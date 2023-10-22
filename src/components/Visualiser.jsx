import { Component } from "react";
import Node from "./Node";
import PriorityQueue from "./PriorityQueue";
import './Visualiser.css';

export default class Visualiser extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            numRows: 20,
            numCols: 30,
            start: [],
            finish: [],
            addBlockMode: false,
            addBlockLive: false
        };
    }

    componentDidMount() {
        this.setBoard();
    }

    reset() {
        const start = [];
        const finish = [];
        this.setState({start, finish});
        this.setBoard();
    }

    setBoard() {
        const nodes = [];
        const {numRows, numCols} = this.state;
        for (let row = 0; row < numRows; row++) {
        const currentRow = [];
        for (let col = 0; col < numCols; col++) {
            const node = {
                col,
                row,
                isStart: false,
                isFinish: false,
                isVisited: false,
                distance: Infinity,
                parent: null,
                shortestPath: false,
                isBlock: false
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
            if (currentNode.isVisited || currentNode.isBlock || currentNode.isFinish) {
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

    setPathStartFinish(x, y) {
        var {start, finish, nodes} = this.state;
        if (start.length === 2 && finish.length === 2) {
            return;
        }
        let node = nodes[x][y];
        if (node.isBlock) {
            return;
        }
        if (start.length !== 2) {
            start = [x, y];
            node.isStart = true;
            node.distance = 0;
            console.log(`start has been set to [${start[0]}][${start[1]}]`);
        } else if (finish.length !== 2) {
            finish = [x, y];
            node.isFinish = true;
            console.log(`finish has been set to [${finish[0]}][${finish[1]}]`);
        }
        nodes[x][y] = node;
        this.setState({start, finish, nodes});
    }

    toggleBlockButton() {
        this.setState({addBlockMode: !this.state.addBlockMode})
    }

    addBlockLive(x, y) {
        var {addBlockMode} = this.state;
        if (!addBlockMode) {
            return;
        }
        this.setState({addBlockLive: true});
        this.convertToBlock(x, y);
    }
    
    convertToBlock(x, y) {
        var {addBlockLive, nodes} = this.state;
        if (!addBlockLive) {
            return;
        }
        let node = nodes[x][y];
        node.isBlock = true;
        this.setState({nodes});
    }

    render() {
        const {nodes, addBlockMode} = this.state;
        let blockButton =  addBlockMode ? "blockButtonOn" : "blockButtonOff";
        return (
            <div>
                <button onClick={() => this.djikstras(this.state)}>Start</button>
                <button onClick={() => this.reset()}>Reset</button>
                <button className={blockButton} onClick={() => this.toggleBlockButton()}>Add Blocks</button>
            <div className="grid">
                {nodes.map((row, rowIdx) => {
                    return <div key={rowIdx}> 
                        {row.map((node, nodeIdx) =>    
                        { 
                            const {isStart, isFinish, isVisited, shortestPath, isBlock} = node;
                            return (
                                <span 
                                onClick={() => this.setPathStartFinish(rowIdx, nodeIdx)} 
                                onMouseDown={() => this.addBlockLive(rowIdx, nodeIdx)} 
                                onMouseOver={() => this.convertToBlock(rowIdx, nodeIdx)} 
                                onMouseUp={() => this.setState({addBlockLive: false})}>
                                    <Node
                                    isBlock={isBlock}
                                    isStart={isStart}
                                    isFinish={isFinish}
                                    isVisited={isVisited}
                                    shortestPath={shortestPath}
                                    ></Node>
                                </span>
                            )
                        }
                        )
                        }
                    
                    </div>

                })}

            </div>
            </div>
        )
    }
}