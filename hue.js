var game = document.getElementById("game");

// default grid size
var grid = 6;

// color constants - tune to change difficulty
var hue = (grid >= 10) ? 3 : 18;
var ligthness = (grid >= 8) ? 2 : 5;
var saturation = (grid >= 8) ? 0.05 : 0.1;

// element to be swaped
var toSwap = undefined;

// change size on user input
function changeGridSize() {
  var inputGrid = parseInt(document.getElementById("grid").value);

  clearBoard(game);
  setupGame(inputGrid);
}

// clear the game board
function clearBoard(node) {
  var last;
  while (last = node.lastChild) node.removeChild(last);
}

// initialize the game
function setupGame(inputGrid) {
  // if no grid size provided, use default
  grid = inputGrid ? inputGrid : grid;
  
  // adjust the game div size
  var styles = "height: " + grid * 50 + "px;" 
           + "width: " + grid * 50 + "px;";
  game.setAttribute('style', styles);
  
  // initialize list of elements
  elements = [];
  // choose the starting hue
  var startingHue = Math.floor(Math.random() * Math.floor(360));
  createBoard(startingHue);
}

// build the board
function createBoard(startingHue) {
  for (var row = 0; row <= grid - 1; row++) {
    for (var col = 0; col <= grid - 1; col++) {
      generateColoredNode(row, col, startingHue);
    }
  }
  elements = shuffleColors(elements);
  for (var i = 0; i <= elements.length - 1; i++) {
    game.appendChild(elements[i]);
  }
}

// generate color for a node based on row and column
// call generateNode
function generateColoredNode(row, col, startingHue) {
  generateNode(
    startingHue + (col - 1) * hue,
    50 + col * ligthness, 
    (10 - row) * saturation, 
    col, row
  );
}

// generate a node element
function generateNode(hue, light, saturation, col, row) {
  var node = document.createElement('div');
  node.setAttribute("id", "node-" + row + "-" + col);
  node.setAttribute('class', 'color');
  node.setAttribute('data-value', (row * grid) + col);
  node.onclick = clickNode;
  
  var color = "hsla(" + hue + ", 100%," + light + "%," + saturation +")";
  node.setAttribute('style', 'background-color: ' + color + ';');
  
  elements.push(node);
}

// shuffle elements array
function shuffleColors(arr) {
  // make sure corners stay in place
  var corners =  [
                    arr.splice(0, 1).pop(),         // top left
                    arr.splice(grid - 2, 1).pop(),  // top right
                    arr.splice(-(grid), 1).pop(),   // bottom left
                    arr.splice(-1, 1).pop()         // bottom right
                 ];
  // shuffle all the other elements
  arr.sort(function() { return 0.5 - Math.random() });
  // return a shuffled array with corners in place
  return corners.splice(0, 1).concat(
                                arr.splice(0, grid - 2), 
                                corners.splice(0, 1), 
                                arr.splice(0, grid * (grid -2)), 
                                corners.splice(0, 1), 
                                arr, corners);
}

// hqndle click 
// - highlight a node to be swapped
// - swap two nodes if there are two nodes to swap
function clickNode() {
  // add a shadow to a clicked element
  this.classList.add("clicked");
  
  if (toSwap) {
    // get swap element
    var swap = document.getElementById(toSwap);
    
    // remove the shadow
    swap.classList.remove("clicked");
    this.classList.remove("clicked");
    
    // swap
    swapNodes(swap, this);
    
    // get current children of the game and make an array
    var currentState = Array.prototype.slice.call(game.childNodes, 0);
    // check for win
    if (checkWin(currentState)) {
      alert('yay!');
    }
    
    // reset the swap element
    toSwap = undefined;
    return;
  }
  toSwap = this.id;
}

// swap two nodes in the game
function swapNodes(a, b) {
  var aSib = a.nextSibling;
  var bSib = b.nextSibling;
  
  game.insertBefore(a, bSib);
  game.insertBefore(b, aSib);
}

// check if the game has ended
function checkWin(arr) {
  for (i = 0; i < arr.length - 2; i++) {
    // return as soon as a value is out of order
    if (parseInt(arr[i].dataset.value) > parseInt(arr[i + 1].dataset.value)) {
      return false;
    }
  }
  return true;
}

// start the game
setupGame();