<?php
/**
 * Review order table
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/review-order.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates
 * @version 5.2.0
 */

defined( 'ABSPATH' ) || exit;
?>
<table class="shop_table woocommerce-checkout-review-order-table">
	<tbody>
		<?php
		do_action( 'woocommerce_review_order_before_cart_contents' );

		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			$_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
				?>
				
				<tr class="<?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>" 
					data-cart-item-key="<?php echo esc_attr($cart_item_key); ?>">
					<td class="product-row" colspan="3">
						<div class="product-content">
							<?php
							$image_id = $_product->get_image_id();
							$image_url = wp_get_attachment_image_url( $image_id, 'contain' );
							?>
							<div class="product-thumbnail">
								<img class="product-image" src="<?php echo $image_url; ?>" />
							</div>
							<div class="product-name-container">
								<div class="product-name">
									<div class="blz-product-name">
										<div class="blaze-product-name"><?php echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) ) . '&nbsp;'; ?> </div>
										<?php echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
										<div class="blz-edit-checkout-items"> 
											<a href="#" class="blz-remove-checkout-item">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
													<path d="M21 5.98047C17.67 5.65047 14.32 5.48047 10.98 5.48047C9 5.48047 7.02 5.58047 5.04 5.78047L3 5.98047" stroke="#030712" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
													<path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#030712" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
													<path d="M18.8504 9.13965L18.2004 19.2096C18.0904 20.7796 18.0004 21.9996 15.2104 21.9996H8.79039C6.00039 21.9996 5.91039 20.7796 5.80039 19.2096L5.15039 9.13965" stroke="#030712" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
													<path d="M10.3301 16.5H13.6601" stroke="#030712" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
													<path d="M9.5 12.5H14.5" stroke="#030712" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</a>
										</div>
									</div>
									<div class="blz-qty-price">
										<?php echo apply_filters( 'woocommerce_checkout_cart_item_quantity', ' <strong class="product-quantity">' . sprintf( 'Qty: %s&nbsp;', $cart_item['quantity'] ) . '</strong>', $cart_item, $cart_item_key ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									</div>
									<?php echo wc_get_formatted_cart_item_data( $cart_item ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								</div>
								
							</div>
							
						</div>
					</td>
				</tr>
				<?php
			}
		}

		do_action( 'woocommerce_review_order_after_cart_contents' );
		?>
	</tbody>
	<tfoot>
		<?php if ( is_user_logged_in() || WC()->checkout()->is_registration_enabled() || ! WC()->checkout()->is_registration_required() ): ?>
                <tr class="cart-coupon">
                    <td class="blaze-coupon-container" colspan="2">
                        <div class="coupon-code-container">
                            <div class="blz-custom-coupon-container">
                                <div class="coupon-code-toggle blaze-coupon-toggle">Coupon Code</div>
                                <div class="coupon-code-form blaze-form-toggle">
                                <input type="text" id="coupon-code-input" placeholder="Enter Coupon Code"/>
                                <button class="coupon-code-apply-button">APPLY COUPON</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        <?php endif; ?>

		<tr class="cart-subtotal blz-font">
			<th><?php esc_html_e( 'Subtotal', 'woocommerce' ); ?></th>
			<td><?php wc_cart_totals_subtotal_html(); ?></td>
		</tr>

		<?php foreach ( WC()->cart->get_coupons() as $code => $coupon ) : ?>
			<tr class="blz-font cart-discount coupon-<?php echo esc_attr( sanitize_title( $code ) ); ?>">
				<th><?php wc_cart_totals_coupon_label( $coupon ); ?></th>
				<td><?php wc_cart_totals_coupon_html( $coupon ); ?></td>
			</tr>
		<?php endforeach; ?>

		<?php if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) :
                $shipping_cost = '';
                $packages = WC()->shipping()->get_packages();
            
				foreach ( $packages as $i => $package ) {
					$chosen_method = isset( WC()->session->chosen_shipping_methods[ $i ] ) ? WC()->session->chosen_shipping_methods[ $i ] : '';
			
					foreach ( $package['rates'] as $method ) {
						if ( $method->id == $chosen_method ) {
							$shipping_cost = wc_price( $method->cost );
						}
					}
				}
            ?>
            <tr class="blaze-shipping-review blz-font">
				<th>Shipping</th>
				<td style="text-align: right;"><?php echo $shipping_cost; ?></td>
			</tr>
			
        <?php endif; ?>

		<?php foreach ( WC()->cart->get_fees() as $fee ) : ?>
			<tr class="fee">
				<th><?php echo esc_html( $fee->name ); ?></th>
				<td><?php wc_cart_totals_fee_html( $fee ); ?></td>
			</tr>
		<?php endforeach; ?>

		<?php if ( wc_tax_enabled() && ! WC()->cart->display_prices_including_tax() ) : ?>
			<?php if ( 'itemized' === get_option( 'woocommerce_tax_total_display' ) ) : ?>
				<?php foreach ( WC()->cart->get_tax_totals() as $code => $tax ) : // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited ?>
					<tr class="tax-rate tax-rate-<?php echo esc_attr( sanitize_title( $code ) ); ?>">
						<th><?php echo esc_html( $tax->label ); ?></th>
						<td><?php echo wp_kses_post( $tax->formatted_amount ); ?></td>
					</tr>
				<?php endforeach; ?>
			<?php else : ?>
				<tr class="tax-total blz-font">
					<th><?php echo esc_html( WC()->countries->tax_or_vat() ); ?></th>
					<td><?php wc_cart_totals_taxes_total_html(); ?></td>
				</tr>
				
			<?php endif; ?>
		<?php endif; ?>

		<?php do_action( 'woocommerce_review_order_before_order_total' ); ?>

		<tr class="order-total blz-font blz-order-total">
			<th><?php esc_html_e( 'Total:', 'woocommerce' ); ?></th>
			<td class="blz-tax-total-includes"><?php wc_cart_totals_order_total_html(); ?></td>
		</tr>
		

		<?php do_action( 'woocommerce_review_order_after_order_total' ); ?>

	</tfoot>
</table>
