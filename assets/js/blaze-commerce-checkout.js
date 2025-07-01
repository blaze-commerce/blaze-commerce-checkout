(function($) {
	function debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this,
				args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	}

	var validateEmail = function (email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

    $(document).on('click', '.blaze-coupon-toggle', function(e) {
      e.preventDefault();
      var form = $('.blaze-form-toggle');
      if (form.hasClass('show')) {
          form.removeClass('show');
          setTimeout(function() {
              form.css('display', 'none');
          }, 500); // match the duration of the transition
      } else {
          form.css('display', 'block');
          setTimeout(function() {
              form.addClass('show');
          }); 
      }
      $(this).toggleClass('toggled');
    });

    var checkoutFunctions = function () {
      $(document).on('click', 'button.coupon-code-apply-button', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        // Remove any existing error messages
        $('.blaze-coupon-error').remove();

        var couponCode = $('input#coupon-code-input').val();
        $('input#coupon_code').val(couponCode);

        // Create an observer to watch for the error message
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    // Get all error notices and take the last one
                    const errorNotices = document.querySelectorAll('.coupon-error-notice');
                    if (errorNotices.length > 0) {
                        const lastErrorNotice = errorNotices[errorNotices.length - 1];
                        
                        // Remove any existing error messages first
                        $('.blaze-coupon-error').remove();
                        
                        // Add new error message to our custom coupon container
                        $('.coupon-code-form.blaze-form-toggle').append(
                            '<div class="blaze-coupon-error" style="color: #cc0000; margin-top: 10px;">' + 
                            lastErrorNotice.textContent + 
                            '</div>'
                        );
                        observer.disconnect();
                    }
                }
            });
        });

        // Start observing the checkout form for changes
        observer.observe($('form.checkout')[0], {
            childList: true,
            subtree: true
        });

        // Trigger WooCommerce's native coupon button
        $('form.checkout_coupon.woocommerce-form-coupon button.button').trigger('click');
    });
    
    $(document).on('click', '.btn-checkout-as-guest', function(e) {
      e.preventDefault();
      var guestEmail = $('#guest_email').val();
      // Check if user is not logged in by looking for the logged-in class or body class
      var isLoggedIn = $('body').hasClass('logged-in') || $('body').hasClass('woocommerce-logged-in');
      
      if (validateEmail(guestEmail)) {
        $('.information-content-preview')
        .html('<span>'+ guestEmail +'</span>')
        .css('display', 'flex');
          $('.accordion-content').hide();
          $('.error-message').hide();
          // Only sync email if user is not logged in
          if (!isLoggedIn) {
              $('#billing_email').val(guestEmail);
          }
         
          $('.information-accordion').addClass('completed');
          $('.information-content-preview').addClass('completed');
          $(".information-content-preview").append(
            '<span class="edit-button">Edit</span>'
          );
          
          if ( $(this).parents('.accordion-item').hasClass('direct-to-payment') && $('.billing-shipping-accordion').parent().hasClass('direct-to-payment')) {
            $('.payment-accordion-content').slideDown();
            $('#wc-stripe-payment-request-button-separator').prependTo('.payment-accordion-content');
            $('#wc-stripe-payment-request-wrapper').insertBefore('#wc-stripe-payment-request-button-separator');
          } else {
            $('.billing-shipping-accordion-content').slideDown().addClass('show-flex');
            $(this).parents('.accordion-item').addClass('direct-to-payment');
            $('#wc-stripe-payment-request-button-separator').prependTo('.checkout.woocommerce-checkout');
            $('#wc-stripe-payment-request-wrapper').insertBefore('#wc-stripe-payment-request-button-separator');
          }
      } else {
        $('.error-message').show();
        return false;
      }
    });

		//Validate email syntax on guest checkout
		function validateField(event) {
			const inputValue = $(event.target).val(),
				  inputField = $(event.target),
				  fieldHolder = inputField.is("#guest_email") ? inputField.parent().parent() : inputField.parent(),
				  errorHolder = fieldHolder.find(".error-message");
		
			if (validateEmail(inputValue)) {
				errorHolder.hide();
				fieldHolder.removeClass("woocommerce-invalid");
				fieldHolder.addClass("woocommerce-validated");
			} else {
				errorHolder.show();
				fieldHolder.removeClass("woocommerce-validated");
				fieldHolder.addClass("woocommerce-invalid");
			}
		}
		
		// Debounced version for keydown events
		const debouncedValidateField = debounce(validateField, 500);
		
		// Event listeners for keydown and blur events
		$(document).on("keydown", "#guest_email, #username, #reg_email", debouncedValidateField);
		$(document).on("blur focusout", "#guest_email, #username, #reg_email", validateField);

