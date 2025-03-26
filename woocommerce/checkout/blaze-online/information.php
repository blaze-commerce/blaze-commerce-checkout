<div class="accordion-item">
    <div class="accordion-title information-accordion"><h5><?php _e( 'Account', 'blaze-online-checkout' ) ?></h5></div>
    <div class="accordion-content information-accordion-content">
        <?php do_action( 'blaze_checkout_information_content' ); ?>
        <?php if ( get_option('wc_blazecheckoutsettings_express_checkout') === "yes" ): ?>
            <?php wc_get_template( 'checkout/blaze-online/express-paypal.php' ); ?>
        <?php endif; ?>
        <?php wc_get_template( 'checkout/blaze-online/login-registration-tab.php' ); ?>
    </div>
    <div class="information-content-preview"></div>
</div>
