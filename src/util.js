export const arr = n => new Array(n).fill(undefined)

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

export const matrixMul = (ass, bss) =>
    ass.map((_, i) =>
        bss[0].map((_, j) =>
            ass[i].reduce(
                (acc, a, k) => acc + a * bss[k][j],
                0
            )
        )
    )

export const bSeed =
    (a, b, c, d) =>
    matrixMul(
        [
            [ 1,  0,  0,  0],
            [-3,  3,  0,  0],
            [ 3, -6,  3,  0],
            [-1,  3, -3,  1],
        ],
        [
            [a],
            [b],
            [c],
            [d],
        ]
    )

export const bPos =
    (a, b, c, d) =>
    t =>
    matrixMul(
        [[1, t, t**2, t**3]],
        bSeed(a, b, c, d),
    )[0][0]

export const bVel =
    (a, b, c, d) =>
    t =>
    matrixMul(
        [[0, 1, 2*t, 3*t**2]],
        bSeed(a, b, c, d),
    )[0][0]

export const bAcc =
    (a, b, c, d) =>
    t =>
    matrixMul(
        [[0, 0, 2, 6*t]],
        bSeed(a, b, c, d),
    )[0][0]

export const bPosVector =
    (a, b, c, d) =>
    t => ({
        x: bPos(a.x, b.x, c.x, d.x)(t),
        y: bPos(a.y, b.y, c.y, d.y)(t),
    })

export const bVelVector =
    (a, b, c, d) =>
    t => ({
        x: bVel(a.x, b.x, c.x, d.x)(t),
        y: bVel(a.y, b.y, c.y, d.y)(t),
    })

export const bAccVector =
    (a, b, c, d) =>
    t => ({
        x: bAcc(a.x, b.x, c.x, d.x)(t),
        y: bAcc(a.y, b.y, c.y, d.y)(t),
    })

export const vectorLen =
    ({x, y}) => Math.sqrt(x**2 + y**2)

export const vectorDir =
    ({x, y}) => ({
        x: x / vectorLen({x, y}),
        y: y / vectorLen({x, y}),
    })

export const vectorMulScala =
    ({x, y}, s) => ({
        x: x * s,
        y: y * s,
    })

export const vectorAdd =
    (a, b) => ({
        x: a.x + b.x,
        y: a.y + b.y,
    })

export const vectorRotate =
    theta =>
    ({x, y}) => ({
        x: x * Math.cos(theta) - y * Math.sin(theta),
        y: x * Math.sin(theta) + y * Math.cos(theta),
    })

export const bNormalVector =
    (a, b, c, d) =>
    t => {
        const vel = bVelVector(a, b, c, d)(t)
        return vectorRotate(Math.PI/2)(vel)
    }