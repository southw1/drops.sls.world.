const track = document.getElementById("track");
const spinBtn = document.getElementById("spinBtn");
const tierButtons = document.querySelectorAll(".tier-btn");

const poolList = document.getElementById("poolList");
const poolCount = document.getElementById("poolCount");
const historyList = document.getElementById("historyList");
const bottomResult = document.getElementById("bottomResult");

const tickSound = document.getElementById("tickSound");
const winSound = document.getElementById("winSound");

let history = [];

const guns = {
    t0: ["Hi Point", "Glock 26", "Glock 22"],
    t1: ["G17", "G19", "G21"],
    t2: ["Banshee ARP", "G40 Switch"],
    t3: ["Micro Draco", "G23 Switch"],
    t4: ["Remington 870", "Glock 18"]
};

// Toggle tiers
tierButtons.forEach(btn => {
    btn.onclick = () => {
        btn.classList.toggle("active");
        updatePool();
    };
});

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

function updatePool() {
    let pool = getPool();
    poolList.innerHTML = pool.map(i => `[${i.tier}] ${i.name}`).join("<br>");
    poolCount.innerHTML = `Items: ${pool.length}`;
}

function buildTrack(pool, winner) {
    track.innerHTML = "";
    let winIndex = 45;

    for (let i = 0; i < 60; i++) {
        let item = i === winIndex ? winner : pool[Math.floor(Math.random()*pool.length)];

        let div = document.createElement("div");
        div.className = `card ${item.tier}`;
        div.innerHTML = `<b>${item.name}</b><span>${item.tier.toUpperCase()}</span>`;

        if (i === winIndex) div.id = "winnerCard";

        track.appendChild(div);
    }

    return winIndex;
}

spinBtn.onclick = () => {
    let pool = getPool();
    if (!pool.length) return;

    let winner = pool[Math.floor(Math.random() * pool.length)];
    let winIndex = buildTrack(pool, winner);

    const cardWidth = 170;
    const center = track.parentElement.offsetWidth / 2 - cardWidth / 2;

    let distance = (winIndex * cardWidth) - center + 2500;

    track.style.transition = "transform 2s cubic-bezier(0.1,0.8,0.2,1)";
    track.style.transform = `translateX(-${distance}px)`;

    let tickInterval = setInterval(() => tickSound.play(), 100);

    setTimeout(() => {
        clearInterval(tickInterval);

        let final = (winIndex * cardWidth) - center;
        track.style.transition = "transform 0.4s ease-out";
        track.style.transform = `translateX(-${final}px)`;

        winSound.play();

        bottomResult.innerHTML = `🎯 ${winner.name} (${winner.tier.toUpperCase()})`;
        bottomResult.classList.add("show");

        setTimeout(() => bottomResult.classList.remove("show"), 4000);

        history.unshift(winner);
        if (history.length > 10) history.pop();

        historyList.innerHTML = history.map(i => `[${i.tier}] ${i.name}`).join("<br>");

    }, 2000);
};

updatePool();
