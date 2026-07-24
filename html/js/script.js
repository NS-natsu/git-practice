"use strict";

/** @type {WeakSet<HTMLDivElement>} */
const counters = new WeakSet();

document.querySelector("#counter-board").addEventListener("pointerdown", onDragStart);

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

document.querySelector("#add-counter").addEventListener("click", (e) => {
  const container = e.currentTarget.parentElement;
  container.insertBefore(createCounterElement(), e.currentTarget);
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
 * @returns {HTMLDivElement} セットアップ済みのカウンター要素
 */
function createCounterElement() {
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

  setupCounterButtonBehavior(counter);

  return counter;
}

/**
 * カウンターの各ボタンに対するイベントハンドラを登録する
 * @param {HTMLDivElement} counter クリックイベント未登録のカウンター要素
 */
function setupCounterButtonBehavior(counter) {
  if (!(counter instanceof HTMLDivElement) || !counter.matches(".counter")) return;
  if (counters.has(counter)) return;
  counters.add(counter);
  counter.addEventListener("click", (e) => {
    const isPlus = e.target.classList.contains("plus");
    const isMinus = e.target.classList.contains("minus");
    const isReset = e.target.classList.contains("reset");
    const isRemove = e.target.classList.contains("remove");

    if (isRemove) {
      counter.remove();
      counters.delete(counter);
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

      counter.focus({ focusVisible: true });
    }
  });
}
