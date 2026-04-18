const track = document.getElementById("track");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
const tierButtons = document.querySelectorAll(".tier-btn");

const poolListDiv = document.getElementById("poolList");
const poolCount = document.getElementById("poolCount");
const historyListDiv = document.getElementById("historyList");
const bottomResult = document.getElementById("bottomResult");

let history = [];

const guns = {
    t0: ["Hi Point", "Glock 26", "Glock 22"],
    t1: ["G17", "G19", "G21", "PD 509", "FN"],
    t2: ["Banshee ARP", "G40 Switch", "G19 Switch", "G40 Vintage"],
    t3: ["7 Inch ARP", "Micro Draco", "G17 Switch", "G23 Switch"],
    t4: ["Remington 870", "WhiteOut ARP", "300 Blackout", "Glock 18"]
};

// Toggle tiers
tierButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        updatePool();
    });
});

// Pool
function getPool() {
    let pool = [];
    tierButtons.forEach(btn => {
        if (btn.classList.contains("active")) {
            pool = pool.concat(
                guns[btn.dataset.tier].map(g => ({
                    name: g,
                    tier: btn.dataset.tier
                }))
            );
        }
    });
    return pool;
}

// Update pool
function updatePool() {
    let pool = getPool();
    poolListDiv.innerHTML = pool.map(i => `[${i.tier}] ${i.name}`).join("<br>");
    poolCount.innerHTML = `Total Items: ${pool.length}`;
}

// Build track
function buildTrack(pool, winner) {
    track.innerHTML = "";

    let winIndex = 45;

    for (let i = 0; i < 60; i++) {
        let item = (i === winIndex) ? winner : pool[Math.floor(Math.random()*pool.length)];

        let div = document.createElement("div");
        div.className = `card ${item.tier}`;
        div.innerText = item.name;

        if (i === winIndex) div.id = "winnerCard";

        track.appendChild(div);
    }

    return winIndex;
}

// Spin
spinBtn.addEventListener("click", () => {

    let pool = getPool();
    if (!pool.length) return;

    let winner = pool[Math.floor(Math.random() * pool.length)];
    let winIndex = buildTrack(pool, winner);

    let cardWidth = 160;
    let center = track.parentElement.offsetWidth / 2 - cardWidth / 2;
    let move = (winIndex * cardWidth) - center;

    // 🔥 Smooth realistic spin
    track.style.transition = "transform 1.4s cubic-bezier(0.15,0.85,0.25,1)";
    track.style.transform = `translateX(-${move}px)`;

    setTimeout(() => {

        resultDiv.innerHTML = `🎉 ${winner.name}`;

        bottomResult.innerHTML = `🎯 WINNER: ${winner.name} (${winner.tier.toUpperCase()})`;
        bottomResult.classList.add("show");

        setTimeout(() => {
            bottomResult.classList.remove("show");
        }, 3500);

        // History
        history.unshift(winner);
        if (history.length > 10) history.pop();

        historyListDiv.innerHTML = history.map(i => `[${i.tier}] ${i.name}`).join("<br>");

    }, 1400);
});

updatePool();
