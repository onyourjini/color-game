const COLORS = [
    { name: "Red", value: "red", hex: "#ff5470" },
    { name: "Blue", value: "blue", hex: "#4d9fff" },
    { name: "Green", value: "green", hex: "#3ddc97" },
    { name: "Yellow", value: "yellow", hex: "#ffd93d" },
];

const wordArea = document.getElementById("wordArea");
const choiceArea = document.getElementById("choiceArea");
const msg = document.getElementById("msg");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");

let score = 0;
let timeLeft = 30;
let timerId = null;
let currentColorValue = null;
let playing = false;

let best = Number(localStorage.getItem("colorGameBest") || 0);
bestEl.textContent = best;

function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function nextRound() {
    const wordColor = randomColor();
    let displayColor = randomColor();
    while (displayColor.value === wordColor.value) {
        displayColor = randomColor();
    }

    wordArea.textContent = wordColor.name;
    wordArea.style.color = displayColor.hex;
    currentColorValue = displayColor.value;
}

function buildChoices() {
    choiceArea.innerHTML = "";
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    shuffled.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "choice " + c.value;
        btn.textContent = c.name;
        btn.addEventListener("click", () => handleAnswer(c.value));
        choiceArea.appendChild(btn);
    });
}

function handleAnswer(value) {
    if (!playing) return;
    if (value === currentColorValue) {
        score++;
        scoreEl.textContent = score;
        msg.textContent = "Correct!";
        msg.style.color = "var(--green)";
    } else {
        msg.textContent = "Wrong!";
        msg.style.color = "var(--red)";
    }
    nextRound();
}

function startGame() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    msg.textContent = "";
    playing = true; 

    wordArea.classList.remove("hidden");
    choiceArea.classList.remove("hidden");
    startBtn.classList.add("hidden");

    buildChoices();
    nextRound();

    timerId = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    playing = false;
    clearInterval(timerId);
    wordArea.classList.add("hidden");
    choiceArea.classList.add("hidden");
    startBtn.classList.remove("hidden");
    startBtn.textContent = "Restart";

    if (score > best) {
        best = score;
        localStorage.setItem("colorGameBest", best);
        bestEl.textContent = best;
        msg.textContent = `Score: ${score} - NEW RECORD`;
    } else {
        msg.textContent = `Score: ${score}`;
    }
    msg.style.color = "var(--accent)";
}

startBtn.addEventListener("click", startGame);
