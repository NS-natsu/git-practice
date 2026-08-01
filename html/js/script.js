"use strict";

const counterBoard = document.querySelector("#counter-board");

document.addEventListener("DOMContentLoaded", () => {
  const counterStates = JSON.parse(localStorage.getItem("counterState"));
  if (!counterStates) return;
  const anchor = document.querySelector("#add-counter");
  counterStates.forEach(({ title, count }) => {
    counterBoard.insertBefore(createCounterElement(title, count), anchor);
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "hidden") return;
  saveWorkspace();
});

counterBoard.addEventListener("pointerdown", onDragStart);

counterBoard.addEventListener("focus", (e) => {
  if (!e.target.matches(".counter > .title > input")) return;
  e.target.dataset["beforeTitle"] = e.target.value;
}, { capture: true });

counterBoard.addEventListener("blur", (e) => {
  if (!e.target.matches(".counter > .title > input")) return;
  delete e.target.dataset["beforeTitle"];
  saveWorkspace();
}, { capture: true });

counterBoard.addEventListener("keydown", (e) => {
  const counter = e.target.closest(".counter");
  if (!counter || counter.hasAttribute('data-dragging')) return;

  // title編集時操作定義
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

counterBoard.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

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
    const display = counter.querySelector(".display");

    if (isPlus) {
      display.valueAsNumber++;
    } else if (isMinus) {
      display.valueAsNumber--;
    } else if (isReset) {
      display.valueAsNumber = 0;
    }

    saveWorkspace();
    counter.focus({ focusVisible: true });
  }
});

document.querySelector("#delete-all-counters").addEventListener("click", (e) => {
  document.querySelectorAll(".counter").forEach((counter) => {
    counter.remove();
    counters.delete(counter);
  });
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

function saveWorkspace() {
  const counters = Array.from(document.querySelectorAll(".counter")).map((elm) => {
    const title = elm.querySelector(".title input").value;
    const count = elm.querySelector("input.display").valueAsNumber;
    return { title, count }
  });

  localStorage.setItem("counterState", JSON.stringify(counters));
}
