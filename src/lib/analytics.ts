/**
 * Analytics utility for tracking user behavior.
 * Can be extended to use Google Analytics (gtag), Mixpanel, or custom backend.
 */

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

export const trackEvent = (eventName: string, params: Record<string, unknown> = {}): void => {
    // 1. Log to console for debugging
    console.log(`[Analytics] Event: ${eventName}`, params);

    // 2. Integration with Google Analytics (if available)
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }

    // 3. Integration with Facebook Pixel (if available)
    if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', eventName, params);
    }
};

export const ANALYTICS_EVENTS = {
    STEP_COMPLETE: 'step_complete',
    STEP_BACK: 'step_back',
    FORM_VALIDATION_ERROR: 'form_validation_error',
    WA_CHAT_CLICK: 'wa_chat_click',
    ORDER_SUBMIT_SUCCESS: 'order_submit_success',
    ORDER_SUBMIT_ERROR: 'order_submit_error',
    PDF_DOWNLOAD: 'pdf_download',
} as const;

