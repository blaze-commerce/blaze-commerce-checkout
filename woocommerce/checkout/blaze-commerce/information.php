<div class="accordion-item">
    <div class="accordion-title information-accordion"><?php _e( 'Account', 'blaze-commerce-checkout' ) ?></div>
    <div class="accordion-content information-accordion-content">
        <?php do_action( 'blaze_checkout_information_content' ); ?>
        <?php if ( get_option('wc_blazecheckoutsettings_express_checkout') === "yes" ): ?>
            <?php wc_get_template( 'checkout/blaze-commerce/express-paypal.php' ); ?>
        <?php endif; ?>
        <?php wc_get_template( 'checkout/blaze-commerce/login-registration-tab.php' ); ?>
    </div>
    <div class="information-content-preview"></div>
</div>
