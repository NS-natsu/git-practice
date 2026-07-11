"use strict";

const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
    counter.addEventListener("click", (e) => {
        const isPlus = e.target.classList.contains("plus");
        const isMinus = e.target.classList.contains("minus");

        if (isPlus || isMinus) {
            const value = counter.querySelector(".value");
            let currentValue = parseInt(value.textContent);

            if (isPlus) {
                currentValue++;
            } else if (isMinus) {
                currentValue--;
            }

            value.textContent = currentValue;
        }
    });
});