<!-- ==================== 3D INTERACTIVE ==================== -->
<section class="section" id="sec-3d">
    <p>
        Watch the play unfold in 3D from the linesman's view. When the pass is
        made, the action <strong>freezes</strong> — make your call!
    </p>

    <div class="difficulty-selector">
        <span class="diff-label">Difficulty:</span>
        <button class="diff-btn active" data-diff="all" onclick="setDifficulty('all')">🎯 All</button>
        <button class="diff-btn" data-diff="easy" onclick="setDifficulty('easy')">🟢 Easy</button>
        <button class="diff-btn" data-diff="medium" onclick="setDifficulty('medium')">🟡 Medium</button>
        <button class="diff-btn" data-diff="hard" onclick="setDifficulty('hard')">🔴 Hard</button>
        <span class="timed-badge" id="timedBadge" style="display:none">⏱️ TIMED</span>
    </div>

    <div class="score-bar">
        <span class="score-correct" id="t3Correct">✓ 0</span>
        <span class="score-wrong" id="t3Wrong">✗ 0</span>
        <span class="score-total" id="t3Total">0 / 0</span>
    </div>
    <div class="progress-bar-container">
        <div class="progress-bar-fill" id="t3Progress" style="width: 0%"></div>
    </div>

    <div class="camera-controls">
        <button class="cam-btn active" onclick="setCamera('linesman')" id="camLinesman">
            🚩 Linesman View
        </button>
        <button class="cam-btn" onclick="setCamera('broadcast')" id="camBroadcast">
            📺 Broadcast
        </button>
        <button class="cam-btn" onclick="setCamera('topdown')" id="camTopdown">
            🔽 Top Down
        </button>
        <button class="cam-btn" onclick="setCamera('behindgoal')" id="camBehindgoal">
            🥅 Behind Goal
        </button>
    </div>

    <div id="scene3d-container">
        <!-- Start screen -->
        <div class="start-screen" id="startScreen">
            <div class="start-screen-inner">
                <div class="start-screen-icon">🏟️</div>
                <h3>Interactive Offside Trainer</h3>
                <p>Watch 3D match scenarios from the linesman's view. When the pass is made, the action freezes — you
                    make the call.</p>
                <button class="hero-btn start-btn" id="btnStartTrainer" onclick="startTrainer()">
                    ▶ Start Training
                </button>
                <span class="start-hint">Select a difficulty above, then press start</span>
            </div>
        </div>
        <div class="hud-overlay">
            <div class="hud-box">
                <span class="label">SCENARIO</span>
                <span id="hud-scenario">1 / 8</span>
            </div>
            <div class="hud-box">
                <span class="label">DIFFICULTY</span>
                <span class="hud-diff-badge" id="hud-difficulty"></span>
            </div>
            <div class="hud-box">
                <span class="label">STREAK</span>
                <span class="hud-streak" id="hud-streak">🔥 0</span>
            </div>
        </div>
        <div class="decision-timer" id="decisionTimer" style="display:none">4.0s</div>
        <div class="freeze-banner" id="freezeBanner">
            ⏸️ FREEZE! Make your call — Offside or Onside?
        </div>
        <div class="decision-buttons" id="decisionButtons" style="display: none">
            <button class="btn-3d-offside" id="btn3dOffside" onclick="submit3DAnswer(true)">
                🚩 OFFSIDE
            </button>
            <button class="btn-3d-onside" id="btn3dOnside" onclick="submit3DAnswer(false)">
                ✅ ONSIDE
            </button>
        </div>
        <div class="result-3d" id="result3d">
            <div class="verdict" id="result3dVerdict"></div>
            <div class="sub" id="result3dSub"></div>
        </div>
    </div>

    <!-- Timeline & Playback Controls -->
    <div class="timeline-bar" id="timelineBar">
        <div class="timeline-row">
            <span class="timeline-time" id="timelineCurrent">0.0s</span>
            <div class="timeline-slider-wrap">
                <input type="range" class="timeline-slider" id="timelineSlider" min="0" max="1000" value="0" step="1" />
                <div class="kick-marker" id="kickMarker" style="left: 50%"></div>
            </div>
            <span class="timeline-time" id="timelineTotal">2.2s</span>
        </div>
        <div class="playback-controls">
            <button class="pb-btn" onclick="stepFrame(-0.15)" title="Step Back">
                ⏪
            </button>
            <button class="pb-btn" onclick="stepFrame(-0.05)" title="Nudge Back">
                ◀
            </button>
            <button class="pb-btn pb-btn-play" id="btnPlayPause" onclick="togglePlayPause()" title="Play / Pause">
                ⏸
            </button>
            <button class="pb-btn" onclick="stepFrame(0.05)" title="Nudge Forward">
                ▶
            </button>
            <button class="pb-btn" onclick="stepFrame(0.15)" title="Step Forward">
                ⏩
            </button>
            <span style="width: 12px"></span>
            <button class="pb-btn" id="btnSpeed" onclick="cycleSpeed()" title="Playback Speed">
                1×
            </button>
            <span style="width: 8px"></span>
            <button class="pb-btn" onclick="replay3DScenario()" title="Replay">
                🔄
            </button>
            <button class="pb-btn" id="btnShowLine" onclick="toggleOffsideLine()" title="Toggle Offside Line">
                📏
            </button>
        </div>
        <div class="timeline-phase" id="timelinePhase">▶ Build-up</div>
    </div>

    <div class="explanation-text" id="explanation3d"></div>

    <div class="replay-bar">
        <button class="btn btn-primary" id="btn3dNext" onclick="next3DScenario()" style="display: none">
            Next Scenario →
        </button>
        <button class="btn btn-outline" id="btn3dRestart" onclick="restart3D()" style="display: none">
            🏆 Start Over
        </button>
    </div>
</section>