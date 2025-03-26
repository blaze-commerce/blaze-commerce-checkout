<?php

/**
 * Blaze plugin for Checkout.
 * 
 * @wordpress-plugin
 * Plugin Name: 	Blaze Online Checkout
 * Plugin URI: 		https://blazecommerce.io/
 * Description: 	Blaze plugin for Checkout.
 * Author: 			Blaze Online
 * Author URI: 		https://blazecommerce.io/
 *
 * Version: 		1.0.4
 *
 * License: 		GPLv2 or later
 * License URI: 	http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Text Domain: 	blaze-online-checkout
 * Domain Path: 	languages  
 */

 /**
 * Copyright (c) 2020 Paul Chinmoy. All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 */

//* Prevent direct access to the plugin
if ( !defined( 'ABSPATH' ) ) {
    wp_die( __( "Sorry, you are not allowed to access this page directly.", 'blaze-online-checkout' ) );
}

//* Define constants
define( 'BLAZE_CHECKOUT_VERSION', 	'1.0.4' );
define( 'BLAZE_CHECKOUT_FILE', 		trailingslashit( dirname( __FILE__ ) ) . 'blaze-online-checkout.php' );
define( 'BLAZE_CHECKOUT_DIR', 		plugin_dir_path( BLAZE_CHECKOUT_FILE ) );
define( 'BLAZE_CHECKOUT_URL', 		plugins_url( '/', BLAZE_CHECKOUT_FILE ) );

