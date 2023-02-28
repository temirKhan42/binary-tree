import _ from "lodash";

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.direction = [];
  };

  setLeft(node) {
    this.left = node;
    return this;
  };

  setRight(node) {
    this.right = node;
    return this;
  };

  setParent(node) {
    this.parent = node;
    return this;
  };

  getDirections(node) {
    const r = (node, acc) => {
      if (!node?.parent) return acc;
      return r(node?.parent, [...acc, node?.parent?.left === node ? 0 : 1]);
    };
    
    const directions = r(node, [-1]);
    return directions.length > 1 ? directions.filter((item) => item !== -1).reverse() : directions;
  };

  sortNodes(nodes) {
    const rootNode = nodes.filter((n) => n.direction[0] === -1)
      .map((n) => ({...n, index: 0}));

    const restNodes = _.sortBy(nodes
      .filter((n) => n.direction[0] !== -1), [function(o) { return o.direction.length }])
      .reduce((acc, elem) => {
        const index = elem.direction.length - 1;
        acc[index] = acc[index] ? [...acc[index], elem] : [elem];
        return acc;
      }, [])
      .map((subArr) => {
        return subArr.map((n) => ({ ...n, index: parseInt(n.direction.join(''), 2)}))
      })
      .map((subArr) => {
        const mustlnegth = Math.pow(2, subArr[0].direction.length);
        const newSub = new Array(mustlnegth);
        subArr.forEach(element => {
          newSub[element.index] = element;
        });
        return newSub;
      })
      .reduce((acc, subArr) => ([...acc, ...subArr]), [])
      .map((elem) => (_.isNil(elem) ? {value: null} : elem));

    return [...rootNode, ...restNodes];
  };

  getNodes() {
    const result = [];

    const r = (node, acc) => {
      const direction = this.getDirections(node);

      acc.push({ 
        value: node.value, 
        isVertex: !!node.left || !!node.right,
        isLeftNull: !!node.left,
        isRightNull: !!node.right,
        direction,
      });

      if (node.left) {
        r(node.left, acc);
      }
      if (node.right) {
        r(node.right, acc);
      }
    }

    r(this, result);
    return this.sortNodes(result);
  };
};

export default Node;
