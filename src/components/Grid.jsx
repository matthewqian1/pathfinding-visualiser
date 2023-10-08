import { Component } from 'react';
import './Grid.css'
import Node from './Node';

function Grid () {
    const GRID_ROW_LENGTH = 10;
    const GRID_COL_LENGTH = 10;
    const grid = [];
    for (let row = 0; row < GRID_ROW_LENGTH; row++) {
        const currentRow = [];
        for (let col = 0; col < GRID_COL_LENGTH; col++) {
            currentRow.push(new Node());
        }
        grid.push(currentRow);
    }
    return <div className="grid">
    {grid.map((row, rowId) => {
      return (
        <div key={rowId}>
          {row.map((node, nodeId) => {
            return (
              <Node></Node>
            );
        })}
        </div>)
    })}
    </div>
}

export default Grid;