// Function to validate phone number (stricter validation for phone numbers)
function validatePhoneNumber(phone) {
  // Remove non-breaking spaces and any invisible characters
  phone = phone.replace(/\u00A0/g, ''); // Remove non-breaking spaces

  // Adjust the regex pattern for stricter validation (7 to 15 digits, no leading 0)
  const phonePattern = /^\+?[0-9\s]*\d{6,14}$/;
  return phonePattern.test(phone);
}

// Validate phone number syntax on guest checkout
function validatePhoneField(event) {
  const inputValue = $(event.target).val().replace(/\u00A0/g, ''),  // Sanitize input value
        inputField = $(event.target),
        fieldHolder = inputField.is("#billing_phone") ? inputField.parent().parent() : inputField.parent(),
        errorHolder = fieldHolder.find(".error-message");

  if (validatePhoneNumber(inputValue)) {
      errorHolder.hide();
      fieldHolder.removeClass("woocommerce-invalid");
      fieldHolder.addClass("woocommerce-validated");
  } else {
      errorHolder.show();
      fieldHolder.removeClass("woocommerce-validated");
      fieldHolder.addClass("woocommerce-invalid");
  }
}

// Debounce function to improve performance on keydown events
function debounce(func, delay) {
  let debounceTimer;
  return function() {
      const context = this, args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

// Debounced version for keydown events
const debouncedValidatePhoneField = debounce(validatePhoneField, 500);

// Event listeners for keydown and blur events
$(document).on("keydown", "#billing_phone", debouncedValidatePhoneField);
$(document).on("blur focusout", "#billing_phone", validatePhoneField);



    $(document).on('click', '.btn-continue', function(e) {
      e.preventDefault();
      var errorCount = 0;
      $('.field-error').remove();

      if ($('#save-info-checkbox').prop('checked')) {
        // Trigger a click on the WooCommerce register button if the checkbox is checked
        $('.woocommerce-Button[name="register"]').trigger('click');
      } 
      if ( $('#billing_first_name').val() == null ||  $('#billing_first_name').val() == '') {
        $('#billing_first_name').parent().append('<span class="field-error">First Name is required.</div>');
        errorCount++;
      }
      if ( $('#billing_last_name').val() == null ||  $('#billing_last_name').val() == '') {
        $('#billing_last_name').parent().append('<span class="field-error">Last Name is required.</div>');
        errorCount++;
      }
      if ( $('#billing_country').val() == null ||  $('#billing_country').val() == '') {
        $('#billing_country').parent().append('<span class="field-error">Country is required.</div>');
        errorCount++;
      }
      if ( $('#billing_address_1').val() == null ||  $('#billing_address_1').val() == '') {
        $('#billing_address_1').parent().append('<span class="field-error">Address is required.</div>');
        errorCount++;
      }
      if ( $('#billing_city').val() == null ||  $('#billing_city').val() == '') {
        const label = document.querySelector('label[for="billing_city"]');
        const cityText = label.childNodes[0].nodeValue.trim();
        $('#billing_city').parent().append('<span class="field-error">' + cityText + ' is required.</div>');
        errorCount++;
      }
      if ( $('#billing_state').val() == null ||  $('#billing_state').val() == '') {
        // Check if the state field is hidden (for countries like France)
        if ($('#billing_state').parent().is(':hidden')) {
          // If hidden, set the state value to match the city value
          $('#billing_state').val($('#billing_city').val());
        } else {
          // Only show error if the field is visible and required
          const label = document.querySelector('label[for="billing_state"]');
          const stateText = label.childNodes[0].nodeValue.trim();
          $('#billing_state').parent().append('<span class="field-error">' + stateText + ' is required.</div>');
          errorCount++;
        }
      }
      if ( $('#billing_postcode').val() === '') {
        const label = document.querySelector('label[for="billing_postcode"]');
        const postcodeText = label.childNodes[0].nodeValue.trim();
        $('#billing_postcode').parent().append('<span class="field-error">' + postcodeText + ' is required.</div>');
        errorCount++;
      } else {
        const postcode = $('#billing_postcode').val();
        const country = $('#billing_country').val();
        
        if (!validatePostcode(postcode, country)) {
            $('#billing_postcode').parent().append('<span class="field-error">Please enter a valid postcode/ZIP for your country.</div>');
            errorCount++;
        }
      }
// Validation for Phone Number
var phone = $('#billing_phone').val().replace(/\u00A0/g, '');  // Sanitize the input by removing non-breaking spaces
var phoneRegex = /^\+?[0-9\s]*\d{6,14}$/;  // Allow digits and regular spaces

if (phone == null || phone == '') {
    $('#billing_phone').parent().append('<span class="field-error">Phone is required.</span>');
    errorCount++;
} else if (!phoneRegex.test(phone)) {
    $('#billing_phone').parent().append('<span class="field-error">Invalid phone number.</span>');
    errorCount++;
}
      if ( $('#billing_email').val() == null ||  $('#billing_email').val() == '') {
        $('#billing_email').parent().append('<span class="field-error">Email is required.</div>');
        errorCount++;
      }
      if (errorCount > 0) {
          var top = $('.billing-shipping-accordion').offset().top;
          $('html').animate({scrollTop: top}, 'fast');
          return false;
      } else {
        var billingFirstName = $('#billing_first_name').val();
        var billingLastName = $('#billing_last_name').val();
        var billingPhoneNumber = $('#billing_phone').val();
        var billingCompanyName = $('#billing_company').val();
        var billingAddress1 = $('#billing_address_1').val();
        var billingAddress2 = $('#billing_address_2').val();
        var billingCity = $('#billing_city').val();
        var billingStateRaw = $('#billing_state').val();
        var billingState = $('#billing_state option[value="'+ billingStateRaw +'"]').text();
        var billingPostCode = $('#billing_postcode').val();
        var billingCountryRaw = $('#billing_country').val();
        var billingCountry = $('#billing_country option[value="'+ billingCountryRaw +'"]').text();

        var shippingFirstName = $('#shipping_first_name').val();
        var shippingLastName = $('#shipping_last_name').val();
        var shippingCompanyName = $('#shipping_company').val();
        var shippingAddress1 = $('#shipping_address_1').val();
        var shippingAddress2 = $('#shipping_address_2').val();
        var shippingCity = $('#shipping_city').val();
        var shippingStateRaw = $('#shipping_state').val();
        var shippingState = $('#shipping_state option[value="'+ shippingStateRaw +'"]').text();
        var shippingPostCode = $('#shipping_postcode').val();
        var shippingCountryRaw = $('#shipping_country').val();
        var shippingCountry = $('#shipping_country option[value="'+ shippingCountryRaw +'"]').text();

        var isDifferentShipping = $('#ship-to-different-address-checkbox').is(':checked');

        var billingShippingHTML = '<div class="preview-addresses">' +
                                 '<div class="address-section">' +
                                 '<h4>Billing Address</h4>' +
                                 '<span>'+ billingFirstName +' '+ billingLastName +'</span>' +
                                 '<span>'+ billingCompanyName +' '+ billingPhoneNumber +'</span>' +
                                 '<span>'+ billingAddress1 +'</span>' +
                                 (billingAddress2 ? '<span>'+ billingAddress2 +'</span>' : '') +
                                 '<span>'+ billingCity +', '+ billingStateRaw +', '+ billingPostCode +' / '+ billingCountryRaw + '</span>';

        if (isDifferentShipping) {
            billingShippingHTML += '<h4 class="shipping-title">Shipping Address</h4>' +
                                  '<span>'+ shippingFirstName +' '+ shippingLastName +'</span>' +
                                  (shippingCompanyName ? '<span>'+ shippingCompanyName +'</span>' : '') +
                                  '<span>'+ shippingAddress1 +'</span>' +
                                  (shippingAddress2 ? '<span>'+ shippingAddress2 +'</span>' : '') +
                                  '<span>'+ shippingCity +', '+ shippingStateRaw +', '+ shippingPostCode +' / '+ shippingCountryRaw + '</span>';
        }

        billingShippingHTML += '</div></div>';

        $('.billing-shipping-content-preview').html(billingShippingHTML).show();
        $('.accordion-content').hide();
        $('.payment-accordion-content').slideDown();
        $('#wc-stripe-payment-request-button-separator').prependTo('.payment-accordion-content');
        $('#wc-stripe-payment-request-wrapper').insertBefore('#wc-stripe-payment-request-button-separator');
        $('.billing-shipping-accordion').addClass('completed');
        $('.billing-shippiing-content-preview').addClass('completed');
        $('.billing-shippiing-content-preview').append('<span class="edit-button">Edit</span>');
        $(this).parents('.accordion-item').addClass('direct-to-payment');
        //console.log($('.payment-accordion-content').offset());
        setTimeout(function() {
          var top = $('.payment-accordion-content').offset().top - 64;
          $('html').animate({scrollTop: top}, 'fast');
        }, 200);
      }
    });

    // if ( $('.information-accordion-preview .edit-button').length == 0 ) {
      $(document).on(
        "click",
        '.information-content-preview .edit-button',function () {
          console.log('Event triggered'); // Debugging line
          $('.accordion-content').hide();
          $('.information-accordion-preview').removeClass('completed');
          $('.information-content-preview').hide();
          $('.information-accordion-content').slideDown();
          $('.information-accordion').removeClass('completed');

        if ($('.direct-to-payment .billing-shipping-accordion').length > 0) {
          var firstName = $('#billing_first_name').val();
          var lastName = $('#billing_last_name').val();
          var phoneNumber = $('#billing_phone').val();
          var companyName = $('#billing_company').val();
          var address1 = $('#billing_address_1').val();
          var address2 = $('#billing_address_2').val();
          var city = $('#billing_city').val();
          var stateRaw = $('#billing_state').val();
          var state = $('#billing_state option[value="'+ stateRaw +'"]').text();
          var postCode = $('#billing_postcode').val();
          var countryRaw = $('#billing_country').val();
          var country = $('#billing_country option[value="'+ countryRaw +'"]').text();

          var billingShippingHTML = '<span>'+ firstName +' '+ lastName +'</span>'
                                  + '<span>'+ companyName +' '+ phoneNumber +'</span>'
                                  + '<span>'+ address1 +'</span>'
                                  + (address2 ? '<span>'+ address2 +'</span>' : '')
                                  + '<span>'+ city +', '+ state +', '+ postCode +' </span>';
          // $('.billing-shipping-content-preview').html(billingShippingHTML).show();
          $('.billing-shipping-accordion').addClass('completed');
          $('#wc-stripe-payment-request-button-separator').prependTo('.checkout.woocommerce-checkout');
          $('#wc-stripe-payment-request-wrapper').insertBefore('#wc-stripe-payment-request-button-separator');
        }
      });
   // }

      
   $(document).on(
    "click",
    '.billing-shipping-content-preview .edit-button',function () {
        $('.accordion-content').hide();
        $('.billing-shipping-content-preview').hide();
        $('.billing-shipping-accordion-content').slideDown().addClass('show-flex');
        $('.billing-shipping-accordion').removeClass('completed');

        if ($('.direct-to-payment .information-accordion').length > 0) {
          var guestEmail = $('#guest_email').val();
          // $('.information-content-preview').html('<span>'+ guestEmail +'</span>').show();
          $('.error-message').hide();
          $('#billing_email').val(guestEmail);
          if ( $('.newsletter-checkbox').prop('checked') ) {
            $('#k_id_email').val(guestEmail);
          }
          $('.information-accordion').addClass('completed');
          $('#wc-stripe-payment-request-button-separator').prependTo('.checkout.woocommerce-checkout');
          $('#wc-stripe-payment-request-wrapper').insertBefore('#wc-stripe-payment-request-button-separator');
        }
      });

    $(document).on('click', '.woocommerce-form-coupon-toggle', function(e) {
      e.preventDefault();
      $('.woocommerce-form-coupon').slideToggle('fast');
      setTimeout(function() {
        if ( $('.woocommerce-form-coupon').is(":visible") ) {
          $('.woocommerce-form-coupon-toggle').addClass('open');
        } else {
          $('.woocommerce-form-coupon-toggle').removeClass('open');
        }
      }, 400);
      
    });

    $('.shipping_method').each(function() {
      var thisMethod  = $(this);
      if ( thisMethod.is(':checked') ) {
        thisMethod.parent().addClass('selected');
      }
    });

    $(document).on( 'updated_checkout', function(){
      $('.shipping_method').each(function() {
        var thisMethod  = $(this);
        if ( thisMethod.is(':checked') ) {
          thisMethod.parent().addClass('selected');
        }
      });
    })
    
    $(document).on( 'change', '.shipping_method', function() {
      $('.shipping_method').each(function() {
        var thisMethod  = $(this);
        if ( thisMethod.is(':checked') ) {
          thisMethod.parent().addClass('selected');
        } else {
          thisMethod.parent().removeClass('selected');
        }
      });
    });

    $(document).on( 'click', 'a[data-trigger="tabs"]', function(e) {
      e.preventDefault();
      var tabTrigger = $(this);
      var target = tabTrigger.data('target');

      $('a[data-trigger="tabs"]').parent().removeClass('active');
      tabTrigger.parent().addClass('active');

      $('.tab-panes .tab-pane').removeClass('active');
      $(target).addClass('active');
    });

    $(document).on('click', '.woocommerce-form-login__submit', function(e) {
      e.preventDefault();
      openPost( window.location.href, {
        'username': $('input#blz-username').val(),
        'password': $('input#blz-password').val(),
        'rememberme': $('input#rememberme').val(),
        'woocommerce-login-nonce': $('input#woocommerce-login-nonce').val(),
        '_wp_http_referer': $('input[name="_wp_http_referer"]').val(),
        'redirect': $('input[name="redirect"]').val(),
        'login': 'Login',
      });
      
      // Clear guest email field and localStorage
      $('#guest_email').val('');
      localStorage.removeItem('blaze_guest_email');
      
      // Update the preview with the logged-in user's email
      var loggedInEmail = $('#billing_email').val();
      $('.information-content-preview').html('<span>' + loggedInEmail + '</span>');
    });
    $(document).on('click', '.woocommerce-form-register__submit', function(e) {
      e.preventDefault();
      openPost( window.location.href, {
        'username': $('input#reg_username').val(),
        'email': $('input#reg_email').val(),
        'password': $('input#reg_password').val(),
        'woocommerce-register-nonce': $('input#woocommerce-register-nonce').val(),
        '_wp_http_referer': $('input[name="_wp_http_referer"]').val(),
        'register': 'Register',
      });
    });

    // Make order review sticky
    var offset = 200;
    if ( $('header').length > 0 ) {
      offset = $('header').height() + 20;
    }
    // $('.blaze-commerce-checkout-order-review-wrap').css({
    //   'position': 'sticky',
    //   'top': offset + 'px',
    // });
  }
  
  $(document).ready(function() {
    if ( $('.woocommerce-checkout').length > 0) {
      checkoutFunctions();
    }
  });

  function openPost (url, params) {
    var formElement = document.createElement("form");
    formElement.setAttribute("method", "post");
    formElement.setAttribute("action", url);
    formElement.setAttribute("target", "_parent");

    for (param in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("name", param);
        hiddenField.setAttribute("value", params[param]);
        formElement.appendChild(hiddenField);
    }

    document.body.appendChild(formElement);
    formElement.submit();
  }

  // Save guest email value when it changes
  $(document).on('change keyup', '#guest_email', function () {
      const emailValue = $(this).val();
      var isLoggedIn = $('body').hasClass('logged-in') || $('body').hasClass('woocommerce-logged-in');
      
      if (emailValue && !isLoggedIn) {
          localStorage.setItem('blaze_guest_email', emailValue);
      } else {
          localStorage.removeItem('blaze_guest_email');
      }
  });

  // Restore guest email value on page load
  $(document).ready(function () {
    const savedEmail = localStorage.getItem('blaze_guest_email');
    var isLoggedIn = $('body').hasClass('logged-in') || $('body').hasClass('woocommerce-logged-in');
    
    if (savedEmail && $('#guest_email').length && !isLoggedIn) {
        $('#guest_email').val(savedEmail);

        // Trigger validation if it exists
        if (typeof validateField === 'function') {
            $('#guest_email').trigger('blur');
        }
    } else {
        localStorage.removeItem('blaze_guest_email');
    }
  });
  // Function to save billing field values
  function saveBillingField() {
    const billingFields = [
        'billing_first_name',
        'billing_last_name',
        'billing_phone'
    ];

    billingFields.forEach(field => {
        $(document).on('change keyup', `#${field}`, function () {
            const fieldValue = $(this).val();
            if (fieldValue) {
                localStorage.setItem(`blaze_${field}`, fieldValue);
            }
        });
    });
  }

  // Function to restore billing field values
  function restoreBillingFields() {
    const billingFields = [
        'billing_first_name',
        'billing_last_name',
        'billing_phone'
    ];

    billingFields.forEach(field => {
        const savedValue = localStorage.getItem(`blaze_${field}`);
        if (savedValue && $(`#${field}`).length) {
            $(`#${field}`).val(savedValue);

            // Trigger validation for phone field if it exists
            if (field === 'billing_phone' && typeof validatePhoneField === 'function') {
                $(`#${field}`).trigger('blur');
            }
        }
    });
  }

  // Initialize the functions when document is ready
  $(document).ready(function () {
      saveBillingField();
      restoreBillingFields();
  });

  function validatePostcode(postcode, country) {
    // Common patterns for different countries
    const patterns = {
        'US': /^\d{5}(-\d{4})?$/, // US ZIP code (5 digits, optional 4 digit extension)
        'GB': /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/, // UK postcode
        'CA': /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i, // Canadian postal code
        'AU': /^\d{4}$/, // Australian postcode
        'default': /^[A-Z0-9\s-]{3,10}$/i // Generic pattern for other countries
    };

    // Clean the postcode (remove extra spaces)
    postcode = postcode.toString().trim().toUpperCase();

    // Get the appropriate pattern
    const pattern = patterns[country] || patterns['default'];

    // Test the postcode against the pattern
    const isValid = pattern.test(postcode);

    return isValid;
  }

  $(document).on('change keyup', '#shipping_postcode', function() {
    const postcode = $(this).val();
    const country = $('#shipping_country').val();
    const $field = $(this).parent();
    const $errorMessage = $field.find('.field-error');
    const $continueButton = $('.btn-continue');
    
    // Remove any existing error message
    if ($errorMessage.length) {
        $errorMessage.remove();
    }
    
    if (postcode === '') {
        const label = document.querySelector('label[for="shipping_postcode"]');
        const postcodeText = label.childNodes[0].nodeValue.trim();
        $field.append('<span class="field-error">' + postcodeText + ' is required.</span>');
        $continueButton.addClass('disabled');
        return;
    }
    
    if (!validatePostcode(postcode, country)) {
        $field.append('<span class="field-error">Please enter a valid postcode/ZIP for your country.</span>');
        $continueButton.addClass('disabled');
    } else {
        $continueButton.removeClass('disabled');
    }
  });
  
  // Update validation when shipping country changes
  $(document).on('change', '#shipping_country', function() {
      // Trigger validation on the postcode field if it has a value
      if ($('#shipping_postcode').val()) {
          $('#shipping_postcode').trigger('change');
      }
  });
  
  // Add this function near your other validation functions
  function isShippingPostcodeValid() {
      const postcode = $('#shipping_postcode').val();
      const country = $('#shipping_country').val();
      
      if (!postcode) return false;
      return validatePostcode(postcode, country);
  }

  
})(jQuery);

