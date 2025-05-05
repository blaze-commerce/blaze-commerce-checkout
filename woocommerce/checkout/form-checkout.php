<?php
/**
 * Checkout Form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/form-checkout.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 3.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and not logged in, the user cannot checkout.
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}

?>
<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

	<?php if ( $checkout->get_checkout_fields() ) : ?>

		<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

		<div class="col2-set" id="customer_details">

            <?php do_action( 'blaze_checkout_before_customer_details_sections' ); ?>
                <div class="checkout-form">
                    <div class="accordion-item">
                        <div class="accordion-title billing-shipping-accordion"><?php _e( 'Recipients  Details', 'blaze-commerce-checkout' ) ?></div>
                        
                        <div class="accordion-content billing-shipping-accordion-content">
                            
                            <div class="blz-billing-shipping-container">
                                <h5 class="blaze-checkout-shipping-heading">Shipping address</h5>
                                <div class="col-1">
                                    <div>
                                        <?php do_action( 'woocommerce_checkout_billing' ); ?>
                                    </div>
                                </div>
                                <div class="col-2">
                                    <?php do_action( 'woocommerce_checkout_shipping' ); ?>
                                </div>
                            </div>
                            <?php if ( ! is_user_logged_in() ) : ?>
                            <div class="blaze-register-container">
                                <h5 class="blaze-checkout-register">Create an account</h5>
                                <label class="blz-check-register">
                                    <input type="checkbox" id="save-info-checkbox">
                                    Enter a password to save your information. <span style="font-style: italic;">(Optional)</span>
                                </label>
                                <div class="woocommerce-form woocommerce-form-register register" <?php do_action( 'woocommerce_register_form_tag' ); ?> >

                                    <?php do_action( 'woocommerce_register_form_start' ); ?>

                                    <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide blz-custom-reg-username">
                                        <label for="reg_username"><?php esc_html_e( 'Username', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
                                        <input type="text" placeholder="Username" class="woocommerce-Input woocommerce-Input--text input-text" name="username" id="reg_username" autocomplete="username" value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; ?>" /><?php // @codingStandardsIgnoreLine ?>
                                    </p>

                                    <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide blz-custom-reg-email">
                                        <label for="reg_email"><?php esc_html_e( 'Email address', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
                                        <input type="email" placeholder="Email" class="woocommerce-Input woocommerce-Input--text input-text" name="email" id="reg_email" autocomplete="email" value="<?php echo ( ! empty( $_POST['email'] ) ) ? esc_attr( wp_unslash( $_POST['email'] ) ) : ''; ?>" /><?php // @codingStandardsIgnoreLine ?>
                                    </p>


                                    <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                                        <label for="reg_password"><?php esc_html_e( 'Password', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
                                        <input type="password" placeholder="Password" class="woocommerce-Input woocommerce-Input--text input-text" name="password" id="reg_password" autocomplete="new-password" />
                                    </p>

                                    <?php do_action( 'woocommerce_register_form' ); ?>

                                    <p class="woocommerce-form-row form-row">
                                        <?php wp_nonce_field( 'woocommerce-register', 'woocommerce-register-nonce' ); ?>
                                        <button type="submit" class="woocommerce-Button woocommerce-button button woocommerce-form-register__submit" name="register" value="<?php esc_attr_e( 'Register', 'woocommerce' ); ?>"><?php esc_html_e( 'REGISTER', 'woocommerce' ); ?></button>
                                    </p>

                                    <?php do_action( 'woocommerce_register_form_end' ); ?>

                                </div>
                            </div>
                            <?php endif; ?>
                            <div class="blz-button-container">   
                                <a class="btn-continue" href="http://" target="_self">Continue</a>
                            </div>
                        </div>
                        <div class="billing-shipping-content-preview billing-shippiing-content-preview"></div>
                    </div>

                    <?php do_action( 'blaze_checkout_after_append_accordions' ); ?>
                </div>
            <?php do_action( 'blaze_checkout_after_customer_details_sections' ); ?>
            
		</div>

		<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

	<?php endif; ?>
	
	<div class="blaze-commerce-checkout-order-review-wrap">
        <?php do_action( 'woocommerce_checkout_before_order_review_heading' ); ?>
        
        <?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
        <hr class="blaze-hr">
        <div id="order_review" class="woocommerce-checkout-review-order">
            <?php do_action( 'woocommerce_checkout_order_review' ); ?>
        </div>

        <?php do_action( 'woocommerce_checkout_after_order_review' ); ?>
    </div>

</form>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
