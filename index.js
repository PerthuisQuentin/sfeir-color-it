const Fs = require('fs')
const colorIt = require('./color-it')

const inputIndex = process.argv.indexOf('-i')

if (inputIndex === -1 || !process.argv[inputIndex + 1]) {
    console.error('No entry file parameter specified')
    process.exit(1)
}

const outputIndex = process.argv.indexOf('-o')
const outputFilePath = outputIndex !== -1 && process.argv[outputIndex + 1]

const inputFilePath = process.argv[inputIndex + 1]
if (!Fs.existsSync(inputFilePath)) {
    console.error(`File ${inputFilePath} does not exist`)
    process.exit(1)
}

const fileContent = Fs.readFileSync(inputFilePath, 'utf-8')

const debugIndex = process.argv.indexOf('-d')
const debug = debugIndex !== -1

const colorItResult = colorIt(fileContent, debug)
const resultText = colorItResult.join('\n')

if (outputFilePath) {
    Fs.writeFileSync(outputFilePath, resultText, 'utf-8')
} else {
    console.log(resultText)
}