jQuery(document).ready(function($) {
    // Function to check if the .woocommerce-invalid class is present and show/hide the error message
    function checkValidationStatus() {
      var $formElement = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.form-checkout > div.guest-form > div');
      var $errorMessage = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.form-checkout > div > div > span.error-message');
      
      if ($formElement.hasClass('woocommerce-invalid')) {
          // If the .woocommerce-invalid class is present, show the error message
          $errorMessage.removeClass('guest-custom-hide').addClass('guest-custom-show');
      } else {
          // If the .woocommerce-invalid class is not present, hide the error message
          $errorMessage.removeClass('guest-custom-show').addClass('guest-custom-hide');
      }
  }

  // Initialize the MutationObserver to monitor changes to the class list of the form element
  var targetNode = document.querySelector('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.form-checkout > div.guest-form > div');
  var config = { attributes: true, attributeFilter: ['class'] };

  var observer = new MutationObserver(function(mutationsList, observer) {
      // When a mutation is detected (a class change), check the validation status
      checkValidationStatus();
  });

  // Start observing for class changes
  if (targetNode) {
      observer.observe(targetNode, config);
  }

  // Initial check in case the class is already applied when the page loads
  checkValidationStatus();


  function setupEmailSync() {
    // Only setup email sync if user is not logged in
    var isLoggedIn = $('body').hasClass('logged-in') || $('body').hasClass('woocommerce-logged-in');
    
    if (!isLoggedIn) {
        const billingEmail = $('#billing_email');
        const regUsername = $('#reg_username');
        const regEmail = $('#reg_email');

        let lastValue = billingEmail.val();

        function syncText() {
            const emailValue = billingEmail.val();
            regUsername.val(emailValue);
            regEmail.val(emailValue);
        }

        setInterval(function() {
            const currentValue = billingEmail.val();
            if (currentValue !== lastValue) {
                syncText();
                lastValue = currentValue;
            }
        }, 500);
    }
  }

  // Call the function when the DOM is ready
  $(document).ready(function () {
      setupEmailSync();
  });


  function hideShowRegistration() {
    const checkbox = $('#save-info-checkbox'); // Select the checkbox

    // Attach a change event listener
    checkbox.on('change', function () {
        if (this.checked) {
            console.log('Checkbox is checked');
            // Add your logic for when the checkbox is checked
            $( ".woocommerce-form.woocommerce-form-register.register" ).show();
        } else {
            console.log('Checkbox is not checked');
            // Add your logic for when the checkbox is unchecked
            $( ".woocommerce-form.woocommerce-form-register.register" ).hide();
        }
    });
  }

  $(document).ready(function () {
      hideShowRegistration();
  });


});

