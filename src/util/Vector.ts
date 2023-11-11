interface Point {
    x: number
    y: number
}

export const len =
    ({x, y}: Point) => Math.sqrt(x**2 + y**2)

export const dir =
    ({x, y}: Point) => ({
        x: x / len({x, y}),
        y: y / len({x, y}),
    })

export const mulScala =
    (s: number) =>
    ({x, y}: Point) => ({
        x: x * s,
        y: y * s,
    })

export const add =
    (a: Point, b: Point) => ({
        x: a.x + b.x,
        y: a.y + b.y,
    })

export const rotate =
    (theta: number) =>
    ({x, y}: Point) => ({
        x: x * Math.cos(theta) - y * Math.sin(theta),
        y: x * Math.sin(theta) + y * Math.cos(theta),
    })