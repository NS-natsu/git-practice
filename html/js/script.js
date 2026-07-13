"use strict";

const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
    counter.addEventListener("click", (e) => {
        const isPlus = e.target.classList.contains("plus");
        const isMinus = e.target.classList.contains("minus");

        if (isPlus || isMinus) {
            const display = counter.querySelector(".display");
            let currentValue = parseInt(display.textContent);

            if (isPlus) {
                currentValue++;
            } else if (isMinus) {
                currentValue--;
            }

            display.textContent = currentValue;
        }
    });

    counter.querySelector(".title > input").addEventListener("blur", (e) => {
        const title = e.target.value || e.target.placeholder;
        // TODO: titleの更新の適応
    });
});

document.querySelector("main").addEventListener('keydown', (e) => {
    e.stopPropagation();

    if (e.key === 'Enter' && e.target.matches('.title > input')) {
        e.preventDefault();
        e.target.blur(); 
    }
}, { capture: true });