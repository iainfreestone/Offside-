<?php
// Dynamic OG Image Generator
// Generates a 1200x630 branded social sharing image
if (!extension_loaded('gd')) {
    header('HTTP/1.1 500 Internal Server Error');
    exit('GD library not available');
}
header('Content-Type: image/png');
header('Cache-Control: public, max-age=86400');

$width = 1200;
$height = 630;

$img = imagecreatetruecolor($width, $height);

// Colours matching site theme
$bgDark = imagecolorallocate($img, 10, 14, 23);    // #0a0e17
$green = imagecolorallocate($img, 0, 255, 135);    // #00ff87
$greenDark = imagecolorallocate($img, 0, 180, 95);
$white = imagecolorallocate($img, 255, 255, 255);
$grey = imagecolorallocate($img, 160, 170, 190);
$pitchGreen = imagecolorallocate($img, 30, 80, 50);
$lineWhite = imagecolorallocate($img, 255, 255, 255);

// Background
imagefilledrectangle($img, 0, 0, $width, $height, $bgDark);

// Subtle pitch stripe pattern
for ($i = 0; $i < 12; $i++) {
    $shade = ($i % 2 === 0) ? imagecolorallocate($img, 12, 18, 28) : imagecolorallocate($img, 14, 20, 32);
    imagefilledrectangle($img, $i * 100, 0, ($i + 1) * 100, $height, $shade);
}

// Offside line (dashed green vertical line)
$lineX = 780;
imagesetthickness($img, 3);
for ($y = 40; $y < $height - 40; $y += 12) {
    imageline($img, $lineX, $y, $lineX, $y + 6, $green);
}

// Player circles
// Attacker (green) - offside position
imagefilledellipse($img, 840, 280, 36, 36, $green);
// Attacker (green) - onside position  
imagefilledellipse($img, 720, 380, 36, 36, $green);
// Defender (red)
imagefilledellipse($img, 800, 340, 36, 36, imagecolorallocate($img, 255, 71, 87));
// Ball
imagefilledellipse($img, 660, 310, 22, 22, $white);

// Green accent bar at top
imagefilledrectangle($img, 0, 0, $width, 5, $green);

// Main title text area (left side)
$fontSizeTitle = 7; // GD built-in font sizes 1-5, we'll use imagestring
// Using built-in fonts since TTF may not be available
// Large text simulation with multiple lines

// Title block background
imagefilledrectangle($img, 50, 160, 620, 470, imagecolorallocatealpha($img, 10, 14, 23, 40));

// Draw title using built-in fonts (scaled approach)
$titleLines = ["THE OFFSIDE RULE", "EXPLAINED"];
$y = 180;
foreach ($titleLines as $line) {
    // Draw each character larger by repeating
    for ($dx = 0; $dx < 3; $dx++) {
        for ($dy = 0; $dy < 3; $dy++) {
            imagestring($img, 5, 72 + $dx, $y + $dy, $line, $green);
        }
    }
    $y += 45;
}

// Subtitle
imagestring($img, 4, 72, 290, "Free Interactive 3D Trainer", $white);
imagestring($img, 4, 72, 315, "for Parent Linesmen", $white);

// Stats line
imagestring($img, 3, 72, 370, "21 Scenarios  |  3 Levels  |  100% Free", $grey);

// Website URL
imagestring($img, 4, 72, 420, "offsideexplained.com", $green);

// Bottom green accent bar
imagefilledrectangle($img, 0, $height - 5, $width, $height, $green);

// Border
imagerectangle($img, 0, 0, $width - 1, $height - 1, imagecolorallocatealpha($img, 0, 255, 135, 100));

imagepng($img);
imagedestroy($img);
