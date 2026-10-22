// Products page live search using pure Vanilla JavaScript
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("live-search-input");
    const btnReset = document.getElementById("btn-reset");
    const visibleCount = document.getElementById("visible-count");
    const noResults = document.getElementById("no-results");
    const cards = document.querySelectorAll(".product-card");

    function filter() {
        const query = searchInput.value.toLowerCase().trim();
        let count = 0;

        cards.forEach(function (card) {
            const name = (card.dataset.name || "").toLowerCase();
            const description = (card.dataset.description || "").toLowerCase();

            const matchText = !query || name.includes(query) || description.includes(query);

            if (matchText) {
                card.style.display = "";
                count++;
            } else {
                card.style.display = "none";
            }
        });

        visibleCount.textContent = count;
        noResults.style.display = count === 0 ? "block" : "none";
    }

    searchInput.addEventListener("input", filter);

    btnReset.addEventListener("click", function () {
        searchInput.value = "";
        filter();
        searchInput.focus();
    });

    visibleCount.textContent = cards.length;
});
