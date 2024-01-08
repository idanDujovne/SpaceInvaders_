'use strict'

const LASER_SPEED = 80
var gIntervalLaser
var gHero = { pos: { i: 12, j: 5 }, isShoot: false }
// creates the hero and place it on board
function createHero(board) {
    board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
}
// Handle game keys
function onKeyDown(ev) {
    switch (ev.key) {
        case 'ArrowLeft':
            moveHero(-1)
            break
        case 'ArrowRight':
            moveHero(1)
            break
        case ' ':
            shoot()
            break
    }
}
// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    if (gHero.pos.j === 0 && dir === -1) return
    if (gHero.pos.j === BOARD_SIZE - 1 && dir === 1) return

    updateCell(gHero.pos, null)

    gHero.pos.j += dir
    updateCell(gHero.pos, HERO)
}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    var laserPos = { i: gHero.pos.i, j: gHero.pos.j }
    gIntervalLaser = setInterval(blinkLaser, 100, laserPos)
}
// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {
    if (pos.i === 0) {
        clearInterval(gIntervalLaser)
        gHero.isShoot = false
        return
    }
    pos.i--
    if (gBoard[pos.i][pos.j].gameObject) {
        handleAlienHit(pos)
        clearInterval(gIntervalLaser)
        gHero.isShoot = false
        return
    }
    updateCell(pos, LASER)
    setTimeout(updateCell, LASER_SPEED, pos, null)
}