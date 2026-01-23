const container = document.querySelector("#grid-container");
const gridSize = document.querySelector("#grid-size");
const sizeValue = document.querySelector("#size-value");
const palette = document.querySelector("#palette");
const currentColorMode = document.querySelector("#currentColorMode");
const toggleGridBtn = document.querySelector("#grid-line")
const eraser = document.querySelector("#eraser");

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
    if (!e.target.closest("button")) return;
    const button = e.target.closest("button");

    //read the button's css background color
    currentColor = getComputedStyle(button).backgroundColor;

    //update the current color display
    currentColorMode.style.backgroundColor = currentColor;
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