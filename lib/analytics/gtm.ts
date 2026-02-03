/**
 * Google Tag Manager Integration for PoolOps
 *
 * Alternative to direct GA4 implementation
 * GTM provides more flexibility for marketing teams to manage tags
 */

// GTM Container ID from environment variables
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Check if GTM is enabled
export const isGTMEnabled = (): boolean => {
  return typeof window !== 'undefined' &&
         !!GTM_ID &&
         GTM_ID !== 'GTM-XXXXXXX';
};

/**
 * Push data to GTM data layer
 */
export const pushToDataLayer = (data: Record<string, unknown>): void => {
  if (!isGTMEnabled()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};

/**
 * Track page view via GTM
 */
export const gtmPageView = (url: string, title?: string): void => {
  pushToDataLayer({
    event: 'pageview',
    page: url,
    title: title,
  });
};

/**
 * Track custom event via GTM
 */
export const gtmEvent = (
  eventName: string,
  eventData?: Record<string, unknown>
): void => {
  pushToDataLayer({
    event: eventName,
    ...eventData,
  });
};

// ============================================
// GTM E-COMMERCE EVENTS
// Standard GTM data layer events for e-commerce
// ============================================

/**
 * Track view_item event
 */
export const gtmViewItem = (
  itemId: string,
  itemName: string,
  price: number,
  currency: string = 'USD'
): void => {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency,
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        price,
        quantity: 1,
      }],
    },
  });
};

/**
 * Track add_to_cart event
 */
export const gtmAddToCart = (
  itemId: string,
  itemName: string,
  price: number,
  currency: string = 'USD'
): void => {
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency,
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        price,
        quantity: 1,
      }],
    },
  });
};

/**
 * Track begin_checkout event
 */
export const gtmBeginCheckout = (
  itemId: string,
  itemName: string,
  price: number,
  currency: string = 'USD'
): void => {
  // Clear previous ecommerce data
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency,
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        price,
        quantity: 1,
      }],
    },
  });
};

/**
 * Track purchase event
 */
export const gtmPurchase = (
  transactionId: string,
  itemId: string,
  itemName: string,
  price: number,
  currency: string = 'USD'
): void => {
  // Clear previous ecommerce data
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      currency,
      value: price,
      items: [{
        item_id: itemId,
        item_name: itemName,
        price,
        quantity: 1,
      }],
    },
  });
};

// ============================================
// GTM CONVERSION EVENTS
// Custom events for PoolOps conversions
// ============================================

/**
 * Track demo request
 */
export const gtmDemoRequest = (source?: string): void => {
  pushToDataLayer({
    event: 'demo_request',
    conversion_type: 'lead',
    source,
  });
};

/**
 * Track trial signup
 */
export const gtmTrialSignup = (plan?: string): void => {
  pushToDataLayer({
    event: 'trial_signup',
    conversion_type: 'signup',
    plan,
  });
};

/**
 * Track form submission
 */
export const gtmFormSubmit = (
  formName: string,
  formData?: Record<string, unknown>
): void => {
  pushToDataLayer({
    event: 'form_submit',
    form_name: formName,
    ...formData,
  });
};

// ============================================
// USER DATA
// Set user-level data in data layer
// ============================================

/**
 * Set user data in data layer
 */
export const gtmSetUser = (userData: {
  userId?: string;
  userType?: string;
  plan?: string;
  companySize?: string;
}): void => {
  pushToDataLayer({
    event: 'user_data',
    user: userData,
  });
};
