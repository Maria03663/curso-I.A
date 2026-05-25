// ============ SISTEMA DE EXAMEN TEMPORIZADO ============
// 1 minuto por pregunta, formato ABCD, corrección automática

const EXAM_KEY = 'ia_exam_results';

function getExamResults() {
    return JSON.parse(localStorage.getItem(EXAM_KEY) || '{}');
}

function saveExamResult(examId, score, total, answered) {
    const results = getExamResults();
    results[examId] = { score, total, answered, date: new Date().toISOString() };
    localStorage.setItem(EXAM_KEY, JSON.stringify(results));
}

function getExamStatus(examId) {
    const r = getExamResults()[examId];
    if (!r) return null;
    return r;
}

function initTimedExam(containerId, questions, timePerQuestionSeconds, examName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let currentQ = 0;
    let answers = new Array(questions.length).fill(null);
    let timerInterval = null;
    let timeLeft = timePerQuestionSeconds;

    const existing = getExamStatus(examName || containerId);
    if (existing) {
        container.innerHTML = `
            <div style="text-align:center;padding:30px">
                <i class="fa-solid fa-circle-check" style="font-size:3rem;color:var(--green);margin-bottom:12px;display:block"></i>
                <h3 style="color:#fff;margin-bottom:8px">Examen completado</h3>
                <p style="color:var(--text-secondary);font-size:.9rem">Puntaje: ${existing.score}/${existing.total} (${Math.round(existing.score/existing.total*100)}%)</p>
                <p style="color:var(--text-muted);font-size:.8rem;margin-top:4px">${existing.answered} preguntas respondidas</p>
                <button onclick="resetExam('${containerId}', ${JSON.stringify(questions).replace(/"/g,'&quot;')}, ${timePerQuestionSeconds}, '${examName || containerId}')" style="margin-top:16px;padding:10px 24px;background:var(--purple);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600">Reintentar examen</button>
            </div>
        `;
        return;
    }

    function renderQuestion() {
        const q = questions[currentQ];
        const totalSec = timePerQuestionSeconds;
        const min = Math.floor(timeLeft / 60);
        const seg = timeLeft % 60;

        container.innerHTML = `
            <div class="exam-progress" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                <span style="font-size:.82rem;color:var(--text-secondary)">Pregunta <strong style="color:#fff">${currentQ+1}/${questions.length}</strong></span>
                <span class="exam-timer ${timeLeft <= 10 ? 'exam-timer-critical' : ''}" id="examTimerDisplay" style="font-size:.9rem;font-weight:700;color:var(--green);padding:4px 12px;border-radius:8px;background:rgba(152,202,63,0.08);border:1px solid rgba(152,202,63,0.2);transition:all .3s">
                    <i class="fa-regular fa-clock"></i> ${min}:${String(seg).padStart(2,'0')}
                </span>
            </div>
            <div class="progress-bar-wrap" style="height:4px;background:rgba(255,255,255,0.04);border-radius:99px;overflow:hidden;margin-bottom:20px">
                <div style="height:100%;width:${((currentQ+1)/questions.length)*100}%;background:linear-gradient(90deg,var(--green),var(--purple));border-radius:99px;transition:width .4s ease"></div>
            </div>
            <div class="exam-question-text" style="font-weight:600;color:#fff;font-size:1.02rem;margin-bottom:18px;line-height:1.6">
                ${currentQ+1}. ${q.text}
            </div>
            <div class="exam-options" style="display:flex;flex-direction:column;gap:8px">
                ${q.options.map((opt, i) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const selectedClass = answers[currentQ] === i ? 'exam-option-selected' : '';
                    return `
                        <div class="exam-option-single ${selectedClass}" data-opt-index="${i}" onclick="selectExamOption(${currentQ}, ${i}, '${containerId}')" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:${answers[currentQ] === i ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)'};border:1px solid ${answers[currentQ] === i ? 'rgba(139,92,246,0.4)' : 'var(--border)'};border-radius:10px;cursor:pointer;transition:all .2s;font-size:.9rem;color:var(--text-secondary)">
                            <span style="width:28px;height:28px;border-radius:50%;background:${answers[currentQ] === i ? 'var(--purple)' : 'rgba(255,255,255,0.04)'};color:${answers[currentQ] === i ? '#fff' : 'var(--text-muted)'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;flex-shrink:0;border:1px solid ${answers[currentQ] === i ? 'var(--purple)' : 'var(--border)'}">${letters[i]}</span>
                            <span>${opt}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:12px;flex-wrap:wrap">
                <div style="display:flex;gap:8px">
                    ${currentQ > 0 ? `<button onclick="navigateExam(${currentQ-1}, '${containerId}')" style="padding:8px 18px;background:rgba(255,255,255,0.04);color:var(--text-secondary);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:600;font-size:.82rem;font-family:'Inter',sans-serif;transition:all .2s">← Anterior</button>` : ''}
                    ${currentQ < questions.length - 1 
                        ? `<button onclick="navigateExam(${currentQ+1}, '${containerId}')" style="padding:8px 18px;background:var(--purple);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.82rem;font-family:'Inter',sans-serif;transition:all .2s">Siguiente →</button>`
                        : `<button onclick="finishExam('${containerId}')" style="padding:8px 24px;background:var(--green);color:#0a0a0f;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:.82rem;font-family:'Inter',sans-serif;transition:all .2s;box-shadow:0 0 16px rgba(152,202,63,0.3)">Finalizar examen ✓</button>`
                    }
                </div>
                <span style="font-size:.75rem;color:var(--text-muted)">
                    ${answers.filter(a => a !== null).length} de ${questions.length} respondidas
                </span>
            </div>
            <div id="exam-feedback-${currentQ}" style="margin-top:12px;font-size:.82rem;display:none"></div>
        `;
    }

    if (window.examTimers === undefined) window.examTimers = {};
    if (window.examQuestions === undefined) window.examQuestions = {};
    window.examQuestions[containerId] = questions;

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            const timerEl = document.querySelector(`#${containerId} #examTimerDisplay`);
            if (timerEl) {
                const min = Math.floor(timeLeft / 60);
                const seg = timeLeft % 60;
                timerEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${min}:${String(seg).padStart(2,'0')}`;
                if (timeLeft <= 10) {
                    timerEl.style.color = '#EF4444';
                    timerEl.style.background = 'rgba(239,68,68,0.08)';
                    timerEl.style.borderColor = 'rgba(239,68,68,0.3)';
                }
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if (currentQ < questions.length - 1) {
                    currentQ++;
                    timeLeft = timePerQuestionSeconds;
                    renderQuestion();
                    startTimer();
                } else {
                    finishExam(containerId);
                }
            }
        }, 1000);
    }

    renderQuestion();
    startTimer();

    window[`finishExam_${containerId}`] = function() {
        finishExam(containerId);
    };

    window[`selectExamOption_${containerId}`] = function(qIdx, optIdx) {
        selectExamOption(qIdx, optIdx, containerId);
    };

    window[`navigateExam_${containerId}`] = function(newQ) {
        navigateExam(newQ, containerId);
    };
}

function selectExamOption(qIdx, optIdx, containerId) {
    const container = document.getElementById(containerId);
    const questions = window.examQuestions[containerId];
    if (!questions) return;

    const existing = getExamResults()[containerId];
    if (existing) return;

    window.examCurrentAnswers = window.examCurrentAnswers || {};
    window.examCurrentAnswers[containerId] = window.examCurrentAnswers[containerId] || new Array(questions.length).fill(null);
    window.examCurrentAnswers[containerId][qIdx] = optIdx;

    const allOptions = container.querySelectorAll('.exam-option-single');
    allOptions.forEach((el, idx) => {
        const optIndex = parseInt(el.dataset.optIndex);
        if (optIndex === optIdx) {
            el.style.background = 'rgba(139,92,246,0.08)';
            el.style.borderColor = 'rgba(139,92,246,0.4)';
            const letterSpan = el.querySelector('span:first-child');
            if (letterSpan) {
                letterSpan.style.background = 'var(--purple)';
                letterSpan.style.color = '#fff';
                letterSpan.style.borderColor = 'var(--purple)';
            }
        } else if (parseInt(el.dataset.optIndex) === window.examCurrentAnswers[containerId][idx]) {
            // keep previous selection
        } else {
            el.style.background = 'rgba(255,255,255,0.02)';
            el.style.borderColor = 'var(--border)';
            const letterSpan = el.querySelector('span:first-child');
            if (letterSpan) {
                letterSpan.style.background = 'rgba(255,255,255,0.04)';
                letterSpan.style.color = 'var(--text-muted)';
                letterSpan.style.borderColor = 'var(--border)';
            }
        }
    });

    const answeredCount = window.examCurrentAnswers[containerId].filter(a => a !== null).length;
    const statusSpan = container.querySelector('[style*="font-size:.75rem"]');
    if (statusSpan) {
        statusSpan.textContent = `${answeredCount} de ${questions.length} respondidas`;
    }
}

function navigateExam(newQ, containerId) {
    const container = document.getElementById(containerId);
    const questions = window.examQuestions[containerId];
    if (!questions) return;

    const existing = getExamResults()[containerId];
    if (existing) return;

    const answers = window.examCurrentAnswers?.[containerId] || new Array(questions.length).fill(null);

    window.examCurrentQ = window.examCurrentQ || {};
    window.examCurrentQ[containerId] = newQ;

    const q = questions[newQ];
    const totalSec = 60;
    const timeLeft = 60;

    const min = Math.floor(timeLeft / 60);
    const seg = timeLeft % 60;

    container.innerHTML = `
        <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <span style="font-size:.82rem;color:var(--text-secondary)">Pregunta <strong style="color:#fff">${newQ+1}/${questions.length}</strong></span>
            <span style="font-size:.9rem;font-weight:700;color:var(--green);padding:4px 12px;border-radius:8px;background:rgba(152,202,63,0.08);border:1px solid rgba(152,202,63,0.2)">
                <i class="fa-regular fa-clock"></i> ${min}:${String(seg).padStart(2,'0')}
            </span>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.04);border-radius:99px;overflow:hidden;margin-bottom:20px">
            <div style="height:100%;width:${((newQ+1)/questions.length)*100}%;background:linear-gradient(90deg,var(--green),var(--purple));border-radius:99px;transition:width .4s ease"></div>
        </div>
        <div style="font-weight:600;color:#fff;font-size:1.02rem;margin-bottom:18px;line-height:1.6">
            ${newQ+1}. ${q.text}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
            ${q.options.map((opt, i) => {
                const letters = ['A', 'B', 'C', 'D'];
                const selected = answers[newQ] === i;
                return `
                    <div onclick="selectExamOption(${newQ}, ${i}, '${containerId}')" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:${selected ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)'};border:1px solid ${selected ? 'rgba(139,92,246,0.4)' : 'var(--border)'};border-radius:10px;cursor:pointer;transition:all .2s;font-size:.9rem;color:var(--text-secondary)">
                        <span style="width:28px;height:28px;border-radius:50%;background:${selected ? 'var(--purple)' : 'rgba(255,255,255,0.04)'};color:${selected ? '#fff' : 'var(--text-muted)'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;flex-shrink:0;border:1px solid ${selected ? 'var(--purple)' : 'var(--border)'}">${letters[i]}</span>
                        <span>${opt}</span>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:12px;flex-wrap:wrap">
            <div style="display:flex;gap:8px">
                ${newQ > 0 ? `<button onclick="navigateExam(${newQ-1}, '${containerId}')" style="padding:8px 18px;background:rgba(255,255,255,0.04);color:var(--text-secondary);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:600;font-size:.82rem;font-family:'Inter',sans-serif">← Anterior</button>` : ''}
                ${newQ < questions.length - 1 
                    ? `<button onclick="navigateExam(${newQ+1}, '${containerId}')" style="padding:8px 18px;background:var(--purple);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.82rem;font-family:'Inter',sans-serif">Siguiente →</button>`
                    : `<button onclick="finishExam('${containerId}')" style="padding:8px 24px;background:var(--green);color:#0a0a0f;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:.82rem;font-family:'Inter',sans-serif;box-shadow:0 0 16px rgba(152,202,63,0.3)">Finalizar examen ✓</button>`
                }
            </div>
            <span style="font-size:.75rem;color:var(--text-muted)">
                ${answers.filter(a => a !== null).length} de ${questions.length} respondidas
            </span>
        </div>
    `;
}

function finishExam(containerId) {
    const questions = window.examQuestions[containerId];
    if (!questions) return;

    const answers = window.examCurrentAnswers?.[containerId] || new Array(questions.length).fill(null);
    clearInterval(window.examTimers?.[containerId]);

    let correct = 0;
    let answered = 0;
    const results = questions.map((q, i) => {
        const userAns = answers[i];
        const isCorrect = userAns === q.correct;
        if (userAns !== null) {
            answered++;
            if (isCorrect) correct++;
        }
        return { userAnswer: userAns, isCorrect };
    });

    saveExamResult(containerId, correct, questions.length, answered);
    showExamResult(containerId, questions, results, correct, answered);
}

function showExamResult(containerId, questions, results, correct, answered) {
    const container = document.getElementById(containerId);
    const pct = Math.round((correct / questions.length) * 100);
    let gradeClass = 'exam-grade-fail';
    let gradeText = '❌ Necesitas mejorar';
    if (pct >= 80) { gradeClass = 'exam-grade-excellent'; gradeText = '🏆 ¡Excelente!'; }
    else if (pct >= 60) { gradeClass = 'exam-grade-good'; gradeText = '👍 Bien, sigue practicando'; }

    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
        <div style="text-align:center;padding:10px 0 20px">
            <div style="font-size:3rem;margin-bottom:8px">${pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
            <h3 style="color:#fff;font-size:1.4rem;margin-bottom:4px">${gradeText}</h3>
            <div style="font-size:2.5rem;font-weight:800;font-family:'Syne',sans-serif;color:${pct >= 80 ? 'var(--green)' : pct >= 60 ? '#F59E0B' : '#EF4444'};margin:8px 0">
                ${correct}/${questions.length}
            </div>
            <p style="color:var(--text-secondary);font-size:.9rem">${Math.round(pct)}% correcto · ${answered} de ${questions.length} respondidas</p>
        </div>
        <div style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px">
            ${questions.map((q, i) => {
                const r = results[i];
                const isCorrect = r.isCorrect;
                const userAns = r.userAnswer;
                return `
                    <div style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;gap:12px;align-items:flex-start">
                        <span style="width:28px;height:28px;border-radius:50%;background:${isCorrect ? 'rgba(152,202,63,0.12)' : 'rgba(239,68,68,0.12)'};color:${isCorrect ? 'var(--green)' : '#EF4444'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.7rem">
                            ${isCorrect ? '✓' : '✗'}
                        </span>
                        <div style="flex:1;min-width:0">
                            <p style="font-size:.82rem;color:#fff;font-weight:600;margin-bottom:4px">${i+1}. ${q.text}</p>
                            <p style="font-size:.75rem;color:var(--text-muted)">
                                ${userAns !== null 
                                    ? `Tu respuesta: <span style="color:${isCorrect ? 'var(--green)' : '#EF4444'}">${letters[userAns]}. ${q.options[userAns]}</span>`
                                    : `<span style="color:#EF4444">No respondida</span>`
                                }
                                ${!isCorrect ? ` · <span style="color:var(--green)">Correcta: ${letters[q.correct]}. ${q.options[q.correct]}</span>` : ''}
                            </p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
            <button onclick="resetExam('${containerId}', ${JSON.stringify(questions).replace(/"/g,'&quot;')}, 60, '${containerId}')" style="padding:10px 24px;background:var(--purple);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-family:'Inter',sans-serif;font-size:.85rem">Reintentar examen</button>
        </div>
    `;
}

function resetExam(containerId, questions, timePerQuestionSeconds, examName) {
    localStorage.removeItem(EXAM_KEY);
    const key = examName || containerId;
    const stored = getExamResults();
    delete stored[key];
    localStorage.setItem(EXAM_KEY, JSON.stringify(stored));
    if (window.examCurrentAnswers) {
        delete window.examCurrentAnswers[containerId];
    }
    if (window.examCurrentQ) {
        delete window.examCurrentQ[containerId];
    }
    initTimedExam(containerId, questions, timePerQuestionSeconds, examName);
}
