import { SvgThing } from "./SvgThing.ts"
import { el } from "../util.ts"

export class Control extends SvgThing {
    element
    constructor(x: number, y: number) {
        super(x, y)
        this.element = 
            el("circle",
                {
                    transform:
                        `translate(${x}, ${y})`,
                    r: 5,
                    stroke: "black",
                    fill: "white",
                    "stroke-width": 2,
                }
            ) as SVGCircleElement
    }
}