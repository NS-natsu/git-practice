"use strict";

const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
    counter.addEventListener("click", (e) => {
        const isPlus = e.target.classList.contains("plus");
        const isMinus = e.target.classList.contains("minus");
        const isReset = e.target.classList.contains("reset");

        if (isPlus || isMinus || isReset) {
            const display = counter.querySelector(".display");
            let currentValue = parseInt(display.textContent);

            if (isPlus) {
                currentValue++;
            } else if (isMinus) {
                currentValue--;
            } else if (isReset) {
                currentValue = 0;
            }

            display.textContent = currentValue;
        }
    });
});