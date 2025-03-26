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
                echo '<div class="user-email"><p>'. $userEmail .'</p></div>';
            ?>
            <input type="hidden" class="input-text" name="guest_email" id="guest_email" placeholder="Email address. *" value="<?php echo $userEmail; ?>">
        <?php } ?>
        <label class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox">
            <input type="checkbox" class="newsletter-checkbox" name="newsletter-checkbox">
            <p>SMS updates (optional)</p>
        </label>
        <!-- <div class="blz-continue-order blz-continue-login">
            <p> By clicking 'Continue to Order Payment' you agree to the Terms and Conditions and Privacy and Cookie Policy. </p>
        </div> -->
        <a href="javascript:void(0);" class="btn-checkout-as-guest">
            <?php
                if (is_user_logged_in()) {
                    echo 'CONTINUE TO RECIPIENT DETAILS →';
                } else {
                    echo 'CONTINUE TO RECIPIENT DETAILS →';
                }
            ?>
        </a>
    </div>
</div>
<div class="blaze-checkout-signin">
    <span>Have an Account?</span>
    <div class="blaze-checkout-showhide">
        <span class="blz-checkout-signin-show">Sign In to Save time 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g id="heroicons-mini/arrow-right">
                <path id="Vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M2.40002 8.00078C2.40002 7.66941 2.66865 7.40078 3.00002 7.40078L11.5104 7.40078L8.18416 4.23328C7.9453 4.0036 7.93785 3.62378 8.16752 3.38492C8.3972 3.14605 8.77703 3.1386 9.01589 3.36828L13.4159 7.56828C13.5335 7.6814 13.6 7.83757 13.6 8.00078C13.6 8.16399 13.5335 8.32016 13.4159 8.43328L9.01589 12.6333C8.77703 12.863 8.3972 12.8555 8.16753 12.6166C7.93785 12.3778 7.9453 11.998 8.18416 11.7683L11.5104 8.60078L3.00002 8.60078C2.66865 8.60078 2.40002 8.33215 2.40002 8.00078Z" fill="#111111"/>
                </g>
            </svg>
        </span>
        <span class="blz-checkout-signin-hide">Close</span>
    </div>
</div>

<!-- <div class="line-container"><span>Or sign in to existing account</span></div> -->

<?php if (!is_user_logged_in()) : ?>
    <div class="checkout-account-tabs">
        <ul class="tabs login-register">
            <li class="active"><a data-trigger="tabs" data-target="#checkout-login"><?php _e( 'Sign In to Faster Checkout', 'blaze-online-checkout' ); ?></a></li>
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
