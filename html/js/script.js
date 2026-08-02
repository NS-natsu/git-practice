"use strict";

const counterBoard = document.querySelector("#counter-board");

document.addEventListener("DOMContentLoaded", () => {
  const counterStates = JSON.parse(localStorage.getItem("counterStates"));
  if (!counterStates) return;
  const insertAnchor = document.querySelector("#add-counter");
  counterStates.forEach(({ title, count }) => {
    counterBoard.insertBefore(createCounterElement(title, count), insertAnchor);
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") return;
  const counterStates = Array.from(document.querySelectorAll(".counter"))
    .map((counterElm) => {
      const title = counterElm.querySelector(".title input").value;
      const count = counterElm.querySelector("input.display").valueAsNumber;
      return { title, count }
    });

  localStorage.setItem("counterStates", JSON.stringify(counterStates));
});

document.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  if (button.closest("header")) handleHeaderButtonClick(button);
  else if (button.closest("main")) handleMainButtonClick(button);
});

counterBoard.addEventListener("pointerdown", onDragStart);

counterBoard.addEventListener("focus", (e) => {
  if (!e.target.matches(".counter > .title > input")) return;
  e.target.dataset.previousTitle = e.target.value;
}, { capture: true });

counterBoard.addEventListener("blur", (e) => {
  if (!e.target.matches(".counter > .title > input")) return;
  delete e.target.dataset.previousTitle;
}, { capture: true });

counterBoard.addEventListener("keydown", (e) => {
  const counter = e.target.closest(".counter");
  if (!counter || counter.hasAttribute('data-dragging')) return;

  // title編集時操作定義
  if (e.target.matches(".title > input")) {
    switch (e.key) {
      case "Escape":
        e.target.value = e.target.dataset.previousTitle;
        // fall through
      case "Enter":
        e.preventDefault();
        counter.focus();
        break;
      default: break;
    }
    return;
  }

  // 非title編集時操作定義
  const keyActions = {
    "t": () => counter.querySelector(".title > input").focus(),
    "r": () => counter.querySelector("button.reset").click(),
    "ArrowUp": () => counter.querySelector("button.plus").click(),
    "ArrowDown": () => counter.querySelector("button.minus").click(),
  };

  if (e.key in keyActions) {
    keyActions[e.key]();
    e.preventDefault();
  }
});

/**
 * JSDocつけてみる
 * イベントハンドラが設定済みのカウンター要素を生成して返す
 * @param {string} initTitle カウンターのタイトル
 * @param {number} initCount カウンターの値
 * @returns {HTMLDivElement} セットアップ済みのカウンター要素
 */
function createCounterElement(initTitle = "", initCount = 0) {
  const template = document.querySelector("template#counter-template");
  if (!template) {
    // エラーハンドリングもやってみる
    throw new ReferenceError("HTML内に '#counter-template' が見つかりません。");
  }

  /** @type {HTMLDivElement | null} */
  const counter = template.content.cloneNode(true).querySelector("div.counter");
  if (!counter) {
    throw new DOMException("テンプレート内に子要素（div.counter）が存在しません。", "NotFoundError")
  }

  if (initTitle) {
    counter.querySelector(".title input").value = initTitle;
  }
  if (initCount) {
    counter.querySelector("input.display").value = initCount;
  }

  return counter;
}

function handleHeaderButtonClick(button) {
  if (button.matches("#delete-all-counters")) {
    document.querySelectorAll(".counter").forEach((counter) => counter.remove());
  }
}

function handleMainButtonClick(button) {
  if (button.matches("#add-counter")) {
    counterBoard.insertBefore(createCounterElement(), button);
    return;
  }

  const counter = button.closest(".counter");

  const isPlus = button.matches(".plus");
  const isMinus = button.matches(".minus");
  const isReset = button.matches(".reset");
  const isRemove = button.matches(".remove");

  if (isRemove) {
    counter.remove();
    return;
  }

  if (isPlus || isMinus || isReset) {
    const display = counter.querySelector("input.display");

    if (isPlus) {
      display.valueAsNumber++;
    } else if (isMinus) {
      display.valueAsNumber--;
    } else if (isReset) {
      display.valueAsNumber = 0;
    }

    counter.focus({ focusVisible: true });
  }
}
