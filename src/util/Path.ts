/**
 * @param {SVGElement} target 
 * @returns {{
 *  x: number,
 *  y: number
 * }}
 */
export const getLocation = (target: any) => {
    const {
        e: x,
        f: y,
    } = target.transform.baseVal.getItem(0).matrix
    return { x, y }
}

export const setLocation =
    (x: number, y: number) =>
    (target: any) =>
    {
        target.transform.baseVal.getItem(0)
            .setTranslate(x, y)
        target.x = x
        target.y = y
    }

export const moveAmount =
    (dx: number, dy: number) =>
    (target: any) =>
    {
        const { x, y } = getLocation(target)
        target.transform.baseVal.getItem(0)
            .setTranslate(x + dx, y + dy)
        target.x = x + dx
        target.y = y + dy
    }