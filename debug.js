function displayGrid(grid) {
    const gridValues = grid.values.map(value => value.toString())
    const width = gridValues.reduce((a, b) => b.length > a.length ? b : a).length

    const values = []
    for (let i = 0; i < grid.size; i++) {
        values.push(gridValues.slice(i * grid.size, i * grid.size + grid.size))
    }

    console.log(values.map(line => line.map(color => color.padStart(width, ' ')).join(',')).join('\n'), '\n')
}

function getCellColor(grid, position) {
    return grid.values[position.y * grid.size + position.x]
}

function getNeighborsPosition(grid, position) {
    const neighbors = []

    if (position.x > 0)         neighbors.push({ x: position.x - 1 , y: position.y     })
    if (position.x < grid.size) neighbors.push({ x: position.x + 1 , y: position.y     })
    if (position.y > 0)         neighbors.push({ x: position.x     , y: position.y - 1 })
    if (position.y < grid.size) neighbors.push({ x: position.x     , y: position.y + 1 })

    return neighbors
}

function hashPosition(position) {
    return `${position.x},${position.y}`
}

function hashGrid(grid) {
    return `${grid.size}/${grid.values.join(',')}`
}

function isGridFinished(grid) {
    const firstColor = getCellColor(grid, { x: 0, y: 0 })
    return grid.values.every(color => color === firstColor)
}

function applyColorGrid(grid, newColor) {
    const gridValues = grid.values.slice()
    const colorToOverride = getCellColor(grid, { x: 0, y: 0 })
    const seenCells = new Set([hashPosition({ x: 0, y: 0 })])
	let cells = [{ x: 0, y: 0 }]
    let newCells = []

    while (cells.length) {
        for (const cell of cells) {
            for (const neighbor of getNeighborsPosition(grid, cell)) {
                const hash = hashPosition(neighbor)
                if (seenCells.has(hash)) continue
                seenCells.add(hash)

                if (getCellColor(grid, neighbor) === colorToOverride) {
                    newCells.push(neighbor)
                }
            }

            gridValues[cell.y * grid.size + cell.x] = newColor
        }

        cells = newCells
        newCells = []
    }

    return { size: grid.size, values: gridValues }
}

module.exports = {
    displayGrid,
    getCellColor,
    getNeighborsPosition,
    hashPosition,
    hashGrid,
    isGridFinished,
    applyColorGrid
}