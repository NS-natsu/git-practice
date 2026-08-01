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
  const anchorNode = container.querySelector("#add-counter");

  const otherCounters = Array.from(container.querySelectorAll(".counter"));
  let insertOrder = otherCounters.indexOf(dragTarget);
  otherCounters.splice(insertOrder, 1);

  // 移動可能なことがわかるように少しずらす
  dragTarget.style.left = `${dragTarget.offsetLeft - 5}px`;
  dragTarget.style.top = `${dragTarget.offsetTop - 5}px`;
  dragTarget.toggleAttribute('data-dragging', true);

  otherCounters.forEach((item, idx) => {
    item.style.order = idx;
  });
  placeholder.style.order = insertOrder;
  anchorNode.style.order = otherCounters.length;

  const onPointerMove = ({ movementX, movementY }) => {
    dragTarget.style.top = `${dragTarget.offsetTop + movementY}px`;
    dragTarget.style.left = `${dragTarget.offsetLeft + movementX}px`;

    const delta = getSlotDelta(dragTarget, placeholder, container);
    insertOrder = clampNumber(insertOrder + delta, 0, otherCounters.length);

    placeholder.style.order = insertOrder;
  };

  const controller = new AbortController();
  const onDragEnd = ({ type: eventType }) => {
    controller.abort();

    if (eventType === "pointerup") {
      container.insertBefore(dragTarget, otherCounters[insertOrder] ?? anchorNode);
    }

    for (const elm of container.children) {
      elm.removeAttribute("style");
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
 * @param {HTMLDivElement} dragElm
 * @param {HTMLDivElement} baseElm
 * @param {HTMLDivElement} container
 * @returns {number}
 */
function getSlotDelta(dragElm, baseElm, container) {
  const containerStyle = getComputedStyle(container);

  const rowGap = parseFloat(containerStyle.rowGap) || 0;
  const columnGap = parseFloat(containerStyle.columnGap) || 0;

  const slotWidth = baseElm.offsetWidth + columnGap;
  const slotHeight = baseElm.offsetHeight + rowGap;

  const maxColumns = Math.max(1, Math.floor((container.offsetWidth + columnGap) / slotWidth));
  const maxRows = Math.max(1, Math.floor((container.offsetHeight + rowGap) / slotHeight));

  const baseRow = Math.floor(baseElm.offsetTop / slotHeight);
  const baseColumn = Math.floor(baseElm.offsetLeft / slotWidth);

  const columnDelta = clampNumber(
    Math.round((dragElm.offsetLeft - baseElm.offsetLeft) / slotWidth),
    -baseColumn,
    maxColumns - baseColumn - 1
  );
  const rowDelta = clampNumber(
    Math.round((dragElm.offsetTop - baseElm.offsetTop) / slotHeight),
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