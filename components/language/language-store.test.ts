import assert from "node:assert/strict";
import { test } from "node:test";
import { getStoredLanguage, setStoredLanguage } from "./language-store";

test("keeps language switching usable when browser storage is blocked", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  let notifications = 0;
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    get localStorage() { throw new Error("Storage disabled"); },
    dispatchEvent: () => { notifications++; },
  } });
  try {
    assert.equal(getStoredLanguage(), "bg");
    setStoredLanguage("en");
    assert.equal(getStoredLanguage(), "en");
    assert.equal(notifications, 1);
  } finally {
    setStoredLanguage("bg");
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
