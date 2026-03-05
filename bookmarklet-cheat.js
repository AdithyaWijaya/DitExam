// ========================================
// BOOKMARKLET CHEATNETWORK.EU - QUIZIZZ v2
// ========================================
// Cara install:
// 1. Copy kode di bawah ini
// 2. Buat bookmark baru di browser
// 3. Paste kode sebagai URL bookmark
// 4. Klik bookmark saat di halaman Quizizz

javascript:(function(){
  // --- KONFIGURASI ---
  const API_BASE = 'https://api.cheatnetwork.eu';
  const GAME_TYPE = 'quizizzzzz'; // sesuai endpoint Anda
  
  // --- AMBIL PIN DARI URL ---
  function getPinFromUrl() {
    const url = window.location.href;
    console.log('URL:', url);
    
    // various Quizizz URL formats
    const patterns = [
      /quizizz\.com\/(\d{6,})/,           // quizizz.com/123456
      /quizizz\.com\/quiz\/([a-zA-Z0-9]+)/, // quizizz.com/quiz/abc123
      /quizizz\.com\/join\?.*?quiz=([a-zA-Z0-9]+)/, // quizizz.com/join?quiz=abc
      /quizizz\.com\/(\d{8,})/,            // quizizz.com/12345678
      /game\/(\d+)/,                       // game/123456
      /(\d{6})/                            // 6 digit PIN
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        console.log('PIN found:', match[1]);
        return match[1];
      }
    }
    
    return null;
  }
  
  // --- FETCH ANSWERS ---
  async function fetchAnswers(pin) {
    const url = `${API_BASE}/${GAME_TYPE}/${pin}/answers`;
    console.log('Fetching:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Response:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // --- BUAT GUI DENGAN INPUT MANUAL ---
  function createGUI(answers, initialPin) {
    const oldGui = document.getElementById('cheatnetwork-gui');
    if (oldGui) oldGui.remove();
    
    const container = document.createElement('div');
    container.id = 'cheatnetwork-gui';
    Object.assign(container.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      maxHeight: '80vh',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: '999999',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    });
    
    // Header
    const header = document.createElement('div');
    Object.assign(header.style, {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'move'
    });
    header.innerHTML = '<span style="font-weight:bold">CheatNetwork Answers</span>';
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '✕';
    Object.assign(closeBtn.style, { cursor: 'pointer', fontSize: '18px' });
    closeBtn.onclick = () => container.remove();
    header.appendChild(closeBtn);
    container.appendChild(header);
    
    // Body
    const body = document.createElement('div');
    Object.assign(body.style, { padding: '15px' });
    
    // Input PIN section
    const inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '15px';
    
    const pinInput = document.createElement('input');
    pinInput.type = 'text';
    pinInput.placeholder = 'Masukkan PIN Quizizz';
    pinInput.value = initialPin || '';
    Object.assign(pinInput.style, {
      width: '70%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '14px'
    });
    
    const fetchBtn = document.createElement('button');
    fetchBtn.innerHTML = 'Cari';
    Object.assign(fetchBtn.style, {
      width: '25%',
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      background: '#667eea',
      color: 'white',
      cursor: 'pointer',
      marginLeft: '5%'
    });
    
    inputContainer.appendChild(pinInput);
    inputContainer.appendChild(fetchBtn);
    body.appendChild(inputContainer);
    
    // Results container
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'cn-results';
    body.appendChild(resultsDiv);
    
    container.appendChild(body);
    document.body.appendChild(container);
    
    // Show answers if we have them
    if (answers) {
      displayAnswers(resultsDiv, answers);
    }
    
    // Fetch button click
    fetchBtn.onclick = async () => {
      const pin = pinInput.value.trim();
      if (!pin) {
        alert('Masukkan PIN terlebih dahulu!');
        return;
      }
      resultsDiv.innerHTML = '<div style="text-align:center;">Loading...</div>';
      const data = await fetchAnswers(pin);
      displayAnswers(resultsDiv, data);
    };
    
    // Enter key to search
    pinInput.onkeypress = (e) => {
      if (e.key === 'Enter') fetchBtn.click();
    };
    
    // Drag functionality
    let isDragging = false, startX, startY, initialX, initialY;
    header.onmousedown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = container.offsetLeft;
      initialY = container.offsetTop;
    };
    document.onmousemove = (e) => {
      if (isDragging) {
        container.style.left = (initialX + e.clientX - startX) + 'px';
        container.style.top = (initialY + e.clientY - startY) + 'px';
        container.style.right = 'auto';
      }
    };
    document.onmouseup = () => isDragging = false;
  }
  
  // --- TAMPILKAN JAWABAN ---
  function displayAnswers(container, answers) {
    if (!answers.success) {
      container.innerHTML = `<div style="color:red; text-align:center; padding:20px;">Error: ${answers.message}</div>`;
      return;
    }
    
    const answerData = answers.data?.answers || answers.answers || [];
    
    if (answerData.length === 0) {
      container.innerHTML = '<div style="text-align:center;">Tidak ada jawaban</div>';
      return;
    }
    
    let html = '<div style="max-height:400px; overflow-y:auto;">';
    answerData.forEach((item, index) => {
      const q = item.question || index + 1;
      const a = item.answer || item.correctAnswer || '-';
      html += `
        <div style="background:#e8f5e9; padding:10px; border-radius:8px; 
                    margin-bottom:8px; border-left:4px solid #4caf50;">
          <div style="font-weight:bold; font-size:12px; color:#666;">Soal ${q}</div>
          <div style="font-size:16px; font-weight:bold;">${a}</div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }
  
  // --- MAIN ---
  const pin = getPinFromUrl();
  console.log('Detected PIN:', pin);
  
  // Show GUI (dengan atau tanpa PIN)
  createGUI(null, pin);
  
  // Jika dapat PIN, langsung fetch
  if (pin) {
    fetchAnswers(pin).then(answers => {
      const resultsDiv = document.getElementById('cn-results');
      if (resultsDiv) displayAnswers(resultsDiv, answers);
    });
  }
})();
