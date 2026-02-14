(function() {
    'use strict';
 
    window.addEventListener('blur', function(e) {
        e.stopImmediatePropagation();
    }, true);
 
    window.addEventListener('focus', function(e) {
        e.stopImmediatePropagation();
    }, true);
 
    document.addEventListener('visibilitychange', function(e) {
        e.stopImmediatePropagation();
    }, true);
 
    try {
        Object.defineProperty(document, 'hidden', {
            get: function() {
                return false;
            }
        });
    } catch (e) {
        console.log('Failed to override document.hidden:', e);
    }
 
    try {
        Object.defineProperty(document, 'visibilityState', {
            get: function() {
                return 'visible';
            }
        });
    } catch (e) {
        console.log('Failed to override document.visibilityState:', e);
    }
 
    var originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
            console.log('Blocked event listener for:', type);
            return;
        }
        originalAddEventListener.call(this, type, listener, options);
    };
 
    console.log('Tab switch detection bypassed!');
})();