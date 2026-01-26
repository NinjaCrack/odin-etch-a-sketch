const container = document.querySelector("#grid-container");
const gridSize = document.querySelector("#grid-size");
const sizeValue = document.querySelector("#size-value");
const palette = document.querySelector("#palette");
const currentColorMode = document.querySelector("#currentColorMode");
const toggleGridBtn = document.querySelector("#grid-line")
const eraser = document.querySelector("#eraser");


//create the colors dynamically
const paletteGroups = {
    gray: 21,
    red: 16,
    orange: 16,
    yellow: 16,
    green: 16,
    olive: 16,
    blue: 16,
    cyan: 16,
    purple: 16,
    pink: 16
};

for (const [color, count] of Object.entries(paletteGroups)) {
    for (let i = 1; i <= count; i++) {
        const button = document.createElement("button");
        button.classList.add("palette-btn")

        button.id = `${color}-${String(i).padStart(2, "0")}`;
        palette.appendChild(button);
    }
}



let defaultSize = 16;

function createGrid(gridNum) {
    container.textContent = ""; //to reset current value
    container.style.setProperty("--grid-size", gridNum);
    for (let i = 0; i < gridNum * gridNum; i++) {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col");
        colDiv.classList.add("show-grid");
        container.appendChild(colDiv);
    }
}

gridSize.addEventListener("input", () => {
    const size = Number(gridSize.value);
    sizeValue.textContent = `${size} x ${size}`;
    createGrid(size);
});

createGrid(defaultSize);

// color the grid
let currentColor = "black";
let isDrawing = false;

container.addEventListener("dragstart", (e) => { e.preventDefault(); })

container.addEventListener("pointerdown", (e) => {isDrawing = true; paint(e) });

document.addEventListener("pointerup", () => { isDrawing = false });
container.addEventListener("pointermove", (e) => {
    if (!isDrawing) return;
    paint(e);
});

function paint(e) {
    const x = e.clientX;
    const y = e.clientY;

    const cell = document.elementFromPoint(x, y);
    if (!cell || !cell.classList.contains("col")) return;

    cell.style.backgroundColor = currentColor;
    addRecentColor(currentColor);
}

// change color
palette.addEventListener("click", (e) => {
    if (!e.target.closest("button")) return;
    const button = e.target.closest("button");
    
    const paletteBtn = document.querySelectorAll(".palette-btn");

    //read the button's css background color
    currentColor = getComputedStyle(button).backgroundColor;

    //update the current color display
    currentColorMode.style.backgroundColor = currentColor;

     // active color
    paletteBtn.forEach(btn => {
        btn.classList.toggle("selectedColor", btn === button);
    });

     if (window.innerWidth <= 768) {
        palette.style.display = "none";
    }

    
});

//reset the grid layout to default size
const resetGrid = document.querySelector("#reset-grid").addEventListener("click", () => { 
    container.textContent = "";
    sizeValue.textContent = `${defaultSize} x ${defaultSize}`;
    createGrid(defaultSize);
});

//toggle grid lines
toggleGridBtn.addEventListener("click", () => {
    document.querySelectorAll(".col").forEach(cell => {
        cell.classList.toggle("show-grid");
    });
});

//eraser
const gridBg = getComputedStyle(container).backgroundColor;
eraser.addEventListener("click", () => {
    currentColor = gridBg;
    currentColorMode.style.backgroundColor = currentColor;
});



//toggle pallete on mobile
if (window.innerWidth <= 768) {
    currentColorMode.addEventListener("click", () => {
            const isVisible = palette.style.display === "flex";
            palette.style.display = isVisible ? "none" : "flex";
    });
}


// save 
function isGridEmpty() {
    return !document.querySelector(".col[style]");
}

const saveBtn = document.querySelector("#save");

saveBtn.addEventListener("click", () => {
    const gridCells = document.querySelectorAll(".col");
    const gridSize = Math.sqrt(gridCells.length); // assumes square grid
    const cellSize = 20; // pixels per cell in output image

    // create a temporary canvas
    const canvasEl = document.createElement("canvas");
    canvasEl.width = gridSize * cellSize;
    canvasEl.height = gridSize * cellSize;
    const ctx = canvasEl.getContext("2d");

    // draw each cell
    gridCells.forEach((cell, index) => {
        const x = (index % gridSize) * cellSize;
        const y = Math.floor(index / gridSize) * cellSize;
        ctx.fillStyle = getComputedStyle(cell).backgroundColor;
        ctx.fillRect(x, y, cellSize, cellSize);
    });

    // convert canvas to PNG and trigger download if the canvas is not empty
    if(!isGridEmpty()){
        const link = document.createElement("a");
        link.download = "pixel-art.png";
        link.href = canvasEl.toDataURL("image/png");
        link.click();
    } else {
        alert("canvas is empty you can't save it!");
    }
});

// recent colors
const recentPalette = document.querySelector("#recent-palette");

const MAX_RECENT_COLORS = 12;
let recentColors = [];

function addRecentColor(color) {
    if (!color || color === getComputedStyle(container).backgroundColor) return;

    recentColors = recentColors.filter( c => c != color);

    recentColors.unshift(color);

    if (recentColors.length > MAX_RECENT_COLORS) {
        recentColors.pop();
    }

    renderRecentColors();
}

function renderRecentColors() {
    recentPalette.innerHTML = "";

    recentColors.forEach(color => {
        const btn = document.createElement("button");
        btn.className = "palette-btn";
        btn.style.backgroundColor = color;

        btn.addEventListener("click", () => {
            currentColor = color;
            currentColorMode.style.backgroundColor = color;
        });

        recentPalette.appendChild(btn);
    });
}


