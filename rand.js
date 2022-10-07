const { displayGrid } = require('./debug')

function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}  

const sizeIndex = process.argv.indexOf('-s')
const size = sizeIndex === -1
    ? randomIntFromInterval(1, 15)
    : Number(process.argv[sizeIndex + 1])

const colorsIndex = process.argv.indexOf('-c')
const colors = colorsIndex === -1
    ? randomIntFromInterval(2, size)
    : Number(process.argv[colorsIndex + 1])

const values = []

for (let i = 0; i < (size * size); i++) {
    values.push(randomIntFromInterval(0, colors - 1))
}

displayGrid({
    size,
    values
})