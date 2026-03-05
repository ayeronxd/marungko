// Clear lesson badges from localStorage on hard reload/new session
if (!sessionStorage.getItem('marungko_session')) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.endsWith('_done') || key.endsWith('_wrong'))) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    sessionStorage.setItem('marungko_session', '1');
}

function showPage(pageId) {
    const currentScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(pageId);
    
    if (currentScreen === targetScreen) return;

    // Stop all audio when navigating between slides
    document.querySelectorAll('audio').forEach(a => { a.pause(); a.currentTime = 0; });

    // Handle fade transition
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    // Target the inner text elements for the reset
    const animElements = document.querySelectorAll('.pop-animation, .pop-delayed, .syllable-text, .letter-text, .letter-y-in-word, .first-letter-in-word, .blend-text, .grid-item');
    animElements.forEach(el => {
        el.classList.remove('pop-animation', 'pop-delayed');
        void el.offsetWidth;
    });

    targetScreen.classList.add('active');

    // Update completion badges when lesson menu is shown
    if (pageId === 'page11') updateNotebookBadges('page11');
    if (pageId === 'page14') updateNotebookBadges('page14');

    // Auto-play instruction audio when navigating to instruction slides
    if (pageId === 'page10') {
        const instrAudio = document.getElementById('instruction_audio');
        if (instrAudio) {
            instrAudio.currentTime = 0;
            setTimeout(() => instrAudio.play(), 400);
        }
    }
    if (pageId === 'page12') {
        const instrAudio2 = document.getElementById('instruction_audio2');
        if (instrAudio2) {
            instrAudio2.currentTime = 0;
            setTimeout(() => instrAudio2.play(), 400);
        }
    }
    if (pageId === 'page7') {
        const page7Audio = document.getElementById('page7_audio');
        if (page7Audio) {
            page7Audio.currentTime = 0;
            setTimeout(() => page7Audio.play(), 400);
        }
    }
    if (pageId === 'page8') {
        const page8Audio = document.getElementById('page8_audio');
        if (page8Audio) {
            page8Audio.currentTime = 0;
            setTimeout(() => page8Audio.play(), 400);
        }
    }
}

/**
 * Reads localStorage completion flags and adds/keeps green ✓ badges
 * on the notebook buttons for completed lessons.
 */
function updateNotebookBadges(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    page.querySelectorAll('.lesson-btn[data-lesson]').forEach(btn => {
        const key = btn.getAttribute('data-lesson');
        const isDone = localStorage.getItem(key + '_done') === '1';
        const isWrong = localStorage.getItem(key + '_wrong') === '1';

        // Remove existing badges before re-rendering
        btn.querySelectorAll('.nb-done-badge, .nb-wrong-badge').forEach(b => b.remove());

        if (isDone) {
            const badge = document.createElement('div');
            badge.className = 'nb-done-badge';
            badge.textContent = '✓';
            btn.appendChild(badge);
        } else if (isWrong) {
            const badge = document.createElement('div');
            badge.className = 'nb-wrong-badge';
            badge.textContent = '✕';
            btn.appendChild(badge);
        }
    });
}


function playAudio(audioId, textId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }

    const textEl = document.getElementById(textId);
    if (!textEl) return;

    if (textEl.classList.contains('word')) {
        // Word: pop first letter, then pop the whole word (letters only)
        const firstLetter = textEl.querySelector('.first-letter-in-word') || textEl.querySelector('.letter-y-in-word');
        const letters = textEl.querySelectorAll('.syllable-text');

        letters.forEach(el => {
            el.classList.remove('pop-animation', 'pop-delayed');
            void el.offsetWidth;
        });

        if (!firstLetter) {
            letters.forEach(el => el.classList.add('pop-animation'));
            return;
        }

        const onFirstLetterEnd = function () {
            firstLetter.removeEventListener('animationend', onFirstLetterEnd);

            let delay = 500;
            if (textId === 'targetWord3') {
                delay += 200; // yelo
            } else if (textId === 'targetWord4') {
                delay += 0; // yeso (no extra delay now)
            }

            setTimeout(() => {
                letters.forEach(el => {
                    el.classList.remove('pop-animation', 'pop-delayed');
                    void el.offsetWidth;
                    el.classList.add('pop-animation');
                });
            }, delay);
        };

        firstLetter.addEventListener('animationend', onFirstLetterEnd);
        firstLetter.classList.add('pop-animation');
        return;
    }

    if (textEl.classList.contains('letter-wrapper')) {
        const textElement = textEl.querySelector('.letter-text');
        if (textElement) {
            textElement.classList.remove('pop-animation');
            void textElement.offsetWidth;
            textElement.classList.add('pop-animation');
        }
    } else if (textEl.classList.contains('blend-text') || textEl.classList.contains('grid-item')) {
        textEl.classList.remove('pop-animation');
        void textEl.offsetWidth;
        textEl.classList.add('pop-animation');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if there is a hash in the URL (e.g., #page11)
    if (window.location.hash) {
        const pageId = window.location.hash.substring(1);
        if (document.getElementById(pageId)) {
            showPage(pageId);
        }
        // Clear the hash from the URL so that a page reload always returns to page1
        history.replaceState(null, '', window.location.pathname);
    }
});
