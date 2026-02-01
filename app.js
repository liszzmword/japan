(function () {
  'use strict';

  let vocab = [];
  let deck = [];
  let currentMode = 'type'; // 'type' | 'choice'
  let currentIndex = 0;
  let correctCount = 0;
  let totalCount = 0;
  let currentChoices = []; // 4지선다용 [correctIndex, options array]

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function normalize(s) {
    return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getDisplayAnswer(word) {
    if (word.meaning_ko) return word.meaning_ko;
    return word.romaji || '';
  }

  function isAnswerCorrect(word, input) {
    const n = normalize(input);
    const romaji = normalize(word.romaji || '');
    const meaning = normalize(word.meaning_ko || '');
    return (romaji && n === romaji) || (meaning && n === meaning);
  }

  function buildDeck() {
    const count = Math.min(50, Math.max(5, parseInt($('#quizCount').value, 10) || 10));
    const shuffled = shuffle(vocab);
    deck = shuffled.slice(0, count);
    totalCount = deck.length;
    currentIndex = 0;
    correctCount = 0;
  }

  function showScreen(id) {
    $$('.start-screen, .quiz-screen, .result-screen').forEach((el) => el.classList.add('hidden'));
    const el = $(id);
    if (el) el.classList.remove('hidden');
  }

  function startQuiz() {
    currentMode = $('.mode-btn.selected')?.dataset.mode || 'type';
    buildDeck();
    if (deck.length === 0) {
      alert('단어가 없어요. data.js에 단어를 넣어 주세요.');
      return;
    }
    showScreen('#quizScreen');
    $('#typeMode').classList.toggle('hidden', currentMode !== 'type');
    $('#choiceMode').classList.toggle('hidden', currentMode !== 'choice');
    showQuestion();
  }

  function showQuestion() {
    const word = deck[currentIndex];
    $('#currentNum').textContent = currentIndex + 1;
    $('#totalNum').textContent = totalCount;
    $('#questionJp').textContent = word.jp;
    $('#feedback').classList.add('hidden');
    $('#nextBtn').classList.add('hidden');

    if (currentMode === 'type') {
      $('#answerInput').value = '';
      $('#answerInput').disabled = false;
      $('#checkBtn').disabled = false;
      $('#answerInput').focus();
    } else {
      buildChoices();
    }
  }

  function buildChoices() {
    const word = deck[currentIndex];
    const correctAnswer = getDisplayAnswer(word);
    const others = vocab
      .filter((w) => w !== word && getDisplayAnswer(w) !== correctAnswer)
      .map((w) => getDisplayAnswer(w));
    const uniqueOthers = [...new Set(others)];
    const wrongs = shuffle(uniqueOthers).slice(0, 3);
    const options = shuffle([correctAnswer, ...wrongs]);
    const correctIndex = options.indexOf(correctAnswer);
    currentChoices = [correctIndex, options];
    if (correctIndex < 0) currentChoices[0] = 0;

    const container = $('#choiceButtons');
    container.innerHTML = options
      .map(
        (text, i) =>
          `<button type="button" class="choice-btn" data-index="${i}">${escapeHtml(text)}</button>`
      )
      .join('');
    container.querySelectorAll('.choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => onChoiceClick(parseInt(btn.dataset.index, 10)));
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function onChoiceClick(clickedIndex) {
    const [correctIndex, options] = currentChoices;
    const buttons = $$('#choiceButtons .choice-btn');
    buttons.forEach((b) => (b.disabled = true));
    buttons[clickedIndex].classList.add(clickedIndex === correctIndex ? 'correct' : 'wrong');
    if (clickedIndex !== correctIndex) {
      buttons[correctIndex].classList.add('correct');
    }
    if (clickedIndex === correctIndex) correctCount++;
    $('#feedback').classList.remove('hidden');
    $('#feedback').textContent = clickedIndex === correctIndex ? '정답!' : '틀렸어요';
    $('#feedback').className = 'feedback ' + (clickedIndex === correctIndex ? 'correct' : 'wrong');
    $('#nextBtn').classList.remove('hidden');
    $('#nextBtn').focus();
  }

  function checkTypeAnswer() {
    const word = deck[currentIndex];
    const input = $('#answerInput').value;
    const correct = isAnswerCorrect(word, input);
    if (correct) correctCount++;
    $('#answerInput').disabled = true;
    $('#checkBtn').disabled = true;
    $('#feedback').classList.remove('hidden');
    $('#feedback').textContent = correct ? '정답!' : `틀렸어요. 정답: ${getDisplayAnswer(word)}`;
    $('#feedback').className = 'feedback ' + (correct ? 'correct' : 'wrong');
    $('#nextBtn').classList.remove('hidden');
    $('#nextBtn').focus();
  }

  function nextQuestion() {
    currentIndex++;
    if (currentIndex >= totalCount) {
      showResult();
      return;
    }
    showQuestion();
  }

  function showResult() {
    showScreen('#resultScreen');
    $('#scoreText').textContent = `${correctCount} / ${totalCount}`;
  }

  function bindEvents() {
    $$('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.mode-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    $('#startBtn').addEventListener('click', startQuiz);

    $('#checkBtn').addEventListener('click', checkTypeAnswer);

    $('#answerInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (!$('#nextBtn').classList.contains('hidden')) nextQuestion();
        else checkTypeAnswer();
      }
    });

    $('#nextBtn').addEventListener('click', nextQuestion);

    $('#retryBtn').addEventListener('click', () => showScreen('#startScreen'));
  }

  function init() {
    if (typeof window.VOCAB_DATA === 'object' && Array.isArray(window.VOCAB_DATA)) {
      vocab = window.VOCAB_DATA.filter((w) => w.jp);
    }
    if (vocab.length === 0) {
      console.warn('VOCAB_DATA가 비어 있어요. data.js를 확인해 주세요.');
    }
    $$('.mode-btn').forEach((b) => b.classList.remove('selected'));
    $('.mode-btn')?.classList.add('selected');
    bindEvents();
    showScreen('#startScreen');
  }

  init();
})();
