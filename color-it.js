const process = require('process')

const { displayGrid, applyColorGrid } = require('./debug')

let colorItStartTime

function parseInput(input) {
    const gridLines = input.split('\n')
    const size = gridLines.length
    const gridValues = gridLines.map(line => line.split(',')).flat()
    return { size, values: gridValues }
}

function indexToPosition(size, index) {
    return {
        x: index % size,
        y: Math.floor(index / size)
    }
}

function isAdjacent(positionA, positionB) {
    const distance = Math.abs(positionB.x - positionA.x) + Math.abs(positionB.y - positionA.y)
    return distance === 1
}

function listGroups(grid) {
    const groups = []
    let groupId = 0

    grid.values.forEach((color, index) => {
        const position = indexToPosition(grid.size, index)

        const adjacentGroups = groups.filter(group => {
            const adjacentCell = group.cells.find(cell => isAdjacent(cell, position))
            return adjacentCell && adjacentCell.color === color
        })

        if (adjacentGroups.length > 1) {
            const [mainGroup, ...otherGroups] = adjacentGroups
            mainGroup.cells = adjacentGroups.map(group => group.cells).flat()
            mainGroup.cells.push({
                ...position,
                color
            })
            otherGroups.forEach(otherGroup => {
                const index = groups.findIndex(group => group.id === otherGroup.id)
                groups.splice(index, 1)
            })
        } else if (adjacentGroups.length === 1) {
            adjacentGroups[0].cells.push({
                ...position,
                color
            })
        } else {
            groups.push({
                id: groupId++,
                color,
                links: new Set(),
                cells: [{
                    ...position,
                    color
                }]
            })
        }
    })

    return groups
}

function linkGroups(groups) {
    for (let i = 0; i < groups.length; i++) {
        const groupA = groups[i]

        for (let y = i + 1; y < groups.length; y++) {
            const groupB = groups[y]
            
            groupA.cells.forEach(cellA => {
                groupB.cells.forEach(cellB => {
                    if (isAdjacent(cellA, cellB)) {
                        groupA.links.add(groupB.id)
                        groupB.links.add(groupA.id)
                    }
                })
            })
        }
    }
}

function groupsToGraph(groups) {
    const graph = new Map()

    groups.forEach(group => {
        graph.set(group.id, {
            color: group.color,
            size: group.cells.length,
            links: group.links,
        })
    })

    return graph
}

function gridToGraph(grid) {
    const groups = listGroups(grid)
    linkGroups(groups)
    const graph = groupsToGraph(groups)

    return graph
}

function hashGraph(graph) {
    let hash = ''
    graph.forEach((_, id) => {
        hash += id
    })
    return hash
}

function applyColor(graph, color) {
    const mainGroup = graph.get(0)
    const groupIdsToMerge = new Set()

    mainGroup.links.forEach(groupId => {
        if (graph.get(groupId).color === color) groupIdsToMerge.add(groupId)
    })

    const newGraph = new Map()

    graph.forEach((group, groupId) => {
        if (groupId === 0) {
            const newLinks = new Set()
            let newSize = group.size

            group.links.forEach(groupId => {
                if (!groupIdsToMerge.has(groupId)) newLinks.add(groupId)
            })

            groupIdsToMerge.forEach(groupIdToMerge => {
                const groupToMerge = graph.get(groupIdToMerge)
                newSize += groupToMerge.size
                groupToMerge.links.forEach(groupId => {
                    if (groupId !== 0 && !groupIdsToMerge.has(groupId) && graph.has(groupId)) newLinks.add(groupId)
                })
            })

            newGraph.set(0, {
                color,
                size: newSize,
                links: newLinks
            })
        } else if (!groupIdsToMerge.has(groupId)) {
            newGraph.set(groupId, group)
        }
    })

    return newGraph
}

function getPossibleColors(graph) {
    const colors = new Set()

    graph.get(0).links.forEach(groupId => {
        colors.add(graph.get(groupId).color)
    })

    return colors
}

const oneSecond = Math.pow(10, 9)
const timeLimit = BigInt(oneSecond * 119)

function isTimeLimitExceeded() {
    const endTime = process.hrtime.bigint()
    return (endTime - colorItStartTime) > timeLimit
}

const memory = new Map()

function whereItExplodes(graph) {
    if (isTimeLimitExceeded()) throw new Error('Tooooo long')
    
    const hash = hashGraph(graph)
    if (memory.has(hash)) return memory.get(hash)

    if (graph.size === 1) return []
    
    let minColors

    getPossibleColors(graph)
        .forEach(color => {
            const result = [color, ...whereItExplodes(applyColor(graph, color))]
            if (!minColors || result.length < minColors.length) {
                minColors = result
            }
        })

    memory.set(hash, minColors)
    return minColors
}

function naiveIsEasy(graph) {
    const colors = []
    let currentGraph = graph

    while(currentGraph.size !== 1) {
        const mainGroup = currentGraph.get(0)
        const sizeByColor = new Map()

        mainGroup.links.forEach(groupId => {
            const group = currentGraph.get(groupId)
            if (!sizeByColor.has(group.color)) sizeByColor.set(group.color, group.size)
            else sizeByColor.set(group.color, group.size + sizeByColor.get(group.color))
        })

        const largestColorGroup = Array.from(sizeByColor.entries()).reduce((result, current) => current[1] > result[1] ? current : result)
        const color = largestColorGroup[0]

        colors.push(color)
        currentGraph = applyColor(currentGraph, color)
    }

    return colors
}

function colorIt(input, debug = false) {
    colorItStartTime = process.hrtime.bigint()
    let grid = parseInput(input)
    const graph = gridToGraph(grid)

    let result
    const naiveResult = naiveIsEasy(graph)
    try {
        result = whereItExplodes(graph, [])
    } catch(e) {
        result = naiveResult
    }

    const colorItEndTime = process.hrtime.bigint()

    if (debug) {
        displayGrid(grid)

        result.forEach(color => {
            console.log('Apply color', color)
            grid = applyColorGrid(grid, color)
            displayGrid(grid)
        })

        const timeElapsed = Number(colorItEndTime - colorItStartTime) / Math.pow(10, 9)
        console.log('Took', timeElapsed, 'seconds')
    }

    return result
}

module.exports = colorIt
