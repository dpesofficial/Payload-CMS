<?php
/**
 * Migration bridge: WordPress + ACF flexible content -> Payload block JSON.
 *
 * Run from anywhere with Laragon's PHP:
 *   php scripts/wp-export.php > scripts/wp-export.json
 *
 * This is the piece that makes a real migration a script rather than a
 * retyping exercise. One case per ACF layout.
 */
define('PROD_ORIGIN', getenv('PROD_ORIGIN') ?: 'https://titanshutters.com.au');
$WP = getenv('WP_PATH') ?: 'C:/laragon/www/titan';
require_once $WP . '/wp-load.php';

function img($id) {
    if (is_array($id)) $id = $id['ID'] ?? $id['id'] ?? null;
    if (!$id) return null;
    $path = get_attached_file((int) $id);
    $url  = wp_get_attachment_url((int) $id);
    if (!$url) return null;
    // The local staging DB has no uploads folder, so fall back to the live CDN.
    $remote = str_replace(['http://titan.test', 'https://titan.test'], PROD_ORIGIN, $url);
    return [
        'wpId'   => (int) $id,
        'file'   => ($path && file_exists($path)) ? str_replace(chr(92), '/', $path) : null,
        'remote' => $remote,
        'name'   => basename(parse_url($remote, PHP_URL_PATH)),
        'alt'    => (string) get_post_meta((int) $id, '_wp_attachment_image_alt', true),
    ];
}

function link_field($l) {
    if (!is_array($l) || empty($l['title'])) return null;
    // Rewrite staging hostnames to relative paths.
    $url = preg_replace('#^https?://[^/\#?]+#', '', $l['url'] ?? '');
    return ['label' => $l['title'], 'url' => $url ?: '#'];
}

$pageId = isset($argv[1]) ? (int) $argv[1] : (int) get_option('page_on_front');
$acf = get_fields($pageId);
$layout = [];

foreach (($acf['content'] ?? []) as $row) {
    switch ($row['acf_fc_layout']) {

        case 'banner':
            $layout[] = [
                'blockType' => 'banner',
                'slides' => array_values(array_filter(array_map(function ($s) {
                    return [
                        'title'     => $s['title'] ?? '',
                        'subtitle'  => trim($s['sub_title'] ?? ''),
                        '_image'    => img($s['background_image'] ?? null),
                        'enquire'   => link_field($s['enquire_button'] ?? null),
                        'learnMore' => link_field($s['learn_more'] ?? null),
                    ];
                }, $row['banner_items'] ?? []))),
                '_crests' => array_values(array_filter(array_map('img', $row['crest_images'] ?? []))),
            ];
            break;

        case 'your_journey':
            $layout[] = [
                'blockType' => 'yourJourney',
                'title'     => $row['section_title'] ?? '',
                'subtitle'  => trim($row['section_subtitle'] ?? ''),
                'steps'     => array_map(function ($s) {
                    return [
                        'title'       => $s['title'] ?? '',
                        'description' => wp_strip_all_tags($s['content'] ?? ''),
                        '_icon'       => !empty($s['upload_static_icon']) ? img($s['icon_static_image'] ?? null) : null,
                    ];
                }, $row['icon_block'] ?? []),
            ];
            break;

        case 'two_column':
            $i = 0;
            $layout[] = [
                'blockType' => 'twoColumn',
                'rows' => array_map(function ($c) use (&$i) {
                    return [
                        'title'         => $c['title'] ?? '',
                        'content'       => wp_strip_all_tags($c['content'] ?? ''),
                        '_image'        => img($c['image'] ?? null),
                        'imagePosition' => ($i++ % 2 === 0) ? 'right' : 'left',
                        'cta'           => link_field($c['cta'] ?? null),
                    ];
                }, $row['column_block'] ?? []),
            ];
            break;

        case 'google_slider':
            // Reviews render client-side via Trustindex, so there is nothing to
            // migrate. Seeded with sample rows; a real build pulls the Google
            // Business Profile API into Payload on a schedule.
            $layout[] = [
                'blockType'   => 'googleReviews',
                'title'       => $row['section_title'] ?? '',
                'description' => wp_strip_all_tags($row['section_description'] ?? ''),
                'reviews'     => [],
            ];
            break;

        case 'got_questions':
            $layout[] = [
                'blockType' => 'gotQuestions',
                'title'     => $row['title'] ?? '',
                'subtitle'  => $row['sub_title'] ?? '',
                'content'   => wp_strip_all_tags(str_replace(['<br />', '<br>'], ' ', $row['content'] ?? '')),
                'phone'     => $row['phone'] ?? '',
                'cta'       => link_field($row['get_quote_cta'] ?? null),
            ];
            break;
    }
}

// ACF's options API is unreliable under CLI once a page has been queried, so
// read the underlying option rows directly.
$wpc_settings = [
    '_logo' => img(get_option('options_site_logo')),
    'phone' => (string) get_option('options_sales_and_support_number'),
];

echo json_encode([
    'settings' => $wpc_settings,
    'source'   => home_url(),
    'wpId'     => $pageId,
    'title'    => get_the_title($pageId),
    'slug'     => 'home',
    'skipped'  => ['infinite_scroll', 'get_inspired', 'book_now'],
    'layout'   => $layout,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
