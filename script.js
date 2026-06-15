const TOTAL_PETALS = 30;

const bloom = document.getElementById("petals");
const streakEl = document.getElementById("streak");
const statusEl = document.getElementById("status");
const button = document.getElementById("readBtn");

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(a, b) {

  const oneDay =
    1000 * 60 * 60 * 24;

  return Math.floor(
    (new Date(a) - new Date(b)) /
    oneDay
  );
}

function loadData() {

  return {

    streak:
      parseInt(
        localStorage.getItem(
          "readingStreak"
        )
      ) || 0,

    lastRead:
      localStorage.getItem(
        "lastReadDate"
      )
  };
}

function saveData(
  streak,
  date
) {

  localStorage.setItem(
    "readingStreak",
    streak
  );

  localStorage.setItem(
    "lastReadDate",
    date
  );
}

function updateStreak() {

  let {
    streak,
    lastRead
  } = loadData();

  const today =
    todayString();

  if (lastRead) {

    const diff =
      daysBetween(
        today,
        lastRead
      );

    if (diff > 1) {

      streak = 0;

      saveData(
        streak,
        lastRead
      );
    }
  }

  streakEl.textContent =
    streak;

  const alreadyRead =
    lastRead === today;

  button.disabled =
    alreadyRead;

  statusEl.textContent =
    alreadyRead
      ? "Today's reading logged ✿"
      : "Read for a few minutes and bloom another petal.";

  drawBloom(streak);
}

function logReading() {

  let {
    streak,
    lastRead
  } = loadData();

  const today =
    todayString();

  if (
    lastRead === today
  ) return;

  if (lastRead) {

    const diff =
      daysBetween(
        today,
        lastRead
      );

    if (diff === 1) {
      streak++;
    } else {
      streak = 1;
    }

  } else {

    streak = 1;
  }

  saveData(
    streak,
    today
  );

  updateStreak();
}

function createPetal(
  x,
  y,
  rotation,
  active
) {

  const petal =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "ellipse"
    );

  petal.setAttribute(
    "cx",
    x
  );

  petal.setAttribute(
    "cy",
    y
  );

  petal.setAttribute(
    "rx",
    18
  );

  petal.setAttribute(
    "ry",
    42
  );

  petal.setAttribute(
    "fill",
    active
      ? "#e8bec5"
      : "#f6d8dd"
  );

  petal.setAttribute(
    "opacity",
    active
      ? "1"
      : ".55"
  );

  petal.setAttribute(
    "transform",
    `rotate(${rotation} ${x} ${y})`
  );

  return petal;
}

function drawBloom(streak) {

  bloom.innerHTML = "";

  const activePetals =
    Math.min(
      streak,
      TOTAL_PETALS
    );

  const centerX = 150;
  const centerY = 150;

  const radius = 80;

  for (
    let i = 0;
    i < TOTAL_PETALS;
    i++
  ) {

    const angle =
      (Math.PI * 2 * i) /
      TOTAL_PETALS;

    const x =
      centerX +
      Math.cos(angle) *
      radius;

    const y =
      centerY +
      Math.sin(angle) *
      radius;

    const rotation =
      (angle * 180) /
        Math.PI +
      90;

    bloom.appendChild(
      createPetal(
        x,
        y,
        rotation,
        i < activePetals
      )
    );
  }
}

button.addEventListener(
  "click",
  logReading
);

updateStreak();
