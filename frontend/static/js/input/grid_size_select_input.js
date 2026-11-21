export function handleSelectCard(event) {
    const gridSize = Number(event.currentTarget.dataset.gridSize);
    localStorage.setItem("grid_size", String(gridSize));
    window.location.href = "/game";
}
