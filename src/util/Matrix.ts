export const mul =
(ass: number[][], bss: number[][]) =>
    ass.map((_, i) =>
        bss[0].map((_, j) =>
            ass[i].reduce(
                (acc, a, k) => acc + a * bss[k][j],
                0
            )
        )
    )