const container = document.querySelector("#grid-container");
const gridSize = document.querySelector("#grid-size");
const sizeValue = document.querySelector("#size-value");
const palette = document.querySelector("#palette");
const currentColorMode = document.querySelector("#currentColorMode");
const toggleGridBtn = document.querySelector("#grid-line")

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
}

// change color
palette.addEventListener("click", (e) => {
    if (!e.target.dataset.mode) return;
    currentColor = e.target.dataset.mode;
    currentColorMode.style.backgroundColor = currentColor;
});

//set to default layout of the grid
const resetGrid = document.querySelector("#reset-grid").addEventListener("click", () => { 
    container.textContent = "";
    createGrid(defaultSize);
});

//toggle grid lines
toggleGridBtn.addEventListener("click", () => {
    document.querySelectorAll(".col").forEach(cell => {
        cell.classList.toggle("show-grid");
    });
});