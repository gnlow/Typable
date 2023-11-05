import {
    el,
    draggable,
    Bezier as B,
    Vector as V,
    Path as P,
    arr,
} from "./util.js"

import { twilight } from "./colormap/twilight.js"

export class PathUi {
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
        this.controls = points.map(([x, y], i) =>
            el("circle",
                {
                    transform:
                        `translate(${x}, ${y})`,
                    r: 10,
                    stroke: "black",
                    fill: "white",
                    "stroke-width": 5,
                },
                [draggable(
                    (i == 0 || i == 3)
                        ? (dx, dy) => {
                            P.moveAmount(
                                dx, dy
                            )(
                                this.controls[
                                    i == 0 ? 1 : 2
                                ]
                            )
                            this.render()
                        }
                        : () => this.render()
                )],
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
        const bezier = new B(a, b, c, d)
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
        const pos = t => bezier.posVector(t)
        const normal = t => 
        V.mulScala(bezier.curvature(t) * -10000)(
            V.dir(
                bezier.normalVector(t)
            )
        )
        this.bars.forEach(bar => {
            const { t } = bar
            bar.setAttribute("d", `
                M ${pos(t).x} ${pos(t).y}
                l ${normal(t).x} ${normal(t).y}
            `)
            const curvature = bezier.curvature(t) * 100
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