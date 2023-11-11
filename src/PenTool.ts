import { PathUi } from "./PathUi.ts"

class PenTool {
    constructor() {
        document.addEventListener(
            "click",
            () => {
                this.pathUi = new PathUi
                document.addEventListener(
                    "click",
                    e => {
                        this.pathUi.addControl(
                            e.clientX,
                            e.clientY,
                        )
                    }
                )
            },
            { once: true }
        )
    }
}