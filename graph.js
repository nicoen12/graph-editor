
class Graph {
    constructor() {
        /** @type {Node[]} */
        this.nodes = []
        /** @type {Edge[]} */
        this.edges = []
    }
    /**
     * @param {Node} u
     */
    getAdjecentEdges(u) {
        return this.edges.filter(v => v.isAdjecent(u))
    }
    /**
     * @param {Node} u
     */
    addNode(u) {
        this.nodes.push(u)
    }
    /**
     * @param {Node} u
     */
    removeNode(u) {
        if (!this.nodes.includes(u)) throw new Error("Node not present")
        this.nodes.splice(this.nodes.indexOf(u), 1)
        this.edges = this.edges.filter(v => !v.isAdjecent(u))
    }
    /**
     * @param {Edge} e
     */
    addEdge(e) {
        this.edges.push(e)
    }
    /**
     * @param {Edge} e
     */
    removeEdge(e) {
        if (!this.edges.includes(e)) throw new Error("Edge not present")
        this.edges.splice(this.edges.indexOf(e), 1)
    }
}

class Node {
    /**
     * @param {string} label
     */
    constructor(label, data={}) {
        this.label = label
        this.data = data
    }
}

class Edge {
    /**
     * @param {Node} u
     * @param {Node} v
     * @param {String} label
     */
    constructor(u, v, label, data={})  {
        this.u = u
        this.v = v
        this.label = label
        this.data = data
    }
    /**
     * @param {Edge} edge
     */
    equals(edge) {
        return (this.u == edge.u && this.v == edge.v) || (this.u == edge.v && this.v == edge.u)
    }
    /**
     * @param {Node} node
     */
    isAdjecent(node) {
        return this.u == node || this.v == node
    }
}

export { Graph, Node, Edge }