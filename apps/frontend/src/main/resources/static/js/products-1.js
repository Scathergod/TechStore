// Products 1 - Rick & Morty REST API (3 Nested Endpoints + 4s Debouncing)
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("api-search-input");
    const statusFilter = document.getElementById("api-status-filter");
    const btnReset = document.getElementById("btn-api-reset");
    const countdownBox = document.getElementById("countdown-box");
    const countdownSeconds = document.getElementById("countdown-seconds");
    const visibleCount = document.getElementById("api-visible-count");
    const container = document.getElementById("api-products-container");
    const loadingBox = document.getElementById("loading-box");
    const noResults = document.getElementById("api-no-results");

    let timer = null;
    let countdown = null;
    const cache = {};

    // Initial load: Endpoint 1 (/character)
    loadCharacters("", "");

    /**
     * 4-Second Delay Window:
     * Starts a 4-second countdown as soon as the user starts typing.
     * The countdown runs continuously so the user can finish typing within the 4 seconds,
     * without resetting on each keystroke (avoiding 8, 12, 16+ seconds of wait time).
     */
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim();

        // If input is cleared, cancel timers and reload immediately
        if (!query) {
            resetTimers();
            loadCharacters("", statusFilter.value);
            return;
        }

        // If a 4-second countdown is already running, let it continue (do not reset)
        if (timer) return;

        // Start the 4-second countdown
        let remaining = 4;
        countdownSeconds.textContent = remaining;
        countdownBox.style.display = "block";

        countdown = setInterval(function () {
            remaining--;
            if (remaining > 0) {
                countdownSeconds.textContent = remaining;
            } else {
                clearInterval(countdown);
                countdown = null;
            }
        }, 1000);

        // Executes search after the 4 seconds with the full query typed
        timer = setTimeout(function () {
            countdownBox.style.display = "none";
            timer = null;
            loadCharacters(searchInput.value.trim(), statusFilter.value);
        }, 4000);
    });

    statusFilter.addEventListener("change", function () {
        resetTimers();
        loadCharacters(searchInput.value.trim(), statusFilter.value);
    });

    btnReset.addEventListener("click", function () {
        resetTimers();
        searchInput.value = "";
        statusFilter.value = "";
        loadCharacters("", "");
        searchInput.focus();
    });

    function resetTimers() {
        clearTimeout(timer);
        clearInterval(countdown);
        timer = null;
        countdown = null;
        countdownBox.style.display = "none";
    }

    // Endpoint 1: /character
    function loadCharacters(name, status) {
        loadingBox.style.display = "block";
        container.style.display = "none";
        noResults.style.display = "none";

        const key = `${name}::${status}`;
        if (cache[key]) {
            render(cache[key]);
            return;
        }

        const url = new URL("https://rickandmortyapi.com/api/character");
        if (name) url.searchParams.set("name", name);
        if (status) url.searchParams.set("status", status);

        fetch(url)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                cache[key] = data.results || [];
                render(cache[key]);
            })
            .catch(() => {
                loadingBox.style.display = "none";
                container.innerHTML = "";
                visibleCount.textContent = "0";
                noResults.style.display = "block";
            });
    }

    function render(characters) {
        loadingBox.style.display = "none";
        container.innerHTML = "";
        visibleCount.textContent = characters.length;

        if (!characters.length) {
            noResults.style.display = "block";
            return;
        }

        noResults.style.display = "none";
        container.style.display = "grid";

        characters.forEach(function (char) {
            const badgeClass = char.status === "Alive" ? "status-badge-alive" : (char.status === "Dead" ? "status-badge-dead" : "status-badge-unknown");
            const price = (24.99 + (char.id % 25)).toFixed(2);
            const stock = (char.id % 15) + 3;

            const card = document.createElement("article");
            card.className = "product-card";
            card.innerHTML = `
                <div>
                    <img src="${char.image}" alt="${char.name}" class="card-img">
                    <div class="card-header-info">
                        <span class="product-id">#FIG-${char.id}</span>
                        <span class="${badgeClass}">${char.status}</span>
                    </div>
                    <h2 class="product-title">${char.name}</h2>
                    <span class="category-badge">${char.species} Line</span>
                </div>
                <div class="card-footer-info">
                    <div class="price-stock-row">
                        <span class="product-price">$${price}</span>
                        <span class="product-stock">Stock: ${stock} units</span>
                    </div>
                    <div class="description-box" style="display: none;">
                        <strong>Product Specifications:</strong>
                        <p><strong>Material:</strong> Premium PVC (1:10 Scale Figure)</p>
                        <p class="origin-info"><strong>Origin Hub (Endpoint 2):</strong> <span>Loading...</span></p>
                        <p class="episode-info"><strong>Authenticity Cert (Endpoint 3):</strong> <span>Loading...</span></p>
                        <div><button type="button" class="mt-2 rounded bg-slate-900 px-2.5 py-1.5 text-xs text-white hover:bg-slate-700">← Back</button></div>
                    </div>
                    <small class="card-hint">Click card to view details</small>
                </div>
            `;

            // Card click opens description and triggers nested endpoints
            card.addEventListener("click", function (e) {
                if (e.target.tagName === "BUTTON") return;
                const desc = card.querySelector(".description-box");
                if (desc.style.display === "none") {
                    desc.style.display = "block";
                    card.querySelector(".card-hint").style.display = "none";
                    loadNestedDetails(char, desc);
                }
            });

            // Back button closes description
            card.querySelector("button").addEventListener("click", function (e) {
                e.stopPropagation();
                card.querySelector(".description-box").style.display = "none";
                card.querySelector(".card-hint").style.display = "block";
            });

            container.appendChild(card);
        });
    }

    /**
     * Nested Endpoints (Endpoints Anidados):
     * Consumes Endpoint 2 (/location) and, nested within its response, consumes Endpoint 3 (/episode).
     */
    function loadNestedDetails(char, desc) {
        const originSpan = desc.querySelector(".origin-info span");
        const episodeSpan = desc.querySelector(".episode-info span");

        const originUrl = char.origin && char.origin.url ? char.origin.url : null;
        const episodeUrl = char.episode && char.episode.length > 0 ? char.episode[0] : null;

        if (originUrl) {
            // Nested Level 1: Fetch Location (Endpoint 2)
            fetch(originUrl)
                .then(resLoc => resLoc.json())
                .then(locationData => {
                    originSpan.textContent = `${locationData.name} (${locationData.type || 'Dimension'})`;

                    // Nested Level 2: Fetch Episode (Endpoint 3) nested inside Location resolution
                    if (episodeUrl) {
                        return fetch(episodeUrl)
                            .then(resEp => resEp.json())
                            .then(episodeData => {
                                episodeSpan.textContent = `${episodeData.episode} - "${episodeData.name}" (${episodeData.air_date})`;
                            });
                    } else {
                        episodeSpan.textContent = "Official Universe Authenticity Certified";
                    }
                })
                .catch(() => {
                    originSpan.textContent = char.origin ? char.origin.name : "Earth";
                    if (episodeUrl) {
                        fetch(episodeUrl)
                            .then(resEp => resEp.json())
                            .then(episodeData => {
                                episodeSpan.textContent = `${episodeData.episode} - "${episodeData.name}" (${episodeData.air_date})`;
                            })
                            .catch(() => episodeSpan.textContent = "Official Universe Authenticity Certified");
                    }
                });
        } else {
            originSpan.textContent = char.origin ? char.origin.name : "Earth";
            if (episodeUrl) {
                fetch(episodeUrl)
                    .then(resEp => resEp.json())
                    .then(episodeData => {
                        episodeSpan.textContent = `${episodeData.episode} - "${episodeData.name}" (${episodeData.air_date})`;
                    })
                    .catch(() => episodeSpan.textContent = "Official Universe Authenticity Certified");
            } else {
                episodeSpan.textContent = "Official Universe Authenticity Certified";
            }
        }
    }
});
