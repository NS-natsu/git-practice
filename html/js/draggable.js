"use strict";

/**
 * ドラッグ開始時のイベントハンドラ
 * @param {PointerEvent} event
 */
function onDragStart(event) {
  const container = event.currentTarget;
  if (!container || !event.target?.matches?.(".dragger")) {
    return;
  }

  // ドラッグ中は多重発火防止のためハンドラを無効化する
  container.removeEventListener(event.type, onDragStart);

  const dragTarget = event.target.closest(".counter");
  const placeholder = container.querySelector(".placeholder");
  const insertAnchor = container.querySelector("#add-counter");

  // ドラッグ対象を除いた並びで再配置するため、先に元の位置を取得してから除外する
  const otherCounters = Array.from(container.querySelectorAll(".counter"));
  let insertOrder = otherCounters.indexOf(dragTarget);
  otherCounters.splice(insertOrder, 1);

  // 移動可能なことがわかるように少しずらす
  dragTarget.style.left = `${dragTarget.offsetLeft - 5}px`;
  dragTarget.style.top = `${dragTarget.offsetTop - 5}px`;
  dragTarget.toggleAttribute('data-dragging', true);

  otherCounters.forEach((counter, index) => {
    counter.style.order = index;
  });
  placeholder.style.order = insertOrder;
  insertAnchor.style.order = otherCounters.length;

  /** @param {PointerEvent} */
  const onPointerMove = ({ movementX, movementY }) => {
    dragTarget.style.top = `${dragTarget.offsetTop + movementY}px`;
    dragTarget.style.left = `${dragTarget.offsetLeft + movementX}px`;

    const orderDelta = getOrderDelta(dragTarget, placeholder, container);
    insertOrder = clampNumber(insertOrder + orderDelta, 0, otherCounters.length);

    placeholder.style.order = insertOrder;
  };

  const controller = new AbortController();
  /** @param {PointerEvent} */
  const onDragEnd = ({ type: eventType }) => {
    controller.abort();

    if (eventType === "pointerup") {
      container.insertBefore(dragTarget, otherCounters[insertOrder] ?? insertAnchor);
    }

    for (const element of container.children) {
      element.removeAttribute("style");
    }
    dragTarget.toggleAttribute('data-dragging', false);
    dragTarget.focus({ focusVisible: true });

    container.addEventListener(event.type, onDragStart);
  }

  // ドラッグ終了時のイベント定義
  document.addEventListener("pointerup", onDragEnd, { signal: controller.signal });
  document.addEventListener("pointercancel", onDragEnd, { signal: controller.signal });
  document.addEventListener("pointermove", onPointerMove, { signal: controller.signal });
}

/**
 * ドラッグ要素と基準要素の位置差から、移動すべきスロット数を算出する
 * @param {HTMLElement} dragItem
 * @param {HTMLElement} referenceItem
 * @param {HTMLElement} gridContainer
 * @returns {number}
 */
function getOrderDelta(dragItem, referenceItem, gridContainer) {
  const containerStyle = getComputedStyle(gridContainer);

  const rowGap = parseFloat(containerStyle.rowGap) || 0;
  const columnGap = parseFloat(containerStyle.columnGap) || 0;

  const trackWidth = referenceItem.offsetWidth + columnGap;
  const trackHeight = referenceItem.offsetHeight + rowGap;

  const maxColumns = Math.max(1, Math.floor((gridContainer.offsetWidth + columnGap) / trackWidth));
  const maxRows = Math.max(1, Math.floor((gridContainer.offsetHeight + rowGap) / trackHeight));

  const baseRow = Math.floor(referenceItem.offsetTop / trackHeight);
  const baseColumn = Math.floor(referenceItem.offsetLeft / trackWidth);

  const columnDelta = clampNumber(
    Math.round((dragItem.offsetLeft - referenceItem.offsetLeft) / trackWidth),
    -baseColumn,
    maxColumns - baseColumn - 1
  );
  const rowDelta = clampNumber(
    Math.round((dragItem.offsetTop - referenceItem.offsetTop) / trackHeight),
    -baseRow,
    maxRows - baseRow - 1
  );

  return maxColumns * rowDelta + columnDelta;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clampNumber(value, min = -Infinity, max = Infinity) {
  return Math.min(max, Math.max(min, value));
}