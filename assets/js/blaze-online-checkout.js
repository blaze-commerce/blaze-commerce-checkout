(function($) {
  function debounce(fn, delay) {
      var timer = null;
      return function() {
          var context = this,
              args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function() {
              fn.apply(context, args);
          }, delay);
      };
  }

  var validateEmail = function(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

  var checkoutFunctions = function() {
      $(document).on('click', 'button.coupon-code-apply-button', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();

          var couponCode = $('input#coupon-code-input').val();
          $('input#coupon_code').val(couponCode);

          $('form.checkout_coupon.woocommerce-form-coupon button.button').trigger('click');
      });

      $(document).on('click', '.btn-checkout-as-guest', function(e) {
          e.preventDefault();
          var guestEmail = $('#guest_email').val();
          if (validateEmail(guestEmail)) {
              $('.information-content-preview')
                  .html('<span>' + guestEmail + '</span>')
                  .css('display', 'flex');
              $('.accordion-content').hide();
              $('.error-message').hide();
              $('#billing_email').val(guestEmail);

              $('.information-accordion').addClass('completed');
              $('.information-content-preview').addClass('completed');
              $(".information-content-preview").append(
                  '<span class="edit-button">Edit</span>'
              );

              if ($(this).parents('.accordion-item').hasClass('direct-to-payment') && $('.billing-shipping-accordion').parent().hasClass('direct-to-payment')) {
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
          const inputValue = $(event.target).val().replace(/\u00A0/g, ''), // Sanitize input value
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
              const context = this,
                  args = arguments;
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
          if ($('#billing_first_name').val() == null || $('#billing_first_name').val() == '') {
              $('#billing_first_name').parent().append('<span class="field-error">First Name is required.</div>');
              errorCount++;
          }
          if ($('#billing_last_name').val() == null || $('#billing_last_name').val() == '') {
              $('#billing_last_name').parent().append('<span class="field-error">Last Name is required.</div>');
              errorCount++;
          }
          if ($('#billing_country').val() == null || $('#billing_country').val() == '') {
              $('#billing_country').parent().append('<span class="field-error">Country is required.</div>');
              errorCount++;
          }
          if ($('#billing_address_1').val() == null || $('#billing_address_1').val() == '') {
              $('#billing_address_1').parent().append('<span class="field-error">Address is required.</div>');
              errorCount++;
          }
          if ($('#billing_city').val() == null || $('#billing_city').val() == '') {
              const label = document.querySelector('label[for="billing_city"]');
              const cityText = label.childNodes[0].nodeValue.trim();
              $('#billing_city').parent().append('<span class="field-error">' + cityText + ' is required.</div>');
              errorCount++;
          }
          if ($('#billing_state').val() == null || $('#billing_state').val() == '') {
              const label = document.querySelector('label[for="billing_state"]');
              const stateText = label.childNodes[0].nodeValue.trim();
              $('#billing_state').parent().append('<span class="field-error">' + stateText + ' is required.</div>');
              errorCount++;
          }
          if ($('#billing_postcode').val() == null || $('#billing_postcode').val() == '') {
              const label = document.querySelector('label[for="billing_postcode"]');
              const postcodeText = label.childNodes[0].nodeValue.trim();
              $('#billing_postcode').parent().append('<span class="field-error">' + postcodeText + ' is required.</div>');
              errorCount++;
          }
          // Validation for Phone Number
          var phone = $('#billing_phone').val().replace(/\u00A0/g, ''); // Sanitize the input by removing non-breaking spaces
          var phoneRegex = /^\+?[0-9\s]*\d{6,14}$/; // Allow digits and regular spaces

          if (phone == null || phone == '') {
              $('#billing_phone').parent().append('<span class="field-error">Phone is required.</span>');
              errorCount++;
          } else if (!phoneRegex.test(phone)) {
              $('#billing_phone').parent().append('<span class="field-error">Invalid phone number.</span>');
              errorCount++;
          }
          if ($('#billing_email').val() == null || $('#billing_email').val() == '') {
              $('#billing_email').parent().append('<span class="field-error">Email is required.</div>');
              errorCount++;
          }
          const $shipToDifferentAddressSpan = $('#ship-to-different-address-checkbox').prop('checked');
          if (! $shipToDifferentAddressSpan){
            if ($('#ship-to-different-address-checkbox').prop('checked')) {
                if ($('#shipping_first_name').val() == null || $('#shipping_first_name').val() == '') {
                    $('#shipping_first_name').parent().append('<span class="field-error">First Name is required.</div>');
                    errorCount++;
                }
                if ($('#shipping_last_name').val() == null || $('#shipping_last_name').val() == '') {
                    $('#shipping_last_name').parent().append('<span class="field-error">Last Name is required.</div>');
                    errorCount++;
                }
                if ($('#shipping_country').val() == null || $('#shipping_country').val() == '') {
                    $('#shipping_country').parent().append('<span class="field-error">Country is required.</div>');
                    errorCount++;
                }
                if ($('#shipping_address_1').val() == null || $('#shipping_address_1').val() == '') {
                    $('#shipping_address_1').parent().append('<span class="field-error">Address is required.</div>');
                    errorCount++;
                }
                if ($('#shipping_city').val() == null || $('#shipping_city').val() == '') {
                    const label = document.querySelector('label[for="shipping_city"]');
                    const cityText = label.childNodes[0].nodeValue.trim();
                    $('#shipping_city').parent().append('<span class="field-error">' + cityText + ' is required.</div>');
                    errorCount++;
                }
                if ($('#shipping_state').val() == null || $('#shipping_state').val() == '') {
                    const label = document.querySelector('label[for="shipping_state"]');
                    const stateText = label.childNodes[0].nodeValue.trim();
                    $('#shipping_state').parent().append('<span class="field-error">' + stateText + ' is required.</div>');
                    errorCount++;
                }
                if ($('#shipping_postcode').val() == null || $('#shipping_postcode').val() == '') {
                    const label = document.querySelector('label[for="shipping_postcode"]');
                    const postcodeText = label.childNodes[0].nodeValue.trim();
                    $('#shipping_postcode').parent().append('<span class="field-error">' + postcodeText + ' is required.</div>');
                    errorCount++;
                }
            }
          }
          if (errorCount > 0) {
              var top = $('.billing-shipping-accordion').offset().top;
              $('html').animate({
                  scrollTop: top
              }, 'fast');
              return false;
          } else {
              var firstName = $('#billing_first_name').val();
              var lastName = $('#billing_last_name').val();
              var phoneNumber = $('#billing_phone').val();
              var companyName = $('#billing_company').val();
              var address1 = $('#billing_address_1').val();
              var address2 = $('#billing_address_2').val();
              var city = $('#billing_city').val();
              var stateRaw = $('#billing_state').val();
              var state = $('#billing_state option[value="' + stateRaw + '"]').text();
              var postCode = $('#billing_postcode').val();
              var countryRaw = $('#billing_country').val();
              var country = $('#billing_country option[value="' + countryRaw + '"]').text();

              var billingShippingHTML = '<span>' + firstName + ' ' + lastName + '</span>' +
                  '<span>' + companyName + ' ' + phoneNumber + '</span>' +
                  '<span>' + address1 + '</span>' +
                  (address2 ? '<span>' + address2 + '</span>' : '') +
                  '<span>' + city + ', ' + stateRaw + ', ' + postCode + ' / ' + countryRaw + '</span>';
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
                  $('html').animate({
                      scrollTop: top
                  }, 'fast');
              }, 200);
          }
      });

      // if ( $('.information-accordion-preview .edit-button').length == 0 ) {
      $(document).on(
          "click",
          '.information-content-preview .edit-button',
          function() {
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
                  var state = $('#billing_state option[value="' + stateRaw + '"]').text();
                  var postCode = $('#billing_postcode').val();
                  var countryRaw = $('#billing_country').val();
                  var country = $('#billing_country option[value="' + countryRaw + '"]').text();

                  var billingShippingHTML = '<span>' + firstName + ' ' + lastName + '</span>' +
                      '<span>' + companyName + ' ' + phoneNumber + '</span>' +
                      '<span>' + address1 + '</span>' +
                      (address2 ? '<span>' + address2 + '</span>' : '') +
                      '<span>' + city + ', ' + state + ', ' + postCode + ' </span>';
                  // $('.billing-shipping-content-preview').html(billingShippingHTML).show();
                  $('.billing-shipping-accordion').addClass('completed');
                  $('#wc-stripe-payment-request-button-separator').prependTo('.checkout.woocommerce-checkout');
                  $('#wc-stripe-payment-request-wrapper').insertBefore('#wc-stripe-payment-request-button-separator');
              }
          });
      // }

      $(document).on(
          "click",
          '.billing-shipping-content-preview .edit-button',
          function() {
              $('.accordion-content').hide();
              $('.billing-shipping-content-preview').hide();
              $('.billing-shipping-accordion-content').slideDown().addClass('show-flex');
              $('.billing-shipping-accordion').removeClass('completed');

              if ($('.direct-to-payment .information-accordion').length > 0) {
                  var guestEmail = $('#guest_email').val();
                  // $('.information-content-preview').html('<span>'+ guestEmail +'</span>').show();
                  $('.error-message').hide();
                  $('#billing_email').val(guestEmail);
                  if ($('.newsletter-checkbox').prop('checked')) {
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
              if ($('.woocommerce-form-coupon').is(":visible")) {
                  $('.woocommerce-form-coupon-toggle').addClass('open');
              } else {
                  $('.woocommerce-form-coupon-toggle').removeClass('open');
              }
          }, 400);

      });

      $('.shipping_method').each(function() {
          var thisMethod = $(this);
          if (thisMethod.is(':checked')) {
              thisMethod.parent().addClass('selected');
          }
      });

      $(document).on('updated_checkout', function() {
          $('.shipping_method').each(function() {
              var thisMethod = $(this);
              if (thisMethod.is(':checked')) {
                  thisMethod.parent().addClass('selected');
              }
          });
      })

      $(document).on('change', '.shipping_method', function() {
          $('.shipping_method').each(function() {
              var thisMethod = $(this);
              if (thisMethod.is(':checked')) {
                  thisMethod.parent().addClass('selected');
              } else {
                  thisMethod.parent().removeClass('selected');
              }
          });
      });

      $(document).on('click', 'a[data-trigger="tabs"]', function(e) {
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
          openPost(window.location.href, {
              'username': $('input#blz-username').val(),
              'password': $('input#blz-password').val(),
              'rememberme': $('input#rememberme').val(),
              'woocommerce-login-nonce': $('input#woocommerce-login-nonce').val(),
              '_wp_http_referer': $('input[name="_wp_http_referer"]').val(),
              'redirect': $('input[name="redirect"]').val(),
              'login': 'Login',
          });
      });
      $(document).on('click', '.woocommerce-form-register__submit', function(e) {
          e.preventDefault();
          openPost(window.location.href, {
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
      if ($('header').length > 0) {
          offset = $('header').height() + 20;
      }
      // $('.blaze-online-checkout-order-review-wrap').css({
      //   'position': 'sticky',
      //   'top': offset + 'px',
      // });
  }

  $(document).ready(function() {
      if ($('.woocommerce-checkout').length > 0) {
          checkoutFunctions();
      }
  });

  function openPost(url, params) {
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
  $(document).on('change keyup', '#guest_email', function() {
      const emailValue = $(this).val();
      if (emailValue) {
          localStorage.setItem('blaze_guest_email', emailValue);
      }
  });

  // Restore guest email value on page load
  $(document).ready(function() {
      const savedEmail = localStorage.getItem('blaze_guest_email');
      if (savedEmail && $('#guest_email').length) {
          $('#guest_email').val(savedEmail);

          // Trigger validation if it exists
          if (typeof validateField === 'function') {
              $('#guest_email').trigger('blur');
          }
      }
  });

  // Function to save billing field values
  function saveBillingField() {
      const billingFields = [
          'billing_first_name',
          'billing_last_name',
          'billing_company',
          'billing_city',
          'billing_address_1',
          'billing_address_2',
          'billing_postcode',
          'billing_phone'
      ];

      billingFields.forEach(field => {
          $(document).on('change keyup', `#${field}`, function() {
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
          'billing_company',
          'billing_city',
          'billing_address_1',
          'billing_address_2',
          'billing_postcode',
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
  $(document).ready(function() {
      saveBillingField();
      restoreBillingFields();
  });
})(jQuery);

jQuery(document).ready(function($) {
    // Function to move <dd> inside <dt>
    function moveDdIntoDt() {
        $('.variation dt').each(function() {
            try {
                var dtClass = $(this).attr('class'); // Get the class of the dt element
                var matchingDd = $('.variation dd.' + dtClass); // Find the matching dd with the same class
                if (matchingDd.length) {
                    $(this).append(' '); // Optional: Add space between dt and dd text
                    $(this).append(matchingDd.contents()); // Move dd content inside dt
                    matchingDd.remove(); // Remove the original dd element
                }
            } catch (error) {
                console.error('Error in moveDdIntoDt:', error);
            }
        });
    }

    // Initial page load
    moveDdIntoDt();

    // Trigger on every AJAX load with error handling
    $(document).ajaxComplete(function() {
        try {
            setTimeout(moveDdIntoDt, 500);
        } catch (error) {
            console.error('Error in ajaxComplete:', error);
        }
    });

    // Select the span element inside the label
    var $shipToDifferentAddressSpan = $('#ship-to-different-address > label > span');

    if ($shipToDifferentAddressSpan.length) {
        // Change the text content
        $shipToDifferentAddressSpan.text('Same as shipping address?');
    }

    function toggleShippingAddress(checkboxSelector, formSelector) {
        var $checkbox = $(checkboxSelector);
        var $form = $(formSelector);

        if (!$checkbox.length || !$form.length) {
            return; // Exit if elements don't exist
        }

        function updateVisibility() {
            if ($checkbox.is(':checked')) {
                $form.addClass('blz-custom-form').removeClass('blz-custom-form-2');
            } else {
                $form.addClass('blz-custom-form-2').removeClass('blz-custom-form');
            }
        }

        // Set initial visibility on page load
        updateVisibility();

        // Bind event listener to checkbox change
        $checkbox.on('change', updateVisibility);
    }

    // Call the function
    toggleShippingAddress('#ship-to-different-address-checkbox', '.shipping_address');

    function syncBillingToShipping(checkboxSelector) {
        var $checkbox = $(checkboxSelector);

        // Array of billing and shipping fields to sync
        var fields = [
            { billing: '#billing_first_name', shipping: '#shipping_first_name' },
            { billing: '#billing_last_name', shipping: '#shipping_last_name' },
            { billing: '#billing_company', shipping: '#shipping_company' },
            { billing: '#billing_country', shipping: '#shipping_country' },
            { billing: '#billing_address_1', shipping: '#shipping_address_1' },
            { billing: '#billing_address_2', shipping: '#shipping_address_2' },
            { billing: '#billing_city', shipping: '#shipping_city' },
            { billing: '#billing_state', shipping: '#shipping_state' },
            { billing: '#billing_postcode', shipping: '#shipping_postcode' }
        ];

        if (!$checkbox.length) {
            return;
        }

        // Function to sync billing to shipping fields
        function syncFields() {
            try {
                fields.forEach(function(field) {
                    var $billingField = $(field.billing);
                    var $shippingField = $(field.shipping);

                    if ($checkbox.is(':checked') && $billingField.length && $shippingField.length) {
                        var billingValue = $billingField.val();
                        $shippingField.val(billingValue).trigger('change');
                    } else if ($shippingField.length) {
                        $shippingField.val('').trigger('change');
                    }
                });
            } catch (error) {
                console.error('Error in syncFields:', error);
            }
        }

        // Listen for checkbox state changes
        $checkbox.on('change', syncFields);

        // Listen for input changes in billing fields
        fields.forEach(function(field) {
            $(field.billing).on('input', function() {
                try {
                    if ($checkbox.is(':checked')) {
                        var $shippingField = $(field.shipping);
                        if ($shippingField.length) {
                            $shippingField.val($(this).val()).trigger('change');
                        }
                    }
                } catch (error) {
                    console.error('Error in billing field input handler:', error);
                }
            });
        });
    }

    // Call the function
    syncBillingToShipping('#ship-to-different-address-checkbox');

    // Function to remove the 'screen-reader-text' class and change the label text
    function updateBillingAddress2Label() {
        try {
            // Only proceed if we're on the checkout page
            if (!$('.woocommerce-checkout').length) {
                return;
            }
    
            // More specific selector and multiple attempts to find the label
            const $field = $('#billing_address_2_field');
            let $label = $field.find('label.screen-reader-text');
            
            if (!$label.length) {
                $label = $field.find('label');
            }
    
            if ($label.length) {
                $label.removeClass('screen-reader-text');
                $label.text('Apartment, unit, building, floor, etc. (optional)');
            }
        } catch (error) {
            console.error('Error updating billing address 2 label:', error);
        }
    }
    
    // Initialize on document ready with a slight delay
    $(document).ready(function() {
        setTimeout(updateBillingAddress2Label, 500);
    });
    
    // Update on WooCommerce checkout updates
    $(document.body).on('updated_checkout', function() {
        setTimeout(updateBillingAddress2Label, 500);
    });
    
    // Use a more focused MutationObserver
    $(document).ready(function() {
        try {
            const checkoutForm = document.querySelector('.woocommerce-checkout');
            if (checkoutForm) {
                const observer = new MutationObserver(function(mutations) {
                    const shouldUpdate = mutations.some(mutation => 
                        mutation.target.id === 'billing_address_2_field' || 
                        mutation.target.contains(document.getElementById('billing_address_2_field'))
                    );
                    
                    if (shouldUpdate) {
                        setTimeout(updateBillingAddress2Label, 100);
                    }
                });
    
                observer.observe(checkoutForm, {
                    childList: true,
                    subtree: true,
                    attributes: true
                });
            }
        } catch (error) {
            console.error('Error setting up MutationObserver:', error);
        }
    });

    // Remove placeholder from billing_address_2
    function removeBillingAddress2Placeholder() {
        try {
            $('#billing_address_2').attr('placeholder', '');
        } catch (error) {
            console.error('Error removing billing_address_2 placeholder:', error);
        }
    }

    // Initialize on document ready
    $(document).ready(function() {
        setTimeout(removeBillingAddress2Placeholder, 500);
    });

    // Update on WooCommerce checkout updates
    $(document.body).on('updated_checkout', function() {
        setTimeout(removeBillingAddress2Placeholder, 500);
    });
});


jQuery(document).ready(function($) {
    // Function to update input type
    function updateInputType() {
        $('#shipping_method > li > input').each(function() {
            if ($(this).attr('type') === 'hidden') {
                console.log('Changing input type for:', $(this));
                $(this).attr('type', 'radio');
            }
        });
    }

    // Initial update on page load
    updateInputType();

    // Update input type on AJAX completion
    $(document).ajaxComplete(function() {
        updateInputType();
    });

    // Function to check if the .woocommerce-invalid class is present and show/hide the error message
    function checkValidationStatus() {
        var $formElement = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.form-checkout > div.guest-form > div');
        var $errorMessage = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.form-checkout > div > div > span.error-message');

        if ($formElement.hasClass('woocommerce-invalid')) {
            $errorMessage.removeClass('guest-custom-hide').addClass('guest-custom-show');
        } else {
            $errorMessage.removeClass('guest-custom-show').addClass('guest-custom-hide');
        }
    }

    // Monitor class changes with MutationObserver
    var $targetNode = $('#customer_details > div.accordion-item > div.accordion-content.information-accordion-content > div.form-checkout > div.guest-form > div');
    if ($targetNode.length) {
        var observer = new MutationObserver(function() {
            checkValidationStatus();
        });

        observer.observe($targetNode[0], {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Initial check for validation status
    checkValidationStatus();

    // Function to sync email fields
    function setupEmailSync() {
        var $billingEmail = $('#billing_email');
        var $regUsername = $('#reg_username');
        var $regEmail = $('#reg_email');

        var lastValue = $billingEmail.val();

        $.interval = setInterval(function() {
            var currentValue = $billingEmail.val();
            if (currentValue !== lastValue) {
                $regUsername.val(currentValue);
                $regEmail.val(currentValue);
                lastValue = currentValue;
            }
        }, 500);
    }

    // Initialize email synchronization
    setupEmailSync();

    // Function to toggle registration form visibility
    function hideShowRegistration() {
        var $checkbox = $('#save-info-checkbox');
        var $registrationForm = $('.woocommerce-form.woocommerce-form-register.register');
        $registrationForm.hide();

        $checkbox.on('change', function() {
            if ($(this).is(':checked')) {
                console.log('Checkbox is checked');
                $registrationForm.show();
            } else {
                console.log('Checkbox is not checked');
                $registrationForm.hide();
            }
        });
    }

    // Initialize hide/show functionality
    hideShowRegistration();
});