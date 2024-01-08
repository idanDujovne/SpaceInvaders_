'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
// The following two variables represent the part of the matrix (some r ows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 3
var gIsAlienFreeze = false
var gIsRight = true

function createAliens(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < BOARD_SIZE - 4; j++) {
            board[i][j] = createCell(ALIEN)
            gGame.alienCount++
        }
    }
}

function handleAlienHit(pos) {
    var elSpan = document.querySelector('h2 span')
    var score = +elSpan.innerHTML
    score += 10
    elSpan.innerHTML = score
    updateCell(pos, null)
    gGame.alienCount--
    if (gGame.alienCount === 0) gameOver()
}

function moveAliens() {
    if (gIsAlienFreeze) return
    clearInterval(gIntervalAliens)

    if (gIsRight) {
        gIntervalAliens = setInterval(shiftBoardRight, 1000, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else if (!gIsRight) {
        gIntervalAliens = setInterval(shiftBoardLeft, 1000, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = BOARD_SIZE - 1; j >= 0; j--) {
            var currCell = board[i][j]
            if (currCell.gameObject === HERO) gameOver()
            if (currCell.gameObject === LASER) handleAlienHit({ i, j })
            if (currCell.gameObject === ALIEN) {
                updateCell({ i, j: j + 1 }, ALIEN)
                updateCell({ i, j }, null)
            }
            checkIfEdgeRight(board)
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = board[i][j]
            if (currCell.gameObject === HERO) gameOver()
            if (currCell.gameObject === LASER) handleAlienHit({ i, j })
            if (currCell.gameObject === ALIEN) {
                updateCell({ i, j: j - 1 }, ALIEN)
                updateCell({ i, j }, null)
            }
            checkIfEdgeLeft(board)
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = toI; i >= fromI; i--) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            var currCell = board[i][j]
            if (currCell.gameObject === HERO) gameOver()
            if (currCell.gameObject === LASER) handleAlienHit({ i, j })
            if (currCell.gameObject === ALIEN) {
                updateCell({ i: i + 1, j }, ALIEN)
                updateCell({ i, j }, null)
            }
        }
    }
    clearInterval(gIntervalAliens)
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    moveAliens()
}

function checkIfEdgeRight(board) {
    for (var i = 0; i < BOARD_SIZE; i++) {
        if (board[i][BOARD_SIZE - 1].gameObject === LASER) handleAlienHit({ i, j: BOARD_SIZE - 1 })
        if (board[i][BOARD_SIZE - 1].gameObject === ALIEN) {
            clearInterval(gIntervalAliens)
            gIsRight = !gIsRight
            gIntervalAliens = setInterval(shiftBoardDown, 1000, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        }
    }
}

function checkIfEdgeLeft(board) {
    for (var i = 0; i < BOARD_SIZE; i++) {
        if (board[i][0].gameObject === LASER) handleAlienHit({ i, j: 0 })
        if (board[i][0].gameObject === ALIEN) {
            clearInterval(gIntervalAliens)
            gIsRight = !gIsRight
            gIntervalAliens = setInterval(shiftBoardDown, 1000, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        }
    }
}

// runs the interval for moving aliens side to side and down // it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

