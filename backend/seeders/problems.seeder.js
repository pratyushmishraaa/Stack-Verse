import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/problem.model.js';

dotenv.config({ path: './env/.env' });

const problems = [
  // ─── EASY ───────────────────────────────────────────────────────────────────
  {
    title: "Build a Digital Clock",
    difficulty: "beginner",
    category: "frontend",
    tags: ["html", "css", "javascript", "dom", "setInterval"],
    description: `Build a live digital clock that shows the current time and updates every second.

This is a great beginner project to get comfortable with the DOM, JavaScript's Date object, and timers.

You are free to use plain HTML/CSS/JS or any approach you prefer inside the editor tabs.

What it should do:
- Display the current hours, minutes, and seconds
- Update in real time every second
- Show AM / PM indicator
- Look clean and readable`,
    requirements: [
      "Display current time (HH:MM:SS format)",
      "Update every second using setInterval",
      "Show AM/PM indicator",
      "Style it so it looks like a real clock"
    ],
    resources: [
      { label: "Date Object – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date" },
      { label: "setInterval – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/setInterval" }
    ],
    starterCode: {
      html: `<div class="clock-wrapper">
  <div class="clock">
    <span id="hours">00</span>
    <span class="sep">:</span>
    <span id="minutes">00</span>
    <span class="sep">:</span>
    <span id="seconds">00</span>
    <span id="ampm">AM</span>
  </div>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f1a;
  font-family: 'Courier New', monospace;
}

.clock-wrapper {
  padding: 40px 60px;
  background: #1a1a2e;
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.3);
}

.clock {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 72px;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: 4px;
}

.sep {
  color: #6366f1;
  animation: blink 1s step-end infinite;
}

#ampm {
  font-size: 24px;
  color: #818cf8;
  margin-left: 12px;
  align-self: flex-end;
  margin-bottom: 10px;
}

@keyframes blink {
  50% { opacity: 0; }
}`,
      javascript: `function updateClock() {
  const now = new Date();

  let h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';

  h = h % 12 || 12; // convert to 12-hour format

  document.getElementById('hours').textContent   = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  document.getElementById('ampm').textContent    = ampm;
}

updateClock();
setInterval(updateClock, 1000);`
    }
  },

  // ─── MEDIUM ─────────────────────────────────────────────────────────────────
  {
    title: "Build a Expense Tracker",
    difficulty: "intermediate",
    category: "frontend",
    tags: ["html", "css", "javascript", "localstorage", "dom", "charts"],
    description: `Build a personal expense tracker where users can log income and expenses, see their balance, and visualise spending by category.

You are free to use plain HTML/CSS/JS or bring in a CDN library (e.g. Chart.js via a script tag in the HTML panel).

What it should do:
- Let the user add a transaction (description, amount, type: income / expense, category)
- Show a running balance at the top (total income − total expenses)
- List all transactions with the ability to delete any entry
- Persist data in localStorage so it survives a page refresh
- Show a simple breakdown of spending per category (a bar or pie chart, or even a plain list with percentages)`,
    requirements: [
      "Add transactions with description, amount, type and category",
      "Calculate and display live balance, total income, total expenses",
      "Delete individual transactions",
      "Persist all data in localStorage",
      "Show spending breakdown by category",
      "Validate input (no empty fields, amount must be a positive number)"
    ],
    resources: [
      { label: "localStorage – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
      { label: "Chart.js CDN", url: "https://www.chartjs.org/docs/latest/getting-started/installation.html" },
      { label: "Array reduce – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" }
    ],
    starterCode: {
      html: `<!-- Chart.js loaded from CDN – feel free to use it -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div class="app">
  <header>
    <h1>Expense Tracker</h1>
    <div class="summary">
      <div class="card balance">
        <p>Balance</p>
        <h2 id="balance">₹0.00</h2>
      </div>
      <div class="card income">
        <p>Income</p>
        <h3 id="total-income">₹0.00</h3>
      </div>
      <div class="card expense">
        <p>Expenses</p>
        <h3 id="total-expense">₹0.00</h3>
      </div>
    </div>
  </header>

  <main>
    <section class="form-section">
      <h2>Add Transaction</h2>
      <form id="txn-form">
        <input type="text"   id="desc"     placeholder="Description"  required />
        <input type="number" id="amount"   placeholder="Amount"       min="0.01" step="0.01" required />
        <select id="type">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select id="category">
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
          <option value="salary">Salary</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Add</button>
      </form>
    </section>

    <section class="list-section">
      <h2>Transactions</h2>
      <ul id="txn-list"></ul>
    </section>

    <section class="chart-section">
      <h2>Spending by Category</h2>
      <canvas id="chart" width="300" height="300"></canvas>
    </section>
  </main>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f0f4f8;
  color: #1e293b;
  padding: 20px;
}

.app { max-width: 900px; margin: 0 auto; }

h1 { font-size: 28px; margin-bottom: 20px; color: #0f172a; }
h2 { font-size: 18px; margin-bottom: 14px; color: #334155; }

/* Summary cards */
.summary {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.card {
  flex: 1;
  min-width: 140px;
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.card p { font-size: 13px; color: #64748b; margin-bottom: 6px; }
.balance h2 { font-size: 28px; color: #0f172a; }
.income  h3 { color: #16a34a; font-size: 22px; }
.expense h3 { color: #dc2626; font-size: 22px; }

/* Layout */
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}
.form-section, .list-section, .chart-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.chart-section { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; }

/* Form */
form { display: flex; flex-direction: column; gap: 10px; }
input, select {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}
input:focus, select:focus { border-color: #6366f1; }
button {
  padding: 10px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover { background: #4f46e5; }

/* Transaction list */
#txn-list { list-style: none; display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.txn-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f8fafc;
  border-left: 4px solid #e2e8f0;
  font-size: 14px;
}
.txn-item.income  { border-left-color: #16a34a; }
.txn-item.expense { border-left-color: #dc2626; }
.txn-item .amount { font-weight: 700; }
.txn-item.income  .amount { color: #16a34a; }
.txn-item.expense .amount { color: #dc2626; }
.txn-item .del-btn {
  background: none;
  color: #94a3b8;
  font-size: 16px;
  padding: 2px 6px;
  border-radius: 4px;
}
.txn-item .del-btn:hover { color: #dc2626; background: #fee2e2; }`,
      javascript: `let transactions = JSON.parse(localStorage.getItem('txns')) || [];
let chart = null;

const form       = document.getElementById('txn-form');
const list       = document.getElementById('txn-list');
const balanceEl  = document.getElementById('balance');
const incomeEl   = document.getElementById('total-income');
const expenseEl  = document.getElementById('total-expense');

function save() {
  localStorage.setItem('txns', JSON.stringify(transactions));
}

function fmt(n) {
  return '₹' + Math.abs(n).toFixed(2);
}

function render() {
  // Summary
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  balanceEl.textContent = fmt(balance);
  balanceEl.style.color = balance >= 0 ? '#16a34a' : '#dc2626';
  incomeEl.textContent  = fmt(income);
  expenseEl.textContent = fmt(expense);

  // List
  list.innerHTML = '';
  [...transactions].reverse().forEach(t => {
    const li = document.createElement('li');
    li.className = 'txn-item ' + t.type;
    li.innerHTML = \`
      <div>
        <strong>\${t.desc}</strong>
        <span style="color:#94a3b8;font-size:12px;margin-left:8px">\${t.category}</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="amount">\${t.type === 'income' ? '+' : '-'}\${fmt(t.amount)}</span>
        <button class="del-btn" onclick="remove('\${t.id}')">✕</button>
      </div>\`;
    list.appendChild(li);
  });

  // Chart
  const expenses = transactions.filter(t => t.type === 'expense');
  const cats = {};
  expenses.forEach(t => { cats[t.category] = (cats[t.category] || 0) + t.amount; });

  const labels = Object.keys(cats);
  const data   = Object.values(cats);
  const colors = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6'];

  if (chart) chart.destroy();
  if (labels.length) {
    chart = new Chart(document.getElementById('chart'), {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors }] },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  }
}

function remove(id) {
  transactions = transactions.filter(t => t.id !== id);
  save(); render();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const desc     = document.getElementById('desc').value.trim();
  const amount   = parseFloat(document.getElementById('amount').value);
  const type     = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  if (!desc || isNaN(amount) || amount <= 0) return;

  transactions.push({ id: Date.now().toString(), desc, amount, type, category });
  save(); render();
  form.reset();
});

render();`
    }
  },

  // ─── HARD ────────────────────────────────────────────────────────────────────
  {
    title: "Build a Kanban Board",
    difficulty: "advanced",
    category: "frontend",
    tags: ["html", "css", "javascript", "drag-and-drop", "localstorage", "ui"],
    description: `Build a fully functional Kanban board — like Trello — with drag-and-drop support, multiple columns, and persistent state.

You are free to use plain HTML/CSS/JS or any CDN library you like (e.g. SortableJS via a script tag).

What it should do:
- Three default columns: To Do, In Progress, Done
- Add a new card to any column via an inline form
- Edit a card's title by double-clicking it
- Delete a card with a ✕ button
- Drag cards between columns (and reorder within a column)
- Add and rename custom columns
- Delete an empty column
- Persist the entire board state in localStorage`,
    requirements: [
      "Render at least 3 columns (To Do / In Progress / Done)",
      "Add cards to any column with a title",
      "Edit card title inline (double-click)",
      "Delete individual cards",
      "Drag-and-drop cards between columns",
      "Add new custom columns",
      "Delete empty columns",
      "Persist full board state in localStorage"
    ],
    resources: [
      { label: "HTML Drag and Drop API – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API" },
      { label: "SortableJS (CDN)", url: "https://sortablejs.github.io/Sortable/" },
      { label: "localStorage – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" }
    ],
    starterCode: {
      html: `<!-- SortableJS for smooth drag-and-drop – feel free to use it -->
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>

<div class="app">
  <header>
    <h1>Kanban Board</h1>
    <button id="add-col-btn">+ Add Column</button>
  </header>
  <div class="board" id="board"></div>
</div>`,
      css: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  padding: 24px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
h1 { font-size: 26px; color: #f1f5f9; }

#add-col-btn {
  padding: 8px 18px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
#add-col-btn:hover { background: #4f46e5; }

/* Board */
.board {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 20px;
}

/* Column */
.column {
  background: #1e293b;
  border-radius: 14px;
  padding: 16px;
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
}
.col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.col-title {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  flex: 1;
  background: transparent;
  outline: none;
}
.col-title:focus { border-color: #6366f1; background: #0f172a; }
.del-col-btn {
  background: none;
  border: none;
  color: #475569;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.2s;
}
.del-col-btn:hover { color: #ef4444; }

/* Cards */
.cards { min-height: 40px; display: flex; flex-direction: column; gap: 10px; }

.card {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: #cbd5e1;
  cursor: grab;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.card:hover { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
.card.sortable-ghost { opacity: 0.3; }

.card-title {
  flex: 1;
  outline: none;
  background: transparent;
  border: none;
  color: inherit;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  cursor: pointer;
}
.card-title:focus { cursor: text; }

.del-card-btn {
  background: none;
  border: none;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  padding: 0 2px;
  flex-shrink: 0;
  transition: color 0.2s;
}
.del-card-btn:hover { color: #ef4444; }

/* Add card form */
.add-card-form { margin-top: 12px; }
.add-card-input {
  width: 100%;
  padding: 8px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 13px;
  outline: none;
  margin-bottom: 8px;
}
.add-card-input:focus { border-color: #6366f1; }
.add-card-actions { display: flex; gap: 8px; }
.btn-add-card {
  padding: 6px 14px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.btn-cancel {
  padding: 6px 14px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
.open-form-btn {
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  background: transparent;
  border: 1px dashed #334155;
  border-radius: 8px;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.open-form-btn:hover { border-color: #6366f1; color: #a5b4fc; }`,
      javascript: `// ── State ──────────────────────────────────────────────────────────────────
let board = JSON.parse(localStorage.getItem('kanban')) || {
  columns: [
    { id: 'col-1', title: 'To Do',       cards: [{ id: 'c1', text: 'Design homepage mockup' }, { id: 'c2', text: 'Write project README' }] },
    { id: 'col-2', title: 'In Progress', cards: [{ id: 'c3', text: 'Build navigation component' }] },
    { id: 'col-3', title: 'Done',        cards: [{ id: 'c4', text: 'Set up project repo' }] }
  ]
};

function save() { localStorage.setItem('kanban', JSON.stringify(board)); }
function uid()  { return 'id-' + Math.random().toString(36).slice(2, 9); }

// ── Render ──────────────────────────────────────────────────────────────────
function render() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';

  board.columns.forEach(col => {
    const colEl = document.createElement('div');
    colEl.className = 'column';
    colEl.dataset.id = col.id;

    colEl.innerHTML = \`
      <div class="col-header">
        <input class="col-title" value="\${col.title}" data-col="\${col.id}" />
        <button class="del-col-btn" data-col="\${col.id}" title="Delete column">✕</button>
      </div>
      <div class="cards" id="cards-\${col.id}"></div>
      <button class="open-form-btn" data-col="\${col.id}">+ Add a card</button>
      <div class="add-card-form" id="form-\${col.id}" style="display:none">
        <textarea class="add-card-input" placeholder="Card title..." rows="2"></textarea>
        <div class="add-card-actions">
          <button class="btn-add-card" data-col="\${col.id}">Add</button>
          <button class="btn-cancel"   data-col="\${col.id}">Cancel</button>
        </div>
      </div>\`;

    // Render cards
    const cardsEl = colEl.querySelector('.cards');
    col.cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.dataset.id = card.id;
      cardEl.draggable = true;
      cardEl.innerHTML = \`
        <textarea class="card-title" rows="1" data-card="\${card.id}">\${card.text}</textarea>
        <button class="del-card-btn" data-card="\${card.id}">✕</button>\`;
      cardsEl.appendChild(cardEl);
    });

    boardEl.appendChild(colEl);

    // SortableJS on each column's card list
    Sortable.create(cardsEl, {
      group: 'cards',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onEnd(evt) {
        const cardId  = evt.item.dataset.id;
        const fromId  = evt.from.closest('.column').dataset.id;
        const toId    = evt.to.closest('.column').dataset.id;
        const newIdx  = evt.newIndex;

        const fromCol = board.columns.find(c => c.id === fromId);
        const toCol   = board.columns.find(c => c.id === toId);
        const cardIdx = fromCol.cards.findIndex(c => c.id === cardId);
        const [card]  = fromCol.cards.splice(cardIdx, 1);
        toCol.cards.splice(newIdx, 0, card);
        save();
      }
    });
  });

  bindEvents();
}

// ── Events ──────────────────────────────────────────────────────────────────
function bindEvents() {
  // Rename column
  document.querySelectorAll('.col-title').forEach(input => {
    input.addEventListener('change', e => {
      const col = board.columns.find(c => c.id === e.target.dataset.col);
      if (col) { col.title = e.target.value; save(); }
    });
  });

  // Delete column
  document.querySelectorAll('.del-col-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const colId = e.target.dataset.col;
      const col   = board.columns.find(c => c.id === colId);
      if (col.cards.length && !confirm('Delete this column and all its cards?')) return;
      board.columns = board.columns.filter(c => c.id !== colId);
      save(); render();
    });
  });

  // Open add-card form
  document.querySelectorAll('.open-form-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const colId = e.target.dataset.col;
      document.getElementById('form-' + colId).style.display = 'block';
      e.target.style.display = 'none';
      document.querySelector(\`#form-\${colId} .add-card-input\`).focus();
    });
  });

  // Add card
  document.querySelectorAll('.btn-add-card').forEach(btn => {
    btn.addEventListener('click', e => {
      const colId = e.target.dataset.col;
      const input = document.querySelector(\`#form-\${colId} .add-card-input\`);
      const text  = input.value.trim();
      if (!text) return;
      const col = board.columns.find(c => c.id === colId);
      col.cards.push({ id: uid(), text });
      save(); render();
    });
  });

  // Cancel add-card
  document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', e => {
      const colId = e.target.dataset.col;
      document.getElementById('form-' + colId).style.display = 'none';
      document.querySelector(\`.open-form-btn[data-col="\${colId}"]\`).style.display = 'block';
    });
  });

  // Edit card (textarea auto-save on blur)
  document.querySelectorAll('.card-title').forEach(ta => {
    ta.addEventListener('blur', e => {
      const cardId = e.target.dataset.card;
      board.columns.forEach(col => {
        const card = col.cards.find(c => c.id === cardId);
        if (card) card.text = e.target.value.trim() || card.text;
      });
      save();
    });
    // Auto-resize
    ta.addEventListener('input', e => {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    });
  });

  // Delete card
  document.querySelectorAll('.del-card-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const cardId = e.target.dataset.card;
      board.columns.forEach(col => {
        col.cards = col.cards.filter(c => c.id !== cardId);
      });
      save(); render();
    });
  });
}

// Add column
document.getElementById('add-col-btn').addEventListener('click', () => {
  board.columns.push({ id: uid(), title: 'New Column', cards: [] });
  save(); render();
});

render();`
    }
  }
];

async function seedProblems() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    const inserted = await Problem.insertMany(problems);
    console.log(`Seeded ${inserted.length} problems:`);
    inserted.forEach((p, i) =>
      console.log(`  ${i + 1}. [${p.difficulty.toUpperCase()}] ${p.title}`)
    );

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedProblems();
