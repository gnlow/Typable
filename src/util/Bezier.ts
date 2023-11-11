import * as Matrix from "./Matrix.ts"
import * as Vector from "./Vector.ts"

export class Bezier1d {
    a
    b
    c
    d
    seed
    constructor(a: number, b: number, c: number, d: number) {
        this.a = a
        this.b = b
        this.c = c
        this.d = d
        this.seed = Matrix.mul(
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
    }
    pos(t: number) {
        return Matrix.mul(
            [[1, t, t**2, t**3]],
            this.seed,
        )[0][0]
    }
    vel(t: number) {
        return Matrix.mul(
            [[0, 1, 2*t, 3*t**2]],
            this.seed,
        )[0][0]
    }
    acc(t: number) {
        return Matrix.mul(
            [[0, 0, 2, 6*t]],
            this.seed,
        )[0][0]
    }
}

interface Point {
    x: number
    y: number
}

export class Bezier {
    x
    y
    constructor(a: Point, b: Point, c: Point, d: Point) {
        this.x = new Bezier1d(a.x, b.x, c.x, d.x)
        this.y = new Bezier1d(a.y, b.y, c.y, d.y)
    }
    posVector(t: number) {
        return {
            x: this.x.pos(t),
            y: this.y.pos(t),
        }
    }
    velVector(t: number) {
        return {
            x: this.x.vel(t),
            y: this.y.vel(t),
        }
    }
    accVector(t: number) {
        return {
            x: this.x.acc(t),
            y: this.y.acc(t),
        }
    }
    normalVector(t: number) {
        const vel = this.velVector(t)
        return Vector.rotate(Math.PI/2)(vel)
    }
    curvature(t: number) {
        const vel = this.velVector(t)
        const acc = this.accVector(t)
        return (
            (vel.x * acc.y - acc.x * vel.y)
            /
            (vel.x ** 2 + vel.y ** 2) ** (3/2)
        )
    }
}