if ( ! class_exists( 'Blaze_Online_Checkout' ) ) {
    class Blaze_Online_Checkout
    {
        private static $instance = null;

        public static function get_instance()
        {
            if ( null == self::$instance ) {
                self::$instance = new self();
            }

            return self::$instance;
        }

        public function __construct()
        {
            add_action( 'wp_enqueue_scripts', array( $this, 'blaze_script_and_styles' ) );

            add_action( 'after_setup_theme', array( $this, 'override_wc_templates' ) );
            
            add_action( 'blaze_checkout_before_customer_details_sections', array( $this, 'add_information_section' ) );

            // Remove Coupon Code on Checkout Form
            remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 );
            add_action( 'blaze_checkout_after_append_accordions', array( $this, 'add_payment_section' ) );
            add_action( 'woocommerce_review_order_before_payment', array( $this, 'move_shipping_selector' ) );
            add_filter( 'woocommerce_update_order_review_fragments', array( $this, 'select_shipping_custom_fragment' ) );
            // add_filter('woocommerce_checkout_show_terms', '__return_false');
            // add_filter('woocommerce_checkout_show_privacy_policy', '__return_false');
            add_action( 'woocommerce_checkout_before_order_review_heading', array( $this, 'add_cart_total_section' ) );

            // Creating the options page
            add_filter('woocommerce_settings_tabs_array', array(&$this, 'add_settings_tab'), 50, 1);
            add_action('woocommerce_settings_tabs_blazecheckoutsettings', array(&$this, 'settings_tab'));
            add_action('woocommerce_update_options_blazecheckoutsettings', array(&$this, 'update_settings'));

            //Ajax function for edit button(order summary)
            // $this->init_ajax();
            // add_action('wp_ajax_get_updated_cart_count', array($this, 'get_updated_cart_count'));
            // add_action('wp_ajax_nopriv_get_updated_cart_count', array($this, 'get_updated_cart_count'));

            // Remove original subscription shipping display and add custom one
            add_action('plugins_loaded', array($this, 'setup_subscription_shipping_display'), 20);
        }

        public function blaze_script_and_styles()
        {
            wp_enqueue_style( 'blaze-online-checkout', BLAZE_CHECKOUT_URL . 'assets/css/blaze-online-checkout.css', array(), BLAZE_CHECKOUT_VERSION );
            wp_enqueue_script( 'blaze-online-checkout', BLAZE_CHECKOUT_URL . '/assets/js/blaze-online-checkout.js', array( 'jquery' ), BLAZE_CHECKOUT_VERSION );
        }

        public function add_information_section()
        {
            wc_get_template( 'checkout/blaze-online/information.php' );
        }

        public function add_payment_section()
        {
            wc_get_template( 'checkout/blaze-online/payment.php' );
        }

        public function move_shipping_selector()
        {
            if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) : ?>

                <?php do_action( 'woocommerce_review_order_before_shipping' ); ?>
        
                <table class="select-shipping-method">
                    <tbody>
                        <?php wc_cart_totals_shipping_html(); ?>
                    </tbody>
                </table>
        
                <?php do_action( 'woocommerce_review_order_after_shipping' ); ?>
            <?php else: ?>
                <table class="select-shipping-method">
                </table>
            <?php endif;
        }

        public function select_shipping_custom_fragment( $fragments ) {     
            ob_start();
            ?>
            <table class="blaze-online-checkout select-shipping-method">
                <tbody>
                    <?php blaze_checkout_cart_totals_shipping_html(); ?>
                </tbody>
            </table>
            <?php
            $woocommerce_shipping_methods = ob_get_clean();

            $fragments['.select-shipping-method'] = $woocommerce_shipping_methods;

            return $fragments;
        }

        public function add_cart_total_section()
        {
            global $woocommerce;
	        $cartCount = $woocommerce->cart->cart_contents_count;
            ?>
                <div class="cart-count-container">
                    <div class="cart-count-edit">
                        <h2 class="blaze-order-heading">Order summary</h2>                    
                        <span class="cart-count"><?php echo sprintf(_n('%d item', '%d items', $cartCount, 'blaze-online-checkout'), $cartCount); ?></span>
                    </div>
                    <a class="blaze-edit-checkout-items" href="/?cart=1">Edit</a>
                    
                </div>
            <?php
        }

        public function override_wc_templates() {
            //* Allow to override WC /templates path
            add_filter( 'wc_get_template', array( $this, 'wc_template' ), 20, 5 );
            add_filter( 'wc_get_template_part', array( $this, 'wc_template_part' ), 20, 3 );

            remove_action( 'woocommerce_checkout_order_review', 'woocommerce_checkout_payment', 20 );
        }

        public function wc_template( $located, $template_name, $args, $template_path, $default_path ) {
            $newtpl = str_replace( 'woocommerce/templates', basename( BLAZE_CHECKOUT_DIR ) . '/woocommerce', $located );
            
            if ( file_exists( $newtpl ) )
                return $newtpl;
         
            return $located;
        }
         
        public function wc_template_part( $template, $slug, $name ) {
            $newtpl = str_replace( 'woocommerce/templates', basename( BLAZE_CHECKOUT_DIR ) . '/woocommerce', $template );
            
            if ( file_exists( $newtpl ) )
                return $newtpl;
         
            return $template;
        }

        /**
         * Adds new tab on Woocommerce Settings
         *
         * @param array $settings_tabs  Woocommerce Settings tab array
         * @return void
         */
        public function add_settings_tab($settings_tabs)
        {
            $settings_tabs['blazecheckoutsettings'] = __('Blaze Checkout Settings', 'blaze-online');
            return $settings_tabs;
        }

        /**
         * Adds the appropriate fields for the new settings tab
         * 
         * @uses $this->get_settings                                        Generates array of settings
         * @uses WooCommerce\Admin\Functions::woocommerce_admin_fields      Output admin fields. https://docs.woocommerce.com/wc-apidocs/function-woocommerce_admin_fields.html
         * @return void
         */
        public function settings_tab()
        {
            woocommerce_admin_fields($this->get_settings());
        }

        /**
         * Updates the apropriate fields for the new settings tab
         * 
         * @uses $this->get_settings                                        Generates array of settings
         * @uses WooCommerce\Admin\Functions::woocommerce_update_options    Update all settings which are passed. https://docs.woocommerce.com/wc-apidocs/function-woocommerce_update_options.html
         * @return void
         */
        public function update_settings()
        {
            woocommerce_update_options($this->get_settings());
        }

        /**
         * Generates an array of settings
         *
         * @used-by     $this->settings_tab
         * @used-by     $this->update_settings
         * @filters     wc_blazecheckoutsettings_settings
         * @return void
         */
        public function get_settings()
        {
            $settings = array(
                'section_title' => array(
                    'name'     => __('Checkout Settings', 'blaze-online'),
                    'type'     => 'title',
                    'desc'     => '',
                    'id'       => 'wc_blazecheckoutsettings_section_title'
                ),
                'express_checkout' => array(
                    'name' => __('Enable Express Checkout', 'blaze-online'),
                    'type' => 'checkbox',
                    'desc' => __('This controls the visibility of the express checkout on the checkout page.', 'blaze-online'),
                    'id'   => 'wc_blazecheckoutsettings_express_checkout'
                ),
                'section_end' => array(
                    'type' => 'sectionend',
                    'id' => 'wc_blazecheckoutsettings_section_end'
                )
            );
            return apply_filters('wc_blazecheckoutsettings_settings', $settings);
        }
        // public function init_ajax() {
        //     add_action('wp_ajax_get_cart_count', array($this, 'get_cart_count'));
        //     add_action('wp_ajax_nopriv_get_cart_count', array($this, 'get_cart_count'));
        // }

        // public function get_cart_count() {
        //     global $woocommerce;
        //     $cartCount = $woocommerce->cart->cart_contents_count;
        //     echo sprintf(_n('%d item', '%d items', $cartCount, 'blaze-online-checkout'), $cartCount);
        //     wp_die();
        // }

        // public function get_updated_cart_count() {
        //     global $woocommerce;
        //     $cartCount = $woocommerce->cart->cart_contents_count;
        //     echo sprintf(_n('%d item', '%d items', $cartCount, 'blaze-online-checkout'), $cartCount);
        //     wp_die();
        // }

        /**
         * Setup subscription shipping display modifications
         */
        public function setup_subscription_shipping_display() {
            if (class_exists('WCS_Template_Loader')) {
                remove_action('woocommerce_subscriptions_recurring_totals_shipping', array('WCS_Template_Loader', 'get_recurring_cart_shipping'), 10);
                add_action('woocommerce_subscriptions_recurring_totals_shipping', array($this, 'custom_recurring_shipping_display'), 10);
            }
        }

        /**
         * Custom display for recurring shipping totals
         *
         * @param array $recurring_carts Array of recurring cart objects
         */
        public function custom_recurring_shipping_display($recurring_carts) {
            try {
                error_log('Recurring Carts Array Keys: ' . print_r(array_keys($recurring_carts), true));

                if (empty($recurring_carts) || !is_array($recurring_carts) || !function_exists('WC')) {
                    return;
                }

                // First display the main shipping method (without price)
                $wc = WC();
                if ($wc && is_object($wc->shipping())) {
                    $packages = $wc->shipping()->get_packages();
                    if (!empty($packages)) {
                        $package = reset($packages);
                        if (isset($wc->session->chosen_shipping_methods[0])) {
                            $chosen_method = $wc->session->chosen_shipping_methods[0];
                            if (!empty($chosen_method) && isset($package['rates'][$chosen_method])) {
                                $method = $package['rates'][$chosen_method];
                                if (is_object($method)) {
                                    $shipping_label = $method->get_label();
                                    // Remove any price information from the label
                                    $shipping_label = preg_replace('/:\s*\$\d+(\.\d{2})?/', '', $shipping_label);
                                    ?>
                                    <tr class="blaze-shipping-review blz-font recurring-total">
                                        <th>Recurring Shipping</th>
                                        <td style="text-align: right;">
                                            <?php echo $shipping_label.':'; ?>
                                        </td>
                                    </tr>
                                    <?php
                                }
                            }
                        }
                    }
                }

                // Then display the recurring periods and costs
                foreach ($recurring_carts as $cart_key => $recurring_cart) {
                    error_log('Processing recurring cart: ' . $cart_key);
                    
                    if (!is_object($recurring_cart)) {
                        continue;
                    }

                    $period = '';
                    if (strpos($cart_key, 'every_4th_week') !== false) {
                        $period = 'every 4 weeks';
                    } elseif (strpos($cart_key, 'every_3rd_month') !== false) {
                        $period = 'every 3 months';
                    }

                    if ($period) {
                        
                        $shipping_total = $recurring_cart->get_shipping_total();

                        if ($shipping_total > 0) {
                            ?>
                            <tr class="blaze-shipping-review blz-font recurring-total-period">
                                <td colspan="2" style="text-align: right;">
                                    <?php 
                                    echo wc_price($shipping_total) . ' ' . $period;
                                    ?>
                                </td>
                            </tr>
                            <?php
                        }
                    }
                }

            } catch (Exception $e) {
                error_log('Exception in custom_recurring_shipping_display: ' . $e->getMessage());
            }
        }
    }

    Blaze_Online_Checkout::get_instance();
}

