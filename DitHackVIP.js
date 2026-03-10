// DitHack! VIP
// Developer: ADITHYA
// VIP VERSION

(function() {
    'use strict';

    // =====================================================
    // LICENSE SYSTEM
    // =====================================================

    // License configuration
    const LICENSE_CONFIG = {
        licenseFile: 'https://adithyawijaya.github.io/DitHack-Script/xditt4gt.json'
    };

    // Validate license against JSON file
    async function validateLicense(licenseCode) {
        try {
            // Fetch license.json from GitHub Pages
            const response = await fetch(LICENSE_CONFIG.licenseFile);
            
            if (!response.ok) {
                return { valid: false, message: 'Gagal memuat Token. Hubungi admin!' };
            }
            
            const licenseData = await response.json();
            const licenses = licenseData.licenses || [];
            
            // Find matching license
            const license = licenses.find(l => l.code === licenseCode);
            
            if (!license) {
                return { valid: false, message: 'Token tidak valid!' };
            }
            
            if (!license.active) {
                return { valid: false, message: 'Token sudah tidak aktif!' };
            }
            
            // Check expiration
            const expiryDate = new Date(license.expired);
            const now = new Date();
            
            if (expiryDate < now) {
                return { valid: false, message: 'Token sudah expired pada ' + license.expired };
            }
            
            return { valid: true, message: 'Selamat datang ' + license.owner + '!', owner: license.owner };
            
        } catch (error) {
            console.error('[License] Validation error:', error);
            return { valid: false, message: 'Error validasi Token. Pastikan terhubung internet!' };
        }
    }

    // Create license modal GUI
    function createLicenseModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('dithack-license-modal');
        if (existingModal) existingModal.remove();

        // Detect mobile
        const isMobile = window.innerWidth <= 480;
        
        // Dynamic sizing based on device
        const padding = isMobile ? '16px' : '20px';
        const titleSize = isMobile ? '18px' : '20px';
        const fontSize = isMobile ? '12px' : '13px';
        const inputPadding = isMobile ? '8px 10px' : '10px 12px';
        const buttonPadding = isMobile ? '8px' : '10px';
        const marginBottom = isMobile ? '8px' : '10px';
        const messageMarginTop = isMobile ? '4px' : '6px';
        const infoMarginTop = isMobile ? '6px' : '8px';
        const titleMarginBottom = isMobile ? '12px' : '14px';

        const overlay = document.createElement('div');
        overlay.id = 'dithack-license-modal';
        overlay.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            background: rgba(0, 0, 0, 0.85) !important; display: flex !important; align-items: center !important;
            justify-content: center !important; z-index: 9999999 !important; font-family: 'Segoe UI', Inter, system-ui, sans-serif !important;
            padding: 10px !important;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #ffffff !important;
            padding: ${padding} !important; border-radius: 10px !important; text-align: center !important;
            max-width: 350px !important; width: 90% !important; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
            border: 1px solid #ddd !important; height: auto !important; min-height: auto !important;
        `;

        // Title
        const title = document.createElement('h2');
        title.textContent = 'DitHack! VIP';
        title.style.cssText = `color: #333 !important; margin: 0 0 ${titleMarginBottom} 0 !important; font-size: ${titleSize} !important; font-weight: bold !important;`;

        // License input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'dithack-license-input';
        input.placeholder = 'Token Anda';
        input.style.cssText = `
            width: 100% !important; padding: ${inputPadding} !important; border-radius: 6px !important;
            border: 1px solid #000 !important; background: #fff !important;
            color: #333 !important; font-size: ${fontSize} !important; outline: none !important;
            box-sizing: border-box !important; margin-bottom: ${marginBottom} !important; text-align: center !important;
        `;

        // Message area
        const message = document.createElement('div');
        message.id = 'dithack-license-message';
        message.style.cssText = `color: #d00 !important; font-size: ${fontSize} !important; margin-top: ${messageMarginTop} !important; min-height: 20px !important;`;

        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Login';
        submitBtn.id = 'dithack-license-submit';
        submitBtn.style.cssText = `
            width: 100% !important; padding: ${buttonPadding} !important; border-radius: 6px !important;
            border: none !important; background: #0066ff !important;
            color: white !important; font-size: ${fontSize} !important; font-weight: bold !important;
            cursor: pointer !important;
        `;

        // Info text
        const infoText = document.createElement('p');
        infoText.innerHTML = 'Belum punya token? <a href="https://dithackvip.vercel.app" target="_blank" style="color: #4b4bfF; text-decoration: none;">Beli di sini</a>';
        infoText.style.cssText = `color: #666 !important; font-size: ${isMobile ? '11px' : '12px'} !important; margin-top: ${infoMarginTop} !important;`;

        modal.appendChild(title);
        modal.appendChild(input);
        modal.appendChild(submitBtn);
        modal.appendChild(message);
        modal.appendChild(infoText);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Handle submit
        submitBtn.onclick = async () => {
            const code = input.value.trim();
            if (!code) {
                message.textContent = 'Masukkan Token terlebih dahulu!';
                message.style.color = '#ff6b6b';
                return;
            }

            submitBtn.textContent = 'Memvalidasi...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            const result = await validateLicense(code);

            if (result.valid) {
                message.textContent = '✓ ' + result.message;
                message.style.color = '#00aa00';
                submitBtn.textContent = '✓ Aktif!';
                submitBtn.style.background = '#008800';
                
                setTimeout(() => {
                    overlay.remove();
                    // Initialize main app after valid license
                    initMainApp();
                }, 1500);
            } else {
                message.textContent = '✗ ' + result.message;
                message.style.color = '#ff6b6b';
                submitBtn.textContent = 'Login';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        };

        // Enter key support
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });

        // Focus input
        setTimeout(() => input.focus(), 100);

        return overlay;
    }

    // Check license on startup - always require input
    function checkLicense() {
        // Always show license modal - user must enter code each time
        createLicenseModal();
    }

    // =====================================================
    // PART 1: DETECTION BYPASS
    // =====================================================
    
    const originalAddEventListener = window.addEventListener;
    const originalDocumentAddEventListener = document.addEventListener;
    const originalEventTargetAddEventListener = EventTarget ? EventTarget.prototype.addEventListener : null;

    const blockedEvents = [
        'blur', 'focus', 'visibilitychange', 'focusin', 'focusout',
        'resize', 'fullscreenchange', 'fullscreenerror', 'contextmenu'
    ];

    // Page Visibility API & blur/focus Events
    Object.defineProperty(document, 'hidden', { get: function() { return false; }, configurable: false });
    Object.defineProperty(document, 'visibilityState', { get: function() { return 'visible'; }, configurable: false });
    Object.defineProperty(document, 'onvisibilitychange', { get: function() { return null; }, set: function() { }, configurable: false });
    Object.defineProperty(window, 'onfocus', { get: function() { return function() {}; }, set: function() { }, configurable: false });
    Object.defineProperty(window, 'onblur', { get: function() { return function() {}; }, set: function() { }, configurable: false });
    Object.defineProperty(window, 'onresize', { get: function() { return function() {}; }, set: function() { }, configurable: false });

    // Mock window dimensions
    let mockWidth = window.innerWidth;
    let mockHeight = window.innerHeight;

    Object.defineProperty(window, 'innerWidth', { get: function() { return mockWidth; }, configurable: true });
    Object.defineProperty(window, 'innerHeight', { get: function() { return mockHeight; }, configurable: true });
    Object.defineProperty(window, 'outerWidth', { get: function() { return mockWidth; }, configurable: true });
    Object.defineProperty(window, 'outerHeight', { get: function() { return mockHeight; }, configurable: true });

    // Screen properties
    Object.defineProperty(screen, 'width', { get: function() { return 1920; }, configurable: true });
    Object.defineProperty(screen, 'height', { get: function() { return 1080; }, configurable: true });
    Object.defineProperty(screen, 'availWidth', { get: function() { return 1920; }, configurable: true });
    Object.defineProperty(screen, 'availHeight', { get: function() { return 1040; }, configurable: true });

    window.setMockDimensions = function(width, height) {
        mockWidth = width;
        mockHeight = height;
        console.log('[Bypass] Mock dimensions set to: ' + width + 'x' + height);
    };

    // Full Screen Detection Bypass
    Object.defineProperty(document, 'fullscreenElement', { get: function() { return document.createElement('div'); }, configurable: false });
    Object.defineProperty(document, 'fullscreenEnabled', { get: function() { return false; }, configurable: false });
    Object.defineProperty(document, 'onfullscreenchange', { get: function() { return function() {}; }, set: function() { }, configurable: false });
    Object.defineProperty(document, 'onfullscreenerror', { get: function() { return function() {}; }, set: function() { }, configurable: false });

    // Override fullscreen methods
    Element.prototype.requestFullscreen = function() {
        console.log('[Bypass] Blocked requestFullscreen call');
        return Promise.reject(new Error('Fullscreen request blocked'));
    };

    document.exitFullscreen = function() {
        console.log('[Bypass] Blocked exitFullscreen call');
        return Promise.resolve();
    };

    // Webkit (Safari/Chrome)
    if (Element.prototype.webkitRequestFullscreen) {
        Element.prototype.webkitRequestFullscreen = function() {
            console.log('[Bypass] Blocked webkitRequestFullscreen call');
            return Promise.reject(new Error('Fullscreen request blocked'));
        };
    }
    if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen = function() {
            console.log('[Bypass] Blocked webkitExitFullscreen call');
            return Promise.resolve();
        };
    }

    // Moz (Firefox)
    if (Element.prototype.mozRequestFullScreen) {
        Element.prototype.mozRequestFullScreen = function() {
            console.log('[Bypass] Blocked mozRequestFullScreen call');
            return Promise.reject(new Error('Fullscreen request blocked'));
        };
    }
    if (document.mozExitFullScreen) {
        document.mozExitFullScreen = function() {
            console.log('[Bypass] Blocked mozExitFullScreen call');
            return Promise.resolve();
        };
    }

    // Ms (IE/Edge)
    if (Element.prototype.msRequestFullscreen) {
        Element.prototype.msRequestFullscreen = function() {
            console.log('[Bypass] Blocked msRequestFullscreen call');
            return Promise.reject(new Error('Fullscreen request blocked'));
        };
    }
    if (document.msExitFullscreen) {
        document.msExitFullscreen = function() {
            console.log('[Bypass] Blocked msExitFullscreen call');
            return Promise.resolve();
        };
    }

    // Right Click (Context Menu) Detection Bypass
    Object.defineProperty(document, 'oncontextmenu', { get: function() { return function() {}; }, set: function() { }, configurable: false });
    Object.defineProperty(window, 'oncontextmenu', { get: function() { return function() {}; }, set: function() { }, configurable: false });

    // Unified addEventListener Override
    window.addEventListener = function(type, listener, options) {
        if (blockedEvents.indexOf(type) !== -1) {
            console.log('[Bypass] Blocked ' + type + ' event listener');
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    document.addEventListener = function(type, listener, options) {
        if (blockedEvents.indexOf(type) !== -1) {
            console.log('[Bypass] Blocked document ' + type + ' event listener');
            return;
        }
        return originalDocumentAddEventListener.call(this, type, listener, options);
    };

    if (EventTarget && EventTarget.prototype && originalEventTargetAddEventListener) {
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (blockedEvents.indexOf(type) !== -1) {
                console.log('[Bypass] Blocked EventTarget.' + type + ' event listener');
                return;
            }
            return originalEventTargetAddEventListener.call(this, type, listener, options);
        };
    }

    // Prevent Default Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        console.log('[Bypass] Prevented context menu');
        return false;
    }, true);

    console.log('[Bypass] Detection bypass loaded successfully!');

    // =====================================================
    // PART 2: MAIN GUI SCRIPT
    // =====================================================

    // Remove existing instance
    const existingFrame = document.getElementById('quizizz-hack-frame');
    if (existingFrame) existingFrame.remove();
    
    const existingBtn = document.getElementById('quizizz-hack-toggle');
    if (existingBtn) existingBtn.remove();

    let cachedData = null;
    let isMinimized = false;
    let currentGameType = 'quizizz';
    
    // Create floating frame - mobile optimized
    function createFrame() {
        const container = document.createElement('div');
        container.id = 'quizizz-hack-frame';
        
        const isMobile = window.innerWidth <= 768;
        
        Object.assign(container.style, {
            position: 'fixed',
            top: isMobile ? '10px' : '50px',
            right: isMobile ? '10px' : '50px',
            left: isMobile ? '10px' : 'auto',
            width: isMobile ? 'calc(100% - 20px)' : '360px',
            maxHeight: isMobile ? '70vh' : '500px',
            height: isMobile ? 'auto' : '500px',
            backgroundColor: '#fff',
            borderRadius: isMobile ? '8px' : '12px',
            border: 'none',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Inter, system-ui, sans-serif'
        });
        
        // Header
        const header = document.createElement('div');
        Object.assign(header.style, {
            height: isMobile ? '40px' : '44px',
            backgroundColor: '#4b4bfF',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '0 8px' : '0 10px',
            cursor: 'move',
            userSelect: 'none',
            flexShrink: '0'
        });
        
        const title = document.createElement('span');
        title.textContent = 'DitHack! VIP';
        title.style.fontSize = isMobile ? '14px' : '16px';
        header.appendChild(title);
        
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '8px';
        
        const minimizeBtn = document.createElement('span');
        minimizeBtn.textContent = '—';
        minimizeBtn.style.cssText = `cursor: pointer; font-weight: bold; font-size: ${isMobile ? '18px' : '14px'}; padding: 4px 8px;`;
        
        const hideBtn = document.createElement('span');
        hideBtn.textContent = '✕';
        hideBtn.style.cssText = `cursor: pointer; padding: 6px 10px; background: rgba(255,255,255,0.2); border-radius: 6px; font-size: ${isMobile ? '14px' : '12px'};`;
        
        controls.appendChild(minimizeBtn);
        controls.appendChild(hideBtn);
        header.appendChild(controls);
        
        // Content area
        const content = document.createElement('div');
        content.id = 'quizizz-content';
        Object.assign(content.style, {
            flex: '1',
            overflowY: 'auto',
            padding: isMobile ? '8px' : '12px',
            backgroundColor: '#f9fafb',
            minHeight: '200px'
        });
        
        // Search wrapper
        const searchWrap = document.createElement('div');
        Object.assign(searchWrap.style, {
            position: 'sticky',
            top: '0',
            display: 'flex',
            alignItems: 'stretch',
            width: '100%',
            backgroundColor: '#f9fafb',
            marginBottom: isMobile ? '8px' : '12px',
            gap: '0px',
            height: '40px'
        });
        
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Cari soal...';
        searchBar.style.cssText = `
            flex: 1 !important; padding: 8px 12px !important; border-radius: 8px 0 0 8px !important;
            border: 1px solid #ccc !important; border-right: none !important; font-size: 14px !important;
            height: 40px !important; line-height: 24px !important; box-sizing: border-box !important;
            outline: none !important; margin: 0 !important;
        `;
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '✕';
        clearBtn.style.cssText = `
            padding: 0 12px !important; background: #e5e7eb !important; border: 1px solid #ccc !important;
            border-left: none !important; border-radius: 0 8px 8px 0 !important; cursor: pointer !important;
            width: 40px !important; height: 40px !important; font-size: 14px !important; line-height: 40px !important;
            box-sizing: border-box !important; margin: 0 !important; display: flex !important;
            align-items: center !important; justify-content: center !important;
        `;
        
        searchWrap.appendChild(searchBar);
        searchWrap.appendChild(clearBtn);
        
        // Results container
        const resultsWrap = document.createElement('div');
        resultsWrap.id = 'quizizz-results';
        resultsWrap.style.cssText = `display: flex; flex-direction: column; gap: ${isMobile ? '6px' : '8px'};`;
        
        content.appendChild(searchWrap);
        content.appendChild(resultsWrap);
        
        container.appendChild(header);
        container.appendChild(content);
        
        // Resize handle
        const resizeHandle = document.createElement('div');
        Object.assign(resizeHandle.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: isMobile ? '20px' : '15px',
            height: isMobile ? '20px' : '15px',
            cursor: 'se-resize',
            background: 'linear-gradient(135deg, transparent 50%, #4b4bfF 50%)',
            borderBottomRightRadius: isMobile ? '8px' : '12px'
        });
        
        container.appendChild(resizeHandle);
        document.body.appendChild(container);
        
        return { container, header, content, searchBar, clearBtn, resultsWrap, minimizeBtn, hideBtn, resizeHandle };
    }
    
    // Create toggle button - mobile optimized
    function createToggleButton() {
        const isMobile = window.innerWidth <= 768;
        
        const btn = document.createElement('button');
        btn.id = 'quizizz-hack-toggle';
        btn.textContent = '👑';
        
        btn.style.cssText = `
            position: fixed !important; bottom: 20px !important; left: 20px !important;
            padding: 12px 16px !important; background: #800080 !important;
            color: white !important; border: none !important; border-radius: 50px !important;
            cursor: pointer !important; z-index: 999998 !important; font-weight: bold !important;
            box-shadow: 0 4px 15px rgba(128, 0, 128, 0.4) !important;
            font-family: Inter, system-ui, sans-serif !important; opacity: 0 !important;
            transition: opacity 0.3s ease, transform 0.2s ease !important; font-size: 18px !important;
            width: 50px !important; max-width: 50px !important; min-width: 50px !important;
            height: 50px !important; max-height: 50px !important; min-height: 50px !important;
            align-items: center !important; justify-content: center !important;
            box-sizing: border-box !important;
        `;
        
        btn.addEventListener('touchstart', function() { btn.style.transform = 'scale(0.95)'; });
        btn.addEventListener('touchend', function() { btn.style.transform = 'scale(1)'; });
        
        btn.onclick = function() {
            const frame = document.getElementById('quizizz-hack-frame');
            if (frame) {
                frame.style.display = 'flex';
                btn.style.opacity = '0';
            }
        };
        
        document.body.appendChild(btn);
        return btn;
    }
    
    // Fetch answers from Quizizz/Wayground API
    async function fetchAnswers(pin, resultsEl) {
        try {
            if (resultsEl) {
                resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Menghubungi server...</div>';
            }
            
            const response = await fetch(`https://api.quizit.online/quizizz?pin=${encodeURIComponent(pin)}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) {
                if (resultsEl) resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                return null;
            }
            
            const data = await response.json();
            
            if (!data || (data.data && !data.data.answers) || (data.data && data.data.answers && data.data.answers.length === 0) || (!data.data && !data.answers)) {
                if (resultsEl) resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching answers:', error);
            if (resultsEl) resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
            return null;
        }
    }
    
    // Fetch Kahoot answers
    async function fetchKahootAnswers(link, resultsEl) {
        try {
            if (resultsEl) {
                resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Menghubungi server...</div>';
            }
            
            const response = await fetch(`https://api.quizit.online/kahoot?link=${encodeURIComponent(link)}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                mode: 'cors'
            });
            
            if (!response.ok) {
                if (resultsEl) resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                return null;
            }
            
            const data = await response.json();
            
            if (!data || (data.answers && data.answers.length === 0)) {
                if (resultsEl) resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching Kahoot answers:', error);
            if (resultsEl) resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
            return null;
        }
    }
    
    // Get answers array from cached data (supports multiple formats)
    function getAnswersArray() {
        if (cachedData && cachedData.data && cachedData.data.answers) return cachedData.data.answers;
        if (cachedData && cachedData.data) return cachedData.data;
        if (cachedData && cachedData.answers) return cachedData.answers;
        if (cachedData && Array.isArray(cachedData)) return cachedData;
        return null;
    }
    
    // Render answer cards for Quizizz/Wayground
    function renderCards(answers, searchTerm = '') {
        const resultsWrap = document.getElementById('quizizz-results');
        if (!resultsWrap) return;
        
        resultsWrap.innerHTML = '';
        
        if (!answers || answers.length === 0) {
            resultsWrap.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Belum ada data jawaban</div>';
            return;
        }
        
        let filteredAnswers = answers;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredAnswers = answers.filter(ans => {
                const questionText = (ans.question && (ans.question.text || ans.question.structure && ans.question.structure.text)) ? (ans.question.text || ans.question.structure.text).replace(/<[^>]*>/g, '') : '';
                const answerText = (ans.answers && ans.answers[0] && ans.answers[0].text) ? ans.answers[0].text.replace(/<[^>]*>/g, '') : '';
                return questionText.toLowerCase().includes(term) || answerText.toLowerCase().includes(term);
            });
        }
        
        if (filteredAnswers.length === 0) {
            resultsWrap.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Tidak ada hasil pencarian</div>';
            return;
        }
        
        filteredAnswers.forEach((ans, index) => {
            const card = document.createElement('div');
            card.style.cssText = `background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #4b4bfF; margin-bottom: 8px;`;
            
            let questionHTML = '';
            if (ans.question && (ans.question.text || ans.question.structure)) {
                questionHTML = ans.question.text || ans.question.structure.text;
            } else {
                questionHTML = 'Soal ' + (index + 1);
            }
            
            let questionImage = '';
            if (ans.question && ans.question.image && typeof ans.question.image === 'string') {
                questionImage = `<img src="${ans.question.image}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
            } else if (ans.question && ans.question.media && ans.question.media.length > 0) {
                const mediaItem = ans.question.media.find(m => m && m.url);
                if (mediaItem && mediaItem.url) questionImage = `<img src="${mediaItem.url}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
            } else if (ans.question && ans.question.structure && ans.question.structure.media) {
                const mediaItem = ans.question.structure.media;
                if (mediaItem.url) questionImage = `<img src="${mediaItem.url}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
            }
            
            let answerHTML = '';
            if (ans.answers && ans.answers.length > 0 && ans.answers[0].text) {
                answerHTML = ans.answers[0].text;
            }
            
            let answerImage = '';
            if (ans.answers && ans.answers.length > 0) {
                const ansObj = ans.answers[0];
                if (ansObj.image && typeof ansObj.image === 'string') {
                    answerImage = `<img src="${ansObj.image}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
                } else if (ansObj.media && ansObj.media.length > 0) {
                    const mediaItem = ansObj.media.find(m => m && m.url);
                    if (mediaItem && mediaItem.url) answerImage = `<img src="${mediaItem.url}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
                }
            }
            
            card.innerHTML = `
                <div style="font-size:14px; font-weight:600; color:#111; margin-bottom:8px; word-wrap:break-word; overflow-wrap:break-word;">
                    <span style="background:#e5e7eb; padding:2px 6px; border-radius:4px; margin-right:5px; font-size:12px;">${index + 1}</span>
                    <span class="math-question">${questionHTML}</span>
                    ${questionImage}
                </div>
                <div style="font-size:13px; color:#10b981; font-weight:bold; margin-top:8px; word-wrap:break-word; overflow-wrap:break-word;">
                    <span class="math-answer">${answerHTML}</span>
                    ${answerImage}
                </div>
            `;
            
            resultsWrap.appendChild(card);
        });
        
        setTimeout(() => {
            document.querySelectorAll('.math-question, .math-answer').forEach(el => {
                el.style.fontFamily = 'Inter, system-ui, sans-serif';
            });
        }, 100);
    }
    
    // Render Kahoot answer cards
    function renderKahootCards(answers, searchTerm = '') {
        const resultsWrap = document.getElementById('quizizz-results');
        if (!resultsWrap) return;
        
        resultsWrap.innerHTML = '';
        
        if (!answers || answers.length === 0) {
            resultsWrap.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Belum ada data jawaban</div>';
            return;
        }
        
        let filteredAnswers = answers;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredAnswers = answers.filter(ans => {
                const questionText = (ans.question && ans.question.text) ? ans.question.text.toLowerCase() : '';
                const answerText = (ans.answers && ans.answers[0] && ans.answers[0].text) ? ans.answers[0].text.toLowerCase() : '';
                return questionText.includes(term) || answerText.includes(term);
            });
        }
        
        if (filteredAnswers.length === 0) {
            resultsWrap.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Tidak ada hasil pencarian</div>';
            return;
        }
        
        filteredAnswers.forEach((ans, index) => {
            const card = document.createElement('div');
            card.style.cssText = `background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 4px solid #ff6b35; margin-bottom: 8px;`;
            
            let questionHTML = '';
            if (ans.question && ans.question.text) {
                questionHTML = ans.question.text;
            } else {
                questionHTML = 'Soal ' + (index + 1);
            }
            
            let questionImage = '';
            if (ans.question && ans.question.image && typeof ans.question.image === 'string') {
                questionImage = `<img src="${ans.question.image}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
            }
            
            let answerHTML = '';
            if (ans.answers && ans.answers.length > 0 && ans.answers[0].text) {
                answerHTML = ans.answers[0].text;
            }
            
            card.innerHTML = `
                <div style="font-size:14px; font-weight:600; color:#111; margin-bottom:8px; word-wrap:break-word; overflow-wrap:break-word;">
                    <span style="background:#ff6b35; color:white; padding:2px 6px; border-radius:4px; margin-right:5px; font-size:12px;">${index + 1}</span>
                    <span class="math-question">${questionHTML}</span>
                    ${questionImage}
                </div>
                <div style="font-size:13px; color:#10b981; font-weight:bold; margin-top:8px; word-wrap:break-word; overflow-wrap:break-word;">
                    <span class="math-answer">${answerHTML}</span>
                </div>
            `;
            
            resultsWrap.appendChild(card);
        });
        
        setTimeout(() => {
            document.querySelectorAll('.math-question, .math-answer').forEach(el => {
                el.style.fontFamily = 'Inter, system-ui, sans-serif';
            });
        }, 100);
    }
    
    // Create game type selector
    function createGameTypeSelector(container) {
        const gameTypeSelector = document.createElement('div');
        gameTypeSelector.style.cssText = 'display:flex; gap:8px; margin-bottom:12px; justify-content:center;';
        
        const quizizzBtn = document.createElement('button');
        quizizzBtn.textContent = '📝 Wayground';
        quizizzBtn.dataset.type = 'quizizz';
        quizizzBtn.style.cssText = 'flex:1; padding:10px; background:#4b4bfF; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:bold;';
        
        const kahootBtn = document.createElement('button');
        kahootBtn.textContent = '🎯 Kahoot';
        kahootBtn.dataset.type = 'kahoot';
        kahootBtn.style.cssText = 'flex:1; padding:10px; background:#ccc; color:#333; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:bold;';
        
        gameTypeSelector.appendChild(quizizzBtn);
        gameTypeSelector.appendChild(kahootBtn);
        
        function updateGameTypeButtons(type) {
            currentGameType = type;
            if (type === 'quizizz') {
                quizizzBtn.style.background = '#4b4bfF';
                quizizzBtn.style.color = 'white';
                kahootBtn.style.background = '#ccc';
                kahootBtn.style.color = '#333';
                pinInput.placeholder = 'Kode Game Wayground';
            } else {
                kahootBtn.style.background = '#ff6b35';
                kahootBtn.style.color = 'white';
                quizizzBtn.style.background = '#ccc';
                quizizzBtn.style.color = '#333';
                pinInput.placeholder = 'QuizID Kahoot';
            }
        }
        
        quizizzBtn.onclick = () => updateGameTypeButtons('quizizz');
        kahootBtn.onclick = () => updateGameTypeButtons('kahoot');
        
        const pinInput = document.createElement('input');
        pinInput.type = 'text';
        pinInput.id = 'quizizz-pin-input';
        pinInput.placeholder = 'Kode Game Wayground';
        pinInput.style.cssText = 'width:80%; padding:10px; border:1px solid #ccc; border-radius:8px; margin-bottom:10px; font-size:14px;';
        
        const fetchBtn = document.createElement('button');
        fetchBtn.id = 'quizizz-fetch-btn';
        fetchBtn.textContent = 'Ambil Jawaban';
        fetchBtn.style.cssText = 'width:80%; padding:10px; background:#4b4bfF; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px;';
        
        fetchBtn.onclick = async () => {
            const inputValue = pinInput.value.trim();
            if (!inputValue) return;
            
            const resultsEl = document.getElementById('quizizz-results');
            resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Memuat data...</div>';
            
            if (currentGameType === 'quizizz') {
                cachedData = await fetchAnswers(inputValue, resultsEl);
                if (cachedData && cachedData.data) {
                    renderCards(cachedData.data.answers || cachedData.data);
                } else if (cachedData && cachedData.answers) {
                    renderCards(cachedData.answers);
                } else if (cachedData) {
                    renderCards(cachedData);
                } else {
                    resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                }
            } else {
                cachedData = await fetchKahootAnswers(inputValue, resultsEl);
                if (cachedData && cachedData.answers) {
                    renderKahootCards(cachedData.answers);
                } else if (cachedData) {
                    renderKahootCards(cachedData);
                } else {
                    resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                }
            }
        };
        
        return { gameTypeSelector, pinInput, fetchBtn };
    }
    
    // Main initialization - called after license validation
    async function initMainApp() {
        const { container, header, content, searchBar, clearBtn, resultsWrap, minimizeBtn, hideBtn, resizeHandle } = createFrame();
        createToggleButton();
        
        let pin = '';
        const currentDomain = window.location.hostname;
        const isQuizizz = currentDomain.includes('quizizz');
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlPin = urlParams.get('pin') || urlParams.get('gamePin');
        
        if (urlPin && isQuizizz) {
            pin = urlPin;
        } else if (isQuizizz) {
            const pinElement = document.querySelector('[data-pin], .game-pin, [class*="pin"]');
            if (pinElement) {
                pin = pinElement.textContent || pinElement.getAttribute('data-pin') || '';
            }
        }
        
        // If no PIN found, show input with game type selector
        if (!pin || pin.length < 4) {
            const inputWrap = document.createElement('div');
            inputWrap.style.cssText = 'padding:20px; text-align:center;';
            
            const { gameTypeSelector, pinInput, fetchBtn } = createGameTypeSelector(inputWrap);
            inputWrap.appendChild(gameTypeSelector);
            inputWrap.appendChild(pinInput);
            inputWrap.appendChild(fetchBtn);
            resultsWrap.appendChild(inputWrap);
        } else {
            // Auto fetch if PIN found - Quizizz only
            const resultsEl = document.getElementById('quizizz-results');
            resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Memuat data...</div>';
            cachedData = await fetchAnswers(pin, resultsEl);
            
            if (cachedData && cachedData.data) {
                renderCards(cachedData.data.answers || cachedData.data);
            } else {
                resultsWrap.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data. Coba masukkan PIN manual.</div>';
                
                const inputWrap = document.createElement('div');
                inputWrap.style.cssText = 'padding:20px; text-align:center; margin-top:10px;';
                
                const { gameTypeSelector, pinInput, fetchBtn } = createGameTypeSelector(inputWrap);
                inputWrap.appendChild(gameTypeSelector);
                inputWrap.appendChild(pinInput);
                inputWrap.appendChild(fetchBtn);
                resultsWrap.appendChild(inputWrap);
            }
        }
        
        // Search functionality
        searchBar.addEventListener('input', function() {
            const term = this.value;
            const answersArray = getAnswersArray();
            if (answersArray) {
                if (currentGameType === 'kahoot') {
                    renderKahootCards(answersArray, term);
                } else {
                    renderCards(answersArray, term);
                }
            }
        });
        
        // Clear button
        clearBtn.addEventListener('click', function() {
            searchBar.value = '';
            const answersArray = getAnswersArray();
            if (answersArray) {
                if (currentGameType === 'kahoot') {
                    renderKahootCards(answersArray);
                } else {
                    renderCards(answersArray);
                }
            }
        });
        
        // Minimize functionality
        minimizeBtn.onclick = function() {
            isMinimized = !isMinimized;
            const isMobile = window.innerWidth <= 768;
            if (isMinimized) {
                content.style.display = 'none';
                container.style.height = isMobile ? '36px' : '40px';
                minimizeBtn.textContent = '□';
            } else {
                content.style.display = 'block';
                container.style.height = isMobile ? 'auto' : '500px';
                container.style.maxHeight = isMobile ? '70vh' : '500px';
                minimizeBtn.textContent = '—';
            }
        };
        
        // Hide functionality
        hideBtn.onclick = function() {
            container.style.display = 'none';
            const toggleBtn = document.getElementById('quizizz-hack-toggle');
            if (toggleBtn) toggleBtn.style.opacity = '0.1';
        };
        
        // Drag functionality
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === minimizeBtn || e.target === hideBtn) return;
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
            container.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = 'auto';
        });
        
        // Touch support for mobile
        header.addEventListener('touchstart', function(e) {
            if (e.target === minimizeBtn || e.target === hideBtn) return;
            const touch = e.touches[0];
            isDragging = true;
            offsetX = touch.clientX - container.offsetLeft;
            offsetY = touch.clientY - container.offsetTop;
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            container.style.left = (touch.clientX - offsetX) + 'px';
            container.style.top = (touch.clientY - offsetY) + 'px';
            container.style.right = 'auto';
        }, { passive: false });
        
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
        
        // Resize functionality
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        const minWidth = 200;
        const minHeight = 200;
        
        resizeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            const newWidth = Math.max(minWidth, startWidth + (e.clientX - startX));
            const newHeight = Math.max(minHeight, startHeight + (e.clientY - startY));
            container.style.width = newWidth + 'px';
            container.style.height = newHeight + 'px';
            container.style.maxHeight = 'none';
        });
        
        document.addEventListener('mouseup', function() {
            isResizing = false;
            document.body.style.userSelect = 'auto';
        });
        
        // Resize functionality - touch (mobile)
        resizeHandle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            isResizing = true;
            startX = touch.clientX;
            startY = touch.clientY;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (!isResizing) return;
            e.preventDefault();
            const touch = e.touches[0];
            const newWidth = Math.max(minWidth, startWidth + (touch.clientX - startX));
            const newHeight = Math.max(minHeight, startHeight + (touch.clientY - startY));
            container.style.width = newWidth + 'px';
            container.style.height = newHeight + 'px';
            container.style.maxHeight = 'none';
        }, { passive: false });
        
        document.addEventListener('touchend', function() {
            isResizing = false;
        });
    }
    
    // Run initialization - start with license check
    checkLicense();

    console.log('✅ DitHack loaded!');
})();

