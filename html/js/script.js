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
            e.target.closest("main > .counter").focus({ focusVisible: true });
        }
    });
});

document.querySelector("main").addEventListener("focus", (e) => {
    if (!e.target.matches(".counter > .title > input")) return;
    e.target.dataset["beforeTitle"] = e.target.value;
}, { capture: true });

document.querySelector("main").addEventListener("blur", (e) => {
    if (!e.target.matches(".counter > .title > input")) return;
    delete e.target.dataset["beforeTitle"];
    // TODO: titleの更新の適応
    const title = e.target.value || e.target.placeholder;
}, { capture: true });

document.querySelector("main").addEventListener("keydown", (e) => {
    const counter = e.target.closest(".counter");
    if (!counter) return;

    // input編集時操作定義
    if (e.target.matches(".title > input")) {
        switch (e.key) {
            case "Escape":
                e.target.value = e.target.dataset["beforeTitle"];
                // fall through
            case "Enter":
                e.preventDefault();
                counter.focus();
                break;
            default: break;
        }
        return;
    }

    //　非input編集時操作定義
    switch (e.key) {
        case "t":
            counter.querySelector(".title > input").focus();
            break;
        case "ArrowUp":
            counter.querySelector("button.plus").click();
            break;
        case "ArrowDown":
            counter.querySelector("button.minus").click();
            break;
        default:
            return;
    }
    
    e.preventDefault();
});