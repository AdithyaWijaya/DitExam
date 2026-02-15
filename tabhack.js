// Bypass Page Visibility API & Event blur & focus
// Author : xDitt4GT++
(function() {
    'use strict';

    // Backup original values
    const originalDocument = document;
    const originalWindow = window;

    // Override document.hidden property
    Object.defineProperty(document, 'hidden', {
        get: function() {
            return false;
        },
        configurable: false
    });

    // Override document.visibilityState property  
    Object.defineProperty(document, 'visibilityState', {
        get: function() {
            return 'visible';
        },
        configurable: false
    });

    // Override document.onvisibilitychange (if it exists)
    Object.defineProperty(document, 'onvisibilitychange', {
        get: function() {
            return null;
        },
        set: function(handler) {
            // Don't actually set it, or you could set a mock handler
        },
        configurable: false
    });

    // Override window.onfocus
    Object.defineProperty(window, 'onfocus', {
        get: function() {
            return function() {};
        },
        set: function(handler) {
            // Don't actually set it - bypass focus detection
        },
        configurable: false
    });

    // Override window.onblur
    Object.defineProperty(window, 'onblur', {
        get: function() {
            return function() {};
        },
        set: function(handler) {
            // Don't actually set it - bypass blur detection  
        },
        configurable: false
    });

    // Override addEventListener for blur and focus events
    const originalAddEventListener = window.addEventListener;
    
    window.addEventListener = function(type, listener, options) {
        // Bypass blur event listeners
        if (type === 'blur') {
            console.log('[Bypass] Blocked blur event listener');
            return;
        }
        
        // Bypass focus event listeners
        if (type === 'focus') {
            console.log('[Bypass] Blocked focus event listener');
            return;
        }
        
        // Bypass visibilitychange event listeners
        if (type === 'visibilitychange') {
            console.log('[Bypass] Blocked visibilitychange event listener');
            return;
        }
        
        // Bypass focusin event listeners
        if (type === 'focusin') {
            console.log('[Bypass] Blocked focusin event listener');
            return;
        }
        
        // Bypass focusout event listeners
        if (type === 'focusout') {
            console.log('[Bypass] Blocked focusout event listener');
            return;
        }
        
        // Pass through other events
        return originalAddEventListener.call(this, type, listener, options);
    };

    // Override removeEventListener for completeness
    const originalRemoveEventListener = window.removeEventListener;
    
    window.removeEventListener = function(type, listener, options) {
        // Still allow removal of blocked events (no-op anyway)
        if (type === 'blur' || type === 'focus' || type === 'visibilitychange' || type === 'focusin' || type === 'focusout') {
            return;
        }
        return originalRemoveEventListener.call(this, type, listener, options);
    };

    // Override EventTarget.prototype.addEventListener if available
    if (EventTarget && EventTarget.prototype) {
        const originalEventTargetAddEventListener = EventTarget.prototype.addEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'blur' || type === 'focus' || type === 'visibilitychange' || type === 'focusin' || type === 'focusout') {
                console.log('[Bypass] Blocked EventTarget.' + type + ' event listener');
                return;
            }
            return originalEventTargetAddEventListener.call(this, type, listener, options);
        };
    }

    // Mock function to manually trigger focus state (if needed)
    window.simulateFocus = function() {
        console.log('[Bypass] Simulating focus state');
    };

    // Mock function to manually trigger blur state (if needed)  
    window.simulateBlur = function() {
        console.log('[Bypass] Simulating blur state');
    };

    // Prevent pages from detecting visibility changes via polling
    let originalHidden = false;
    Object.defineProperty(document, 'hidden', {
        get: function() { 
            return false; 
        },
        set: function(value) {
            originalHidden = value;
        },
        configurable: true
    });

    console.log('[Bypass] Page Visibility API & blur/focus events bypass loaded');
})();