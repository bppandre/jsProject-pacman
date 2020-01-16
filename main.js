let gameData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 18, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 5, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


const WALL = 1;
const COIN = 2;
const GROUND = 3;
const PACMAN = 5;

const BLUE_GHOST = 15;
const RED_GHOST = 16;
const PINK_GHOST = 17;
const ORANGE_GHOST = 18;

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

let map;

let pacman = {
    x: 6,
    y: 4,
    direction: 'right'
};

let orangeGhost = {
    x:8,
    y:1,
    covering:GROUND
};

function getDistance(ghost,pacman){
    let dx = Math.abs(ghost[1]-pacman.x);
    let dy = Math.abs(pacman.y-ghost[0]);
    return dx+dy;
}

function allValidMoves(y,x){
    let res = [];
    if (validPacMove(y - 1, x)) {
        res.push([y - 1, x]);
    }
    if (validPacMove(y + 1, x)) {
        res.push([y + 1, x]);
    }
    if (validPacMove(y , x+1)) {
        res.push([y , x+1]);
    }
    if (validPacMove(y, x - 1)) {
        res.push([y, x - 1]);
    }
    return res;
}

function chase(ghost,target){
    let valid = allValidMoves(ghost.y,ghost.x);
    console.log(valid);
    
    let dist = valid.map(v => getDistance(v,target));
    console.log(dist);
    if(dist.indexOf(0)!==-1){
        console.log('you lost');
        
    }
    let dir = valid[dist.indexOf(Math.min(...dist))];
    console.log('min',dir);
    let x = dir[1];
    let y = dir[0];

    gameData[ghost.y][ghost.x] = ghost.covering;
    ghost.covering = gameData[y][x];
    ghost.x = x;
    ghost.y = y;
    gameData[ghost.y][ghost.x] = ORANGE_GHOST;
    eraseMap();
    drawMap();
}

setInterval(()=>chase(orangeGhost, pacman),1000);


function createTiles(data) {

    let tilesArray = [];

    for (let row of data) {

        for (let col of row) {
            
            
            let tile = document.createElement('div');

            tile.classList.add('tile');

            if (col === WALL) {
                tile.classList.add('wall');

            } else if (col === COIN) {
                tile.classList.add('coin');

            } else if (col === BLUE_GHOST) {
                    tile.classList.add('blueghost');

            } else if (col === RED_GHOST) {
                tile.classList.add('redghost');

            } else if (col === PINK_GHOST) {
                tile.classList.add('pinkghost');

            } else if (col === ORANGE_GHOST) {
                tile.classList.add('orangeghost');

            } else if (col === GROUND) {
                tile.classList.add('ground');

            } else if (col === PACMAN) {
                tile.classList.add('pacman');

                tile.classList.add(pacman.direction);

            }

            tilesArray.push(tile);
        }

        let brTile = document.createElement('br');

        tilesArray.push(brTile);
    }

    return tilesArray;
}

function drawMap() {
    map = document.createElement('div');

    let tiles = createTiles(gameData);
    for (let tile of tiles) {
        map.appendChild(tile);
    }

    document.body.appendChild(map);
}

function eraseMap() {
    document.body.removeChild(map);
}

function validPacMove(y,x){
    // <14 condition checks for all ghosts 
    if(gameData[y][x]!==WALL && gameData[y][x]<14){
        return true;
    }
    return false;
}

function moveDown() {
    pacman.direction = 'down';
    if (validPacMove(pacman.y + 1,pacman.x) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.y = pacman.y + 1;
        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveUp() {
    pacman.direction = 'up';
    if (validPacMove(pacman.y - 1,pacman.x) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.y = pacman.y - 1;
        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveLeft() {
    pacman.direction = 'left';
    if (validPacMove(pacman.y,pacman.x - 1) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.x = pacman.x - 1;
        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveRight() {
    pacman.direction = 'right';
    if (validPacMove(pacman.y,pacman.x + 1) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.x = pacman.x + 1;
        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function setupKeyboardControls() {
    document.addEventListener('keydown', function (e) {

        switch (e.keyCode) {

            case LEFT_KEY:
                moveLeft(); 
                break;

            case UP_KEY:
                moveUp();
                break;

            case RIGHT_KEY:
                moveRight();
                break;

            case DOWN_KEY:
                moveDown();
                break;

            default:
                break;

        }

        eraseMap();
        drawMap();
    });
}

function main() {
    drawMap();
    setupKeyboardControls();
}

main();

