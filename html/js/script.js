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
            e.target.closest("main > .counter").focus({ focusVisible: true });
        }
    });

    counter.querySelector(".title > input").addEventListener("blur", (e) => {
        const title = e.target.value || e.target.placeholder;
        // TODO: titleの更新の適応
    });
});

document.querySelector("main").addEventListener("keydown", (e) => {
    e.stopPropagation();

    const counter = e.target.closest("main > .counter");
    if (!counter) return;

    if (e.key === "Enter" && e.target.matches(".title > input")) {
        e.preventDefault();
        counter.focus();
        return;
    }

    switch (e.key) {
        case "t":
            counter.querySelector(".title > input").focus();
            break;
        case "ArrowUp":
            counter.querySelector("& > button.plus").click();
            break;
        case "ArrowDown":
            counter.querySelector("& > button.minus").click();
            break;
        default:
            return;
    }
    
    e.preventDefault();
}, { capture: true });