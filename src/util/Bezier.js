import * as Matrix from "./Matrix.js"
import * as Vector from "./Vector.js"

export const seed =
    (a, b, c, d) =>
    Matrix.mul(
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

export const pos =
    (a, b, c, d) =>
    t =>
    Matrix.mul(
        [[1, t, t**2, t**3]],
        seed(a, b, c, d),
    )[0][0]

export const vel =
    (a, b, c, d) =>
    t =>
    Matrix.mul(
        [[0, 1, 2*t, 3*t**2]],
        seed(a, b, c, d),
    )[0][0]

export const acc =
    (a, b, c, d) =>
    t =>
    Matrix.mul(
        [[0, 0, 2, 6*t]],
        seed(a, b, c, d),
    )[0][0]

export const posVector =
    (a, b, c, d) =>
    t => ({
        x: pos(a.x, b.x, c.x, d.x)(t),
        y: pos(a.y, b.y, c.y, d.y)(t),
    })

export const velVector =
    (a, b, c, d) =>
    t => ({
        x: vel(a.x, b.x, c.x, d.x)(t),
        y: vel(a.y, b.y, c.y, d.y)(t),
    })

export const accVector =
    (a, b, c, d) =>
    t => ({
        x: acc(a.x, b.x, c.x, d.x)(t),
        y: acc(a.y, b.y, c.y, d.y)(t),
    })

export const normalVector =
    (a, b, c, d) =>
    t => {
        const vel = velVector(a, b, c, d)(t)
        return Vector.rotate(Math.PI/2)(vel)
    }