jQuery(document).ready(function ($) {
  // Function to handle information edit button visibility
  function handleInfoEditButton() {
      var $infoEditButton = $('.information-content-preview.completed .edit-button');
      var $billingAccordion = $('.billing-shipping-accordion');

      if ($billingAccordion.hasClass('completed')) {
          $infoEditButton.show();
      } else {
          $infoEditButton.hide();
      }
  }

  // Run on page load
  handleInfoEditButton();

  // Watch for class changes on billing-shipping-accordion
  const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
          if (mutation.attributeName === 'class') {
              handleInfoEditButton();
          }
      });
  });

  // Start observing
  const billingAccordion = document.querySelector('.billing-shipping-accordion');
  if (billingAccordion) {
      observer.observe(billingAccordion, {
          attributes: true,
          attributeFilter: ['class']
      });
  }
});

jQuery(document).ready(function ($) {
  // Function to handle billing shipping edit button visibility
  function handleBillingShippingEditButton() {
      var $billingShippingEditButton = $('.billing-shippiing-content-preview.completed .edit-button');
      var $infoAccordion = $('.information-accordion');

      if ($infoAccordion.hasClass('completed')) {
          $billingShippingEditButton.show();
      } else {
          $billingShippingEditButton.hide();
      }
  }

  // Run on page load
  handleBillingShippingEditButton();

  // Watch for class changes on information-accordion
  const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
          if (mutation.attributeName === 'class') {
              handleBillingShippingEditButton();
          }
      });
  });

  // Start observing
  const infoAccordion = document.querySelector('.information-accordion');
  if (infoAccordion) {
      observer.observe(infoAccordion, {
          attributes: true,
          attributeFilter: ['class']
      });
  }
});

