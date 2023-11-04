import {
    el,
    draggable,
    Bezier as B,
    Vector as V,
    arr,
} from "./util.js"

import { twilight } from "./colormap/twilight.js"

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
        this.bars = arr(101).map((_, i) =>
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
        const normal = t => 
        V.mulScala(B.curvature(a, b, c, d)(t) * -10000)(
            V.dir(
                B.normalVector(a, b, c, d)(t)
            )
        )
        this.bars.forEach(bar => {
            const { t } = bar
            bar.setAttribute("d", `
                M ${pos(t).x} ${pos(t).y}
                l ${normal(t).x} ${normal(t).y}
            `)
            const curvature = B.curvature(a, b, c, d)(t) * 100
            const colorIndex = Math.floor(
                ((Math.tanh(curvature) + 2) % 2)
                *
                (twilight.length / 2)
            )
            const [r, g, b_] = twilight[colorIndex]
                .map(x => x * 255)
            bar.setAttribute("stroke",
                `rgb(${r} ${g} ${b_})`
            )
        })
    }
    dom() {
        return [
            ...this.bars,
            this.handle,
            this.path,
            ...this.controls,
        ]
    }
}