<?php if (!isset($article_title))
    $article_title = 'Guide'; ?>
<?php if (!isset($article_description))
    $article_description = ''; ?>
<?php if (!isset($article_slug))
    $article_slug = ''; ?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary SEO -->
    <title><?php echo htmlspecialchars($article_title); ?> — The Offside Rule Trainer</title>
    <meta name="description" content="<?php echo htmlspecialchars($article_description); ?>" />
    <meta name="keywords"
        content="offside rule explained, offside rule for parents, linesman tips, assistant referee guide, grassroots football, parent linesman" />
    <meta name="author" content="The Offside Rule Trainer" />
    <link rel="canonical" href="https://www.yoursite.com/guides/<?php echo $article_slug; ?>" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="<?php echo htmlspecialchars($article_title); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($article_description); ?>" />
    <meta property="og:url" content="https://www.yoursite.com/guides/<?php echo $article_slug; ?>" />
    <meta property="og:site_name" content="The Offside Rule Trainer" />
    <meta property="og:locale" content="en_GB" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($article_title); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($article_description); ?>" />

    <!-- Schema.org Article -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "<?php echo htmlspecialchars($article_title); ?>",
        "description": "<?php echo htmlspecialchars($article_description); ?>",
        "author": {
            "@type": "Organization",
            "name": "The Offside Rule Trainer"
        },
        "publisher": {
            "@type": "Organization",
            "name": "The Offside Rule Trainer"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.yoursite.com/guides/<?php echo $article_slug; ?>"
        }
    }
    </script>

    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.yoursite.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Guides",
                "item": "https://www.yoursite.com/#guides"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "<?php echo htmlspecialchars($article_title); ?>",
                "item": "https://www.yoursite.com/guides/<?php echo $article_slug; ?>"
            }
        ]
    }
    </script>

    <!-- Fonts & Styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css" />
</head>

<body>
    <header>
        <div class="header-inner">
            <div class="header-badge"><a href="../" style="text-decoration:none">⚽</a></div>
            <h1><a href="../" style="color:inherit;text-decoration:none">The Offside Rule Explained Simply</a></h1>
            <p>Free interactive training for parents running the line at grassroots kids' football</p>
        </div>
    </header>

    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../">Home</a>
        <span class="breadcrumb-sep">›</span>
        <a href="../#guides">Guides</a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-current"><?php echo htmlspecialchars($article_title); ?></span>
    </nav>