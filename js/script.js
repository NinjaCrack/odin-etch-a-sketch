const container = document.querySelector("#grid-container");
const gridSize = document.querySelector("#grid-size");
const sizeValue = document.querySelector("#size-value");
const palette = document.querySelector("#palette");
const currentColorMode = document.querySelector("#currentColorMode");

let defaultSize = 16;

function createGrid(gridNum) {
    container.textContent = ""; //to reset current value
    container.style.setProperty("--grid-size", gridNum);
    for (let i = 0; i < gridNum * gridNum; i++) {
        const colDiv = document.createElement("div");
        colDiv.classList.add("col");
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

container.addEventListener("dragstart", (e) => { e.preventDefault(); })
container.addEventListener("pointerdown", paint);
container.addEventListener("pointermove", paint);

function paint(e) {
    if (e.buttons !== 1) return;
    if (!e.target.classList.contains("col")) return;

    e.target.style.backgroundColor = currentColor;
}

// change color

palette.addEventListener("click", (e) => {
    if (!e.target.dataset.mode) return;
    currentColor = e.target.dataset.mode;
    currentColorMode.style.backgroundColor = currentColor;
});