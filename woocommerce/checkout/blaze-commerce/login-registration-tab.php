<div class="form-checkout">
    <?php if ( get_option('wc_blazecheckoutsettings_express_checkout') === "yes" ): ?>
        <span class="line">
            <h2><span>OR</span></h2>
        </span>
    <?php endif; ?>
    <?php
        if (!is_user_logged_in()) {
            ?>
            <h2>Guest Checkout</h2>
            <p>Checking out as a Guest? You'll be able to save your details to create an account with us later.</p>
            <?php
        }
    ?>
    <div class="guest-form">
        <?php if (!is_user_logged_in()) { ?>
            <div class="form-row form-row-wide">
                <label for="guest_email" class="label-guest_email">Email&nbsp;<span class="required">*</span></label>
                <span class="woocommerce-input-wrapper">
                    <input type="email" class="input-text" name="guest_email" id="guest_email" placeholder="Email" value="<?php echo $userEmail; ?>">
                </span>
                <span class="error-message">Please enter a valid email address.</span>
                <div class="blz-custom-guest">Order number and receipt will be sent to this email address.</div>
            </div>
        <?php } else {
                $current_user = wp_get_current_user();
                $userEmail = $current_user->user_email;
                echo '<div class="user-email">'. $userEmail .'</div>';
            ?>
            <input type="hidden" class="input-text" name="guest_email" id="guest_email" placeholder="Email address. *" value="<?php echo $userEmail; ?>">
        <?php } ?>
        <label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
            <input type="checkbox" class="newsletter-checkbox" name="newsletter-checkbox">
            <span>SMS updates (optional)</span>
        </label>
        <a href="javascript:void(0);" class="btn-checkout-as-guest">
            <?php
                if (is_user_logged_in()) {
                    echo 'Submit';
                } else {
                    echo 'Submit';
                }
            ?>
        </a>
    </div>
</div>

<!-- <div class="line-container"><span>Or sign in to existing account</span></div> -->

<?php if (!is_user_logged_in()) : ?>
    <div class="checkout-account-tabs">
        <ul class="tabs login-register">
            <li class="active"><a data-trigger="tabs" data-target="#checkout-login"><?php _e( 'Sign in', 'blaze-commerce-checkout' ); ?></a></li>
            <li><a data-trigger="tabs" data-target="#checkout-register"><?php _e( 'Register', 'blaze-commerce-checkout' ); ?></a></li>
        </ul>

        <div class="tab-panes blz-login-container">
            <div class="tab-pane active" id="checkout-login">
                <?php 
                    $redirect = wc_get_checkout_url();
                ?>
                <div class="woocommerce-form woocommerce-form-login login">

                    <?php do_action( 'woocommerce_login_form_start' ); ?>

                    <p class="form-row">
                        <label for="username"><?php esc_html_e( 'Email address', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
                        <input type="text" class="input-text" name="username" id="blz-username" autocomplete="username" placeholder="Email"/>
                    </p>
                    <p class="form-row">
                        <label for="password"><?php esc_html_e( 'Password', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
                        <input class="input-text" type="password" name="password" id="blz-password" autocomplete="current-password" placeholder="Password"/>
                    </p>
                    <div class="clear"></div>

                    <?php do_action( 'woocommerce_login_form' ); ?>

                    <p class="form-row">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 18px;">
                            <label class="woocommerce-form__label woocommerce-form__label-for-checkbox woocommerce-form-login__rememberme">
                                <input class="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme" value="forever" /> <span class="blz-remember"><?php esc_html_e( 'Remember me', 'woocommerce' ); ?></span>
                            </label>

                            <a class="blz-forgot-pass" href="/my-account/lost-password" style="text-decoration: none;">Forgot password?</a>
                        </div>
                        <?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
                        <input type="hidden" name="redirect" value="<?php echo esc_url( $redirect ); ?>" />
                        <button type="submit" class="woocommerce-button button woocommerce-form-login__submit" name="login" value="<?php esc_attr_e( 'Login', 'woocommerce' ); ?>"><?php esc_html_e( 'Sign in', 'woocommerce' ); ?></button>
                    </p>

                    <div class="clear"></div>

                    <?php do_action( 'woocommerce_login_form_end' ); ?>

                </div>
            </div>
            
        </div>
    </div>
<?php endif; ?>
