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

    <!-- Share -->
    <div class="share-bar share-bar-compact">
        <p class="share-label">📣 Know a parent who'd find this useful?</p>
        <div class="share-buttons">
            <a class="share-btn share-whatsapp"
                href="https://api.whatsapp.com/send?text=Check%20out%20this%20free%20interactive%20offside%20trainer%20%E2%80%93%20perfect%20for%20parents%20running%20the%20line!%20https%3A%2F%2Fwww.offsideexplained.com"
                target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
            </a>
            <a class="share-btn share-facebook"
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.offsideexplained.com"
                target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
            </a>
            <a class="share-btn share-twitter"
                href="https://twitter.com/intent/tweet?text=Free%20offside%20rule%20trainer%20for%20parents&url=https%3A%2F%2Fwww.offsideexplained.com"
                target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
            </a>
            <button class="share-btn share-copy"
                onclick="navigator.clipboard.writeText('https://www.offsideexplained.com');this.textContent='✓ Copied!';setTimeout(()=>{this.innerHTML='📋 Copy'},2000)">
                📋 Copy
            </button>
        </div>
    </div>
</section>