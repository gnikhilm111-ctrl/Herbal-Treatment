// ============================================================
//  recommender.js — Symptom Analysis & Remedy Scoring Engine
// ============================================================

const Recommender = (() => {

  /* Check whether any selected symptoms are danger signs */
  function checkDanger(selectedSymptoms) {
    const alerts = [];
    // Single-symptom dangers
    DANGER_SIGNS.forEach(d => {
      if (selectedSymptoms.includes(d.symptom)) alerts.push(d);
    });
    // Combination dangers
    HIGH_RISK_COMBINATIONS.forEach(combo => {
      if (combo.symptoms.every(s => selectedSymptoms.includes(s))) {
        alerts.push({ urgency: 'EMERGENCY', message: combo.message, icon: '🚨' });
      }
    });
    return alerts;
  }

  /* Score a remedy against the user's input */
  function scoreRemedy(remedy, { selectedSymptoms, age, conditions, days }) {
    let score = 0;

    // 1. Symptom match — weighted by symptom severity
    let matchCount = 0;
    selectedSymptoms.forEach(sid => {
      if (remedy.symptoms.includes(sid)) {
        const sw = SYMPTOMS_DB[sid]?.w || 1;
        score += sw * 10;
        matchCount++;
      }
    });
    if (matchCount === 0) return null;  // no relevant symptoms

    // 2. Coverage ratio bonus
    const coverage = matchCount / selectedSymptoms.length;
    score += coverage * 20;

    // 3. Age check
    if (age < remedy.ageMin || age > remedy.ageMax) return null;

    // 4. Contraindication check — skip remedy if user has conflicting condition
    if (conditions && conditions.length) {
      const hasContraindication = remedy.contraindications.some(c => conditions.includes(c));
      if (hasContraindication) return null;
    }

    // 5. Duration bonus (longer symptoms = remedies for chronic issues rank higher)
    if (days >= 7 && remedy.duration?.includes('week')) score += 5;

    // 6. Effectiveness boost
    score += (remedy.effectiveness || 4) * 3;

    return { remedy, score: Math.round(score), matchCount };
  }

  /* Main recommendation function */
  function recommend({ selectedSymptoms, age, gender, conditions, days }) {
    const dangers   = checkDanger(selectedSymptoms);
    const hasEmergency = dangers.some(d => d.urgency === 'EMERGENCY');

    // If emergency — return danger alerts only
    if (hasEmergency) return { dangers, results: [], emergency: true };

    // Score all remedies
    const scored = REMEDIES
      .map(r => scoreRemedy(r, { selectedSymptoms, age, conditions, days }))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    // De-duplicate by category (take best from each category for variety)
    const seen = new Set();
    const top = [];
    for (const item of scored) {
      const cat = item.remedy.category;
      if (!seen.has(cat)) {
        seen.add(cat);
        top.push(item);
      }
      if (top.length >= 5) break;
    }
    // If fewer than 3, just take top scored regardless of category
    const results = top.length >= 3 ? top : scored.slice(0, 5);

    // Long symptom duration warning
    const durationWarning = days >= 7
      ? 'Your symptoms have persisted for over a week. While herbal remedies can support recovery, we recommend consulting a doctor if there is no improvement after trying these remedies.'
      : null;

    return { dangers: dangers.filter(d => d.urgency !== 'EMERGENCY'), results, emergency: false, durationWarning };
  }

  /* Build a formatted remedy card HTML */
  function buildRemedyCard(item, index) {
    const r = item.remedy;
    const stars = '★'.repeat(Math.round(r.effectiveness)) + '☆'.repeat(5 - Math.round(r.effectiveness));
    const diffColor = { Easy: 'var(--green-light)', Moderate: 'var(--amber)', Hard: 'var(--danger)' };

    const ingredientsList = r.ingredients.map(i =>
      `<li><span class="ing-item">${i.item}</span><span class="ing-amount">${i.amount}</span></li>`
    ).join('');

    const stepsList = r.steps.map((s, i) =>
      `<li><span class="step-num">${i + 1}</span>${s}</li>`
    ).join('');

    const benefitsList = r.benefits.map(b => `<li><i class="fas fa-check"></i>${b}</li>`).join('');
    const precautionsList = r.precautions.map(p => `<li><i class="fas fa-exclamation-triangle"></i>${p}</li>`).join('');

    const herbBadges = r.herbs.map(h => {
      const herb = HERBS_DB[h];
      return herb ? `<span class="herb-badge">${herb.emoji} ${herb.name}</span>` : '';
    }).join('');

    return `
    <div class="remedy-card" id="remedy-${index}">
      <div class="remedy-card-header">
        <div class="remedy-rank">#${index + 1}</div>
        <div class="remedy-title-block">
          <h3 class="remedy-name">${r.name}</h3>
          <p class="remedy-tagline">${r.tagline}</p>
        </div>
        <div class="remedy-score-block">
          <div class="stars">${stars}</div>
          <span class="effectiveness">${r.effectiveness}/5</span>
        </div>
      </div>

      <p class="remedy-description">${r.description}</p>

      <div class="remedy-meta">
        <span class="meta-pill"><i class="fas fa-clock"></i>${r.prepTime}</span>
        <span class="meta-pill" style="background:${diffColor[r.difficulty]}20;color:${diffColor[r.difficulty]}">
          <i class="fas fa-signal"></i>${r.difficulty}
        </span>
        <span class="meta-pill"><i class="fas fa-calendar-check"></i>${r.duration}</span>
        <span class="meta-pill"><i class="fas fa-pills"></i>${r.dosage}</span>
      </div>

      <div class="remedy-herbs">${herbBadges}</div>

      <div class="remedy-tabs">
        <button class="tab-btn active" onclick="switchTab(this,'ingredients-${index}')"><i class="fas fa-list"></i> Ingredients</button>
        <button class="tab-btn" onclick="switchTab(this,'steps-${index}')"><i class="fas fa-tasks"></i> Steps</button>
        <button class="tab-btn" onclick="switchTab(this,'benefits-${index}')"><i class="fas fa-heart"></i> Benefits</button>
        <button class="tab-btn" onclick="switchTab(this,'caution-${index}')"><i class="fas fa-exclamation-triangle"></i> Caution</button>
      </div>

      <div class="tab-content active" id="ingredients-${index}">
        <ul class="ingredients-list">${ingredientsList}</ul>
      </div>
      <div class="tab-content" id="steps-${index}">
        <ol class="steps-list">${stepsList}</ol>
      </div>
      <div class="tab-content" id="benefits-${index}">
        <ul class="benefits-list">${benefitsList}</ul>
      </div>
      <div class="tab-content" id="caution-${index}">
        <ul class="precautions-list">${precautionsList}</ul>
      </div>

      <div class="remedy-actions">
        <button class="btn btn-outline btn-sm" onclick="printRemedy(${index})"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-outline btn-sm" onclick="saveRemedyPDF(${index})"><i class="fas fa-download"></i> Save PDF</button>
        <button class="btn btn-outline btn-sm" onclick="openReminder(${index})"><i class="fas fa-bell"></i> Remind Me</button>
        <button class="btn btn-primary btn-sm" onclick="openFeedback('${r.id}','${r.name}')"><i class="fas fa-star"></i> Rate</button>
      </div>
    </div>`;
  }

  return { recommend, buildRemedyCard, checkDanger };
})();

