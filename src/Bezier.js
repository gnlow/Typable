const el = (tag, {children = [], ...attrs} = {}) => {
    const result = document.createElementNS("http://www.w3.org/2000/svg", tag)
    for (const [k, v] of Object.entries(attrs)) {
        result.setAttribute(k, v)
    }
    for (const child of children) {
        result.appendChild(child)
    }
    return result
}
const arr = n => new Array(n).fill()

export class Bezier {
    constructor() {
        this.path = el("path", {
            d: `
                m 0 0
                l 500 400
            `,
            stroke: "black",
            "stroke-width": 10
        })
        this.controls
    }
}