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

  t0: [
    // 🔘 Budget / Entry Pistols
    { name: "Hi Point", label: "SNS Pistol EXT" },
    { name: "Glock 26", label: "SNS Pistol MK2 EXT" },
    { name: "Glock 22", label: "Pistol MK2" },
    { name: "Glock 19", label: "Ceramic Pistol" }
],
    ],
    ],

    t1: [
    // 🔘 Pistols / Entry Tier
    { name: "Glock 17", label: "Combat Pistol w/ Flashlight" },
    { name: "Glock 19", label: "Combat Pistol EXT" },
    { name: "Glock 21", label: "Vintage Pistol EXT" },
    { name: "PD 509", label: "Heavy Pistol" },
    { name: "FN", label: "Heavy Pistol EXT" }
],
    ],
    ],

 t2: [
    // 🧨 ARP / PDW
    { name: "Banshee ARP", label: "Compact PDW (Grip)" },

    
    // ⚡ Switch
    { name: "G40 Switch", label: "AP Pistol (No Attachments)" },
    { name: "G19 Switch", label: "AP Pistol w/ Flashlight" },

    // 🔘 Semi / Pistols
    { name: "Glock 40", label: "Vintage Pistol EXT" },
    { name: "Glock 26", label: "SNS Pistol MK2 EXT" },
    { name: "Glock 22", label: "Pistol MK2" }
],
   
    ],
    ],
    ],

  t3: [
    // 🔫 ARP
    { name: "7 Inch ARP", label: "Assault Rifle MK2 (No Attachments)" },
    { name: "Micro Black Draco", label: "Compact Rifle (Green Wrap)" },

    // ⚡ Switch
    { name: "G17 Gen 4", label: "Switch (AP Pistol w/ Flashlight)" },
    { name: "G23", label: "Switch (AP Pistol EXT)" },
    { name: "Glock 26", label: "Switch (AP Pistol w/ Flashlight)" },

    // 🔘 Semi
    { name: "Glock 20", label: "AP Pistol (No Attachments)" },
    { name: "Glock 17", label: "Combat Pistol w/ Flashlight" },
    { name: "Glock 19", label: "Combat Pistol EXT" },
   
    ],
    ],
    ],    
    ],

       t4: [
    // 🔫 Shotgun
    { name: "Remington 870", label: "Pump Shotgun MK2" },

    // 🧨 ARP
    { name: "WhiteOut ARP", label: "Assault Rifle MK2 (White Tint)" },
    { name: "300 Blackout", label: "Special Rifle MK2" },

    // ⚡ Switch
    { name: "Glock 18 Red Button", label: "AP Pistol (Orange Wrap + EXT)" },
    { name: "G30 Red Button", label: "AP Pistol EXT (Orange Wrap)" },
    { name: "Glock 22 Green Button", label: "AP Pistol (Green Wrap + Flashlight + EXT)" },

    // 🔘 Semi / Vintage / Heavy
    { name: "Glock 40", label: "Vintage Pistol EXT" },
    { name: "FN", label: "Heavy Pistol EXT" },
    { name: "Glock 21", label: "Vintage Pistol EXT" }
],
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
    
        div.innerHTML = `
    <strong>${item.name}</strong>
    <span>${item.label}</span>
`;
`;

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
