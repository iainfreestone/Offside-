<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Not Found — The Offside Rule Explained</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@700&display=swap"
        rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #0a0e17;
            color: rgba(255, 255, 255, 0.85);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }

        .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 2rem;
            color: #00ff87;
            margin-bottom: 0.5rem;
        }

        p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.05rem;
            line-height: 1.6;
            max-width: 480px;
            margin-bottom: 1.5rem;
        }

        .home-link {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #00ff87, #00cc6a);
            color: #0a0e17;
            font-weight: 700;
            font-size: 1rem;
            border-radius: 0.75rem;
            text-decoration: none;
            transition: transform 0.15s;
        }

        .home-link:hover {
            transform: translateY(-2px);
        }

        .sub-links {
            margin-top: 1.5rem;
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .sub-links a {
            color: #00ff87;
            text-decoration: none;
            font-size: 0.9rem;
        }

        .sub-links a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="error-icon">🚩</div>
    <h1>Offside! Page Not Found</h1>
    <p>Looks like this page has strayed beyond the last defender. The page you're looking for doesn't exist or has been
        moved.</p>
    <a href="/" class="home-link">🏠 Back to Home</a>
    <div class="sub-links">
        <a href="/#learn">Learn the Rule</a>
        <a href="/#interactive">Interactive Trainer</a>
        <a href="/#quiz">Quiz</a>
        <a href="/#guides">Guides</a>
    </div>
</body>

</html>