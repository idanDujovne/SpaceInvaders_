'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SKY = ''
// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gIsWin // Add lose option
var gBoard
var gGame = {
    isOn: false,
    alienCount: 0
}
// Called when game loads
function init() {
    gGame.isOn = true
    createBoard()
    createHero(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
    moveAliens()
}
// Create and returns the board with aliens on top, ground at bottom // use the functions: createCell, createHero, createAliens
function createBoard() {
    gBoard = []
    for (var i = 0; i < BOARD_SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = createCell()
            gBoard[i].push(currCell)
        }
    }
}
// Render the board as a <table> to the page
function renderBoard(board) {
    var strHtml = ''
    var elTable = document.querySelector('.board')
    for (var i = 0; i < BOARD_SIZE; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = board[i][j]
            const className = `cell data-i=${i} data-j=${j}`
            strHtml += `<td ${className}>`
            if (currCell.gameObject) strHtml += currCell.gameObject
            strHtml += `</td>`
        }
        strHtml += `</tr>`
    }
    elTable.innerHTML = strHtml
}
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}
// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function gameOver() {
    clearInterval(gIntervalAliens)
    gGame.isOn = false
    var elMenu = document.querySelector('.menu-container')
    elMenu.classList.add('hide')
    var elGame = document.querySelector('.game-container')
    elGame.classList.add('hide')
    var elModal = document.querySelector('.game-over')
    elModal.classList.remove('hide')
    var elMsg = document.querySelector('h1 span')
    if (gIsWin) {
        elMsg.innerHTML = 'You Win!'
    } else {
        elMsg.innerHTML = 'Maybe Next Time...'
    }
}

function resetGame() {
    var elMenu = document.querySelector('.menu-container')
    elMenu.classList.remove('hide')
    var elGame = document.querySelector('.game-container')
    elGame.classList.remove('hide')
    var elMsg = document.querySelector('.game-over')
    elMsg.classList.add('hide')
    var elScore = document.querySelector('h2 span')
    var score = +elScore.innerHTML
    score = 0
    elScore.innerHTML = score
    init()
}