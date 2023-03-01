import Node from './utils/Node';
import _ from 'lodash';
import { useState, useEffect } from 'react';


export default function Home() {
  const [randomInt, setRandomInt] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        handleClick(event);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  };

  const buildTree = (arr) => {
    if (arr.length === 0) return null;
    const sortArr = _.sortBy(arr);
    const r = (subArr, node) => {
      if (subArr.length === 1) {
        const newNode = new Node(subArr[0]);
        return newNode.setParent(node);
      } 
      else if (subArr.length === 2) {
        const newNode = new Node(subArr[0]);
        newNode.setParent(node);
        return newNode.setRight(r([subArr[1]], newNode));
      } 
      else {
        const newNodeIndex = Math.ceil(subArr.length/2)-1;
        const newNode = new Node(subArr[newNodeIndex]);
        newNode.setParent(node);
        newNode.setLeft(r([...subArr].slice(0, newNodeIndex), newNode));
        return newNode.setRight(r([...subArr].slice(newNodeIndex+1), newNode));
      }
    }

    return r(sortArr, null);
  };

  const getLevelFromNodesLength = (length) => {
    const BINARY = 2;
    let result = 1;
    if (length > 1) {
      let i = 1;
      while (Math.pow(BINARY, i) <= length) {
        i+=1;
        result = i;
      }
    }
    return result;
  }

  const handleClick = (e) => {
    e.preventDefault();
    const MIN = -100;
    const MAX = 101;
    const rand = getRandomInt(MIN, MAX);
    setRandomInt((prevRendInt) => rand);
    setNumbers((prevNumbers) => {
      const tree = buildTree([...prevNumbers, rand]);
      const newNodes = tree.getNodes();
      setNodes((prevNodes) => newNodes);
      const newLevel = getLevelFromNodesLength(newNodes.length);
      setLevel((prevLevel) => newLevel);  
      return [...prevNumbers, rand];
    });
  }

  return (
    <div className='container' id='container'>
      <h1>Binary search tree</h1>
      <div className='header' onClick={handleClick}>  
        <button>Click here to add random number <span>{randomInt ? randomInt : '-'}</span></button>
      </div>
      <div className='block'>        
        <div className='grid' style={{
            gridTemplateColumns: `repeat(${Math.pow(2, level-1)}, auto)`,
            gridTemplateRows: `repeat(${level}, auto)`,
        }}>
        
          {nodes.map((item, i) => {

            const currentLevel = getLevelFromNodesLength(i+1);
            const spanIndex = Math.pow(2, level-currentLevel);
            return _.isNil(item.value) ? (<div key={i}></div>) : (
              <div key={i} className='number' style={{ 
                gridColumn: `span ${spanIndex}`,
              }}><p>{item.value}</p></div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
