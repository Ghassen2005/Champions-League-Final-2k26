// ============================================
// UCL FINAL PREDICTOR - MAIN APPLICATION
// Chatbot, UI Logic, Animations
// ============================================

let ml = null;
let predictionRun = false;
let analysisData = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initChatbot();
  addWelcomeMessage();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ===== PREDICTION ENGINE =====
function runPrediction() {
  const btn = document.getElementById('predict-btn');
  btn.classList.add('loading');
  btn.disabled = true;

  // Simulate ML processing time
  setTimeout(() => {
    ml = new MLEngine(MatchData);
    const results = ml.runAllModels();
    analysisData = ml.getAnalysis();
    
    displayPrediction(analysisData);
    displayModelCards(results);
    displayWinProbability(ml.calculateWinProbability());
    
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-text">⟳ Re-run Prediction</span><span class="spinner"></span>';
    predictionRun = true;

    // Send analysis to chatbot
    const extraInfo = analysisData.prediction.extraTime ? ` *${analysisData.prediction.extraTimeMsg}*` : '';
    addBotMessage(`🎯 **Prediction Complete!** Our ensemble of 6 ML models predicts:\n\n**Arsenal ${analysisData.prediction.homeGoals} - ${analysisData.prediction.awayGoals} PSG**${extraInfo}\n\nConfidence: ${(analysisData.prediction.confidence * 100).toFixed(1)}%\n\nAsk me anything about this prediction! I can explain the models, stats, player comparisons, and more.`);
  }, 2500);
}

function displayPrediction(analysis) {
  const homeScore = document.getElementById('home-score');
  const awayScore = document.getElementById('away-score');
  const confFill = document.getElementById('confidence-fill');
  const confLabel = document.getElementById('confidence-value');
  const predLabel = document.querySelector('.prediction-label');
  
  // Set label based on match duration
  if (analysis.prediction.extraTime) {
    predLabel.textContent = 'Ensemble Meta-Model Prediction (A.E.T.)';
  } else {
    predLabel.textContent = 'Ensemble Meta-Model Prediction';
  }
  
  // Animate score counters
  animateValue(homeScore, 0, analysis.prediction.homeGoals, 1500);
  animateValue(awayScore, 0, analysis.prediction.awayGoals, 1500);
  
  // Animate confidence bar
  const confPct = (analysis.prediction.confidence * 100).toFixed(1);
  setTimeout(() => {
    confFill.style.width = confPct + '%';
    confLabel.textContent = confPct + '%';
  }, 500);
}

function animateValue(el, start, end, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function displayModelCards(results) {
  const modelData = [
    { key: 'knn', icon: '🔍', iconClass: 'knn', desc: 'Finds the most similar historical match scenarios using distance-based voting with K=5 neighbors.' },
    { key: 'kmeans', icon: '🎯', iconClass: 'kmeans', desc: 'Groups match profiles into clusters and assigns this match to the most similar performance cluster.' },
    { key: 'regression', icon: '📈', iconClass: 'regression', desc: 'Fits a linear model using win rate, xG, possession, and form as predictors for goals.' },
    { key: 'forest', icon: '🌲', iconClass: 'forest', desc: 'Ensemble of 10 decision trees, each using random feature subsets for robust prediction.' },
    { key: 'svm', icon: '⚡', iconClass: 'svm', desc: 'Uses RBF kernel to find the optimal decision boundary between match outcomes.' },
    { key: 'ensemble', icon: '🧠', iconClass: 'ensemble', desc: 'Weighted combination of all models, with Random Forest and KNN receiving highest weights.' },
  ];

  const grid = document.getElementById('models-grid');
  grid.innerHTML = '';

  modelData.forEach((m, i) => {
    const r = results[m.key];
    if (!r) return;
    const card = document.createElement('div');
    card.className = 'model-card animate-in';
    card.innerHTML = `
      <div class="model-icon ${m.iconClass}">${m.icon}</div>
      <h3 class="model-name">${r.name}</h3>
      <p class="model-desc">${m.desc}</p>
      <div class="model-prediction">
        <span class="model-score">${r.homeGoals} - ${r.awayGoals}</span>
        <span class="model-confidence">${(r.confidence * 100).toFixed(1)}% conf.</span>
      </div>
    `;
    grid.appendChild(card);
    
    // Stagger animation
    setTimeout(() => card.classList.add('visible'), i * 100);
  });
}

function displayWinProbability(prob) {
  const arsenalBar = document.getElementById('prob-arsenal');
  const drawBar = document.getElementById('prob-draw');
  const psgBar = document.getElementById('prob-psg');

  document.getElementById('prob-arsenal-val').textContent = prob.arsenalWin + '%';
  document.getElementById('prob-psg-val').textContent = prob.psgWin + '%';

  setTimeout(() => {
    arsenalBar.style.width = prob.arsenalWin + '%';
    arsenalBar.textContent = prob.arsenalWin + '%';
    drawBar.style.width = prob.draw + '%';
    drawBar.textContent = prob.draw + '%';
    psgBar.style.width = prob.psgWin + '%';
    psgBar.textContent = prob.psgWin + '%';
  }, 300);
}

// ===== CHATBOT =====
function initChatbot() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      handleUserMessage(input.value.trim());
      input.value = '';
    }
  });

  sendBtn.addEventListener('click', () => {
    if (input.value.trim()) {
      handleUserMessage(input.value.trim());
      input.value = '';
    }
  });

  // Quick questions
  document.querySelectorAll('.quick-q').forEach(q => {
    q.addEventListener('click', () => {
      handleUserMessage(q.textContent);
    });
  });
}

