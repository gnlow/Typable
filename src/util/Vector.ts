export const len =
    ({x, y}) => Math.sqrt(x**2 + y**2)

export const dir =
    ({x, y}) => ({
        x: x / len({x, y}),
        y: y / len({x, y}),
    })

export const mulScala =
    s =>
    ({x, y}) => ({
        x: x * s,
        y: y * s,
    })

export const add =
    (a, b) => ({
        x: a.x + b.x,
        y: a.y + b.y,
    })

export const rotate =
    theta =>
    ({x, y}) => ({
        x: x * Math.cos(theta) - y * Math.sin(theta),
        y: x * Math.sin(theta) + y * Math.cos(theta),
    })