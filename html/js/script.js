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
});