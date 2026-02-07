// ==================== 3D INTERACTIVE MODE ====================
(function () {
  "use strict";

  // ---- State ----
  let scene, camera, renderer, clock;
  let pitch, ball3d;
  let playerMeshes = [];
  let animMixer = null;
  let current3DScenario = 0;
  let answered3D = false;
  let frozen = false;
  let score3D = { correct: 0, wrong: 0, streak: 0 };
  let animState = "idle"; // 'playing', 'frozen', 'result'
  let animTime = 0;
  let currentCamMode = "linesman";
  let initialized = false;
  let passerKickTime = 0;
  let ballStartPos = null;
  let ballEndPos = null;
  let animDuration = 2.2; // seconds to animate before freeze
  let totalDuration = 3.2; // total scrub range (extends a bit past freeze)
  let offsideLineObj = null;
  let scenarioData3D = null;
  let playbackSpeed = 1;
  let isPlaying = true;
  let sliderDragging = false;
  let offsideLineForced = false;
  let offsideLineUserOff = false;

  // Smooth camera state
  let camPos = { x: 15, y: 1.85, z: -24 }; // current interpolated position
  let camTarget = { x: 10, y: 1.0, z: 0 }; // current interpolated lookAt
  let camGoalPos = { x: 15, y: 1.85, z: -24 }; // desired position
  let camGoalTarget = { x: 10, y: 1.0, z: 0 }; // desired lookAt
  const CAM_SMOOTH = 0.06; // lower = smoother (0-1)

  // Pitch dimensions (Three.js units) — a kids' pitch ~60m x 40m, we'll use 60x40
  const PW = 70,
    PH = 45;
  const HALF = PW / 2;

  // ---- 3D Scenarios ----
  // difficulty: 'easy' | 'medium' | 'hard'
  // Positions: x = along pitch length (-HALF to +HALF, attacking toward +x), z = across pitch (-PH/2 to +PH/2)
  const allScenarios = [
    // ===== EASY (clear-cut calls for learning the basics) =====
    {
      title: "Through Ball — Classic Offside",
      difficulty: "easy",
      offside: true,
      passer: { x: 2, z: 5, team: "attack" },
      subject: { x: 22, z: -4 },
      attackers: [{ x: 8, z: 12 }],
      defenders: [
        { x: 18, z: -2 },
        { x: 16, z: 8 },
        { x: 14, z: 14 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 28, z: -6 },
      explanation:
        "The attacker is well beyond the second-last defender when the through ball is played. Classic offside — flag goes up!",
    },
    {
      title: "In Own Half — Safe!",
      difficulty: "easy",
      offside: false,
      passer: { x: -12, z: -3, team: "attack" },
      subject: { x: -3, z: 5 },
      attackers: [{ x: -15, z: 10 }],
      defenders: [
        { x: 8, z: 2 },
        { x: 10, z: 8 },
        { x: 12, z: -4 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 10, z: 6 },
      explanation:
        "The attacker is in their OWN half when the ball is played. You cannot be offside in your own half!",
    },
    {
      title: "Throw-In — No Offside!",
      difficulty: "easy",
      offside: false,
      passer: { x: 14, z: -22, team: "attack", isThrowIn: true },
      subject: { x: 26, z: -8 },
      attackers: [{ x: 12, z: 8 }],
      defenders: [
        { x: 20, z: -4 },
        { x: 18, z: 6 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 26, z: -8 },
      explanation:
        "This is a THROW-IN! You cannot be offside directly from a throw-in, no matter where you are. Keep your flag down!",
    },
    {
      title: "Miles Offside — Easy Flag",
      difficulty: "easy",
      offside: true,
      passer: { x: -5, z: 0, team: "attack" },
      subject: { x: 30, z: 2 },
      attackers: [{ x: 0, z: -8 }],
      defenders: [
        { x: 15, z: -3 },
        { x: 12, z: 6 },
        { x: 10, z: 12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 32, z: 3 },
      explanation:
        "The attacker is practically on the goal line — miles beyond every defender. Clear offside, raise that flag!",
    },
    {
      title: "Goal Kick — Can't Be Offside",
      difficulty: "easy",
      offside: false,
      passer: { x: 30, z: 5, team: "attack", isGoalKick: true },
      subject: { x: 24, z: -3 },
      attackers: [{ x: 10, z: 8 }],
      defenders: [
        { x: 18, z: 2 },
        { x: 16, z: -6 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 24, z: -3 },
      explanation:
        "This is a GOAL KICK! Like throw-ins and corners, you cannot be offside directly from a goal kick. Flag stays down!",
    },
    {
      title: "Corner Kick — No Offside!",
      difficulty: "easy",
      offside: false,
      passer: { x: 34, z: -22, team: "attack", isCorner: true },
      subject: { x: 30, z: 2 },
      attackers: [
        { x: 28, z: -4 },
        { x: 26, z: 6 },
      ],
      defenders: [
        { x: 29, z: 0 },
        { x: 27, z: 4 },
        { x: 25, z: -2 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 30, z: 2 },
      explanation:
        "This is a CORNER KICK! You cannot be offside from a corner. Even with attackers camped right by the goal — it's fine!",
    },
    {
      title: "Attacker Behind the Ball",
      difficulty: "easy",
      offside: false,
      passer: { x: 18, z: 0, team: "attack" },
      subject: { x: 14, z: -6 },
      attackers: [{ x: 8, z: 10 }],
      defenders: [
        { x: 12, z: 5 },
        { x: 10, z: -8 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 24, z: -8 },
      explanation:
        "The attacker is BEHIND the ball when it's played. A player behind the ball can never be offside, even past all defenders.",
    },

    // ===== MEDIUM (closer calls, need to read the positions carefully) =====
    {
      title: "Level With Defender — Onside!",
      difficulty: "medium",
      offside: false,
      passer: { x: -2, z: 8, team: "attack" },
      subject: { x: 16, z: -3 },
      attackers: [{ x: 5, z: -10 }],
      defenders: [
        { x: 16, z: 6 },
        { x: 12, z: 14 },
        { x: 10, z: -8 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 22, z: -5 },
      explanation:
        "The attacker is exactly LEVEL with the second-last defender. Level is onside! Remember: if any playable body part is level, they're onside.",
    },
    {
      title: "Well-Timed Run",
      difficulty: "medium",
      offside: false,
      passer: { x: 0, z: -6, team: "attack" },
      subject: { x: 14, z: 4 },
      attackers: [{ x: 4, z: -14 }],
      defenders: [
        { x: 16, z: 0 },
        { x: 18, z: 7 },
        { x: 13, z: 14 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 24, z: 5 },
      explanation:
        "At the moment the pass is made, the attacker is BEHIND the second-last defender. They'll run past them as the ball travels — perfectly timed! Onside.",
    },
    {
      title: "Goalkeeper Up — Watch Out!",
      difficulty: "medium",
      offside: true,
      passer: { x: 5, z: 6, team: "attack" },
      subject: { x: 28, z: -2 },
      attackers: [{ x: 10, z: 14 }],
      defenders: [{ x: 24, z: 3 }],
      gk: { x: 12, z: -8 },
      ballTarget: { x: 30, z: -3 },
      explanation:
        "The goalkeeper has come way out! Now the second-last opponent is the GK at x=12. The attacker is miles past both — offside!",
    },
    {
      title: "Tight Call — Just Offside",
      difficulty: "medium",
      offside: true,
      passer: { x: 3, z: 3, team: "attack" },
      subject: { x: 19, z: -5 },
      attackers: [{ x: 6, z: 12 }],
      defenders: [
        { x: 17, z: 0 },
        { x: 15, z: 10 },
        { x: 18, z: -12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 25, z: -6 },
      explanation:
        "This is tight! The second-last defender is at x=17 and our attacker is at x=19 — just beyond. Even a small distance counts. In a real game, benefit of doubt goes to the attacker for marginal calls.",
    },
    {
      title: "Deep Defensive Line",
      difficulty: "medium",
      offside: false,
      passer: { x: 5, z: -5, team: "attack" },
      subject: { x: 20, z: 3 },
      attackers: [{ x: 8, z: 10 }],
      defenders: [
        { x: 22, z: -2 },
        { x: 24, z: 5 },
        { x: 20, z: 12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 26, z: 4 },
      explanation:
        "The defenders are sitting very deep. The second-last defender is at x=22 and the attacker is at x=20 — he's behind the line. Onside!",
    },
    {
      title: "Played Backwards — No Offside",
      difficulty: "medium",
      offside: false,
      passer: { x: 22, z: 3, team: "attack" },
      subject: { x: 26, z: -5 },
      attackers: [{ x: 10, z: -8 }],
      defenders: [
        { x: 20, z: -2 },
        { x: 18, z: 6 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 18, z: -4 },
      explanation:
        "Even though the attacker looks offside, they're BEHIND the ball when it's played (ball is at x=22, attacker at x=26 is further forward but the pass goes backwards). A player can't be offside if they receive a backward pass... BUT WAIT — actually the subject IS ahead of the second-last defender. However, they're behind the ball — so it's onside!",
    },
    {
      title: "Striker Makes a Run",
      difficulty: "medium",
      offside: true,
      passer: { x: 0, z: 10, team: "attack" },
      subject: { x: 20, z: 0 },
      attackers: [{ x: 5, z: -12 }],
      defenders: [
        { x: 18, z: 4 },
        { x: 16, z: -6 },
        { x: 14, z: 12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 28, z: -2 },
      explanation:
        "The striker has timed their run but set off too early. At the moment of the pass, they're at x=20 while the second-last defender is at x=16. Beyond the line — offside!",
    },

    // ===== HARD (tricky, deceiving scenarios) =====
    {
      title: "Deflection Off Defender",
      difficulty: "hard",
      offside: true,
      passer: { x: 5, z: 0, team: "attack" },
      subject: { x: 25, z: -3 },
      attackers: [{ x: 10, z: 10 }],
      defenders: [
        { x: 20, z: -1 },
        { x: 18, z: 7 },
        { x: 16, z: -10 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 27, z: -4 },
      explanation:
        "Even though the ball deflects off a defender on the way, this is still an INTENDED pass from the attacker. A deflection or rebound off a defender does NOT reset offside. Still offside!",
    },
    {
      title: "Two Attackers — Who's Offside?",
      difficulty: "hard",
      offside: false,
      passer: { x: 3, z: -4, team: "attack" },
      subject: { x: 15, z: 8 },
      attackers: [{ x: 24, z: -6 }],
      defenders: [
        { x: 17, z: 2 },
        { x: 15, z: -8 },
        { x: 13, z: 12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 20, z: 10 },
      explanation:
        "There are two attackers in dangerous positions. The other attacker at x=24 IS in an offside position — but the ball goes to the subject at x=15 who is LEVEL with the second-last defender. Only the player who receives the ball matters. Onside!",
    },
    {
      title: "GK is Second-Last — Trap!",
      difficulty: "hard",
      offside: true,
      passer: { x: 8, z: 5, team: "attack" },
      subject: { x: 26, z: -2 },
      attackers: [{ x: 12, z: -10 }],
      defenders: [{ x: 28, z: 4 }],
      gk: { x: 24, z: 0 },
      ballTarget: { x: 30, z: -3 },
      explanation:
        "Tricky! One defender is at x=28 and the GK is at x=24. The second-last opponent is the GK at x=24. The attacker at x=26 is beyond the GK — offside! Remember: the GK counts as an opponent too.",
    },
    {
      title: "Offside but Not Interfering",
      difficulty: "hard",
      offside: false,
      passer: { x: 0, z: 8, team: "attack" },
      subject: { x: 10, z: -3 },
      attackers: [{ x: 24, z: 5 }],
      defenders: [
        { x: 16, z: 0 },
        { x: 14, z: 8 },
        { x: 12, z: -10 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 14, z: -5 },
      explanation:
        "There's an attacker in an offside position at x=24, but the ball is played SHORT to the subject at x=10, well behind the defensive line. Being in an offside POSITION is not an offence — you must interfere with play. The pass goes to an onside player. Play on!",
    },
    {
      title: "Marginal — Shoulder vs Arm",
      difficulty: "hard",
      offside: false,
      passer: { x: 2, z: 6, team: "attack" },
      subject: { x: 17.5, z: -4 },
      attackers: [{ x: 8, z: 14 }],
      defenders: [
        { x: 18, z: 2 },
        { x: 16, z: 10 },
        { x: 14, z: -8 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 24, z: -5 },
      explanation:
        "Super tight! The attacker's body is level with the defender — but imagine if their arm was slightly ahead. Arms DON'T count for offside! Only parts of the body you can score with (head, body, feet). Onside!",
    },
    {
      title: "Attacker Runs Back From Offside",
      difficulty: "hard",
      offside: true,
      passer: { x: 5, z: 3, team: "attack" },
      subject: { x: 22, z: -6 },
      attackers: [{ x: 10, z: 8 }],
      defenders: [
        { x: 19, z: -2 },
        { x: 17, z: 5 },
        { x: 15, z: 12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 26, z: -7 },
      explanation:
        "The attacker was in an offside position when the ball was played (x=22 vs defender at x=19), even though they may run back to collect the ball. It's the position at the MOMENT OF THE PASS that matters, not where they receive it!",
    },
    {
      title: "High Press — All Up",
      difficulty: "hard",
      offside: false,
      passer: { x: -8, z: -2, team: "attack" },
      subject: { x: 6, z: 0 },
      attackers: [{ x: -2, z: 10 }],
      defenders: [
        { x: 8, z: -4 },
        { x: 6, z: 6 },
        { x: 4, z: 12 },
      ],
      gk: { x: 32, z: 0 },
      ballTarget: { x: 14, z: 2 },
      explanation:
        "The defenders are pressing extremely high (up at x=4-8). The attacker at x=6 is LEVEL with the defensive line. Level is always onside — no matter how high the line is!",
    },
  ];

  // Active (filtered + shuffled) scenario list
  let scenarios3D = [];
  let currentDifficulty = "all";
  let scenariosPerRound = 8;
  let timedMode = false;
  let decisionTimer = null;
  let decisionTimeLeft = 0;
  const DECISION_TIME = 4; // seconds to decide on hard-timed

  // Fisher-Yates shuffle
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Build scenario list based on difficulty
  function buildScenarioList(difficulty) {
    currentDifficulty = difficulty;
    let pool;
    if (difficulty === "all") {
      pool = allScenarios.slice();
    } else {
      pool = allScenarios.filter((s) => s.difficulty === difficulty);
    }
    // Shuffle and pick up to scenariosPerRound
    pool = shuffleArray(pool);
    // Ensure a mix of offside/onside when possible
    const offside = pool.filter((s) => s.offside);
    const onside = pool.filter((s) => !s.offside);
    // Interleave for variety
    const mixed = [];
    const maxLen = Math.max(offside.length, onside.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < onside.length) mixed.push(onside[i]);
      if (i < offside.length) mixed.push(offside[i]);
    }
    // Re-shuffle the interleaved list for unpredictability
    scenarios3D = shuffleArray(mixed).slice(0, scenariosPerRound);
    // Timed mode only on hard
    timedMode = difficulty === "hard";
  }

  // ---- Initialization ----
  function init3D() {
    if (initialized) return;
    initialized = true;

    const container = document.getElementById("scene3d-container");
    const W = container.clientWidth || 880;
    const H = Math.round(W * 0.56);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // sky
    scene.fog = new THREE.Fog(0x87ceeb, 80, 160);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 200);
    setCameraPosition("linesman", true);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(20, 40, 10);
    sun.castShadow = true;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 35;
    sun.shadow.camera.bottom = -35;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-15, 20, -10);
    scene.add(fill);

    // Build pitch
    buildPitch();

    // Clock
    clock = new THREE.Clock();

    // Resize
    window.addEventListener("resize", () => {
      const w = container.clientWidth;
      const h = Math.round(w * 0.56);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    // Set up slider events
    setupSliderEvents();

    // Start render loop
    animate();

    // Build initial scenario list (default: all, shuffled)
    buildScenarioList("all");

    // Load first scenario
    load3DScenario(0);
  }

  // ---- Build 3D Pitch ----
  function buildPitch() {
    // Ground (large grass plane)
    const groundGeo = new THREE.PlaneGeometry(160, 120);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x3a8c3f });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pitch surface with stripes
    const pitchGroup = new THREE.Group();
    const stripeW = PW / 10;
    for (let i = 0; i < 10; i++) {
      const geo = new THREE.PlaneGeometry(stripeW, PH);
      const col = i % 2 === 0 ? 0x3e9442 : 0x45a04a;
      const mat = new THREE.MeshLambertMaterial({ color: col });
      const stripe = new THREE.Mesh(geo, mat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(-HALF + stripeW / 2 + i * stripeW, 0, 0);
      stripe.receiveShadow = true;
      pitchGroup.add(stripe);
    }
    scene.add(pitchGroup);

    // Lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    function makeLine(x1, z1, x2, z2, width) {
      const dx = x2 - x1,
        dz = z2 - z1;
      const len = Math.sqrt(dx * dx + dz * dz);
      const geo = new THREE.PlaneGeometry(len, width || 0.15);
      const line = new THREE.Mesh(geo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set((x1 + x2) / 2, 0.01, (z1 + z2) / 2);
      line.rotation.z = -Math.atan2(dz, dx);
      scene.add(line);
    }

    // Pitch outline
    makeLine(-HALF, -PH / 2, HALF, -PH / 2);
    makeLine(-HALF, PH / 2, HALF, PH / 2);
    makeLine(-HALF, -PH / 2, -HALF, PH / 2);
    makeLine(HALF, -PH / 2, HALF, PH / 2);

    // Halfway line
    makeLine(0, -PH / 2, 0, PH / 2, 0.15);

    // Centre circle
    const ccGeo = new THREE.RingGeometry(6, 6.15, 48);
    const cc = new THREE.Mesh(ccGeo, lineMat);
    cc.rotation.x = -Math.PI / 2;
    cc.position.y = 0.01;
    scene.add(cc);

    // Centre spot
    const csDot = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16), lineMat);
    csDot.rotation.x = -Math.PI / 2;
    csDot.position.y = 0.01;
    scene.add(csDot);

    // Penalty areas
    const paW = 14,
      paH = 28;
    // Right
    makeLine(HALF, -paH / 2, HALF - paW, -paH / 2);
    makeLine(HALF, paH / 2, HALF - paW, paH / 2);
    makeLine(HALF - paW, -paH / 2, HALF - paW, paH / 2);
    // Left
    makeLine(-HALF, -paH / 2, -HALF + paW, -paH / 2);
    makeLine(-HALF, paH / 2, -HALF + paW, paH / 2);
    makeLine(-HALF + paW, -paH / 2, -HALF + paW, paH / 2);

    // Goal area (6-yard box)
    const gaW = 5,
      gaH = 14;
    makeLine(HALF, -gaH / 2, HALF - gaW, -gaH / 2);
    makeLine(HALF, gaH / 2, HALF - gaW, gaH / 2);
    makeLine(HALF - gaW, -gaH / 2, HALF - gaW, gaH / 2);
    makeLine(-HALF, -gaH / 2, -HALF + gaW, -gaH / 2);
    makeLine(-HALF, gaH / 2, -HALF + gaW, gaH / 2);
    makeLine(-HALF + gaW, -gaH / 2, -HALF + gaW, gaH / 2);

    // Goals (3D posts)
    buildGoal(HALF, 0);
    buildGoal(-HALF, 0, true);
  }

  function buildGoal(x, z, flip) {
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.6,
      roughness: 0.3,
    });
    const postRadius = 0.12,
      goalW = 5.5,
      goalH = 2.2,
      goalD = 1.5;
    const dir = flip ? 1 : -1;

    // Posts
    const postGeo = new THREE.CylinderGeometry(
      postRadius,
      postRadius,
      goalH,
      8,
    );
    const lPost = new THREE.Mesh(postGeo, postMat);
    lPost.position.set(x, goalH / 2, -goalW / 2);
    lPost.castShadow = true;
    scene.add(lPost);

    const rPost = new THREE.Mesh(postGeo, postMat);
    rPost.position.set(x, goalH / 2, goalW / 2);
    rPost.castShadow = true;
    scene.add(rPost);

    // Crossbar
    const barGeo = new THREE.CylinderGeometry(postRadius, postRadius, goalW, 8);
    const bar = new THREE.Mesh(barGeo, postMat);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(x, goalH, 0);
    bar.castShadow = true;
    scene.add(bar);

    // Net (semi-transparent)
    const netMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    // Back
    const backNet = new THREE.Mesh(
      new THREE.PlaneGeometry(goalW, goalH),
      netMat,
    );
    backNet.position.set(x + dir * goalD, goalH / 2, 0);
    scene.add(backNet);
    // Top
    const topNet = new THREE.Mesh(
      new THREE.PlaneGeometry(goalD, goalW),
      netMat,
    );
    topNet.rotation.x = Math.PI / 2;
    topNet.rotation.z = Math.PI / 2;
    topNet.position.set(x + (dir * goalD) / 2, goalH, 0);
    scene.add(topNet);
    // Sides
    const sideNet = new THREE.Mesh(
      new THREE.PlaneGeometry(goalD, goalH),
      netMat,
    );
    sideNet.rotation.y = Math.PI / 2;
    sideNet.position.set(x + (dir * goalD) / 2, goalH / 2, -goalW / 2);
    scene.add(sideNet);
    const sideNet2 = sideNet.clone();
    sideNet2.position.z = goalW / 2;
    scene.add(sideNet2);
  }

  // ---- Create a 3D Player Figure ----
  function createPlayer(color, isGK, isSubject) {
    const group = new THREE.Group();

    // Body (cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.4, 1.1, 12);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.5,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.15;
    body.castShadow = true;
    group.add(body);

    // Shorts
    const shortsGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.4, 12);
    const shortsMat = new THREE.MeshStandardMaterial({
      color: isGK ? 0x333333 : color === 0x1565c0 ? 0x0d2f6e : 0x7a1a1a,
      roughness: 0.6,
    });
    const shorts = new THREE.Mesh(shortsGeo, shortsMat);
    shorts.position.y = 0.6;
    shorts.castShadow = true;
    group.add(shorts);

    // Head
    const headGeo = new THREE.SphereGeometry(0.28, 12, 10);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xf0c8a0,
      roughness: 0.7,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.98;
    head.castShadow = true;
    group.add(head);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.7, 8);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0xf0c8a0,
      roughness: 0.7,
    });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-0.15, 0.2, 0);
    group.add(legL);
    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(0.15, 0.2, 0);
    group.add(legR);
    group.userData.legL = legL;
    group.userData.legR = legR;

    // Boots
    const bootGeo = new THREE.BoxGeometry(0.18, 0.12, 0.3);
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const bootL = new THREE.Mesh(bootGeo, bootMat);
    bootL.position.set(-0.15, -0.08, 0.05);
    group.add(bootL);
    const bootR = new THREE.Mesh(bootGeo, bootMat);
    bootR.position.set(0.15, -0.08, 0.05);
    group.add(bootR);
    group.userData.bootL = bootL;
    group.userData.bootR = bootR;

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.6, 8);
    const armMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.5,
    });
    const armL = new THREE.Mesh(armGeo, armMat);
    armL.position.set(-0.48, 1.2, 0);
    armL.rotation.z = 0.2;
    group.add(armL);
    const armR = new THREE.Mesh(armGeo, armMat);
    armR.position.set(0.48, 1.2, 0);
    armR.rotation.z = -0.2;
    group.add(armR);
    group.userData.armL = armL;
    group.userData.armR = armR;

    // Subject highlight ring
    if (isSubject) {
      const ringGeo = new THREE.RingGeometry(0.6, 0.75, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfdd835,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      group.add(ring);

      // Floating arrow above
      const arrowGeo = new THREE.ConeGeometry(0.25, 0.5, 8);
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0xfdd835 });
      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.position.y = 2.8;
      arrow.rotation.x = Math.PI;
      group.add(arrow);
      group.userData.arrow = arrow;
    }

    // GK gloves
    if (isGK) {
      const gloveMat = new THREE.MeshStandardMaterial({
        color: 0x76ff03,
      });
      const gloveGeo = new THREE.SphereGeometry(0.1, 8, 6);
      const gloveL = new THREE.Mesh(gloveGeo, gloveMat);
      gloveL.position.set(-0.5, 0.95, 0);
      group.add(gloveL);
      const gloveR = new THREE.Mesh(gloveGeo, gloveMat);
      gloveR.position.set(0.5, 0.95, 0);
      group.add(gloveR);
    }

    // Shadow disc
    const shadowGeo = new THREE.CircleGeometry(0.42, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    group.add(shadow);

    return group;
  }

  // ---- Create Ball ----
  function createBall() {
    const group = new THREE.Group();
    const ballGeo = new THREE.SphereGeometry(0.22, 16, 12);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.1,
    });
    const sphere = new THREE.Mesh(ballGeo, ballMat);
    sphere.castShadow = true;
    group.add(sphere);

    // Pentagon pattern (simplified — dark patches)
    const patchGeo = new THREE.SphereGeometry(0.225, 5, 1);
    const patchMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.5,
    });
    const patch = new THREE.Mesh(patchGeo, patchMat);
    patch.scale.set(0.4, 0.4, 0.4);
    patch.position.set(0.15, 0.08, 0.1);
    group.add(patch);
    const patch2 = patch.clone();
    patch2.position.set(-0.1, 0.12, -0.12);
    group.add(patch2);
    const patch3 = patch.clone();
    patch3.position.set(0.05, -0.15, 0.08);
    group.add(patch3);

    // Ball shadow
    const shadowGeo = new THREE.CircleGeometry(0.25, 12);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.2;
    group.add(shadow);
    group.userData.shadow = shadow;

    return group;
  }

  // ---- Offside Line ----
  function createOffsideLine(xPos) {
    if (offsideLineObj) scene.remove(offsideLineObj);
    const group = new THREE.Group();

    // Bold line on the ground
    const lineGeo = new THREE.PlaneGeometry(0.3, PH + 4);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xff1111,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.rotation.z = Math.PI / 2;
    line.position.set(xPos, 0.05, 0);
    group.add(line);

    // Tall vertical curtain — one solid plane across the whole pitch
    const curtainGeo = new THREE.PlaneGeometry(PH + 4, 3);
    const curtainMat = new THREE.MeshBasicMaterial({
      color: 0xff2222,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const curtain = new THREE.Mesh(curtainGeo, curtainMat);
    curtain.position.set(xPos, 1.5, 0);
    curtain.rotation.y = Math.PI / 2;
    group.add(curtain);

    // Dashed vertical poles for depth cues
    const poleMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.6,
    });
    for (let z = -PH / 2; z <= PH / 2; z += 5) {
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3, 6);
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(xPos, 1.5, z);
      group.add(pole);
    }

    scene.add(group);
    offsideLineObj = group;
    offsideLineObj.visible = false; // hidden until freeze
  }

  // ---- Camera Positions ----
  function getBaseCameraForMode(mode) {
    switch (mode) {
      case "linesman":
        return {
          pos: { x: 15, y: 1.85, z: -PH / 2 - 1.5 },
          target: { x: 10, y: 1.0, z: 0 },
        };
      case "broadcast":
        return {
          pos: { x: -5, y: 28, z: -35 },
          target: { x: 5, y: 0, z: 2 },
        };
      case "topdown":
        return {
          pos: { x: 5, y: 50, z: 0 },
          target: { x: 5, y: 0, z: 0 },
        };
      case "behindgoal":
        return {
          pos: { x: HALF + 10, y: 6, z: 0 },
          target: { x: 0, y: 0, z: 0 },
        };
      default:
        return {
          pos: { x: 15, y: 1.85, z: -PH / 2 - 1.5 },
          target: { x: 10, y: 1.0, z: 0 },
        };
    }
  }

  function setCameraPosition(mode, instant) {
    currentCamMode = mode;
    // Update buttons
    document
      .querySelectorAll(".cam-btn")
      .forEach((b) => b.classList.remove("active"));
    const btn = document.getElementById(
      "cam" + mode.charAt(0).toUpperCase() + mode.slice(1),
    );
    if (btn) btn.classList.add("active");

    if (!camera) return;

    const base = getBaseCameraForMode(mode);
    camGoalPos = { ...base.pos };
    camGoalTarget = { ...base.target };

    if (instant) {
      // Snap immediately (used on first load)
      camPos = { ...camGoalPos };
      camTarget = { ...camGoalTarget };
      camera.position.set(camPos.x, camPos.y, camPos.z);
      camera.lookAt(camTarget.x, camTarget.y, camTarget.z);
    }
  }

  function smoothLerp(current, goal, factor) {
    return current + (goal - current) * factor;
  }

  function updateCamera(t) {
    if (!camera || !scenarioData3D) return;

    const s = scenarioData3D;
    const smoothFactor = CAM_SMOOTH;

    // Compute desired camera goal based on mode and animation time
    const base = getBaseCameraForMode(currentCamMode);

    if (currentCamMode === "linesman") {
      // Phase 1: Gently track center of action
      if (t < passerKickTime) {
        const preT = t / passerKickTime;
        // Slowly pan to keep the developing play in view
        const midX = (s.passer.x + s.subject.x) / 2;
        camGoalPos.x = lerp(base.pos.x, midX, preT * 0.3);
        camGoalPos.y = base.pos.y;
        camGoalPos.z = base.pos.z;
        camGoalTarget.x = lerp(base.target.x, midX, preT * 0.4);
        camGoalTarget.y = 1.0;
        camGoalTarget.z = lerp(
          base.target.z,
          (s.passer.z + s.subject.z) / 2,
          preT * 0.3,
        );
      }
      // Phase 2: Smoothly transition to follow the subject
      else {
        const kickT = (t - passerKickTime) / (animDuration - passerKickTime);
        const easedT = Math.min(kickT, 1);
        // Ease in-out for smooth tracking
        const smoothT = easedT * easedT * (3 - 2 * easedT);
        const subjectX = s.subject.x + easedT * 2; // matches subject run
        camGoalPos.x = lerp(
          (s.passer.x + s.subject.x) / 2,
          subjectX - 3,
          smoothT,
        );
        camGoalPos.y = base.pos.y;
        camGoalPos.z = base.pos.z;
        camGoalTarget.x = lerp(
          (s.passer.x + s.subject.x) / 2,
          subjectX,
          smoothT,
        );
        camGoalTarget.y = 1.0;
        camGoalTarget.z = lerp(
          (s.passer.z + s.subject.z) / 2,
          s.subject.z,
          smoothT,
        );
      }
    } else if (currentCamMode === "broadcast") {
      // Subtle pan to follow the action
      if (t >= passerKickTime) {
        const kickT = (t - passerKickTime) / (animDuration - passerKickTime);
        const easedT = Math.min(kickT, 1);
        const smoothT = easedT * easedT * (3 - 2 * easedT);
        const midX = lerp(s.passer.x, (s.passer.x + s.subject.x) / 2, smoothT);
        camGoalTarget.x = lerp(base.target.x, midX, 0.4);
      } else {
        camGoalPos = { ...base.pos };
        camGoalTarget = { ...base.target };
      }
    } else {
      // topdown / behindgoal — minimal tracking
      camGoalPos = { ...base.pos };
      camGoalTarget = { ...base.target };
    }

    // Smoothly interpolate toward goals
    camPos.x = smoothLerp(camPos.x, camGoalPos.x, smoothFactor);
    camPos.y = smoothLerp(camPos.y, camGoalPos.y, smoothFactor);
    camPos.z = smoothLerp(camPos.z, camGoalPos.z, smoothFactor);
    camTarget.x = smoothLerp(camTarget.x, camGoalTarget.x, smoothFactor);
    camTarget.y = smoothLerp(camTarget.y, camGoalTarget.y, smoothFactor);
    camTarget.z = smoothLerp(camTarget.z, camGoalTarget.z, smoothFactor);

    camera.position.set(camPos.x, camPos.y, camPos.z);
    camera.lookAt(camTarget.x, camTarget.y, camTarget.z);
  }

  window.setCamera = function (mode) {
    setCameraPosition(mode, false);
  };

  // ---- Load scenario ----
  function load3DScenario(idx) {
    scenarioData3D = scenarios3D[idx];
    answered3D = false;
    frozen = false;
    animState = "playing";
    animTime = 0;

    // Clear existing players
    playerMeshes.forEach((m) => scene.remove(m));
    playerMeshes = [];
    if (ball3d) scene.remove(ball3d);

    const s = scenarioData3D;

    // Create passer
    const passer = createPlayer(0x1565c0, false, false);
    passer.position.set(s.passer.x, 0, s.passer.z);
    passer.lookAt(s.ballTarget.x, 0, s.ballTarget.z);
    scene.add(passer);
    playerMeshes.push(passer);
    passer.userData.role = "passer";
    passer.userData.startX = s.passer.x;
    passer.userData.startZ = s.passer.z;

    // Create subject
    const subject = createPlayer(0x1565c0, false, true);
    subject.position.set(s.subject.x, 0, s.subject.z);
    subject.lookAt(HALF, 0, s.subject.z);
    scene.add(subject);
    playerMeshes.push(subject);
    subject.userData.role = "subject";
    subject.userData.startX = s.subject.x;
    subject.userData.startZ = s.subject.z;

    // Other attackers
    s.attackers.forEach((a) => {
      const atk = createPlayer(0x1565c0, false, false);
      atk.position.set(a.x, 0, a.z);
      atk.lookAt(HALF, 0, a.z);
      scene.add(atk);
      playerMeshes.push(atk);
      atk.userData.role = "attacker";
      atk.userData.startX = a.x;
      atk.userData.startZ = a.z;
    });

    // Defenders
    s.defenders.forEach((d) => {
      const def = createPlayer(0xc62828, false, false);
      def.position.set(d.x, 0, d.z);
      def.lookAt(-HALF, 0, d.z);
      scene.add(def);
      playerMeshes.push(def);
      def.userData.role = "defender";
      def.userData.startX = d.x;
      def.userData.startZ = d.z;
    });

    // Goalkeeper
    const gk = createPlayer(0xff9800, true, false);
    gk.position.set(s.gk.x, 0, s.gk.z);
    gk.lookAt(0, 0, 0);
    scene.add(gk);
    playerMeshes.push(gk);
    gk.userData.role = "gk";
    gk.userData.startX = s.gk.x;
    gk.userData.startZ = s.gk.z;

    // Ball
    ball3d = createBall();
    ball3d.position.set(s.passer.x + 0.6, 0.22, s.passer.z);
    scene.add(ball3d);
    ballStartPos = { x: s.passer.x + 0.6, z: s.passer.z };
    ballEndPos = { x: s.ballTarget.x, z: s.ballTarget.z };

    // Offside line
    let defXs = s.defenders.map((d) => d.x);
    defXs.push(s.gk.x);
    defXs.sort((a, b) => b - a);
    const offsideX = defXs[1]; // second-last opponent
    createOffsideLine(offsideX);

    // Update HUD
    document.getElementById("hud-scenario").textContent =
      idx + 1 + " / " + scenarios3D.length;
    document.getElementById("hud-streak").textContent = "🔥 " + score3D.streak;
    // Show difficulty badge on HUD
    const diffBadge = document.getElementById("hud-difficulty");
    if (diffBadge && s.difficulty) {
      diffBadge.textContent = s.difficulty.toUpperCase();
      diffBadge.className = "hud-diff-badge diff-" + s.difficulty;
    }

    // Reset UI
    document.getElementById("freezeBanner").style.display = "none";
    document.getElementById("decisionButtons").style.display = "none";
    clearDecisionTimer();
    document.getElementById("result3d").className = "result-3d";
    document.getElementById("btn3dOffside").disabled = false;
    document.getElementById("btn3dOnside").disabled = false;
    document.getElementById("btn3dNext").style.display = "none";
    document.getElementById("btn3dRestart").style.display = "none";
    document.getElementById("explanation3d").classList.remove("show");
    offsideLineForced = false;
    offsideLineUserOff = false;

    // Camera follows linesman-style
    setCameraPosition(currentCamMode, true);

    // Set duration that allows some pre-kick movement
    passerKickTime = 1.2; // passer kicks at 1.2s
    animDuration = 2.2; // freeze at 2.2s (1s after kick)
    totalDuration = 3.2; // slider goes slightly past freeze

    // Reset playback state
    isPlaying = true;
    document.getElementById("btnPlayPause").textContent = "⏸";

    // Set up timeline slider
    const slider = document.getElementById("timelineSlider");
    slider.value = 0;
    updateSliderFill(0);
    document.getElementById("timelineCurrent").textContent = "0.0s";
    document.getElementById("timelineTotal").textContent =
      totalDuration.toFixed(1) + "s";
    document.getElementById("timelinePhase").textContent = "▶ Build-up";

    // Position the kick marker on the slider
    const kickPct = (passerKickTime / totalDuration) * 100;
    document.getElementById("kickMarker").style.left = kickPct + "%";
  }

  // ---- Timeline Slider ----
  function setupSliderEvents() {
    const slider = document.getElementById("timelineSlider");
    if (!slider) return;

    slider.addEventListener("input", () => {
      sliderDragging = true;
      const pct = slider.value / 1000;
      animTime = pct * totalDuration;
      applySceneAtTime(animTime);
      updateTimelineUI(animTime);
    });

    slider.addEventListener("pointerdown", () => {
      sliderDragging = true;
      isPlaying = false;
      document.getElementById("btnPlayPause").textContent = "▶";
    });

    slider.addEventListener("pointerup", () => {
      sliderDragging = false;
    });

    slider.addEventListener("change", () => {
      sliderDragging = false;
    });
  }

  function updateSliderFill(pct) {
    const slider = document.getElementById("timelineSlider");
    if (slider) slider.style.setProperty("--fill", pct * 100 + "%");
  }

  function updateTimelineUI(t) {
    const pct = Math.min(t / totalDuration, 1);
    const slider = document.getElementById("timelineSlider");
    if (slider && !sliderDragging) slider.value = Math.round(pct * 1000);
    updateSliderFill(pct);

    document.getElementById("timelineCurrent").textContent = t.toFixed(1) + "s";

    // Phase indicator
    const phase = document.getElementById("timelinePhase");
    if (t < passerKickTime) {
      phase.textContent = "▶ Build-up";
      phase.style.color = "#aaa";
    } else if (t < animDuration) {
      phase.textContent = "⚡ Ball in flight — WATCH THE POSITIONS!";
      phase.style.color = "#fdd835";
    } else {
      phase.textContent = "⏸ Moment of the pass — Make your call!";
      phase.style.color = "#69f0ae";
    }
  }

  // Apply the scene state at any given time (for scrubbing)
  function applySceneAtTime(t) {
    if (!scenarioData3D) return;
    animateScenario(t, 0);
    updateCamera(t);

    // Show/hide offside line — only when user toggles it on
    if (offsideLineObj) {
      offsideLineObj.visible = offsideLineForced;
    }

    // Show/hide freeze banner & buttons
    if (t >= animDuration && !answered3D) {
      document.getElementById("freezeBanner").style.display = "block";
      document.getElementById("decisionButtons").style.display = "flex";
      if (!frozen && timedMode && !decisionTimer) {
        startDecisionTimer();
      }
      frozen = true;
    } else if (t < animDuration) {
      if (!answered3D) {
        document.getElementById("freezeBanner").style.display = "none";
        document.getElementById("decisionButtons").style.display = "none";
        clearDecisionTimer();
      }
      frozen = false;
    }
  }

  // Playback controls
  window.togglePlayPause = function () {
    isPlaying = !isPlaying;
    document.getElementById("btnPlayPause").textContent = isPlaying ? "⏸" : "▶";
    if (isPlaying && animTime >= totalDuration) {
      animTime = 0; // restart if at end
    }
  };

  window.stepFrame = function (delta) {
    isPlaying = false;
    document.getElementById("btnPlayPause").textContent = "▶";
    animTime = Math.max(0, Math.min(totalDuration, animTime + delta));
    applySceneAtTime(animTime);
    updateTimelineUI(animTime);
  };

  window.cycleSpeed = function () {
    const speeds = [0.25, 0.5, 1, 1.5, 2];
    const idx = speeds.indexOf(playbackSpeed);
    playbackSpeed = speeds[(idx + 1) % speeds.length];
    document.getElementById("btnSpeed").textContent = playbackSpeed + "×";
  };

  window.toggleOffsideLine = function () {
    offsideLineForced = !offsideLineForced;
    const btn = document.getElementById("btnShowLine");
    btn.classList.toggle("active", offsideLineForced);
    if (offsideLineObj) offsideLineObj.visible = offsideLineForced;
  };

  // ---- Animation Loop ----
  function animate() {
    requestAnimationFrame(animate);
    if (!renderer) return;

    const dt = clock.getDelta();

    if (
      scenarioData3D &&
      isPlaying &&
      !sliderDragging &&
      animState !== "result"
    ) {
      animTime += dt * playbackSpeed;

      // Clamp within total scrub range
      if (animTime > totalDuration) {
        animTime = totalDuration;
        isPlaying = false;
        document.getElementById("btnPlayPause").textContent = "▶";
      }

      applySceneAtTime(animTime);
      updateTimelineUI(animTime);

      if (animTime >= animDuration && !frozen && !answered3D) {
        freezeScene();
      }
    }

    // Idle animations (breathing, arrow bob)
    playerMeshes.forEach((p, i) => {
      const body = p.children[0];
      if (body) body.scale.y = 1 + Math.sin(clock.elapsedTime * 2 + i) * 0.01;

      if (p.userData.arrow) {
        p.userData.arrow.position.y =
          2.8 + Math.sin(clock.elapsedTime * 3) * 0.15;
      }
    });

    // Ball spin when in flight
    if (ball3d && animTime > passerKickTime && (isPlaying || sliderDragging)) {
      ball3d.children[0].rotation.x += dt * 8;
      ball3d.children[0].rotation.z += dt * 3;
    }

    // Always keep camera smoothly interpolating (for camera mode switches during pause/result)
    if (scenarioData3D && !isPlaying && !sliderDragging) {
      updateCamera(animTime);
    }

    renderer.render(scene, camera);
  }

  // ---- Animate the scenario ----
  function animateScenario(t, dt) {
    const s = scenarioData3D;

    // Phase 1: Pre-kick (0 to passerKickTime) — players jog/move slightly
    if (t < passerKickTime) {
      const preT = t / passerKickTime; // 0..1

      // Passer runs toward ball slightly
      const passer = playerMeshes.find((p) => p.userData.role === "passer");
      if (passer) {
        // Run animation (legs)
        animateRunning(passer, t, 5);
      }

      // Subject makes a forward run
      const subject = playerMeshes.find((p) => p.userData.role === "subject");
      if (subject) {
        const runDist = 3; // run forward 3 units during buildup
        subject.position.x = s.subject.x - runDist * (1 - preT);
        subject.position.z = s.subject.z;
        animateRunning(subject, t, 6);
      }

      // Other attackers shift
      let atkIdx = 0;
      playerMeshes
        .filter((p) => p.userData.role === "attacker")
        .forEach((atk) => {
          atk.position.x = s.attackers[atkIdx].x - 1 * (1 - preT);
          animateRunning(atk, t, 4);
          atkIdx++;
        });

      // Defenders shift
      let defIdx = 0;
      playerMeshes
        .filter((p) => p.userData.role === "defender")
        .forEach((def) => {
          const jitter = Math.sin(t * 3 + defIdx) * 0.3;
          def.position.z = s.defenders[defIdx].z + jitter;
          animateRunning(def, t, 3);
          defIdx++;
        });
    }

    // Phase 2: Kick and ball travel (passerKickTime to animDuration)
    if (t >= passerKickTime) {
      const kickT = (t - passerKickTime) / (animDuration - passerKickTime);
      const easedT = Math.min(kickT, 1);

      // Passer kick animation
      const passer = playerMeshes.find((p) => p.userData.role === "passer");
      if (passer) {
        const kickPhase = Math.min((t - passerKickTime) * 4, 1);
        if (passer.userData.legR) {
          passer.userData.legR.rotation.x =
            -Math.sin(kickPhase * Math.PI) * 0.9;
        }
        if (passer.userData.bootR) {
          passer.userData.bootR.rotation.x =
            -Math.sin(kickPhase * Math.PI) * 0.5;
        }
        if (passer.userData.armL) {
          passer.userData.armL.rotation.x = Math.sin(kickPhase * Math.PI) * 0.4;
        }
        // Body lean
        passer.children[0].rotation.x = Math.sin(kickPhase * Math.PI) * 0.1;
      }

      // Ball trajectory (with arc for height)
      const bx = ballStartPos.x + (ballEndPos.x - ballStartPos.x) * easedT;
      const bz = ballStartPos.z + (ballEndPos.z - ballStartPos.z) * easedT;
      const arc = Math.sin(easedT * Math.PI) * 2.5; // height arc
      ball3d.position.set(bx, 0.22 + arc, bz);

      // Update ball shadow
      if (ball3d.userData.shadow) {
        ball3d.userData.shadow.position.y = -(0.22 + arc) + 0.02;
        ball3d.userData.shadow.scale.setScalar(1 + arc * 0.2);
        ball3d.userData.shadow.material.opacity = 0.18 / (1 + arc * 0.3);
      }

      // Subject continues run
      const subject = playerMeshes.find((p) => p.userData.role === "subject");
      if (subject) {
        const runExtra = easedT * 2;
        subject.position.x = s.subject.x + runExtra;
        animateRunning(subject, t, 8);
      }
    }
  }

  function animateRunning(player, t, speed) {
    if (player.userData.legL) {
      player.userData.legL.rotation.x = Math.sin(t * speed) * 0.5;
    }
    if (player.userData.legR) {
      player.userData.legR.rotation.x = -Math.sin(t * speed) * 0.5;
    }
    if (player.userData.armL) {
      player.userData.armL.rotation.x = -Math.sin(t * speed) * 0.3;
    }
    if (player.userData.armR) {
      player.userData.armR.rotation.x = Math.sin(t * speed) * 0.3;
    }
    // Slight body bob
    player.position.y = Math.abs(Math.sin(t * speed)) * 0.06;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ---- Freeze ----
  function freezeScene() {
    frozen = true;
    animState = "frozen";
    isPlaying = false;
    document.getElementById("btnPlayPause").textContent = "▶";

    // Show offside line
    if (offsideLineObj) offsideLineObj.visible = true;

    // Show freeze banner + buttons
    document.getElementById("freezeBanner").style.display = "block";
    document.getElementById("decisionButtons").style.display = "flex";

    // Play a freeze sound effect (optional visual flash)
    flashScreen();
  }

  function flashScreen() {
    const container = document.getElementById("scene3d-container");
    container.style.outline = "3px solid #fdd835";
    setTimeout(() => {
      container.style.outline = "none";
    }, 300);
  }

  // ---- Decision Timer (Hard mode) ----
  function startDecisionTimer() {
    decisionTimeLeft = DECISION_TIME;
    const timerEl = document.getElementById("decisionTimer");
    if (timerEl) {
      timerEl.style.display = "block";
      timerEl.textContent = decisionTimeLeft.toFixed(1) + "s";
      timerEl.classList.remove("timer-urgent");
    }
    decisionTimer = setInterval(() => {
      decisionTimeLeft -= 0.1;
      if (timerEl) {
        timerEl.textContent = Math.max(0, decisionTimeLeft).toFixed(1) + "s";
        if (decisionTimeLeft <= 1.5) timerEl.classList.add("timer-urgent");
      }
      if (decisionTimeLeft <= 0) {
        clearDecisionTimer();
        // Time's up — count as wrong (random guess)
        if (!answered3D) {
          timedOut3D();
        }
      }
    }, 100);
  }

  function clearDecisionTimer() {
    if (decisionTimer) {
      clearInterval(decisionTimer);
      decisionTimer = null;
    }
    const timerEl = document.getElementById("decisionTimer");
    if (timerEl) timerEl.style.display = "none";
  }

  function timedOut3D() {
    answered3D = true;
    clearDecisionTimer();

    const s = scenarios3D[current3DScenario];
    score3D.wrong++;
    score3D.streak = 0;

    document.getElementById("btn3dOffside").disabled = true;
    document.getElementById("btn3dOnside").disabled = true;
    document.getElementById("freezeBanner").style.display = "none";

    const result = document.getElementById("result3d");
    const verdict = document.getElementById("result3dVerdict");
    const sub = document.getElementById("result3dSub");

    verdict.textContent = "⏱️ TOO SLOW!";
    sub.textContent = s.offside
      ? "It was OFFSIDE — a real linesman needs to react fast!"
      : "It was ONSIDE — you hesitated too long!";
    result.className = "result-3d wrong show";

    const expl = document.getElementById("explanation3d");
    expl.textContent = s.explanation;
    expl.classList.add("show");

    const total = score3D.correct + score3D.wrong;
    document.getElementById("t3Correct").textContent = "✓ " + score3D.correct;
    document.getElementById("t3Wrong").textContent = "✗ " + score3D.wrong;
    document.getElementById("t3Total").textContent =
      total + " / " + scenarios3D.length;
    document.getElementById("t3Progress").style.width =
      (total / scenarios3D.length) * 100 + "%";
    document.getElementById("hud-streak").textContent = "🔥 " + score3D.streak;

    if (current3DScenario < scenarios3D.length - 1) {
      document.getElementById("btn3dNext").style.display = "";
    } else {
      document.getElementById("btn3dRestart").style.display = "";
      const pct = Math.round((score3D.correct / scenarios3D.length) * 100);
      let msg =
        pct >= 80
          ? "🎉 Superb! You're ready for matchday!"
          : pct >= 60
            ? "👍 Decent — a few more rounds will sharpen you up."
            : "📚 Keep at it! Try again and focus on the key moments.";
      expl.textContent += `\n\nFinal Score: ${score3D.correct}/${scenarios3D.length} (${pct}%) — ${msg}`;
    }
    animState = "result";
  }

  // ---- Submit 3D Answer ----
  window.submit3DAnswer = function (isOffside) {
    if (answered3D) return;
    answered3D = true;
    clearDecisionTimer();

    const s = scenarios3D[current3DScenario];
    const correct = isOffside === s.offside;

    document.getElementById("btn3dOffside").disabled = true;
    document.getElementById("btn3dOnside").disabled = true;
    document.getElementById("freezeBanner").style.display = "none";

    const result = document.getElementById("result3d");
    const verdict = document.getElementById("result3dVerdict");
    const sub = document.getElementById("result3dSub");

    if (correct) {
      score3D.correct++;
      score3D.streak++;
      verdict.textContent = "✅ CORRECT!";
      sub.textContent = s.offside
        ? "That IS offside — good eye!"
        : "That is NOT offside — well spotted!";
      result.className = "result-3d correct show";
    } else {
      score3D.wrong++;
      score3D.streak = 0;
      verdict.textContent = "❌ WRONG!";
      sub.textContent = s.offside
        ? "That IS offside — the attacker was past the line."
        : "That is NOT offside — keep your flag down!";
      result.className = "result-3d wrong show";
    }

    // Show explanation
    const expl = document.getElementById("explanation3d");
    expl.textContent = s.explanation;
    expl.classList.add("show");

    // Update scores
    const total = score3D.correct + score3D.wrong;
    document.getElementById("t3Correct").textContent = "✓ " + score3D.correct;
    document.getElementById("t3Wrong").textContent = "✗ " + score3D.wrong;
    document.getElementById("t3Total").textContent =
      total + " / " + scenarios3D.length;
    document.getElementById("t3Progress").style.width =
      (total / scenarios3D.length) * 100 + "%";
    document.getElementById("hud-streak").textContent = "🔥 " + score3D.streak;

    // Show appropriate buttons
    if (current3DScenario < scenarios3D.length - 1) {
      document.getElementById("btn3dNext").style.display = "";
    } else {
      document.getElementById("btn3dRestart").style.display = "";
      const pct = Math.round((score3D.correct / scenarios3D.length) * 100);
      let msg =
        pct >= 80
          ? "🎉 Superb! You're ready for matchday!"
          : pct >= 60
            ? "👍 Decent — a few more rounds will sharpen you up."
            : "📚 Keep at it! Try again and focus on the key moments.";
      expl.textContent += `\n\nFinal Score: ${score3D.correct}/${scenarios3D.length} (${pct}%) — ${msg}`;
    }

    animState = "result";
  };

  // ---- Next / Replay / Restart ----
  window.next3DScenario = function () {
    current3DScenario++;
    load3DScenario(current3DScenario);
    clock.start();
  };

  window.replay3DScenario = function () {
    // If already answered, reset the answered state too for re-watching
    if (answered3D) {
      // Don't re-score, just let them re-watch the animation
      document.getElementById("result3d").className = "result-3d";
      document.getElementById("freezeBanner").style.display = "none";
      document.getElementById("decisionButtons").style.display = "none";
    }
    animTime = 0;
    frozen = false;
    animState = "playing";
    isPlaying = true;
    offsideLineForced = false;
    offsideLineUserOff = false;
    clearDecisionTimer();
    document.getElementById("btnPlayPause").textContent = "⏸";
    document.getElementById("btnShowLine").classList.remove("active");
    if (offsideLineObj) offsideLineObj.visible = false;

    // Reset ball and player positions to frame 0
    if (ball3d && ballStartPos) {
      ball3d.position.set(ballStartPos.x, 0.22, ballStartPos.z);
    }
    applySceneAtTime(0);
    updateTimelineUI(0);
    setCameraPosition(currentCamMode, true);
    clock.start();
  };

  window.restart3D = function () {
    current3DScenario = 0;
    score3D = { correct: 0, wrong: 0, streak: 0 };
    // Re-shuffle for a fresh round
    buildScenarioList(currentDifficulty);
    document.getElementById("t3Correct").textContent = "✓ 0";
    document.getElementById("t3Wrong").textContent = "✗ 0";
    document.getElementById("t3Total").textContent =
      "0 / " + scenarios3D.length;
    document.getElementById("t3Progress").style.width = "0%";
    load3DScenario(0);
    clock.start();
  };

  // ---- Difficulty selector ----
  window.setDifficulty = function (difficulty) {
    // Update button states
    document
      .querySelectorAll(".diff-btn")
      .forEach((b) => b.classList.remove("active"));
    const btn = document.querySelector(
      '.diff-btn[data-diff="' + difficulty + '"]',
    );
    if (btn) btn.classList.add("active");

    // Show/hide timed badge
    const badge = document.getElementById("timedBadge");
    if (badge) badge.style.display = difficulty === "hard" ? "inline" : "none";

    // Rebuild and restart
    current3DScenario = 0;
    score3D = { correct: 0, wrong: 0, streak: 0 };
    buildScenarioList(difficulty);
    document.getElementById("t3Correct").textContent = "✓ 0";
    document.getElementById("t3Wrong").textContent = "✗ 0";
    document.getElementById("t3Total").textContent =
      "0 / " + scenarios3D.length;
    document.getElementById("t3Progress").style.width = "0%";
    if (initialized) {
      load3DScenario(0);
      clock.start();
    }
  };

  // ---- Tab activation hook ----
  const origNavHandler = () => {
    // Initialize 3D when tab becomes active
    const sec3d = document.getElementById("sec-3d");
    if (sec3d && sec3d.classList.contains("active")) {
      init3D();
    }
  };

  // Override tab navigation to hook init
  document.querySelectorAll("nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(origNavHandler, 50);
    });
  });
})();