add_filter( 'woocommerce_locate_template', 'my_custom_woocommerce_template', 10, 3 );

function my_custom_woocommerce_template( $template, $template_name, $template_path ) {
    if ( 'checkout/review-order.php' === $template_name ) {
        $custom_template = plugin_dir_path( __FILE__ ) . 'woocommerce/checkout/review-order.php';
        if ( file_exists( $custom_template ) ) {
            return $custom_template;
        }
    }
    return $template;
}

/**
 * Get shipping methods.
 */
function blaze_checkout_cart_totals_shipping_html() {
	$packages = WC()->shipping()->get_packages();
	$first    = true;

	foreach ( $packages as $i => $package ) {
		$chosen_method = isset( WC()->session->chosen_shipping_methods[ $i ] ) ? WC()->session->chosen_shipping_methods[ $i ] : '';
		$product_names = array();

		if ( count( $packages ) > 1 ) {
			foreach ( $package['contents'] as $item_id => $values ) {
				$product_names[ $item_id ] = $values['data']->get_name() . ' &times;' . $values['quantity'];
			}
			$product_names = apply_filters( 'woocommerce_shipping_package_details_array', $product_names, $package );
		}

		wc_get_template(
			'cart/blaze-online/cart-shipping.php',
			array(
				'package'                  => $package,
				'available_methods'        => $package['rates'],
				'show_package_details'     => count( $packages ) > 1,
				'show_shipping_calculator' => is_cart() && apply_filters( 'woocommerce_shipping_show_shipping_calculator', $first, $i, $package ),
				'package_details'          => implode( ', ', $product_names ),
				/* translators: %d: shipping package number */
				'package_name'             => apply_filters( 'woocommerce_shipping_package_name', ( ( $i + 1 ) > 1 ) ? sprintf( _x( 'Shipping %d', 'shipping packages', 'woocommerce' ), ( $i + 1 ) ) : _x( 'Choose Your Shipping', 'shipping packages', 'woocommerce' ), $i, $package ),
				'index'                    => $i,
				'chosen_method'            => $chosen_method,
				'formatted_destination'    => WC()->countries->get_formatted_address( $package['destination'], ', ' ),
				'has_calculated_shipping'  => WC()->customer->has_calculated_shipping(),
			)
		);

		$first = false;
	}
}

// Add this filter to check if something is filtering the methods
// add_filter('woocommerce_package_rates', 'debug_shipping_methods', 999, 2);
// function debug_shipping_methods($rates, $package) {
//     error_log('Shipping methods after filters: ' . print_r($rates, true));
//     return $rates;
// }

// add_action('wp_ajax_remove_cart_item', 'blaze_remove_cart_item');
// add_action('wp_ajax_nopriv_remove_cart_item', 'blaze_remove_cart_item');

// function blaze_remove_cart_item() {
//     // Verify nonce
//     check_ajax_referer('update-order-review', 'security');

//     if (isset($_POST['cart_item_key'])) {
//         WC()->cart->remove_cart_item(sanitize_text_field($_POST['cart_item_key']));
//     }
    
//     wp_die();
// }

