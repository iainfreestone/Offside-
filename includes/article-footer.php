<!-- Related Guides -->
<aside class="related-guides">
    <h3>More Guides for Parent Linesmen</h3>
    <div class="related-grid">
        <?php if ($article_slug !== 'first-time-linesman'): ?>
            <a href="first-time-linesman" class="related-card">
                <span class="related-icon">🆕</span>
                <span class="related-title">Your First Time as Linesman</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'common-offside-mistakes'): ?>
            <a href="common-offside-mistakes" class="related-card">
                <span class="related-icon">⚠️</span>
                <span class="related-title">7 Common Offside Mistakes</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'tricky-offside-scenarios'): ?>
            <a href="tricky-offside-scenarios" class="related-card">
                <span class="related-icon">🧩</span>
                <span class="related-title">5 Tricky Scenarios</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'club-assistant-referee-guide'): ?>
            <a href="club-assistant-referee-guide" class="related-card">
                <span class="related-icon">🏟️</span>
                <span class="related-title">Complete AR Guide</span>
            </a>
        <?php endif; ?>
        <?php if ($article_slug !== 'offside-rule-faq'): ?>
            <a href="offside-rule-faq" class="related-card">
                <span class="related-icon">❓</span>
                <span class="related-title">Offside FAQ</span>
            </a>
        <?php endif; ?>
    </div>
</aside>

<!-- Share this guide -->
<div class="share-bar">
    <p class="share-label">📣 Found this useful? Share it with your team:</p>
    <div class="share-buttons">
        <a class="share-btn share-whatsapp"
            href="https://api.whatsapp.com/send?text=<?php echo rawurlencode($article_title . ' — ' . 'https://www.offsideexplained.com/guides/' . $article_slug); ?>"
            target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
        </a>
        <a class="share-btn share-facebook"
            href="https://www.facebook.com/sharer/sharer.php?u=<?php echo rawurlencode('https://www.offsideexplained.com/guides/' . $article_slug); ?>"
            target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
        </a>
        <a class="share-btn share-twitter"
            href="https://twitter.com/intent/tweet?text=<?php echo rawurlencode($article_title); ?>&url=<?php echo rawurlencode('https://www.offsideexplained.com/guides/' . $article_slug); ?>"
            target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X
        </a>
        <button class="share-btn share-copy"
            onclick="navigator.clipboard.writeText('https://www.offsideexplained.com/guides/<?php echo $article_slug; ?>');this.textContent='✓ Copied!';setTimeout(()=>{this.innerHTML='📋 Copy Link'},2000)">
            📋 Copy Link
        </button>
    </div>
</div>

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