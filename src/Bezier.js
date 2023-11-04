const el = (
    tag,
    {children = [], ...attrs} = {},
    [...ops] = [],
) => {
    const result = document.createElementNS("http://www.w3.org/2000/svg", tag)
    for (const [k, v] of Object.entries(attrs)) {
        result.setAttribute(k, v)
    }
    for (const child of children) {
        result.appendChild(child)
    }
    for (const op of ops) {
        op(result)
    }
    return result
}

const draggable = f => target => {
    console.log("makeDraggable", this, target)
    const {
        e: initX,
        f: initY,
    } = target.transform.baseVal.getItem(0).matrix
    target.x = initX
    target.y = initY

    target.addEventListener("pointerdown", e => {
        console.log("drag start", this)
        e.stopPropagation()
        const {
            e: initX,
            f: initY,
        } = target.transform.baseVal.getItem(0).matrix
        const start = {
            x: e.clientX - initX,
            y: e.clientY - initY,
        }
        const onMove = e => {
            target.x = e.clientX - start.x
            target.y = e.clientY - start.y
            target.transform.baseVal.getItem(0).setTranslate(
                target.x,
                target.y,
            )
            f()
        }
        document.body.addEventListener("pointermove", onMove)
        document.body.addEventListener("pointerup", e => {
            document.body.removeEventListener("pointermove", onMove)
        }, { once: true })
    })
    return target
}

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
    }
}