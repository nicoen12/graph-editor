import { Node, Edge } from "./graph.js"
import { Model } from "./model.js"
import { View } from "./view.js"

import * as PIXI from "./dependencies/pixi.mjs" 

export { options }

const options = {
    nodes : {
        radius : 20,
        bounds_radius : 25,
        stroke_color : "#14171c",
        stroke_width : 6
    },
    edges : {
        width : 6,
        bounds_distance : 10,
        stroke_color : "#14171c"
    },
    background : {
        color : "#c8d9b0"
    },
    canvas : {
        width : 640,
        height : 360,
        antialias : true,
        resizeTo: window
    },
    events: {
        resolution: 20
    },
    labels: {
        style : {
            fontFamily: 'serif',
            fontWeight: 600
        }
    }
}

/*
left click on bg adds node
left click on node or edge selects
right click deletes node or edge
left drag moves node
right drag draws edge
typing edits label on selected or last added node or edge
undo / redo (ctrl z)
*/

class Controller {
    /**
     * @param {Model} model
     * @param {View} view
     * @param {HTMLCanvasElement} canvas
     */
    constructor(model, view, canvas) {
        this.model = model
        this.view = view
        this.canvas = canvas
        this.lasthover = null
        this.timestamp = 0
        this.canvas.addEventListener("mousemove", e => this.mousemove(e))
        this.canvas.addEventListener("contextmenu", e => this.rightclick(e))
        this.canvas.addEventListener("click", e => this.leftclick(e))
        this.canvas.addEventListener("dragstart", e => this.dragstart(e))
        this.canvas.addEventListener("drag", e => this.dragging(e))
        this.canvas.addEventListener("dragend", e => this.dragend(e))

        this.selected_node = null
        this.selected_edge = null
        this.current_drag = null
    }
    /** @param {DragEvent} e */
    dragend(e) {
        throw new Error("Method not implemented.")
    }
    /** @param {DragEvent} e */
    dragging(e) {
        throw new Error("Method not implemented.")
    }
    /** @param {DragEvent} e */
    dragstart(e) {
        throw new Error("Method not implemented.")
    }
    /** @param {MouseEvent} e */
    leftclick(e) {
        const [x, y] = [e.offsetX, e.offsetY]
        const elem = this.getClosest(x, y)
        if (elem == null) {
            if (this.selected_node == null && this.selected_edge == null) {
                this.createNode(x, y)
            }
            else {
                this.selected_node = null
                this.selected_edge = null
            }
        }
        else if (Object.hasOwn(elem, "edge")) {
            this.selected_edge = elem.edge
        }
        else if (Object.hasOwn(elem, "node")) {
            const node = elem.node
            if (this.selected_node != null && node != this.selected_node && node != null) {
                this.createEdge(this.selected_node, node)
                this.selected_node = null
            }
            else {
                this.selected_node = elem.node
            }
        }
    }
    /** @param {MouseEvent} e */
    rightclick(e) {
        e.preventDefault()
        const [x, y] = [e.offsetX, e.offsetY]
        const elem = this.getClosest(x, y)
        if (elem == null) {
            this.selected_node = null
            this.selected_edge = null
        }
        else if (Object.hasOwn(elem, "edge")) this.deleteEdge(elem.edge);
        else if (Object.hasOwn(elem, "node")) this.deleteNode(elem.node);
    }
    /** @param {Node | any} node */
    deleteNode(node) {
        if (node == null) throw new Error("Node null!")
        this.view.removeNodeGraphic(node)
        this.model.graph.getAdjecentEdges(node).forEach(
            e => this.deleteEdge(e)
        )
        this.model.removeNode(node)
    }
    /** @param {Edge | any} edge */
    deleteEdge(edge) {
        if (edge == null) throw new Error("Edge null!")
        this.view.removeEdgeGraphic(edge)
        this.model.removeEdge(edge)
    }
    /** @param {MouseEvent} e */
    mousemove(e) {
        if (Date.now() - this.timestamp < options.events.resolution) return;
        this.timestamp = Date.now()

        const [x, y] = [e.offsetX, e.offsetY]
        const target = this.getClosest(x, y)
        if (target == this.lasthover) return;
        // if (this.lasthover != null) this.view.removeOutline(this.lasthover)
        // if (target != null) this.view.addOutline(target)
        this.lasthover = target
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Edge} edge
     */
    squaredDistanceToEdge(x, y, edge) {
        return PIXI.squaredDistanceToLineSegment(x, y, edge.u.data.x, edge.u.data.y, edge.v.data.x, edge.v.data.y)
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Node} node
     */
    squaredDistanceToNode(x, y, node) {
        return (x - node.data.x)**2 + (y - node.data.y)**2
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    getClosest(x, y) {
        const closest_edge = this.model.graph.edges.length == 0 ? null : this.model.graph.edges.reduce(
            (prev, curr) => this.squaredDistanceToEdge(x, y, prev) < this.squaredDistanceToEdge(x, y, curr) ? prev : curr)
        const closest_node = this.model.graph.nodes.length == 0 ? null : this.model.graph.nodes.reduce(
            (prev, curr) => this.squaredDistanceToNode(x, y, prev) < this.squaredDistanceToNode(x, y, curr) ? prev : curr)
        const d_closest_edge = closest_edge == null ? Infinity : this.squaredDistanceToEdge(x, y, closest_edge)**0.5
        const d_closest_node = closest_node == null ? Infinity : this.squaredDistanceToNode(x, y, closest_node)**0.5
        const r_d_closest_edge = d_closest_edge / options.edges.bounds_distance
        const r_d_closest_node = d_closest_node / options.nodes.bounds_radius
        if (r_d_closest_edge > 1 && r_d_closest_node > 1) return null
        return r_d_closest_edge < r_d_closest_node ? {edge: closest_edge} : {node: closest_node}
    }
    i = 0
    /**
     * @param {number} x
     * @param {number} y
     */
    createNode(x, y) {
        const node = this.model.createNode(x, y, "" + this.i++)
        this.view.addNode(node)
        return node
    }
    /**
     * @param {Node} u
     * @param {Node} v
     */
    createEdge(u, v) {
        const edge = this.model.createEdge(u, v)
        this.view.addEdge(edge)
        return edge
    }

}


async function main() {
    const app = new PIXI.Application()
    await app.init({
        width: options.canvas.width,
        height: options.canvas.height,
        antialias: options.canvas.antialias,
        background: options.background.color,
        resizeTo: options.canvas.resizeTo
    })
    document.body.appendChild(app.canvas)

    const model = new Model()
    const view = new View(model)
    const controller = new Controller(model, view, app.canvas)
    app.stage.addChild(view.graphic)
    
    function runtest() {
        const a = controller.createNode(100, 100)
        const b = controller.createNode(200, 100)
        const c = controller.createNode(100, 250)
        const d = controller.createNode(400, 150)
        controller.createEdge(a, b)
        controller.createEdge(a, c)
        controller.createEdge(c, d)
    }
    
    runtest()
}



await main()