function addWelcomeMessage() {
  addBotMessage(`👋 Welcome to the **UCL Final Predictor**! I'm your AI assistant.\n\nI use **6 different Machine Learning models** — KNN, K-Means Clustering, Linear Regression, Random Forest, SVM, and an Ensemble Meta-Model — to predict the Champions League Final score.\n\nClick **"Run ML Prediction"** above to generate the prediction, then ask me anything about it!`);
}

function handleUserMessage(text) {
  addUserMessage(text);
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    const response = generateResponse(text);
    addBotMessage(response);
  }, 800 + Math.random() * 1200);
}

function addBotMessage(text) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message bot';
  msg.innerHTML = `
    <div class="msg-avatar">⚽</div>
    <div class="msg-bubble">${formatMessage(text)}</div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message user';
  msg.innerHTML = `
    <div class="msg-avatar">👤</div>
    <div class="msg-bubble">${escapeHtml(text)}</div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'chat-message bot';
  typing.id = 'typing-indicator';
  typing.innerHTML = `
    <div class="msg-avatar">⚽</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function formatMessage(text) {
  // Basic markdown-like formatting
  text = escapeHtml(text);
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/\n/g, '<br>');
  return text;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== CHATBOT RESPONSE ENGINE =====
function generateResponse(input) {
  const lower = input.toLowerCase();

  // Greeting
  if (lower.match(/^(hi|hello|hey|bonjour|salut|yo|sup)/)) {
    return `👋 Hey there! I'm the UCL Final Predictor Bot. ${predictionRun ? 'The prediction is ready — ask me anything about the Arsenal vs PSG final!' : 'Click **Run ML Prediction** to get started, then I can break down everything for you!'}`;
  }

  // Score prediction
  if (lower.match(/score|prediction|predict|result|final score/)) {
    if (!predictionRun) return `⚠️ Please run the prediction first by clicking the **"Run ML Prediction"** button above! Once the models have run, I'll have a detailed score prediction for you.`;
    const p = analysisData.prediction;
    const extraInfo = p.extraTime ? ` *${p.extraTimeMsg}*` : '';
    return `🎯 **Predicted Score: Arsenal ${p.homeGoals} - ${p.awayGoals} PSG**${extraInfo}\n\nThis prediction comes from our **Ensemble Meta-Model** which combines 6 different ML algorithms:\n\n• **KNN** (K=5): ${ml.results.knn.homeGoals} - ${ml.results.knn.awayGoals}\n• **K-Means**: ${ml.results.kmeans.homeGoals} - ${ml.results.kmeans.awayGoals}\n• **Linear Regression**: ${ml.results.regression.homeGoals} - ${ml.results.regression.awayGoals}\n• **Random Forest**: ${ml.results.forest.homeGoals} - ${ml.results.forest.awayGoals}\n• **SVM**: ${ml.results.svm.homeGoals} - ${ml.results.svm.awayGoals}\n\nOverall confidence: **${(p.confidence * 100).toFixed(1)}%**`;
  }

  // KNN specific
  if (lower.match(/knn|k-nearest|nearest neighbor/)) {
    if (!predictionRun) return `Run the prediction first! KNN (K-Nearest Neighbors) will find the 5 most similar historical match scenarios to predict this final's score.`;
    const k = ml.results.knn;
    return `🔍 **K-Nearest Neighbors (KNN) Analysis:**\n\n**Prediction: Arsenal ${k.homeGoals} - ${k.awayGoals} PSG**\nConfidence: ${(k.confidence * 100).toFixed(1)}%\n\nKNN works by:\n1. Converting each team's stats into a feature vector\n2. Finding the K=${k.k} most similar historical match profiles\n3. Using **inverse-distance weighting** to average their outcomes\n4. Adjusting for team-specific xG and head-to-head performance\n\nThe algorithm considers win rate, recent form, xG per game, and H2H record as key features.`;
  }

  // K-Means
  if (lower.match(/k-means|kmeans|cluster/)) {
    if (!predictionRun) return `Run the prediction first! K-Means Clustering groups match profiles into distinct categories to classify this final.`;
    const km = ml.results.kmeans;
    return `🎯 **K-Means Clustering Analysis:**\n\n**Prediction: Arsenal ${km.homeGoals} - ${km.awayGoals} PSG**\nConfidence: ${(km.confidence * 100).toFixed(1)}%\n\nK-Means groups historical match data into **${km.clusters} clusters** based on team strengths:\n\n• **Cluster 0**: Dominant home team wins\n• **Cluster 1**: Tight, competitive matches\n• **Cluster 2**: Away team upsets\n\nThis match was assigned to **Cluster ${km.assignedCluster}**, which reflects the competitive nature of both teams. The algorithm ran 50 iterations to converge on optimal centroids.`;
  }

  // Random Forest
  if (lower.match(/random forest|forest|tree/)) {
    if (!predictionRun) return `Run the prediction first! Random Forest uses an ensemble of decision trees for robust prediction.`;
    const rf = ml.results.forest;
    return `🌲 **Random Forest Analysis:**\n\n**Prediction: Arsenal ${rf.homeGoals} - ${rf.awayGoals} PSG**\nConfidence: ${(rf.confidence * 100).toFixed(1)}%\n\nOur Random Forest uses **${rf.nTrees} decision trees**, each trained on:\n• A random subset of 4-6 features\n• Features include: win rate, xG, clean sheets, possession, form, H2H\n• Each tree adds controlled randomness for diversity\n\nThe final prediction averages all trees, making it robust against overfitting. This is why Random Forest gets the **highest weight (28%)** in our ensemble!`;
  }

  // SVM
  if (lower.match(/svm|support vector|vector machine/)) {
    if (!predictionRun) return `Run the prediction first! Our SVM model uses RBF kernel for match outcome classification.`;
    const svm = ml.results.svm;
    return `⚡ **Support Vector Machine (SVM) Analysis:**\n\n**Prediction: Arsenal ${svm.homeGoals} - ${svm.awayGoals} PSG**\nConfidence: ${(svm.confidence * 100).toFixed(1)}%\n\nThe SVM uses a **Radial Basis Function (RBF) kernel** with:\n• ${svm.supportVectorCount} support vectors from key historical matches\n• Gamma = 0.5 for kernel width\n• Alpha-weighted contributions from each support vector\n\nSVM is excellent at finding non-linear boundaries between match outcomes, making it especially useful for predicting cup finals where patterns differ from league games.`;
  }

  // Linear Regression
  if (lower.match(/regression|linear/)) {
    if (!predictionRun) return `Run the prediction first! Linear Regression models the relationship between team stats and goals.`;
    const lr = ml.results.regression;
    return `📈 **Linear Regression Analysis:**\n\n**Prediction: Arsenal ${lr.homeGoals} - ${lr.awayGoals} PSG**\nConfidence: ${(lr.confidence * 100).toFixed(1)}%\n\nThe model uses **6 features** with learned weights:\n• Win Rate (weight: 1.2) — strongest predictor\n• xG per Game (weight: 0.8)\n• Clean Sheet Rate (weight: -0.3) — reduces opponent goals\n• Possession (weight: 0.4)\n• Recent Form (weight: 0.6)\n• H2H Score (weight: 0.5)\n\nR² score: **${lr.r2Score}** — the model explains 73% of variance in historical UCL goal data.`;
  }

  // Ensemble
  if (lower.match(/ensemble|meta|combined|all models/)) {
    if (!predictionRun) return `Run the prediction first! The ensemble combines all 6 ML models for the most reliable prediction.`;
    const ens = ml.results.ensemble;
    return `🧠 **Ensemble Meta-Model:**\n\n**Final Prediction: Arsenal ${ens.homeGoals} - ${ens.awayGoals} PSG**\nConfidence: ${(ens.confidence * 100).toFixed(1)}%\n\n**Model Weights:**\n• Random Forest: 28% (highest — most robust)\n• KNN: 22% (strong similarity-based reasoning)\n• Linear Regression: 20% (solid statistical foundation)\n• SVM: 18% (good non-linear capture)\n• K-Means: 12% (useful for categorization)\n\nA **0.9x cup final adjustment** is applied because finals tend to produce tighter scorelines than regular matches. The ensemble is weighted by both assigned weights AND individual model confidence scores.`;
  }

  // Arsenal questions
  if (lower.match(/arsenal|gunner/)) {
    const a = MatchData.seasonStats.arsenal;
    const topScorer = MatchData.arsenalPlayers.reduce((best, p) => p.goals > best.goals ? p : best);
    return `🔴 **Arsenal Season Profile:**\n\n📊 Record: ${a.wins}W ${a.draws}D ${a.losses}L (${a.played} games)\n⚽ Goals: ${a.goalsFor} scored, ${a.goalsAgainst} conceded\n🛡️ Clean Sheets: ${a.cleanSheets}\n📈 xG: ${a.xGFor} for, ${a.xGAgainst} against\n🎯 Shots on Target/game: ${a.shotsOnTargetPG}\n🏆 League Position: ${a.leaguePosition}st\n💰 Squad Value: €${a.totalSquadValue}M\n\n🌟 Top Scorer: **${topScorer.name}** (${topScorer.goals} goals, ${topScorer.assists} assists)\n\nArsenal's key strength is their **defensive solidity** — ${a.cleanSheets} clean sheets this season is exceptional!`;
  }

  // PSG questions
  if (lower.match(/psg|paris|saint.germain/)) {
    const p = MatchData.seasonStats.psg;
    const topScorer = MatchData.psgPlayers.reduce((best, pl) => pl.goals > best.goals ? pl : best);
    return `🔵 **PSG Season Profile:**\n\n📊 Record: ${p.wins}W ${p.draws}D ${p.losses}L (${p.played} games)\n⚽ Goals: ${p.goalsFor} scored, ${p.goalsAgainst} conceded\n🛡️ Clean Sheets: ${p.cleanSheets}\n📈 xG: ${p.xGFor} for, ${p.xGAgainst} against\n🎯 Shots on Target/game: ${p.shotsOnTargetPG}\n🏆 League Position: ${p.leaguePosition}st\n💰 Squad Value: €${p.totalSquadValue}M\n\n🌟 Top Scorer: **${topScorer.name}** (${topScorer.goals} goals, ${topScorer.assists} assists)\n\nPSG's biggest advantage is their **attacking firepower** — ${p.goalsFor} goals this season with the highest xG in the competition!`;
  }

  // Player values
  if (lower.match(/player|value|price|transfer|market|worth/)) {
    const arsTotal = MatchData.arsenalPlayers.reduce((s, p) => s + p.value, 0);
    const psgTotal = MatchData.psgPlayers.reduce((s, p) => s + p.value, 0);
    const mostValuable = [...MatchData.arsenalPlayers, ...MatchData.psgPlayers].sort((a, b) => b.value - a.value);
    return `💰 **Player Market Values:**\n\n**Arsenal Top 3:**\n1. ${MatchData.arsenalPlayers[0].name} — €${MatchData.arsenalPlayers[0].value}M\n2. ${MatchData.arsenalPlayers[1].name} — €${MatchData.arsenalPlayers[1].value}M\n3. ${MatchData.arsenalPlayers[3].name} — €${MatchData.arsenalPlayers[3].value}M\n\n**PSG Top 3:**\n1. ${MatchData.psgPlayers[1].name} — €${MatchData.psgPlayers[1].value}M\n2. ${MatchData.psgPlayers[6].name} — €${MatchData.psgPlayers[6].value}M\n3. ${MatchData.psgPlayers[0].name} — €${MatchData.psgPlayers[0].value}M\n\n**Total Squad Values:**\n🔴 Arsenal: €${arsTotal}M\n🔵 PSG: €${psgTotal}M\n\nArsenal holds the edge in squad depth and value, which is factored into the Random Forest and SVM predictions.`;
  }

  // Head to head
  if (lower.match(/head.to.head|h2h|history|historical|previous|past/)) {
    let arsWins = 0, psgWins = 0, draws = 0;
    MatchData.headToHead.forEach(m => {
      if (m.scoreH > m.scoreA) { m.home === 'Arsenal' ? arsWins++ : psgWins++; }
      else if (m.scoreH < m.scoreA) { m.home === 'Arsenal' ? psgWins++ : arsWins++; }
      else draws++;
    });
    let matchList = MatchData.headToHead.map(m => 
      `• ${m.date}: ${m.home} ${m.scoreH}-${m.scoreA} ${m.away} (${m.competition})`
    ).join('\n');
    return `📊 **Head-to-Head Record (${MatchData.headToHead.length} matches):**\n\n🔴 Arsenal Wins: ${arsWins}\n🤝 Draws: ${draws}\n🔵 PSG Wins: ${psgWins}\n\n**All Meetings:**\n${matchList}\n\nArsenal has a strong recent H2H advantage — winning both 2024/25 group stage matches! This historical dominance is weighted at 15% in the KNN model.`;
  }

  // Probability / who wins
  if (lower.match(/probability|chance|who.*(win|favourite|favorite)|likely|odds/)) {
    if (!predictionRun) return `Run the prediction first to see detailed win probabilities!`;
    const prob = ml.calculateWinProbability();
    return `📊 **Win Probability Breakdown:**\n\n🔴 Arsenal Win: **${prob.arsenalWin}%**\n🤝 Draw: **${prob.draw}%**\n🔵 PSG Win: **${prob.psgWin}%**\n\nThese probabilities are calculated by combining:\n• Season win rates (weighted 35%)\n• Recent form scores (weighted 25%)\n• Head-to-head record (weighted 20%)\n• Expected goals data (weighted 20%)\n\n${prob.arsenalWin > prob.psgWin ? '**Arsenal is the slight favorite** based on their superior defensive record and head-to-head dominance.' : '**PSG has a slight edge** based on their attacking prowess and higher xG numbers.'}`;
  }

  // How / methodology
  if (lower.match(/how|method|work|algorithm|explain|what.*model/)) {
    return `🤖 **How Our Prediction Works:**\n\nWe use **6 Machine Learning algorithms** running in your browser:\n\n1. **KNN (K=5)**: Finds 5 most similar historical matches\n2. **K-Means (K=3)**: Clusters team performance profiles\n3. **Linear Regression**: Models goal output from 6 features\n4. **Random Forest (10 trees)**: Ensemble of decision trees\n5. **SVM (RBF kernel)**: Non-linear match classification\n6. **Ensemble Meta-Model**: Weighted combination of all 5\n\n**Input Features:**\n• Win rate, goals per game, xG stats\n• Clean sheet rate, possession %\n• Recent form (weighted recency)\n• Head-to-head historical record\n• Squad market value\n• Shots on target, pass accuracy\n\nThe final score is adjusted by a **0.9x cup final factor** since finals historically produce fewer goals.`;
  }

  // Form / recent
  if (lower.match(/form|recent|last|momentum/)) {
    const arsForm = MatchData.arsenalForm.slice(0, 5).map(m => 
      `${m.result === 'W' ? '✅' : m.result === 'D' ? '🟡' : '❌'} ${m.score} vs ${m.opponent} (${m.competition})`
    ).join('\n');
    const psgForm = MatchData.psgForm.slice(0, 5).map(m => 
      `${m.result === 'W' ? '✅' : m.result === 'D' ? '🟡' : '❌'} ${m.score} vs ${m.opponent} (${m.competition})`
    ).join('\n');
    return `📈 **Recent Form (Last 5 Matches):**\n\n🔴 **Arsenal:**\n${arsForm}\n\n🔵 **PSG:**\n${psgForm}\n\nArsenal is in **outstanding form** — unbeaten in their last 10 matches with 8 wins. PSG has also been strong but suffered a loss to Barcelona in the QF second leg.`;
  }

  // Saka
  if (lower.match(/saka/)) {
    const saka = MatchData.arsenalPlayers[0];
    return `⭐ **Bukayo Saka - Key Player Analysis:**\n\n📍 Position: ${saka.position}\n💰 Market Value: €${saka.value}M\n⚽ Goals: ${saka.goals}\n🅰️ Assists: ${saka.assists}\n⭐ Rating: ${saka.rating}/10\n\nSaka is Arsenal's most dangerous player and the highest-valued in both squads. His ability to create chances from the right wing will be **crucial** in breaking down PSG's defense. Our models factor in his contribution through Arsenal's high xG numbers.`;
  }

  // Dembele
  if (lower.match(/dembele|demb/)) {
    const demb = MatchData.psgPlayers[0];
    return `⭐ **Ousmane Dembélé - Key Player Analysis:**\n\n📍 Position: ${demb.position}\n💰 Market Value: €${demb.value}M\n⚽ Goals: ${demb.goals}\n🅰️ Assists: ${demb.assists}\n⭐ Rating: ${demb.rating}/10\n\nDembélé is PSG's creative engine with ${demb.assists} assists this season. His unpredictable dribbling and pace will test Arsenal's full-backs. He's been directly involved in 28 goals this season!`;
  }

  // Stadium
  if (lower.match(/stadium|venue|where|location/)) {
    return `🏟️ **Venue: Puskás Aréna, Budapest, Hungary**\n\nThe 2026 Champions League Final takes place at the iconic Puskás Aréna in Budapest, Hungary.\n\n📍 Capacity: 67,215\n🌍 Location: Budapest, Hungary\n🏗️ Opened: 2019\n\nThis is a neutral venue, which our models account for by removing home advantage bias. The stadium's atmosphere is expected to be electric with fans from both London and Paris!`;
  }

  // xG / expected goals
  if (lower.match(/xg|expected goal/)) {
    const a = MatchData.seasonStats.arsenal;
    const p = MatchData.seasonStats.psg;
    return `📊 **Expected Goals (xG) Analysis:**\n\n🔴 **Arsenal:**\n• xG For: ${a.xGFor} (${(a.xGFor/a.played).toFixed(2)}/game)\n• xG Against: ${a.xGAgainst} (${(a.xGAgainst/a.played).toFixed(2)}/game)\n• xG Difference: +${(a.xGFor - a.xGAgainst).toFixed(1)}\n\n🔵 **PSG:**\n• xG For: ${p.xGFor} (${(p.xGFor/p.played).toFixed(2)}/game)\n• xG Against: ${p.xGAgainst} (${(p.xGAgainst/p.played).toFixed(2)}/game)\n• xG Difference: +${(p.xGFor - p.xGAgainst).toFixed(1)}\n\nPSG has higher xG numbers offensively, but Arsenal's xG against is significantly lower, showing their **defensive superiority**. xG is weighted at 30% in our KNN and Linear Regression models.`;
  }

  // Thanks
  if (lower.match(/thank|thanks|thx|merci/)) {
    return `You're welcome! 😊 Feel free to ask me anything else about the prediction, the models, or the match. Good luck to your team! ⚽🏆`;
  }

  // Default / fallback
  if (predictionRun) {
    return `Great question! Here's what I can help you with:\n\n• **"What's the predicted score?"** — Full prediction breakdown\n• **"Explain KNN / K-Means / Random Forest / SVM"** — Model details\n• **"Tell me about Arsenal / PSG"** — Team analysis\n• **"Show me player values"** — Market value comparison\n• **"Head to head history"** — Past meetings\n• **"Who will win?"** — Win probability analysis\n• **"Recent form"** — Last 5 matches for each team\n• **"Explain xG"** — Expected goals analysis\n\nTry asking about any of these topics! 🎯`;
  }

  return `I'd love to help! First, please click the **"Run ML Prediction"** button above to generate the prediction. Once the models have run, I can answer detailed questions about:\n\n• The predicted score and confidence level\n• How each ML model works (KNN, K-Means, Regression, etc.)\n• Arsenal and PSG team analysis\n• Player values and comparisons\n• Historical head-to-head record\n• Win probabilities\n\nLet's get started! ⚽`;
}

