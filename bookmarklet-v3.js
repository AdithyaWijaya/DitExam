// ========================================
// BOOKMARKLET CHEATNETWORK.EU - QUIZIZZ v3
// DENGAN SUPPORT LOGIN/TOKEN
// ========================================

javascript:(function(){
  var API_BASE = 'https://api.cheatnetwork.eu';
  var GAME_TYPE = 'quizizzzzz';
  
  function getAuthData() {
    var data = {
      token: localStorage.getItem('authToken') || localStorage.getItem('token'),
      deviceId: localStorage.getItem('device_id'),
      cookie: localStorage.getItem('cookie')
    };
    console.log('Auth data:', data);
    return data;
  }
  
  async function fetchAnswers(pin, authData) {
    var url = API_BASE + '/' + GAME_TYPE + '/' + pin + '/answers';
    console.log('Fetching:', url);
    
    var headers = {
      'Content-Type': 'application/json'
    };
    
    if (authData.token) {
      headers['Authorization'] = 'Bearer ' + authData.token;
    }
    
    try {
      var response = await fetch(url, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });
      
      var text = await response.text();
      console.log('Response:', text);
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return { success: false, message: text || 'Access denied' };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: error.message };
    }
  }
  
  function createGUI(initialPin) {
    var oldGui = document.getElementById('cheatnetwork-gui');
    if (oldGui) oldGui.remove();
    
    var authData = getAuthData();
    
    var container = document.createElement('div');
    container.id = 'cheatnetwork-gui';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.width = '350px';
    container.style.background = '#fff';
    container.style.borderRadius = '12px';
    container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    container.style.zIndex = '999999';
    container.style.fontFamily = 'Arial, sans-serif';
    
    var header = document.createElement('div');
    header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    header.style.color = 'white';
    header.style.padding = '15px';
    header.style.borderRadius = '12px 12px 0 0';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.cursor = 'move';
    header.innerHTML = '<span style="font-weight:bold">CheatNetwork Answers</span>';
    
    var closeBtn = document.createElement('span');
    closeBtn.innerHTML = 'X';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function() { container.remove(); };
    header.appendChild(closeBtn);
    container.appendChild(header);
    
    var body = document.createElement('div');
    body.style.padding = '15px';
    
    var statusDiv = document.createElement('div');
    statusDiv.style.marginBottom = '15px';
    statusDiv.style.padding = '10px';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.fontSize = '12px';
    
    if (authData.token) {
      statusDiv.style.background = '#e8f5e9';
      statusDiv.style.color = '#2e7d32';
      statusDiv.innerHTML = '<b>Logged in</b><br>Token: ' + authData.token.substring(0, 20) + '...';
    } else {
      statusDiv.style.background = '#ffebee';
      statusDiv.style.color = '#c62828';
      statusDiv.innerHTML = '<b>Not logged in</b><br>Login di cheatnetwork.eu dl!';
    }
    body.appendChild(statusDiv);
    
    var inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '15px';
    
    var pinInput = document.createElement('input');
    pinInput.type = 'text';
    pinInput.placeholder = 'Masukkan PIN';
    pinInput.value = initialPin || '';
    pinInput.style.width = '70%';
    pinInput.style.padding = '10px';
    pinInput.style.borderRadius = '8px';
    pinInput.style.border = '1px solid #ccc';
    
    var fetchBtn = document.createElement('button');
    fetchBtn.innerHTML = 'Cari';
    fetchBtn.style.width = '25%';
    fetchBtn.style.padding = '10px';
    fetchBtn.style.borderRadius = '8px';
    fetchBtn.style.border = 'none';
    fetchBtn.style.background = '#667eea';
    fetchBtn.style.color = 'white';
    fetchBtn.style.cursor = 'pointer';
    fetchBtn.style.marginLeft = '5%';
    
    inputContainer.appendChild(pinInput);
    inputContainer.appendChild(fetchBtn);
    body.appendChild(inputContainer);
    
    var resultsDiv = document.createElement('div');
    resultsDiv.id = 'cn-results';
    body.appendChild(resultsDiv);
    
    container.appendChild(body);
    document.body.appendChild(container);
    
    fetchBtn.onclick = async function() {
      var pin = pinInput.value.trim();
      if (!pin) { alert('Masukkan PIN!'); return; }
      resultsDiv.innerHTML = '<div style="text-align:center;">Loading...</div>';
      var data = await fetchAnswers(pin, authData);
      displayAnswers(resultsDiv, data);
    };
    
    var isDragging = false;
    var startX, startY, initX, initY;
    
    header.onmousedown = function(e) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initX = container.offsetLeft;
      initY = container.offsetTop;
    };
    
    document.onmousemove = function(e) {
      if (isDragging) {
        container.style.left = (initX + e.clientX - startX) + 'px';
        container.style.top = (initY + e.clientY - startY) + 'px';
        container.style.right = 'auto';
      }
    };
    
    document.onmouseup = function() {
      isDragging = false;
    };
  }
  
  function displayAnswers(container, answers) {
    if (!answers || !answers.success) {
      container.innerHTML = '<div style="color:red; padding:20px; text-align:center;">' + 
        (answers ? answers.message : 'Error') + '</div>';
      return;
    }
    
    var data = answers.data ? answers.data.answers : (answers.answers || []);
    if (!data.length) {
      container.innerHTML = '<div style="text-align:center;">Tidak ada jawaban</div>';
      return;
    }
    
    var html = '<div style="max-height:300px; overflow-y:auto;">';
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var q = item.question || (i + 1);
      var a = item.answer || item.correctAnswer || '-';
      html += '<div style="background:#e8f5e9; padding:10px; border-radius:8px; margin-bottom:8px; border-left:4px solid #4caf50;">';
      html += '<div style="font-size:12px; color:#666;">Soal ' + q + '</div>';
      html += '<div style="font-size:16px; font-weight:bold;">' + a + '</div>';
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }
  
  // CARA PAKAI:
  // 1. Login ke cheatnetwork.eu (tab yang sama)
  // 2. Buka Quizizz
  // 3. Klik bookmarklet ini
  // 4. Masukkan PIN dan klik Cari
  
  createGUI(null);
})();
