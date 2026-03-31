/* ============================================================
   AthleteCentral – Frontend App
   ============================================================ */

let currentUser = null;

/* ── Bootstrap ─────────────────────────────────────────────── */
async function init() {
  try {
    const res = await fetch('/auth/profile', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      showApp();
    } else {
      showLogin();
    }
  } catch {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('app-page').classList.add('hidden');
}

function showApp() {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('app-page').classList.remove('hidden');

  // Set user info in navbar
  if (currentUser) {
    const nameEl   = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    nameEl.textContent = currentUser.displayName || currentUser.username;
    if (currentUser.avatarUrl) {
      avatarEl.src = currentUser.avatarUrl;
      avatarEl.classList.remove('hidden');
    }
  }

  // Wire nav buttons
  document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });

  // Load default section
  loadWorkouts();
}

/* ── Navigation ─────────────────────────────────────────────── */
function switchSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`section-${name}`).classList.remove('hidden');
  document.querySelector(`.nav-btn[data-section="${name}"]`).classList.add('active');

  if (name === 'workouts') loadWorkouts();
  if (name === 'races')    loadRaces();
  if (name === 'recipes')  loadRecipes();
}

/* ── Toast ──────────────────────────────────────────────────── */
let toastTimer;
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast${type === 'error' ? ' error' : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

/* ── Modal helpers ──────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal.id);
  });
});

/* ── Format helpers ─────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function diffTag(diff) {
  const map = { EASY: 'easy', MED: 'med', HARD: 'hard' };
  const label = { EASY: 'Easy', MED: 'Medium', HARD: 'Hard' };
  return `<span class="tag ${map[diff] || ''}">${label[diff] || diff}</span>`;
}

function intensityBar(val) {
  const pct = Math.min(100, (val / 10) * 100);
  return `<div class="intensity-bar"><div class="intensity-fill" style="width:${pct}%"></div></div>`;
}

/* ============================================================
   WORKOUTS
   ============================================================ */
async function loadWorkouts() {
  const grid = document.getElementById('workouts-grid');
  grid.innerHTML = `<div class="empty-state"><div class="big">⏳</div><p>Loading...</p></div>`;
  try {
    const res  = await fetch('/api/workouts', { credentials: 'include' });
    const data = await res.json();
    renderWorkouts(Array.isArray(data) ? data : []);
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="big">⚠️</div><p>Failed to load workouts</p></div>`;
  }
}

function renderWorkouts(workouts) {
  const grid = document.getElementById('workouts-grid');
  if (!workouts.length) {
    grid.innerHTML = `<div class="empty-state"><div class="big">🏋️</div><p>No workouts yet — add one!</p></div>`;
    return;
  }
  grid.innerHTML = workouts.map(w => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <span class="card-title">${esc(w.name)}</span>
        ${diffTag(w.difficulty)}
      </div>
      <div class="stat-row">
        <div class="stat"><span class="stat-val">${w.duration}</span><span class="stat-lbl">min</span></div>
        <div class="stat"><span class="stat-val">${w.intensity}<span style="font-size:0.9rem;color:var(--text-muted)">/10</span></span><span class="stat-lbl">intensity</span></div>
        ${w.repCount ? `<div class="stat"><span class="stat-val">${w.repCount}</span><span class="stat-lbl">reps</span></div>` : ''}
      </div>
      ${intensityBar(w.intensity)}
      <div class="card-meta">
        <span>📅 ${fmtDate(w.date)}</span>
        ${w.location ? `<span>📍 ${esc(w.location)}</span>` : ''}
      </div>
      ${w.comment ? `<div class="card-body">${esc(w.comment)}</div>` : ''}
      ${currentUser ? `
        <div class="card-footer">
          <button class="btn-edit" onclick="editWorkout(${JSON.stringify(w).replace(/"/g,'&quot;')})">Edit</button>
          <button class="btn-danger" onclick="deleteWorkout('${w._id}')">Delete</button>
        </div>` : ''}
    </div>
  `).join('');
}

function openNewWorkout() {
  document.getElementById('workout-modal-title').textContent = 'NEW WORKOUT';
  document.getElementById('workout-form').reset();
  document.getElementById('workout-id').value = '';
  openModal('workout-modal');
}

function editWorkout(w) {
  document.getElementById('workout-modal-title').textContent = 'EDIT WORKOUT';
  document.getElementById('workout-id').value   = w._id;
  document.getElementById('w-name').value        = w.name;
  document.getElementById('w-date').value        = w.date ? w.date.slice(0,10) : '';
  document.getElementById('w-duration').value    = w.duration;
  document.getElementById('w-intensity').value   = w.intensity;
  document.getElementById('w-difficulty').value  = w.difficulty;
  document.getElementById('w-repcount').value    = w.repCount || '';
  document.getElementById('w-location').value    = w.location || '';
  document.getElementById('w-comment').value     = w.comment  || '';
  openModal('workout-modal');
}

