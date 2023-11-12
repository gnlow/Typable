export const arr = (n: number) => new Array(n).fill(undefined)

type Attributes = {
    children?: SVGElement[]
    [attr: string]: any // string | number
}

export const el = (
    tag: string,
    {children = [], ...attrs}: Attributes = {},
    [...ops]: ((el: any/* SVGElement */) => void)[] = [],
) => {
    const result = document.createElementNS("http://www.w3.org/2000/svg", tag)
    for (const [k, v] of Object.entries(attrs)) {
        result.setAttribute(k, String(v))
    }
    for (const child of children) {
        result.appendChild(child)
    }
    for (const op of ops) {
        op(result)
    }
    return result
}

import { SvgThing } from "./components/SvgThing.ts"

export const draggable =
(f: (x: number, y: number) => void) =>
<T extends SvgThing>(target: T) => {
    console.log("makeDraggable", target)
    const {
        x: initX,
        y: initY,
    } = target
    target.x = initX
    target.y = initY

    target.element.addEventListener("pointerdown", e => {
        console.log("drag start", target)
        e.stopPropagation()
        const {
            x: initX,
            y: initY,
        } = target
        const start = {
            x: e.clientX - initX,
            y: e.clientY - initY,
        }
        const onMove = (e: MouseEvent) => {
            target.setLocation(
                e.clientX - start.x,
                e.clientY - start.y,
            )
            f(
                e.movementX,
                e.movementY,
            )
        }
        document.body.addEventListener("pointermove", onMove)
        document.body.addEventListener("pointerup", e => {
            document.body.removeEventListener("pointermove", onMove)
        }, { once: true })
    })
    return target
}

export { Bezier } from "./util/Bezier.ts"
export * as Matrix from "./util/Matrix.ts"
export * as Vector from "./util/Vector.ts"