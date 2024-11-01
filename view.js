import { Node, Edge } from "./graph.js"
import { options } from "./script.js"
import { Model } from "./model.js"

import * as PIXI from "./dependencies/pixi.mjs" 

class View {
    /** @param {Edge} edge */
    removeEdgeGraphic(edge) {
        this.graphic.removeChild(edge.data.graphic)
    }
    /** @param {Node} node */
    removeNodeGraphic(node) {
        this.graphic.removeChild(node.data.graphic)
    }
    addOutline(target) {
        throw new Error("Method not implemented.")
    }
    removeOutline(target) {
        throw new Error("Method not implemented.")
    }
    /**
     * @param {Model} model
     */
    constructor(model) {
        this.model = model
        this.graphic = new PIXI.Container({})
    }
    
    /**
     * @param {Node} node
     */
    addNode(node) {
        const g = new PIXI.Graphics({})
        g.zIndex = 1
        g.circle(node.data.x, node.data.y, options.nodes.radius)
            .fill()
            .stroke({ color: options.nodes.stroke_color, width: options.nodes.stroke_width })
        node.data.graphic = g
        this.graphic.addChild(g)
    }

    /**
     * @param {Edge} edge
     */
    addEdge(edge) {
        const x0 = edge.u.data.x, y0 = edge.u.data.y 
        const x1 = edge.v.data.x, y1 = edge.v.data.y 
        const g = new PIXI.Graphics({})
        
        g.moveTo(x0, y0)
            .lineTo(x1, y1)
            .stroke({ width: options.edges.width, color: options.edges.stroke_color })
        edge.data.graphic = g
        this.graphic.addChild(g)
    }

    getText(string) {
        const label = new PIXI.Text({ text: string, style: new PIXI.TextStyle(options.labels.style)})
        label.anchor.set(1, 0.5)
        return label
    }
}

export { View }