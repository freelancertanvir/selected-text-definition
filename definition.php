<?php
/**
 * @package Selected Text Definition
 * @version 2.0
 */
/*
Plugin Name: Selected Text Definition
Description: This is a definition plugin to use in blog to show definition of any selected word.
Author: Tanvir Islam
Version: 2.0
Author URI: https://fiverwebsitedesign.com
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Selected Text Definition is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Selected Text Definition is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Selected Text Definition. If not, see <https://www.gnu.org/licenses/>.
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue the JavaScript file
function std_enqueue_scripts() {
    wp_enqueue_script('std_definition', plugin_dir_url(__FILE__) . 'definition.js', array('jquery'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'std_enqueue_scripts');

