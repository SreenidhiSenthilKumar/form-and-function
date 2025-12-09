
const imageUrls = [
    './assets/chair1.jpg',
    './assets/chair2.jpg',
    './assets/chair3.jpg',
    './assets/chair4.jpg',
    './assets/chair5.jpg',
    './assets/chair6.jpg',
    './assets/chair7.jpg',
    './assets/chair8.jpg'
];

const viewport = document.getElementById('viewport');
const world = document.getElementById('world');


const WORLD_SIZE = 400000;
const CHUNK_SIZE = 1200; 


const IMAGE_WIDTH = 250;
const IMAGE_HEIGHT = 250;
const GRID_GAP = 50; 


const IMAGE_COLUMNS_PER_CHUNK = Math.floor(CHUNK_SIZE / (IMAGE_WIDTH + GRID_GAP));
const IMAGE_ROWS_PER_CHUNK = Math.floor(CHUNK_SIZE / (IMAGE_HEIGHT + GRID_GAP));
const IMAGES_PER_CHUNK = IMAGE_COLUMNS_PER_CHUNK * IMAGE_ROWS_PER_CHUNK;


const loadedChunks = new Set();
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;



function getChunkKey(cx, cy) {
    return `${cx},${cy}`;
}

function renderChunk(cx, cy) {
    const key = getChunkKey(cx, cy);
    if (loadedChunks.has(key)) return;

    loadedChunks.add(key);

    const chunkStartX = cx * CHUNK_SIZE;
    const chunkStartY = cy * CHUNK_SIZE;

    for (let i = 0; i < IMAGES_PER_CHUNK; i++) {
        
        const colIndex = i % IMAGE_COLUMNS_PER_CHUNK;
        const rowIndex = Math.floor(i / IMAGE_COLUMNS_PER_CHUNK);


      
        const globalX = chunkStartX + (colIndex * (IMAGE_WIDTH + GRID_GAP));
     
        const globalY = chunkStartY + (rowIndex * (IMAGE_HEIGHT + GRID_GAP));


        const url = imageUrls[i % imageUrls.length];

        const imgItem = document.createElement('div');
        imgItem.className = 'gallery-item';

        imgItem.style.left = `${globalX}px`;
        imgItem.style.top = `${globalY}px`;
     
        imgItem.style.width = `${IMAGE_WIDTH}px`;
        imgItem.style.height = `${IMAGE_HEIGHT}px`;

        const img = document.createElement('img');
        img.src = url;
        img.loading = "lazy";
        img.onload = () => imgItem.classList.add('loaded');

        imgItem.appendChild(img);
        world.appendChild(imgItem);
    }
}

function updateVisibleChunks() {
    const scrollX = viewport.scrollLeft;
    const scrollY = viewport.scrollTop;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;


    const startCx = Math.floor(scrollX / CHUNK_SIZE);
    const endCx = Math.floor((scrollX + width) / CHUNK_SIZE);
    const startCy = Math.floor(scrollY / CHUNK_SIZE);
    const endCy = Math.floor((scrollY + height) / CHUNK_SIZE);

   
    for (let cx = startCx - 1; cx <= endCx; cx++) {
        for (let cy = startCy - 1; cy <= endCy; cy++) {
           
            if (cx >= 0 && cy >= 0 && cx * CHUNK_SIZE < WORLD_SIZE && cy * CHUNK_SIZE < WORLD_SIZE) {
                renderChunk(cx, cy);
            }
        }
    }
}



viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    viewport.classList.add('active');
    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
});

viewport.addEventListener('mouseleave', () => {
    isDragging = false;
    viewport.classList.remove('active');
});

viewport.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.classList.remove('active');
});

viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;
    const walkX = (x - startX) * 1.5; 
    const walkY = (y - startY) * 1.5;
    viewport.scrollLeft = scrollLeft - walkX;
    viewport.scrollTop = scrollTop - walkY;
});



function init() {

    const centerX = WORLD_SIZE / 2 - viewport.clientWidth / 2;
    const centerY = WORLD_SIZE / 2 - viewport.clientHeight / 2;

    viewport.scrollLeft = centerX;
    viewport.scrollTop = centerY;

  
    updateVisibleChunks();


    let ticking = false;
    viewport.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateVisibleChunks();
                ticking = false;
            });
            ticking = true;
        }
    });
}


init();