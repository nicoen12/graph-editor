import { Graph, Node, Edge } from "./graph.js"

class Model {
    constructor() {
        this.graph = new Graph()
    }
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {String} label
     */
    createNode(x, y, label="") {
        const node = new Node(label, {x, y})
        this.graph.addNode(node)
        return node
    }
    /**
     * @param {Node} u
     */
    removeNode(u) {
        this.graph.removeNode(u)
    }
    /**
     * @param {Node} u
     * @param {Node} v
     */
    createEdge(u, v, label="") {
        const edge = new Edge(u, v, label)
        this.graph.addEdge(edge)
        return edge
    }
    /**
     * @param {Edge} e
     */
    removeEdge(e) {
        this.graph.removeEdge(e)
    }
}

export { Model }