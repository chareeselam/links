const gridContainer = document.querySelector('#grid-container');
const modalDialog = document.querySelector('#media-content');
const closeButton = document.querySelector('#close-modal');

// helps to fill the grid based on screen size
// https://dev.to/kaelscion/dynamically-filling-in-a-css-grid-with-javascript-5geb

function populateGrid() {
    gridContainer.innerHTML = ''; // clears existing tiles
    
    // calculates the total number of tiles and uses 48px (3rem) as the base size
    const tileSize = 48; 
    const cols = Math.floor(window.innerWidth / tileSize);
    const rows = Math.floor(window.innerHeight / tileSize);
    const totalTiles = cols * rows;

    for (let i = 0; i < totalTiles; i++) {
        const li = document.createElement('li');
        li.classList.add('tile');
        
        // randomizes which tiles are the interactive tiles
        if (Math.random() > 0.95) { 
            li.classList.add('black');
        }
        
        gridContainer.appendChild(li);
    }
}

gridContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('black')) {
        modalDialog.showModal();
    }
});

closeButton.addEventListener('click', () => {
    modalDialog.close();
});

// initializes and handles resizing
populateGrid();
window.addEventListener('resize', populateGrid);