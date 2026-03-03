function showPage(pageId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Target the inner text elements for the reset
    const animElements = document.querySelectorAll('.pop-animation, .pop-delayed, .syllable-text, .letter-text, .letter-y-in-word, .first-letter-in-word, .blend-text, .grid-item');
    animElements.forEach(el => {
        el.classList.remove('pop-animation', 'pop-delayed');
        void el.offsetWidth;
    });

    document.getElementById(pageId).classList.add('active');
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
            setTimeout(() => {
                letters.forEach(el => {
                    el.classList.remove('pop-animation', 'pop-delayed');
                    void el.offsetWidth;
                    el.classList.add('pop-animation');
                });
            }, 500);
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