/* ── Tab switching inside remedy cards ───────────────────── */
function switchTab(btn, contentId) {
  const card = btn.closest('.remedy-card');
  card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  card.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(contentId).classList.add('active');
}

/* ── Print a single remedy ───────────────────────────────── */
function printRemedy(index) {
  const card = document.getElementById(`remedy-${index}`);
  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>VanaOshadhi Remedy</title>
    <style>
      body{font-family:Georgia,serif;padding:40px;color:#1a1a1a;max-width:700px;margin:0 auto;}
      h2{color:#2D6A4F;border-bottom:2px solid #2D6A4F;padding-bottom:8px;}
      h3{color:#2D6A4F;margin-top:24px;}
      li{margin:6px 0;line-height:1.6;}
      .meta{display:flex;gap:16px;flex-wrap:wrap;margin:12px 0;}
      .pill{background:#f0f7f4;padding:4px 10px;border-radius:20px;font-size:13px;}
      .footer{margin-top:40px;font-size:12px;color:#888;text-align:center;}
    </style></head><body>
    <h2>🌿 VanaOshadhi — Herbal Remedy</h2>
    ${card.querySelector('.remedy-name').outerHTML}
    <p>${card.querySelector('.remedy-description').textContent}</p>
    <h3>Ingredients</h3>${card.querySelector('[id^="ingredients-"]').innerHTML}
    <h3>Preparation Steps</h3>${card.querySelector('[id^="steps-"]').innerHTML}
    <h3>Benefits</h3>${card.querySelector('[id^="benefits-"]').innerHTML}
    <h3>Precautions</h3>${card.querySelector('[id^="caution-"]').innerHTML}
    <div class="footer">Generated by VanaOshadhi · Nature's wisdom, one remedy at a time.<br>
    <strong>Disclaimer:</strong> This is for informational purposes only and not a substitute for professional medical advice.</div>
    </body></html>`);
  win.document.close();
  win.print();
}

/* ── Save remedy as PDF (print to PDF) ───────────────────── */
function saveRemedyPDF(index) {
  printRemedy(index);
  showToast('Use "Save as PDF" option in the print dialog.', 'info');
}
