const container = document.querySelector("#grid-container");
const gridSize = document.querySelector("#grid-size");
const sizeValue = document.querySelector("#size-value");

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