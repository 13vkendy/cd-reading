const questions = [
  {
    question: "What is CDI's focus?",
    options: ["Medicine", "Technology", "Digital Learning", "Music"],
    correct: 2
  },
  {
    question: "Why is this passage written?",
    options: ["To confuse", "For entertainment", "IELTS Practice", "News"],
    correct: 2
  }
];

function renderQuestions() {
  const container = document.getElementById("questions");
  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "mb-4";
    block.innerHTML = `
      <p class="font-semibold">${i + 1}. ${q.question}</p>
      ${q.options.map((opt, idx) => `
        <label class="block">
          <input type="radio" name="q${i}" value="${idx}"> ${opt}
        </label>
      `).join('')}
      <p id="result${i}" class="mt-1 font-medium"></p>
    `;
    container.appendChild(block);
  });
}

function checkAnswers() {
  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const result = document.getElementById(`result${i}`);
    if (selected) {
      if (parseInt(selected.value) === q.correct) {
        result.textContent = "✅ Correct";
        result.className = "text-green-600";
      } else {
        result.textContent = `❌ Incorrect. Answer: ${q.options[q.correct]}`;
        result.className = "text-red-600";
      }
    } else {
      result.textContent = "⚠️ No answer selected";
      result.className = "text-green-600";
    }
  });
}

renderQuestions();

const passage = document.getElementById('passage');
const toolbar = document.getElementById('toolbar');
const highlightBtn = document.getElementById('highlightBtn');
const removeBtn = document.getElementById('removeBtn');
const clearBtn = document.getElementById('clearBtn');

let currentRange = null;

// Toolbarni ko'rsatish
passage.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.toString().trim() === '') {
    toolbar.classList.add('hidden');
    return;
  }

  currentRange = selection.getRangeAt(0);
  const rect = currentRange.getBoundingClientRect();

  toolbar.style.top = `${rect.top + window.scrollY - 50}px`;
  toolbar.style.left = `${rect.left + rect.width / 2 - 70}px`;
  toolbar.classList.remove('hidden');
});

// Highlight qo'shish
highlightBtn.addEventListener('click', () => {
  if (!currentRange) return;
  const span = document.createElement('span');
  span.className = 'bg-green-300 px-0.5 rounded';
  currentRange.surroundContents(span);
  toolbar.classList.add('hidden');
  window.getSelection().removeAllRanges();
});

// Remove highlight
removeBtn.addEventListener('click', () => {
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const parent = selection.getRangeAt(0).commonAncestorContainer.parentNode;
    if (parent.tagName === 'SPAN' && parent.classList.contains('bg-green-300')) {
      parent.replaceWith(document.createTextNode(parent.textContent));
    }
  }
  toolbar.classList.add('hidden');
});

// Clear All
clearBtn.addEventListener('click', () => {
  const highlights = passage.querySelectorAll('span.bg-green-300');
  highlights.forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  toolbar.classList.add('hidden');
});
function showToolbar(e) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
    toolbar.style.display = 'none';
    return;
  }

  currentRange = selection.getRangeAt(0);

  // Toolbar joylashuvi (telefon va PC uchun)
  const rect = currentRange.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 10;
  const left = Math.max(10, Math.min(rect.left + rect.width / 2 - 70, window.innerWidth - 160));

  toolbar.style.top = `${top}px`;
  toolbar.style.left = `${left}px`;
  toolbar.style.display = 'flex';
}

// ✅ Kompyuter uchun
passage.addEventListener('mouseup', showToolbar);

// ✅ Telefon uchun (qo‘shimcha)
passage.addEventListener('touchend', showToolbar);