// ===== BUILD HISTORICAL TABLE =====
function buildHistoryTable() {
  const tbody = document.getElementById('history-tbody');
  if (!tbody) return;
  
  MatchData.headToHead.forEach(match => {
    const isArsenalHome = match.home === 'Arsenal';
    const arsenalGoals = isArsenalHome ? match.scoreH : match.scoreA;
    const psgGoals = isArsenalHome ? match.scoreA : match.scoreH;
    let result, resultClass;
    if (arsenalGoals > psgGoals) { result = 'Arsenal Win'; resultClass = 'win'; }
    else if (arsenalGoals < psgGoals) { result = 'PSG Win'; resultClass = 'loss'; }
    else { result = 'Draw'; resultClass = 'draw'; }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${match.date}</td>
      <td>${match.competition}</td>
      <td>${match.venue}</td>
      <td><strong>${match.scoreH} - ${match.scoreA}</strong></td>
      <td><span class="result-badge ${resultClass}">${result}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== BUILD PLAYER LISTS =====
function buildPlayerLists() {
  const arsenalList = document.getElementById('arsenal-players');
  const psgList = document.getElementById('psg-players');
  if (!arsenalList || !psgList) return;

  MatchData.arsenalPlayers.forEach(p => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <div class="player-info">
        <div class="player-avatar arsenal-bg">${p.name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <div class="player-name">${p.name}</div>
          <div class="player-position">${p.position} · ${p.goals}G ${p.assists}A · ★${p.rating}</div>
        </div>
      </div>
      <div class="player-value">€${p.value}M</div>
    `;
    arsenalList.appendChild(row);
  });

  MatchData.psgPlayers.forEach(p => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.innerHTML = `
      <div class="player-info">
        <div class="player-avatar psg-bg">${p.name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <div class="player-name">${p.name}</div>
          <div class="player-position">${p.position} · ${p.goals}G ${p.assists}A · ★${p.rating}</div>
        </div>
      </div>
      <div class="player-value">€${p.value}M</div>
    `;
    psgList.appendChild(row);
  });
}

// ===== BUILD FORM SECTION =====
function buildFormSection() {
  const arsenalForm = document.getElementById('arsenal-form');
  const psgFormEl = document.getElementById('psg-form');
  if (!arsenalForm || !psgFormEl) return;

  const buildFormHtml = (form, teamName) => {
    const badges = form.slice(0, 5).map(m => 
      `<div class="form-badge ${m.result}">${m.result}</div>`
    ).join('');

    const matches = form.slice(0, 5).map(m => `
      <div class="form-match">
        <span>vs ${m.opponent} <small style="color:var(--gray-500)">(${m.competition})</small></span>
        <span class="form-match-result form-result-${m.result}">${m.score} (${m.result})</span>
      </div>
    `).join('');

    return `
      <div class="form-badges">${badges}</div>
      <div class="form-matches" style="margin-top:12px">${matches}</div>
    `;
  };

  arsenalForm.innerHTML = buildFormHtml(MatchData.arsenalForm, 'Arsenal');
  psgFormEl.innerHTML = buildFormHtml(MatchData.psgForm, 'PSG');
}

// Initialize dynamic content on load
document.addEventListener('DOMContentLoaded', () => {
  buildHistoryTable();
  buildPlayerLists();
  buildFormSection();
});