async function submitWorkout(e) {
  e.preventDefault();
  const id = document.getElementById('workout-id').value;
  const body = {
    name:       document.getElementById('w-name').value.trim(),
    date:       document.getElementById('w-date').value,
    duration:   +document.getElementById('w-duration').value,
    intensity:  +document.getElementById('w-intensity').value,
    difficulty: document.getElementById('w-difficulty').value,
    repCount:   +document.getElementById('w-repcount').value || 0,
    location:   document.getElementById('w-location').value.trim(),
    comment:    document.getElementById('w-comment').value.trim(),
  };

  const url    = id ? `/api/workouts/${id}` : '/api/workouts';
  const method = id ? 'PUT' : 'POST';
  try {
    const res = await fetch(url, {
      method, credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    closeModal('workout-modal');
    toast(id ? 'Workout updated!' : 'Workout added!');
    loadWorkouts();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
}

async function deleteWorkout(id) {
  if (!confirm('Delete this workout?')) return;
  try {
    const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    toast('Workout deleted');
    loadWorkouts();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
}

/* ============================================================
   RACES
   ============================================================ */
async function loadRaces() {
  const grid = document.getElementById('races-grid');
  grid.innerHTML = `<div class="empty-state"><div class="big">⏳</div><p>Loading...</p></div>`;
  try {
    const res  = await fetch('/api/races', { credentials: 'include' });
    const data = await res.json();
    renderRaces(Array.isArray(data) ? data : []);
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="big">⚠️</div><p>Failed to load races</p></div>`;
  }
}

function renderRaces(races) {
  const grid = document.getElementById('races-grid');
  if (!races.length) {
    grid.innerHTML = `<div class="empty-state"><div class="big">🏁</div><p>No races yet — add one!</p></div>`;
    return;
  }
  grid.innerHTML = races.map(r => `
    <div class="card">
      <span class="card-title">${esc(r.name)}</span>
      <div class="stat-row">
        <div class="stat"><span class="stat-val">${r.distance}</span><span class="stat-lbl">km</span></div>
        <div class="stat"><span class="stat-val">${fmtDate(r.date)}</span><span class="stat-lbl">date</span></div>
      </div>
      <div class="card-meta">
        <span>📍 ${esc(r.location)}</span>
      </div>
      ${r.description ? `<div class="card-body">${esc(r.description)}</div>` : ''}
      ${currentUser ? `
        <div class="card-footer">
          <button class="btn-edit" onclick="editRace(${JSON.stringify(r).replace(/"/g,'&quot;')})">Edit</button>
          <button class="btn-danger" onclick="deleteRace('${r._id}')">Delete</button>
        </div>` : ''}
    </div>
  `).join('');
}

function editRace(r) {
  document.getElementById('race-modal-title').textContent = 'EDIT RACE';
  document.getElementById('race-id').value    = r._id;
  document.getElementById('r-name').value     = r.name;
  document.getElementById('r-date').value     = r.date ? r.date.slice(0,10) : '';
  document.getElementById('r-location').value = r.location;
  document.getElementById('r-distance').value = r.distance;
  document.getElementById('r-description').value = r.description || '';
  openModal('race-modal');
}

async function submitRace(e) {
  e.preventDefault();
  const id = document.getElementById('race-id').value;
  const body = {
    name:        document.getElementById('r-name').value.trim(),
    date:        document.getElementById('r-date').value,
    location:    document.getElementById('r-location').value.trim(),
    distance:    +document.getElementById('r-distance').value,
    description: document.getElementById('r-description').value.trim(),
  };

  const url    = id ? `/api/races/${id}` : '/api/races';
  const method = id ? 'PUT' : 'POST';
  try {
    const res = await fetch(url, {
      method, credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    closeModal('race-modal');
    toast(id ? 'Race updated!' : 'Race added!');
    loadRaces();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
}

async function deleteRace(id) {
  if (!confirm('Delete this race?')) return;
  try {
    const res = await fetch(`/api/races/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    toast('Race deleted');
    loadRaces();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
}

/* ============================================================
   RECIPES
   ============================================================ */
async function loadRecipes() {
  const grid = document.getElementById('recipes-grid');
  grid.innerHTML = `<div class="empty-state"><div class="big">⏳</div><p>Loading...</p></div>`;
  try {
    const res  = await fetch('/api/recipes', { credentials: 'include' });
    const data = await res.json();
    renderRecipes(Array.isArray(data) ? data : []);
  } catch {
    grid.innerHTML = `<div class="empty-state"><div class="big">⚠️</div><p>Failed to load recipes</p></div>`;
  }
}

function renderRecipes(recipes) {
  const grid = document.getElementById('recipes-grid');
  if (!recipes.length) {
    grid.innerHTML = `<div class="empty-state"><div class="big">🥗</div><p>No recipes yet — add one!</p></div>`;
    return;
  }
  grid.innerHTML = recipes.map(r => {
    const tags = (r.tags || []).map(t => `<span class="tag orange">${esc(t)}</span>`).join('');
    const ingr = (r.ingredients || []).slice(0, 4)
      .map(i => `<li>${esc(i.name)} — ${esc(i.amount)}</li>`).join('');
    const extra = r.ingredients && r.ingredients.length > 4
      ? `<li style="color:var(--accent)">+ ${r.ingredients.length - 4} more</li>` : '';
    return `
      <div class="card">
        <span class="card-title">${esc(r.name)}</span>
        <div class="stat-row">
          ${r.prepTime ? `<div class="stat"><span class="stat-val">${r.prepTime}</span><span class="stat-lbl">prep min</span></div>` : ''}
          ${r.cookTime ? `<div class="stat"><span class="stat-val">${r.cookTime}</span><span class="stat-lbl">cook min</span></div>` : ''}
          ${r.servings ? `<div class="stat"><span class="stat-val">${r.servings}</span><span class="stat-lbl">servings</span></div>` : ''}
          ${r.calories ? `<div class="stat"><span class="stat-val" style="font-size:1rem">${esc(r.calories)}</span><span class="stat-lbl">calories</span></div>` : ''}
        </div>
        ${r.ingredients && r.ingredients.length ? `<ul class="ingredient-list">${ingr}${extra}</ul>` : ''}
        ${tags ? `<div class="card-meta">${tags}</div>` : ''}
        ${r.comment ? `<div class="card-body">${esc(r.comment)}</div>` : ''}
        ${currentUser ? `
          <div class="card-footer">
            <button class="btn-edit" onclick="editRecipe(${JSON.stringify(r).replace(/"/g,'&quot;')})">Edit</button>
            <button class="btn-danger" onclick="deleteRecipe('${r._id}')">Delete</button>
          </div>` : ''}
      </div>
    `;
  }).join('');
}

function editRecipe(r) {
  document.getElementById('recipe-modal-title').textContent = 'EDIT RECIPE';
  document.getElementById('rec-id').value        = r._id;
  document.getElementById('rec-name').value      = r.name;
  document.getElementById('rec-servings').value  = r.servings || '';
  document.getElementById('rec-preptime').value  = r.prepTime || '';
  document.getElementById('rec-cooktime').value  = r.cookTime || '';
  document.getElementById('rec-calories').value  = r.calories || '';
  document.getElementById('rec-tags').value      = (r.tags || []).join(', ');
  document.getElementById('rec-ingredients').value =
    (r.ingredients || []).map(i => `${i.name}, ${i.amount}`).join('\n');
  document.getElementById('rec-directions').value = (r.directions || []).join('\n');
  document.getElementById('rec-comment').value   = r.comment || '';
  openModal('recipe-modal');
}

async function submitRecipe(e) {
  e.preventDefault();
  const id = document.getElementById('rec-id').value;

  const rawIngr = document.getElementById('rec-ingredients').value.trim();
  const ingredients = rawIngr.split('\n').filter(Boolean).map(line => {
    const parts = line.split(',');
    return { name: (parts[0] || '').trim(), amount: (parts[1] || '').trim() };
  }).filter(i => i.name);

  const directions = document.getElementById('rec-directions').value.trim()
    .split('\n').map(l => l.trim()).filter(Boolean);

  const tagsRaw = document.getElementById('rec-tags').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  const body = {
    name:        document.getElementById('rec-name').value.trim(),
    servings:    +document.getElementById('rec-servings').value || undefined,
    prepTime:    +document.getElementById('rec-preptime').value || undefined,
    cookTime:    +document.getElementById('rec-cooktime').value || undefined,
    calories:    document.getElementById('rec-calories').value.trim() || undefined,
    tags,
    ingredients,
    directions,
    comment:     document.getElementById('rec-comment').value.trim() || undefined,
  };

  const url    = id ? `/api/recipes/${id}` : '/api/recipes';
  const method = id ? 'PUT' : 'POST';
  try {
    const res = await fetch(url, {
      method, credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    closeModal('recipe-modal');
    toast(id ? 'Recipe updated!' : 'Recipe added!');
    loadRecipes();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
}

async function deleteRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  try {
    const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE', credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    toast('Recipe deleted');
    loadRecipes();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  }
}

/* ── XSS helper ─────────────────────────────────────────────── */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Wire new-item buttons ──────────────────────────────────── */
document.querySelector('#section-workouts .btn-primary')
  .addEventListener('click', openNewWorkout);

document.querySelector('#section-races .btn-primary')
  .addEventListener('click', () => {
    document.getElementById('race-modal-title').textContent = 'NEW RACE';
    document.getElementById('race-form').reset();
    document.getElementById('race-id').value = '';
    openModal('race-modal');
  });

document.querySelector('#section-recipes .btn-primary')
  .addEventListener('click', () => {
    document.getElementById('recipe-modal-title').textContent = 'NEW RECIPE';
    document.getElementById('recipe-form').reset();
    document.getElementById('rec-id').value = '';
    openModal('recipe-modal');
  });

/* ── Go ─────────────────────────────────────────────────────── */
init();
