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
    T0: [
        { name: "Hi Point", label: "SNS Pistol EXT" },
        { name: "Glock 26", label: "SNS Pistol MK2 EXT" },
        { name: "Glock 22", label: "Pistol MK2" }
        { name: "Glock 17", label: "Combat Pistol" }
    ],
    ],

    T1: [
        { name: "Glock 17", label: "Standard" },
        { name: "Glock 19", label: "Standard" },
        { name: "Glock 21", label: "Standard" },
        { name: "PD 509", label: "Standard" }
        { name: "FN", label: "Standard" }
    ],
    ],

    T2: [
        { name: "Banshee ARP", label: "SMG Build" },
        { name: "G40 Switch", label: "Standard" },
        { name: "G19 Switch", label: "Standard" },
        { name: "Glock 40", label: "Custom" }
        { name: "Glock 26", label: "Standard" }
        { name: "Glock 22", label: "Pistol MK2" }
    ],
    ],
    ],

    T3: [
        { name: "7 Inch ARP", label: "Compact AR" },
        { name: "Micro Draco", label: "Mini AK" },
        { name: "G17 Gen4 Switch", label: "Standard" },
        { name: "G23 Switch", label: "Switch" }
        { name: "Glock 26 Switch", label: "Standard" }
        { name: "Glock 20", label: "Standard" }
        { name: "Glock 17", label: "Standard" }
        { name: "Glock 19", label: "Standard" }
        { name: "PD 509", label: "Standard" }
    ],
    ],
    ],    
    ],

    T4: [
        { name: "Remington 870", label: "Shotgun" },
        { name: "Whiteout ARP", label: "Legendary" },
        { name: "300 Blackout", label: "Rifle" },
        { name: "Glock 18 Switch", label: "Full Auto" }
        { name: "G30 Switch", label: "Standard" }
        { name: "G22 Switch", label: "Standard" }
        { name: "Glock 40", label: "Standard" }
        { name: "FN", label: "Standard" }
        { name: "Glock 21", label: "Standard" }
    ]
};
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
