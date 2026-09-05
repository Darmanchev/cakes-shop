import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("uses icons exported by Lucide for social links", async () => {
  const source = await readFile(
    resolve(process.cwd(), "components/layout/StorefrontFooter.tsx"),
    "utf8",
  );

  assert.match(source, /import \{ AtSign, MapPin, Phone \} from "lucide-react"/);
  assert.match(source, /<AtSign size=\{20\} \/>/);
  assert.doesNotMatch(source, /import \{[^}]*\bInstagram\b[^}]*\} from "lucide-react"/);
});
