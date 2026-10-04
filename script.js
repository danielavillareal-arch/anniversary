/* =========================================================
   ANNIVERSARY WEBSITE JAVASCRIPT
========================================================= */

/* =========================================================
   FLOWER FIREWORKS
   Petal-shaped bursts instead of heart particles.
========================================================= */

const canvas = document.getElementById("flowerFireworks");
const ctx = canvas ? canvas.getContext("2d") : null;

let flowerBursts = [];
let lastBurst = 0;

const flowerColors = [
    "rgba(201,120,120,",
    "rgba(229,169,155,",
    "rgba(197,160,92,",
    "rgba(145,171,140,",
    "rgba(236,196,185,"
];

function resizeCanvas() {
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createFlowerBurst(x, y) {
    const petals = [];
    const count = 18 + Math.floor(Math.random() * 10);

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i;
        const speed = 0.7 + Math.random() * 1.4;

        petals.push({
            angle,
            distance: 0,
            speed,
            size: 3 + Math.random() * 4,
            length: 7 + Math.random() * 7,
            rotation: Math.random() * Math.PI,
            alpha: 1,
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
        });
    }

    flowerBursts.push({
        x,
        y,
        petals,
        life: 0,
        maxLife: 90 + Math.random() * 35
    });
}

function drawPetal(x, y, angle, length, width, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.ellipse(0, 0, length, width, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
}

function animateFlowers(timestamp) {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    /* Soft warm glow */
    const glow = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        Math.max(window.innerWidth, window.innerHeight) * .7
    );

    glow.addColorStop(0, "rgba(255,255,255,.10)");
    glow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    /* Create a new flower burst */
    if (timestamp - lastBurst > 1550) {
        const x = window.innerWidth * (.18 + Math.random() * .64);
        const y = window.innerHeight * (.15 + Math.random() * .48);

        createFlowerBurst(x, y);
        lastBurst = timestamp;
    }

    flowerBursts.forEach((burst) => {
        burst.life++;

        burst.petals.forEach((petal) => {
            petal.distance += petal.speed;

            const px = burst.x + Math.cos(petal.angle) * petal.distance;
            const py = burst.y + Math.sin(petal.angle) * petal.distance;

            const progress = burst.life / burst.maxLife;
            petal.alpha = Math.max(0, 1 - progress);

            drawPetal(
                px,
                py,
                petal.angle + petal.rotation,
                petal.length,
                petal.size,
                petal.color + petal.alpha + ")"
            );
        });

        /* Tiny glowing center */
        const centerAlpha = Math.max(0, 1 - burst.life / 40);

        ctx.beginPath();
        ctx.arc(burst.x, burst.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197,160,92,${centerAlpha})`;
        ctx.fill();
    });

    flowerBursts = flowerBursts.filter(
        burst => burst.life < burst.maxLife
    );

    requestAnimationFrame(animateFlowers);
}

window.addEventListener("resize", resizeCanvas);

if (canvas) {
    resizeCanvas();

    /* Start with a few flowers already visible */
    setTimeout(() => {
        createFlowerBurst(window.innerWidth * .28, window.innerHeight * .30);
    }, 300);

    setTimeout(() => {
        createFlowerBurst(window.innerWidth * .72, window.innerHeight * .40);
    }, 850);

    requestAnimationFrame(animateFlowers);
}


/* =========================================================
   OPENING SCREEN
========================================================= */

const startButton = document.getElementById("startButton");
const opening = document.getElementById("opening");
const mainContent = document.getElementById("mainContent");

if (startButton) {
    startButton.addEventListener("click", () => {
        opening.classList.add("closed");

        setTimeout(() => {
            mainContent.classList.remove("hidden");
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });
        }, 500);
    });
}


/* =========================================================
   COUNTDOWN
========================================================= */

const targetDate = new Date("October 10, 2026 00:00:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    const message = document.getElementById("countdownMessage");

    if (!days || !hours || !minutes || !seconds) return;

    if (distance <= 0) {
        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        if (message) {
            message.textContent = "Happy Anniversary, my love. ♡";
        }

        return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );
    const m = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );
    const s = Math.floor(
        (distance % (1000 * 60)) /
        1000
    );

    days.textContent = String(d).padStart(2, "0");
    hours.textContent = String(h).padStart(2, "0");
    minutes.textContent = String(m).padStart(2, "0");
    seconds.textContent = String(s).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================================================
   SECRET MESSAGE
========================================================= */

const secretButton = document.getElementById("secretButton");
const secretMessage = document.getElementById("secretMessage");

if (secretButton && secretMessage) {
    secretButton.addEventListener("click", () => {
        secretMessage.classList.toggle("show");

        secretButton.textContent =
            secretMessage.classList.contains("show")
                ? "Close the secret"
                : "Open the secret";
    });
}
const music = document.getElementById("backgroundMusic");

startButton.addEventListener("click", () => {
    music.volume = 0.3;
    music.play();
});