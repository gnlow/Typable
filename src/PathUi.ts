import {
    el,
    draggable,
    Bezier as B,
    Vector as V,
    arr,
} from "./util.ts"

import { twilight } from "./colormap/twilight.ts"

import { Control } from "./components/Control.ts"

type Bar = SVGElement & {t: number}

export class PathUi {
    path: SVGElement
    controls: Control[]
    handle: SVGElement
    barGroups: SVGElement[]
    constructor(points: [number, number][]) {
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
        this.controls = []
        points.forEach(([x, y], i) =>
            this.addControl(x, y, i)
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
    addControl(
        x: number,
        y: number,
        i = this.controls.length,
    ) {
        this.controls.push(
            draggable(
                (i % 3 == 0)
                    ? (dx, dy) => {
                        if (i != 0)
                            this.controls[i - 1].moveAmount(dx, dy)
                        if (i != this.controls.length - 1)
                            this.controls[i + 1].moveAmount(dx, dy)
                        this.render()
                    }
                    : () => this.render()
            )(new Control(x, y))
        )
    }
    get beziers() {
        return arr(Math.floor((this.controls.length - 1) / 3)).map(
            // @ts-ignore: TODO
            (_, i) => new B(...this.controls.slice(3 * i, 3 * i + 4) as [Control, Control, Control, Control])
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
                const pos = (t: number) => bezier.posVector(t)
                const normal = (t: number) => 
                V.mulScala(bezier.curvature(t) * -10000)(
                    V.dir(
                        bezier.normalVector(t)
                    )
                )
                ;[...this.barGroups[n].children].forEach(bar => {
                    const { t } = bar as Bar
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
            //...this.barGroups.flat(),
            this.handle,
            this.path,
            ...this.controls.map(c => c.element),
        ]
    }
}