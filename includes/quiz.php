<!-- ==================== QUIZ ==================== -->
<section class="section" id="sec-quiz">
    <h2>Knowledge Quiz</h2>
    <p>Test your understanding of the offside rule with these questions.</p>

    <div class="score-bar">
        <span class="score-correct" id="qCorrect">✓ 0</span>
        <span class="score-wrong" id="qWrong">✗ 0</span>
        <span class="score-total" id="qTotal">0 / 0</span>
    </div>

    <div class="progress-bar-container">
        <div class="progress-bar-fill" id="qProgress" style="width: 0%"></div>
    </div>

    <div class="card" id="quizCard">
        <h3 id="quizQuestion"></h3>
        <div id="quizOptions"></div>
    </div>

    <div class="explanation-text" id="quizExplanation"></div>

    <div class="scenario-controls">
        <button class="btn btn-primary" id="btnQuizNext" onclick="nextQuizQuestion()" style="display: none">
            Next Question →
        </button>
        <button class="btn btn-outline" id="btnQuizReset" onclick="resetQuiz()" style="display: none">
            🔄 Start Over
        </button>
    </div>
</section>