jQuery(document).ready(function ($) {
  // Function to handle billing shipping edit button visibility and padding
  function handleBillingShippingEditButton() {
      var $billingShippingEditButton = $('.billing-shippiing-content-preview.completed .edit-button');
      var $infoAccordion = $('.information-accordion');
      var $contentPreview = $('.billing-shipping-content-preview.billing-shippiing-content-preview.completed');

      if ($infoAccordion.hasClass('completed')) {
          $billingShippingEditButton.show();
          $contentPreview.css('padding', '30px 0px 0px 0px');
      } else {
          $billingShippingEditButton.hide();
          $contentPreview.css('padding', '30px 0');
      }
  }

  // Run on page load
  handleBillingShippingEditButton();

  // Watch for class changes on information-accordion
  const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
          if (mutation.attributeName === 'class') {
              handleBillingShippingEditButton();
          }
      });
  });

  // Start observing
  const infoAccordion = document.querySelector('.information-accordion');
  if (infoAccordion) {
      observer.observe(infoAccordion, {
          attributes: true,
          attributeFilter: ['class']
      });
  }
});

jQuery(document).ready(function ($) {
  // Create a MutationObserver to watch for changes in the form
  const observer = new MutationObserver(function (mutations) {
      $.each(mutations, function (i, mutation) {
          // Check if new nodes were added
          $.each(mutation.addedNodes, function (j, node) {
              // Check if the added node is the error message
              if ($(node).hasClass('woocommerce-error')) {
                  // Move the error message before the form
                  $(node).insertBefore('form.checkout.woocommerce-checkout');
              }
          });
      });
  });

  // Start observing the form with the configured parameters
  observer.observe($('form.checkout.woocommerce-checkout')[0], {
      childList: true,
      subtree: true
  });
});

