// ==================== QUIZ ====================
const quizQuestions = [
  {
    q: "A player receives the ball directly from a throw-in while standing past all defenders. Is this offside?",
    options: [
      "Yes, it's offside",
      "No, you can't be offside from a throw-in",
      "Only if they score",
      "Only in the penalty area",
    ],
    correct: 1,
    explanation:
      "You cannot be offside when receiving the ball directly from a throw-in. This also applies to goal kicks and corner kicks.",
  },
  {
    q: "At the moment a pass is made, the attacker is exactly level with the second-last defender. What's the call?",
    options: [
      "Offside — they need to be behind the defender",
      "Onside — level is NOT offside",
      "Depends on whether they score",
      "Only the referee can decide this",
    ],
    correct: 1,
    explanation:
      "Level is onside! If the attacker is level with the second-last opponent, they are NOT in an offside position.",
  },
  {
    q: "A player is in an offside position but doesn't touch the ball and doesn't interfere with play. Is this an offence?",
    options: [
      "Yes, being in an offside position is always an offence",
      "No, they must be involved in active play for it to be penalised",
      "Yes, the referee should always stop play",
      "Only if they're in the penalty area",
    ],
    correct: 1,
    explanation:
      "Being in an offside position is NOT automatically an offence. The player must interfere with play, interfere with an opponent, or gain an advantage from the position.",
  },
  {
    q: "Which body parts are used to judge offside position?",
    options: [
      "Only the feet",
      "Any part of the body including arms",
      "Head, body, and feet — NOT arms/hands",
      "Only the torso",
    ],
    correct: 2,
    explanation:
      "Offside position is judged using any body part with which a player can legitimately play the ball — head, body, and feet. Arms and hands do NOT count.",
  },
  {
    q: "The goalkeeper has come up for a corner kick. On the counter-attack, only one defender is back near the goal and the goalkeeper is stranded near the halfway line. An attacker receives the ball between the last defender and the goalkeeper. Offside?",
    options: [
      "No, the goalkeeper's position doesn't matter",
      "Yes — the goalkeeper is now the second-last opponent, and the attacker is ahead of them",
      "It depends on whether the goalie is in their own area",
      "Only if the attacker scores",
    ],
    correct: 1,
    explanation:
      "The offside rule requires the attacker to be behind the SECOND-LAST opponent. Normally the second-last opponent is the last outfield defender (with the GK being the 'last'). But when the GK comes upfield, the GK becomes the second-last opponent. Since the attacker is ahead of the GK, they are offside — even though they are behind the last defender!",
  },
  {
    q: "A player is in their own half when a team-mate passes the ball forward. They sprint into the opponents' half to collect it. Offside?",
    options: [
      "Yes, because they ended up in the opponents' half",
      "No — they were in their own half when the ball was played",
      "Only if they were running when the pass was made",
      "It depends on the speed of the ball",
    ],
    correct: 1,
    explanation:
      "A player in their own half at the moment the ball is played CANNOT be offside, regardless of where they end up when they receive the ball.",
  },
  {
    q: "When should you raise your flag as assistant referee?",
    options: [
      "As soon as a player is in an offside position",
      "When a player in an offside position becomes involved in active play",
      "When the attacking team scores",
      "Whenever you're unsure",
    ],
    correct: 1,
    explanation:
      "You should only flag when a player in an offside position becomes actively involved (touches the ball, interferes with an opponent, or gains an advantage). Just being in an offside position isn't enough.",
  },
  {
    q: "A defender deliberately kicks the ball forward and an attacker who was in an offside position picks it up. What's the call?",
    options: [
      "Offside — the attacker was in an offside position",
      "Onside — the defender deliberately played the ball",
      "It depends on whether it was a pass or a clearance",
      "Always offside if in the opponents' half",
    ],
    correct: 1,
    explanation:
      "If a defender deliberately plays the ball (not a deflection or save), the offside evaluation resets. The attacker who was in an offside position from the previous phase of play is now judged on the new phase. Since the ball was deliberately played by a defender, it's not offside.",
  },
  {
    q: "Which hand should you hold the flag in as assistant referee?",
    options: [
      "Always the right hand",
      "Always the left hand",
      "The hand nearest the referee",
      "It doesn't matter",
    ],
    correct: 2,
    explanation:
      "Hold the flag in the hand nearest the referee so it's most visible to them. You'll typically switch hands at half-time when you change ends.",
  },
  {
    q: "You're not sure if it was offside or not. What should you do?",
    options: [
      "Flag it anyway — better safe than sorry",
      "Keep your flag down — benefit of the doubt to the attacker",
      "Ask the parents watching",
      "Stop play yourself",
    ],
    correct: 1,
    explanation:
      "If in doubt, keep your flag DOWN. The standard approach is 'benefit of the doubt to the attacker'. It's better to miss a marginal offside than to incorrectly flag a legitimate attack.",
  },
];

let currentQuiz = 0;
let qScore = { correct: 0, wrong: 0 };
let quizAnswered = false;

function showQuizQuestion(idx) {
  const q = quizQuestions[idx];
  document.getElementById("quizQuestion").textContent = `Q${idx + 1}: ${q.q}`;

  const optDiv = document.getElementById("quizOptions");
  optDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.onclick = () => submitQuizAnswer(i);
    optDiv.appendChild(btn);
  });

  document.getElementById("quizExplanation").classList.remove("show");
  document.getElementById("btnQuizNext").style.display = "none";
  document.getElementById("btnQuizReset").style.display = "none";
  quizAnswered = false;
}

function submitQuizAnswer(idx) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q = quizQuestions[currentQuiz];
  const buttons = document.querySelectorAll(".quiz-option");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct-answer");
    if (i === idx && idx !== q.correct) btn.classList.add("wrong-answer");
  });

  if (idx === q.correct) {
    qScore.correct++;
  } else {
    qScore.wrong++;
  }

  const total = qScore.correct + qScore.wrong;
  document.getElementById("qCorrect").textContent = "✓ " + qScore.correct;
  document.getElementById("qWrong").textContent = "✗ " + qScore.wrong;
  document.getElementById("qTotal").textContent =
    total + " / " + quizQuestions.length;
  document.getElementById("qProgress").style.width =
    (total / quizQuestions.length) * 100 + "%";

  const expl = document.getElementById("quizExplanation");
  expl.textContent = q.explanation;
  expl.classList.add("show");

  if (currentQuiz < quizQuestions.length - 1) {
    document.getElementById("btnQuizNext").style.display = "";
  } else {
    document.getElementById("btnQuizReset").style.display = "";
    const pct = Math.round((qScore.correct / quizQuestions.length) * 100);
    let msg =
      pct >= 80
        ? "🎉 Brilliant! You know your stuff!"
        : pct >= 60
          ? "👍 Not bad! Review the ones you missed."
          : "📚 Have another read of the Learn section and try again.";
    expl.textContent += `\n\nFinal Score: ${qScore.correct}/${quizQuestions.length} (${pct}%) — ${msg}`;
  }
}

function nextQuizQuestion() {
  currentQuiz++;
  showQuizQuestion(currentQuiz);
}

function resetQuiz() {
  currentQuiz = 0;
  qScore = { correct: 0, wrong: 0 };
  document.getElementById("qCorrect").textContent = "✓ 0";
  document.getElementById("qWrong").textContent = "✗ 0";
  document.getElementById("qTotal").textContent = "0 / " + quizQuestions.length;
  document.getElementById("qProgress").style.width = "0%";
  showQuizQuestion(0);
}

// ==================== INIT ====================
showQuizQuestion(0);
