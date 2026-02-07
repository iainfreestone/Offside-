<!-- Related Guides -->
<aside class="related-guides">
    <h3>More Guides for Parent Linesmen</h3>
    <div class="related-grid">
        <?php if ($article_slug !== 'first-time-linesman'): ?>
            <a href="first-time-linesman.php" class="related-card">
                <span class="related-icon">🆕</span>
                <span class="related-title">Your First Time as Linesman</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'common-offside-mistakes'): ?>
            <a href="common-offside-mistakes.php" class="related-card">
                <span class="related-icon">⚠️</span>
                <span class="related-title">7 Common Offside Mistakes</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'tricky-offside-scenarios'): ?>
            <a href="tricky-offside-scenarios.php" class="related-card">
                <span class="related-icon">🧩</span>
                <span class="related-title">5 Tricky Scenarios</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'club-assistant-referee-guide'): ?>
            <a href="club-assistant-referee-guide.php" class="related-card">
                <span class="related-icon">🏟️</span>
                <span class="related-title">Complete AR Guide</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'offside-rule-faq'): ?>
            <a href="offside-rule-faq.php" class="related-card">
                <span class="related-icon">❓</span>
                <span class="related-title">Offside FAQ</span>
            </a>
        <?php endif; ?>
    </div>
</aside>

<!-- CTA Back to Trainer -->
<div class="article-cta">
    <h3>Ready to Practise?</h3>
    <p>Put what you've learnt into action with our free interactive 3D trainer — 21 real match scenarios from the
        linesman's view.</p>
    <a href="../#interactive" class="hero-btn" onclick="sessionStorage.setItem('autoTab','3d')">🏟️ Try the Interactive
        Trainer</a>
    <span class="hero-sub">No sign-up required — works on desktop &amp; mobile</span>
</div>

<!-- Footer -->
<footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
        <nav class="footer-links" aria-label="Footer navigation">
            <a class="footer-link" href="../">Home</a>
            <a class="footer-link" href="../#learn">Learn the Rule</a>
            <a class="footer-link" href="../#interactive">Interactive Trainer</a>
            <a class="footer-link" href="../#quiz">Quiz</a>
            <a class="footer-link" href="../#guides">Guides</a>
            <a class="footer-link" href="../#tips">Matchday Tips</a>
        </nav>
        <p class="footer-tagline">Built for parents standing on the touchline for the first time &mdash; the offside
            rule explained simply, with free interactive training scenarios based on real grassroots football
            situations.</p>
        <p class="footer-copy">&copy; <?php echo date('Y'); ?> The Offside Rule Explained — Free Interactive Offside
            Trainer for Parent Linesmen</p>
    </div>
</footer>
</body>

</html>