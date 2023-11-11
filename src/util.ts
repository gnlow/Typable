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

import * as P from "./util/Path.ts"

export const draggable =
(f: (x: number, y: number) => void) =>
(target: HTMLElement & {x: number, y: number}) => {
    console.log("makeDraggable", this, target)
    const {
        x: initX,
        y: initY,
    } = P.getLocation(target)
    target.x = initX
    target.y = initY

    target.addEventListener("pointerdown", e => {
        console.log("drag start", this)
        e.stopPropagation()
        const {
            x: initX,
            y: initY,
        } = P.getLocation(target)
        const start = {
            x: e.clientX - initX,
            y: e.clientY - initY,
        }
        const onMove = (e: MouseEvent) => {
            target.x = e.clientX - start.x
            target.y = e.clientY - start.y
            P.setLocation(
                target.x,
                target.y,
            )(target)
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
export * as Path from "./util/Path.ts"