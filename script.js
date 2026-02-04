const grid = document.querySelector(".grid");
const modalDialog = document.querySelector("#media-content");
const closeButton = modalDialog.querySelector("button");

grid.addEventListener("click", (e) => {
  // finds the closest .tile that was clicked
//   https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    const tile = e.target.closest(".tile");

    if (!tile) return;
    if (!tile.classList.contains("active")) return;

    modalDialog.showModal();
});

closeButton.addEventListener("click", () => {
    modalDialog.close();
});