export abstract class SvgThing {
    abstract element: SVGGeometryElement
    _x
    _y
    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }
    set x(x: number) {
        this.element.transform.baseVal.getItem(0)
            .setTranslate(x, this._y)
        this._x = x
    }
    get x() { return this._x }

    set y(y: number) {
        this.element.transform.baseVal.getItem(0)
            .setTranslate(this._x, y)
        this._y = y
    }
    get y() { return this._y }

    setLocation(x: number, y: number) {
        this.element.transform.baseVal.getItem(0)
            .setTranslate(x, y)
        this._x = x
        this._y = y
    }
    moveAmount(dx: number, dy: number) {
        this.element.transform.baseVal.getItem(0)
            .setTranslate(
                this._x + dx,
                this._y + dy,
            )
        this._x += dx
        this._y += dy
    }
}