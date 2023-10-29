import { Component } from "react";
import Node from "./Node";
import NodeLegend from "./NodeLegend";
import PriorityQueue from "./PriorityQueue";
import './Visualiser.css';

export default class Visualiser extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            numRows: 25,
            numCols: 40,
            start: [],
            finish: [],
            addBlockMode: false,
            addBlockLive: false,
            algorithmInProgress: false,
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
        this.setState({algorithmInProgress: true});
        var queue = new PriorityQueue();
    
        queue.enqueue([nodes[start[0]][start[1]], 0]);
        while (!queue.isEmpty()) {
            await delay(1);
            this.setState({nodes});
            const currentNode = queue.dequeue();
            if (currentNode.isVisited || currentNode.isBlock ) {
                continue;
            }

            if (currentNode.isFinish) {
                break;
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
        this.setState({algorithmInProgress: false});

        
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
            if (start[0] === x && start[1] === y) {
                return;
            }
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

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    generateRandomMaze() {
        var {numRows, numCols, nodes} = this.state;
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let node = nodes[i][j];
                if (node.isStart || node.isFinish) {
                    continue;
                }
                if (this.getRandomInt(4) === 1) {
                    node.isBlock = true;
                    nodes[i][j] = node;
                }
            }
        }
        this.setState({nodes});
    }

    generateUserPrompt(start, finish, addBlockMode, algorithmInProgress) {
        if (start.length === 0 || finish.length === 0) {
            return '**Please assign a start and finish node by clicking on a node on the grid';
        }

        if (addBlockMode) {
            return '**Add block mode on - clicking/dragging on the grid will convert nodes to a block';
        }

        if (algorithmInProgress) {
            return '**Algorithm visualisation in progress';    
        }

        return '';
    }

    render() {
        const {nodes, start, finish, addBlockMode, algorithmInProgress} = this.state;
        let blockButton =  addBlockMode ? "blockButtonOn" : "blockButtonOff";
        let prompt = this.generateUserPrompt(start, finish, addBlockMode, algorithmInProgress);
        return (
            <div>
                <div className="controlBar">
                <div className="title">Pathfinding Visualiser</div>
                <button className="startButton" onClick={() => this.djikstras(this.state)} disabled={algorithmInProgress || start.length === 0 || finish.length === 0}>Start</button>
                <button onClick={() => this.reset()} disabled={algorithmInProgress}>Reset</button>
                <button className={blockButton} onClick={() => this.toggleBlockButton()} disabled={algorithmInProgress || start.length === 0 || finish.length === 0}>Add Blocks</button>
                <button onClick={() => this.generateRandomMaze()} disabled={algorithmInProgress || start.length === 0 || finish.length === 0}>Generate Random Maze</button>
            </div>
            <NodeLegend></NodeLegend>
            <div className="prompt">{prompt}</div>
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