export class TreeNode {
    constructor(state, parent = null) {
        this.state = state;
        this.parent = parent;
        this.children = [];
    }

    addChild(childState) {
        const childNode = new TreeNode(childState, this);
        this.children.push(childNode);
        return childNode;
    }
}

export class TicTacToeTree {
    constructor() {
        this.root = new TreeNode(Array(9).fill(null));
    }

    insertMove(node, moveIndex, player) {
        if (node.state[moveIndex] !== null) return null;
        
        let newState = [...node.state];
        newState[moveIndex] = player;
        return node.addChild(newState);
    }

    findWinner(node) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const [a, b, c] of winPatterns) {
            if (node.state[a] && node.state[a] === node.state[b] && node.state[a] === node.state[c]) {
                return node.state[a];
            }
        }
        return node.state.includes(null) ? null : "TIE";
    }
}