// CUSTOM JS/jQUERY FOR HIDING OPTIONAL FIELDS ON CHECKOUT FORM. HIDDEN SIGNIN LOGIC
(function($) {
  $(document).ready(function() {
      function initializeSignInLogic() {
          // Get elements
          const signInBtn = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.blaze-checkout-signin > div > span:nth-child(1)');
          const closeBtn = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.blaze-checkout-signin > div > span:nth-child(3)');
          const accountTabs = $('.checkout-account-tabs');

          // Click event for 'Sign In to Save time'
          signInBtn.on('click', function() {
              accountTabs.addClass('show'); // Show the account tabs
              signInBtn.hide(); // Hide the sign-in button
              closeBtn.show(); // Show the close button
          });

          // Click event for 'Close' button
          closeBtn.on('click', function() {
              accountTabs.removeClass('show'); // Hide the account tabs
              signInBtn.show(); // Show the sign-in button again
              closeBtn.hide(); // Hide the close button
          });
      }

      // Call the function to initialize the logic
      initializeSignInLogic();
  });

  jQuery(document).ready(function($) {
    $('div.blaze-register-container > div > p.mailchimp-newsletter').remove();
    $('div.col-1 > div > div > p.mailchimp-newsletter').remove();
    $('#ship-to-different-address-checkbox').prop('checked', false);
    // Move the optional fields above the gov_order_field
    $('.woocommerce-additional-fields').insertBefore('p#additional__field');
    $('#order_comments_field').attr('data-priority', '120');
    $('p#additional__field').attr('data-priority', '130');
    $('p#gov_order_field').attr('data-priority', '140');

    function insertCustomPrompts() {
      // Remove any previously added prompts to prevent duplicates
      $('.blz-optional-company, .blz-optional-address, .blz-optional-notes, .blz-optional-date, .blz-gift-close').remove();
  
      // Billing Company Field
      const $billingCompanyField = $('#billing_company_field');
      if ($billingCompanyField.length && !$billingCompanyField.prev('.blz-optional-company').length) {
          const $addCompanyText = $('<div class="blz-optional-company">Add a company? (Optional)</div>');
          const $closeCompany = $('<div class="blz-gift-close">Close</div>');
  
          $billingCompanyField.before($addCompanyText);
          $billingCompanyField.before($closeCompany);
  
          $closeCompany.hide();
          $billingCompanyField.hide();
  
          $addCompanyText.on('click', function() {
              $billingCompanyField.show();
              $closeCompany.show();
              $addCompanyText.hide();
          });
  
          $closeCompany.on('click', function() {
              $billingCompanyField.hide();
              $closeCompany.hide();
              $addCompanyText.show();
          });
      }
  
      // Billing Address 2 Field
      const $billingAddress2Field = $('#billing_address_2_field');
      if ($billingAddress2Field.length && !$billingAddress2Field.prev('.blz-optional-address').length) {
          const $addAddressText = $('<div class="blz-optional-address">Add apartment, floor, etc. (Optional)</div>');
          const $closeAddress = $('<div class="blz-gift-close">Close</div>');
  
          $billingAddress2Field.before($addAddressText);
          $billingAddress2Field.before($closeAddress);
  
          $closeAddress.hide();
          $billingAddress2Field.hide();
  
          $addAddressText.on('click', function() {
              $billingAddress2Field.show();
              $closeAddress.show();
              $addAddressText.hide();
          });
  
          $closeAddress.on('click', function() {
              $billingAddress2Field.hide();
              $closeAddress.hide();
              $addAddressText.show();
          });
      }
  
      // Order Comments Field
      const $orderCommentsField = $('#order_comments_field');
      if ($orderCommentsField.length && !$orderCommentsField.prev('.blz-optional-notes').length) {
          const $addNotesText = $('<div class="blz-optional-notes">Add Notes? (Optional)</div>');
          const $closeNotes = $('<div class="blz-gift-close">Close</div>');
  
          $orderCommentsField.before($addNotesText);
          $orderCommentsField.before($closeNotes);
  
          $closeNotes.hide();
          $orderCommentsField.hide();
  
          $addNotesText.on('click', function() {
              $orderCommentsField.show();
              $closeNotes.show();
              $addNotesText.hide();
          });
  
          $closeNotes.on('click', function() {
              $orderCommentsField.hide();
              $closeNotes.hide();
              $addNotesText.show();
          });
      }
  
      // Additional Field
      const $additionalField = $('#additional__field');
      if ($additionalField.length && !$additionalField.prev('.blz-optional-date').length) {
          const $addDateText = $('<div class="blz-optional-date">Add Date? (Optional)</div>');
          const $closeDate = $('<div class="blz-gift-close">Close</div>');
  
          $additionalField.before($addDateText);
          $additionalField.before($closeDate);
  
          $closeDate.hide();
          $additionalField.hide();
  
          $addDateText.on('click', function() {
              $additionalField.show();
              $closeDate.show();
              $addDateText.hide();
          });
  
          $closeDate.on('click', function() {
              $additionalField.hide();
              $closeDate.hide();
              $addDateText.show();
          });
      }
    }
  
    // Insert custom prompts on page load
    $(document).ready(function() {
        insertCustomPrompts();
    });
    
    // Insert custom prompts after AJAX updates
    $(document.body).on('updated_checkout', function() {
        insertCustomPrompts();
    });
  });
})(jQuery);