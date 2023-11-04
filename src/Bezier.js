import {
    el,
    draggable,
    Bezier as B,
    arr,
} from "./util.js"

export class Bezier {
    constructor(points) {
        this.path = el("path", {
            d: `
                m 0 0
                c 300 0
                  400 400 
                  400 800
            `,
            stroke: "black",
            "stroke-width": 10,
            fill: "transparent",
        })
        this.controls = points.map(([x, y]) =>
            el("circle",
                {
                    transform:
                        `translate(${x}, ${y})`,
                    r: 10,
                    stroke: "black",
                    fill: "white",
                    "stroke-width": 5,
                },
                [draggable(() => this.render())],
            )
        )
        this.handle = el("path", {
            stroke: "black",
            "stroke-width": 2,
        })
        this.normals = arr(101).map((_, i) =>
            el("path",
                {
                    stroke: "red",
                    "stroke-width": 1,
                    t: i * 0.01, // for debug
                },
                [x => x.t = i * 0.01]
            )
        )
        this.render()
        console.log(this.controls)
    }
    render() {
        const [a, b, c, d] = this.controls
        this.path.setAttribute("d", `
            M ${a.x} ${a.y}
            C ${b.x} ${b.y}
              ${c.x} ${c.y}
              ${d.x} ${d.y}
        `)
        this.handle.setAttribute("d", `
            M ${a.x} ${a.y}
            L ${b.x} ${b.y}
            M ${c.x} ${c.y}
            L ${d.x} ${d.y}
        `)
        const pos = B.posVector(a, b, c, d)
        this.normals.forEach((normal) => {
            const { t } = normal
            normal.setAttribute("d", `
                M 0 0
                L ${pos(t).x} ${pos(t).y}
            `)
        })
    }
    dom() {
        return [
            ...this.normals,
            this.handle,
            this.path,
            ...this.controls,
        ]
    }
}