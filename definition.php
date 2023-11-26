<?php
/**
 * @package Selected Text Definition
 * @version 1.0.60
 */
/*
Plugin Name: Selected Text Definition
Description: This is a definition plugin to use in blog to show definition of any selected word.
Author: Tanvir
Version: 2.0.0
Author URI: tanvirthestar.bio.link
*/

// Enqueue the JavaScript file
function text_preview_enqueue_scripts() {
    wp_enqueue_script('definition', plugin_dir_url(__FILE__) . 'definition.js', array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'text_preview_enqueue_scripts');
