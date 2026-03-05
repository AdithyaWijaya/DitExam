(function() {
    'use strict';
    
    // Remove existing instance if any
    const existingFrame = document.getElementById('quizizz-hack-frame');
    if (existingFrame) {
        existingFrame.remove();
    }
    
    // Remove existing toggle button if any
    const existingBtn = document.getElementById('quizizz-hack-toggle');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    let cachedData = null;
    let isMinimized = false;
    
// Create floating frame - mobile optimized
    function createFrame() {
        const container = document.createElement('div');
        container.id = 'quizizz-hack-frame';
        
        // Mobile detection
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
            border: '2px solid #4b4bfF',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Inter, system-ui, sans-serif'
        });
        
        // Header - mobile optimized
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
        title.textContent = 'DitHack!';
        title.style.fontSize = isMobile ? '14px' : '16px';
        header.appendChild(title);
        
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '8px';
        
        // Minimize button - larger for touch
        const minimizeBtn = document.createElement('span');
        minimizeBtn.textContent = '—';
        minimizeBtn.style.cssText = `
            cursor: pointer; 
            font-weight: bold; 
            font-size: ${isMobile ? '18px' : '14px'};
            padding: 4px 8px;
        `;
        
        // Hide button - larger for touch  
        const hideBtn = document.createElement('span');
        hideBtn.textContent = '✕';
        hideBtn.style.cssText = `
            cursor: pointer; 
            padding: 6px 10px; 
            background: rgba(255,255,255,0.2);
            border-radius: 6px; 
            font-size: ${isMobile ? '14px' : '12px'};
        `;
        
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
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#f9fafb',
            marginBottom: isMobile ? '8px' : '12px',
            gap: '4px'
        });
        
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Cari soal...';
        searchBar.style.cssText = `
            flex: 1; 
            padding: 10px 12px; 
            border-radius: 8px 0 0 8px; 
            border: 1px solid #ccc; 
            border-right: none; 
            font-size: ${isMobile ? '16px' : '14px'};
            min-height: 40px;
        `;
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '✕';
        clearBtn.style.cssText = `
            padding: 10px 14px; 
            background: #e5e7eb; 
            border: 1px solid #ccc; 
            border-left: none; 
            border-radius: 0 8px 8px 0; 
            cursor: pointer;
            min-width: 40px;
            min-height: 40px;
        `;
        
        searchWrap.appendChild(searchBar);
        searchWrap.appendChild(clearBtn);
        
        // Results container
        const resultsWrap = document.createElement('div');
        resultsWrap.id = 'quizizz-results';
        resultsWrap.style.cssText = `
            display: flex; 
            flex-direction: column; 
            gap: ${isMobile ? '6px' : '8px'};
        `;
        
        content.appendChild(searchWrap);
        content.appendChild(resultsWrap);
        
        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);
        
        return { container, header, content, searchBar, clearBtn, resultsWrap, minimizeBtn, hideBtn };
    }
    
    // Create toggle button - mobile optimized
    function createToggleButton() {
        const isMobile = window.innerWidth <= 768;
        
        const btn = document.createElement('button');
        btn.id = 'quizizz-hack-toggle';
        btn.textContent = '📝';
        
        // Mobile-friendly button
        btn.style.cssText = `
            position: fixed;
            bottom: ${isMobile ? '80px' : '20px'};
            left: ${isMobile ? '20px' : '20px'};
            padding: ${isMobile ? '16px 24px' : '12px 20px'};
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            z-index: 999998;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            font-family: Inter, system-ui, sans-serif;
            opacity: 0.9;
            transition: opacity 0.3s ease, transform 0.2s ease;
            font-size: ${isMobile ? '24px' : '16px'};
            min-width: ${isMobile ? '56px' : 'auto'};
            min-height: ${isMobile ? '56px' : 'auto'};
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Touch feedback
        btn.addEventListener('touchstart', function() {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', function() {
            btn.style.transform = 'scale(1)';
        });
        
        btn.onmouseenter = function() {
            btn.style.opacity = '1';
        };
        
        btn.onmouseleave = function() {
            btn.style.opacity = '0.9';
        };
        
        btn.onclick = function() {
            const frame = document.getElementById('quizizz-hack-frame');
            if (frame) {
                frame.style.display = 'flex';
                btn.style.display = 'none';
            }
        };
        
        document.body.appendChild(btn);
        return btn;
    }
    
    // Fetch answers from API
    async function fetchAnswers(pin, resultsEl) {
        try {
            if (resultsEl) {
                resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Menghubungi server...</div>';
            }
            
            const response = await fetch(`https://api.quizit.online/quizizz?pin=${encodeURIComponent(pin)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('Error fetching answers:', error);
            // Try alternative API format
            return await fetchAnswersAlt(pin, resultsEl);
        }
    }
    
    // Alternative API fetch
    async function fetchAnswersAlt(pin, resultsEl) {
        try {
            if (resultsEl) {
                resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Mencoba ulang...</div>';
            }
            // Try without CORS mode
            const response = await fetch(`https://api.quizit.online/quizizz?pin=${encodeURIComponent(pin)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Alt fetch error:', error);
            if (resultsEl) {
                resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data.<br>Cek console untuk detail error</div>';
            }
            return null;
        }
    }
    
// Render answer cards
    function renderCards(answers, searchTerm = '') {
        const resultsWrap = document.getElementById('quizizz-results');
        if (!resultsWrap) return;
        
        resultsWrap.innerHTML = '';
        
        if (!answers || answers.length === 0) {
            resultsWrap.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Belum ada data jawaban</div>';
            return;
        }
        
        // Filter by search term
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
            card.style.cssText = `
                background: white;
                border-radius: 8px;
                padding: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border-left: 4px solid #4b4bfF;
                margin-bottom: 8px;
            `;
            
            // Get question text - keep HTML for math formulas
            let questionHTML = '';
            if (ans.question && (ans.question.text || ans.question.structure)) {
                questionHTML = ans.question.text || ans.question.structure.text;
            } else {
                questionHTML = 'Soal ' + (index + 1);
            }
            
            // Check for images in question - handle different API formats
            let questionImage = '';
            
            // Format 1: ans.question.image (string URL)
            if (ans.question && ans.question.image && typeof ans.question.image === 'string') {
                questionImage = `<img src="${ans.question.image}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
            }
            // Format 2: ans.question.media (array)
            else if (ans.question && ans.question.media && ans.question.media.length > 0) {
                const mediaItem = ans.question.media.find(m => m && m.url);
                if (mediaItem && mediaItem.url) {
                    questionImage = `<img src="${mediaItem.url}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
                }
            }
            // Format 3: ans.question.structure.media
            else if (ans.question && ans.question.structure && ans.question.structure.media) {
                const mediaItem = ans.question.structure.media;
                if (mediaItem.url) {
                    questionImage = `<img src="${mediaItem.url}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
                }
            }
            
            // Get correct answer text - keep HTML for math
            let answerHTML = '';
            if (ans.answers && ans.answers.length > 0 && ans.answers[0].text) {
                answerHTML = ans.answers[0].text;
            }
            
            // Check for answer media (image)
            let answerImage = '';
            if (ans.answers && ans.answers.length > 0) {
                const ansObj = ans.answers[0];
                // Format 1: ans.answers[0].image
                if (ansObj.image && typeof ansObj.image === 'string') {
                    answerImage = `<img src="${ansObj.image}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
                }
                // Format 2: ans.answers[0].media
                else if (ansObj.media && ansObj.media.length > 0) {
                    const mediaItem = ansObj.media.find(m => m && m.url);
                    if (mediaItem && mediaItem.url) {
                        answerImage = `<img src="${mediaItem.url}" style="max-width:100%; border-radius:8px; margin-top:8px;" onerror="this.style.display='none'">`;
                    }
                }
            }
            
            // Build card HTML with proper math styling
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
        
        // Apply math rendering styles after adding to DOM
        setTimeout(() => {
            document.querySelectorAll('.math-question, .math-answer').forEach(el => {
                // Use browser's native rendering for math
                el.style.fontFamily = '"Times New Roman", Times, serif';
                el.style.fontSize = '15px';
            });
        }, 100);
    }
    
    // Main initialization
    async function init() {
        const { container, header, content, searchBar, clearBtn, resultsWrap, minimizeBtn, hideBtn } = createFrame();
        createToggleButton();
        
        // Get PIN from URL or prompt user
        let pin = '';
        
        // Try to get PIN from URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlPin = urlParams.get('pin') || urlParams.get('gamePin');
        
        if (urlPin) {
            pin = urlPin;
        } else {
            // Check Quizizz page for game PIN
            const pinElement = document.querySelector('[data-pin], .game-pin, [class*="pin"]');
            if (pinElement) {
                pin = pinElement.textContent || pinElement.getAttribute('data-pin') || '';
            }
        }
        
        // If no PIN found, show input
        if (!pin || pin.length < 4) {
            const inputWrap = document.createElement('div');
            inputWrap.style.cssText = 'padding:20px; text-align:center;';
            inputWrap.innerHTML = `
                <input type="text" id="quizizz-pin-input" 
                    placeholder="Masukkan Kode Quizizz" 
                    style="width:80%; padding:10px; border:1px solid #ccc; border-radius:8px; margin-bottom:10px; font-size:14px;">
                <button id="quizizz-fetch-btn"
                    style="width:80%; padding:10px; background:#4b4bfF; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px;">
                    Ambil Jawaban
                </button>
            `;
            resultsWrap.appendChild(inputWrap);
            
            document.getElementById('quizizz-fetch-btn').onclick = async () => {
                const inputPin = document.getElementById('quizizz-pin-input').value.trim();
                if (inputPin) {
                    const resultsEl = document.getElementById('quizizz-results');
                    resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Memuat data...</div>';
                    cachedData = await fetchAnswers(inputPin, resultsEl);
                    if (cachedData && cachedData.data) {
                        renderCards(cachedData.data.answers || cachedData.data);
                    } else if (cachedData && cachedData.answers) {
                        // Alternative format
                        renderCards(cachedData.answers);
                    } else if (cachedData) {
                        // Direct array format
                        renderCards(cachedData);
                    } else {
                        resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data<br>Cek console (F12)</div>';
                    }
                }
            };
        } else {
            // Auto fetch if PIN found
            const resultsEl = document.getElementById('quizizz-results');
            resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Memuat data...</div>';
            cachedData = await fetchAnswers(pin, resultsEl);
            if (cachedData && cachedData.data) {
                renderCards(cachedData.data.answers || cachedData.data);
            } else {
                resultsWrap.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data. Coba masukkan PIN manual.</div>';
                
                // Add manual input
                const inputWrap = document.createElement('div');
                inputWrap.style.cssText = 'padding:20px; text-align:center; margin-top:10px;';
                inputWrap.innerHTML = `
                    <input type="text" id="quizizz-pin-input" 
                        placeholder="Masukkan Kode Quizizz" 
                        style="width:80%; padding:10px; border:1px solid #ccc; border-radius:8px; margin-bottom:10px; font-size:14px;">
                    <button id="quizizz-fetch-btn"
                        style="width:80%; padding:10px; background:#4b4bfF; color:white; border:none; border-radius:8px; cursor:pointer; font-size:14px;">
                        Ambil Jawaban
                    </button>
                `;
                resultsWrap.appendChild(inputWrap);
                
                document.getElementById('quizizz-fetch-btn').onclick = async () => {
                    const inputPin = document.getElementById('quizizz-pin-input').value.trim();
                    if (inputPin) {
                        const resultsEl = document.getElementById('quizizz-results');
                        resultsEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">⏳ Memuat data...</div>';
                        cachedData = await fetchAnswers(inputPin, resultsEl);
                        if (cachedData && cachedData.data) {
                            renderCards(cachedData.data.answers || cachedData.data);
                        } else if (cachedData && cachedData.answers) {
                            renderCards(cachedData.answers);
                        } else if (cachedData) {
                            renderCards(cachedData);
                        } else {
                            resultsEl.innerHTML = '<div style="text-align:center; color:#ef4444; padding:20px;">❌ Gagal mengambil data</div>';
                        }
                    }
                };
            }
        }
        
        // Search functionality - support multiple data formats
        searchBar.addEventListener('input', function() {
            const term = this.value;
            let answersArray = null;
            
            if (cachedData && cachedData.data && cachedData.data.answers) {
                answersArray = cachedData.data.answers;
            } else if (cachedData && cachedData.data) {
                answersArray = cachedData.data;
            } else if (cachedData && cachedData.answers) {
                answersArray = cachedData.answers;
            } else if (cachedData && Array.isArray(cachedData)) {
                answersArray = cachedData;
            }
            
            if (answersArray) {
                renderCards(answersArray, term);
            }
        });
        
        // Clear button - support multiple data formats
        clearBtn.addEventListener('click', function() {
            searchBar.value = '';
            let answersArray = null;
            
            if (cachedData && cachedData.data && cachedData.data.answers) {
                answersArray = cachedData.data.answers;
            } else if (cachedData && cachedData.data) {
                answersArray = cachedData.data;
            } else if (cachedData && cachedData.answers) {
                answersArray = cachedData.answers;
            } else if (cachedData && Array.isArray(cachedData)) {
                answersArray = cachedData;
            }
            
            if (answersArray) {
                renderCards(answersArray);
            }
        });
        
        // Minimize functionality - mobile optimized
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
            if (toggleBtn) {
                toggleBtn.style.display = 'block';
            }
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
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            const touch = e.touches[0];
            container.style.left = (touch.clientX - offsetX) + 'px';
            container.style.top = (touch.clientY - offsetY) + 'px';
            container.style.right = 'auto';
        }, { passive: true });
        
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    }
    
    // Run initialization
    init();
    
    console.log('✅ DitHack loaded!');
})();