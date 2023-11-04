export const el = (
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

export const draggable = f => target => {
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