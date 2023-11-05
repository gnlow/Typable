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
            "stroke-width": 15,
            fill: "transparent",
        })
        this.controls = points.map(([x, y], i) =>
            el("circle",
                {
                    transform:
                        `translate(${x}, ${y})`,
                    r: 5,
                    stroke: "black",
                    fill: "white",
                    "stroke-width": 2,
                },
                [draggable(
                    (i % 3 == 0)
                        ? (dx, dy) => {
                            if (i != 0)
                                P.moveAmount(dx, dy)(this.controls[i - 1])
                            if (i != this.controls.length - 1)
                                P.moveAmount(dx, dy)(this.controls[i + 1])
                            this.render()
                        }
                        : () => this.render()
                )],
            )
        )
        this.handle = el("path", {
            stroke: "black",
            "stroke-width": 2,
            fill: "transparent",
        })
        this.barGroups = this.beziers.map(
            (_, n) => el("g",
                {
                    n,
                    children: arr(101).map((_, i) =>
                        el("path",
                            {
                                stroke: "red",
                                "stroke-width": 1,
                            },
                            [bar => bar.t = i * 0.01]
                        )
                    ),
                },
            )
        )
        this.render()
        console.log(this.controls)
    }
    get beziers() {
        return arr(Math.floor((this.controls.length - 1) / 3)).map(
            (_, i) => new B(...this.controls.slice(3 * i, 3 * i + 4))
        )
    }
    get pathD() {
        const [{x, y}, ...rest] = this.controls
        return `M ${x} ${y}` +
        rest.reduce(
            (acc, now, i) =>
                acc
                + (i % 3 == 0 ? "C" : " ")
                + `${now.x} ${now.y}`,
            ""
        )
    }
    get handleD() {
        const [{x, y}, ...rest] = this.controls
        return rest.reduce(
            (acc, now, i) =>
                acc
                + (i % 3 == 1 ? "M" : "L")
                + `${now.x} ${now.y}`,
            `M ${x} ${y}`
        )
    }
    render() {
        this.path.setAttribute("d", this.pathD)
        this.handle.setAttribute("d", this.handleD)
        this.beziers.forEach(
            (bezier, n) => {
                const pos = t => bezier.posVector(t)
                const normal = t => 
                V.mulScala(bezier.curvature(t) * -10000)(
                    V.dir(
                        bezier.normalVector(t)
                    )
                )
                ;[...this.barGroups[n].children].forEach(bar => {
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
        )
    }
    dom() {
        return [
            ...this.barGroups.flat(),
            this.handle,
            this.path,
            ...this.controls,
        ]
    }
}