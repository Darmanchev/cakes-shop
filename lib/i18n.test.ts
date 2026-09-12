import assert from "node:assert/strict";
import test from "node:test";
import { resolveSupportedLanguage, translations } from "./i18n";

test("accepts exact supported languages and defaults unknown values to Bulgarian", () => {
  assert.equal(resolveSupportedLanguage("en"), "en");
  assert.equal(resolveSupportedLanguage("ru"), "ru");
  assert.equal(resolveSupportedLanguage("en-US,en;q=0.9"), "bg");
  assert.equal(resolveSupportedLanguage(null), "bg");
});

test("localizes catalog controls and uses customer-facing success copy", () => {
  assert.equal(translations.bg.catalog.previousProducts, "Предишни продукти");
  assert.equal(translations.en.catalog.nextProducts, "Next products");
  assert.equal(translations.ru.catalog.close, "Закрыть");
  assert.equal(translations.en.form.success, "Request sent.");
  assert.equal(translations.ru.form.success, "Заявка отправлена.");
});
