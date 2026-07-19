"use strict";

/**
 * ドラッグ開始時のイベントハンドラ
 * @param {PointerEvent} event
 */
function onDragStart(event) {
  const container = event.currentTarget;
  if (!container || !event.target?.matches?.("div.dragger")) {
    return;
  }

  // ドラッグ中は多重発火防止のためハンドラを無効化する
  container.removeEventListener(event.type, onDragStart);

  const dragTarget = event.target.closest(".counter");

  // 移動可能なことがわかるように少しずらす
  dragTarget.style.left = `${dragTarget.offsetLeft - 5}px`;
  dragTarget.style.top = `${dragTarget.offsetTop - 5}px`;
  dragTarget.toggleAttribute('data-dragging', true);

  const onPointerMove = ({ movementX, movementY }) => {
    dragTarget.style.top = `${dragTarget.offsetTop + movementY}px`;
    dragTarget.style.left = `${dragTarget.offsetLeft + movementX}px`;
  };

  const onDragEnd = ({ type: eventType }) => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointercancel", onDragEnd);
    window.removeEventListener("pointerup", onDragEnd);

    dragTarget.toggleAttribute('data-dragging', false);
    dragTarget.removeAttribute("style");
    dragTarget.focus({ focusVisible: true });

    container.addEventListener(event.type, onDragStart);
  }

  // ドラッグ終了時のイベント定義
  window.addEventListener("pointerup", onDragEnd, { once: true });
  window.addEventListener("pointercancel", onDragEnd, { once: true });
  window.addEventListener("pointermove", onPointerMove);
}
