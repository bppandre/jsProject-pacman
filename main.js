let gameData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 18, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 5, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const WALL = 1;
const COIN = 2;
const GROUND = 3;
const PACMAN = 5;

const CROSS = generateCross(gameData);


const BLUE_GHOST = 15;
const RED_GHOST = 16;
const PINK_GHOST = 17;
const ORANGE_GHOST = 18;

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

let score = 0;
let map;

let pacman = {
    x: 1,
    y: 7,
    direction: 'right'
};

let orangeGhost = {
    x:11,
    y:1,
    covering:GROUND
};

function pacClosestNode(){
    let res = [];

    CROSS.forEach((node) =>{
        res.push(getDistance(node,pacman));
    });
    idx = res.indexOf(Math.min(...res));
    let result = CROSS[idx];
    console.log(result);
    return result;
}



var astar = {
    init: function (grid) {
        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {
                grid[x][y].f;
                grid[x][y].g;
                grid[x][y].h;
                grid[x][y].debug = "";
                grid[x][y].parent = null;
            }
        }
    },
    search: function (grid, start, end) {
        astar.init(grid);

        var openList = [];
        var closedList = [];
        openList.push(start);

        while (openList.length > 0) {

            // Grab the lowest f(x) to process next
            var lowInd;
            for (var i =0; i < openList.length; i++) {
                if (openList[i].f < openList[lowInd].f) { lowInd = i; }
            }
            var currentNode = openList[lowInd];

            // End case -- result has been found, return the traced path
            if (currentNode.pos == end.pos) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors
            openList.removeGraphNode(currentNode);
            closedList.push(currentNode);
            var neighbors = astar.neighbors(grid, currentNode);

            for (var i =0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (closedList.findGraphNode(neighbor) || neighbor.isWall()) {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }

                // g score is the shortest distance from start to current node, we need to check if
                //   the path we have arrived at this neighbor is the shortest one we have seen yet
                var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
                var gScoreIsBest = false;


                if (!openList.findGraphNode(neighbor)) {
                    // This the the first time we have arrived at this node, it must be the best
                    // Also, we need to take the h (heuristic) score since we haven't done so yet

                    gScoreIsBest = true;
                    neighbor.h = astar.heuristic(neighbor.pos, end.pos);
                    openList.push(neighbor);
                }
                else if (gScore < neighbor.g) {
                    // We have already seen the node, but last time it had a worse g (distance from start)
                    gScoreIsBest = true;
                }

                if (gScoreIsBest) {
                    // Found an optimal (so far) path to this node.   Store info on how we got here and
                    //  just how good it really is...
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
                }
            }
        }

        // No result was found -- empty array signifies failure to find path
        return [];
    },
    heuristic: function (pos0, pos1) {
        // This is the Manhattan distance
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function (grid, node) {
        var ret = [];
        var x = node.pos.x;
        var y = node.pos.y;

        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }
        if (grid[x][y - 1] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
        if (grid[x][y + 1] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }
        return ret;
    }
};















function getDistance(pointOne,pointTwo){
    let dx = Math.abs(pointOne[1]-pointTwo.x);
    let dy = Math.abs(pointTwo.y-pointOne[0]);
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
    // console.log(valid);
    
    let dist = valid.map(v => getDistance(v,target));
    // console.log(dist);
    if(dist.indexOf(0)!==-1){
        // console.log('you lost');
        
    }
    let dir = valid[dist.indexOf(Math.min(...dist))];
    // console.log('min',dir);
    let x = dir[1];
    let y = dir[0];
    
    gameData[ghost.y][ghost.x] = ghost.covering;
    ghost.covering = gameData[y][x];
    ghost.x = x;
    ghost.y = y;
    gameData[ghost.y][ghost.x] = ORANGE_GHOST;
    
}




























function validPacMove(y,x){
    // <14 condition checks for all ghosts 
    if(gameData[y][x]!==WALL && gameData[y][x]<14){
        return true;
    }
    return false;
}

function incrementScore(data){
    if(data===COIN){
        score+=1;
    }
    document.getElementById('score').innerText=score;
}

function moveDown() {
    pacman.direction = 'down';
    if (validPacMove(pacman.y + 1,pacman.x) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.y = pacman.y + 1;
        incrementScore(gameData[pacman.y][pacman.x]);
        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveUp() {
    pacman.direction = 'up';
    if (validPacMove(pacman.y - 1,pacman.x) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.y = pacman.y - 1;
        incrementScore(gameData[pacman.y][pacman.x]);

        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveLeft() {
    pacman.direction = 'left';
    if (validPacMove(pacman.y,pacman.x - 1) ) {

        gameData[pacman.y][pacman.x] = GROUND;
        pacman.x = pacman.x - 1;
        incrementScore(gameData[pacman.y][pacman.x]);

        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function moveRight() {
    pacman.direction = 'right';
    if (validPacMove(pacman.y,pacman.x + 1) ) {
        gameData[pacman.y][pacman.x] = GROUND;
        pacman.x = pacman.x + 1;
        incrementScore(gameData[pacman.y][pacman.x]);

        gameData[pacman.y][pacman.x] = PACMAN;
    }
}

function handleKeys(e){

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
}

function setupKeyboardControls() {
    document.addEventListener('keydown', handleKeys);
}











let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let resetBtn = document.getElementById('reset');

let ghostId;

function main(){
    drawMap();

    startBtn.addEventListener('click',()=>{
        console.log('start');
        setupKeyboardControls();
        ghostId = setInterval(() => chase(orangeGhost, pacman), 800);

    });

    pauseBtn.addEventListener('click', ()=>{
        console.log('pause');
        clearInterval(ghostId);
        document.removeEventListener('keydown',handleKeys);
    });

    resetBtn.addEventListener('click',()=>{
        console.log('reset');
        //needs to be implemented with Init(game) function
    });

    function loop() {
        eraseMap();
        drawMap();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);


}

main()






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


function isCross(y, x) {
    if (gameData[y][x] === 1) {
        return false
    }

    let up, down, left, right;

    up = gameData[y - 1][x];
    down = gameData[y + 1][x];
    left = gameData[y][x - 1];
    right = gameData[y][x + 1];

    if (up !== WALL || down !== WALL) {
        if (left !== WALL || right !== WALL) {
            return true;
        }
    }

    return false;
}

function generateCross(grid) {
    let res = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (isCross(i, j)) {
                res.push([i, j])
            }

        }
    }
    return res;
}

function hideGrid() {
    // this is a bigger board that needs to be finished 
    // http://3.bp.blogspot.com/_Jrhwx8X9P7g/SwRjAFA8AUI/AAAAAAAAAYM/i9m1fOEY4Os/s1600/Pac-man.png
    // let gameData = [
    //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //     [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    //     [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    //     [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    //     [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    //     [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    //     [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    //     [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    //     [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
    //     [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    //     [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    // ];
}

