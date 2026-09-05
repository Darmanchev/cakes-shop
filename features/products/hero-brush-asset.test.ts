import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import sharp from "sharp";

test("hero brush has transparent edges and exact vertical symmetry", async () => {
  const assetPath = resolve(
    process.cwd(),
    "public/images/hero/pink-brush-stroke.png",
  );
  const { data, info } = await sharp(assetPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  assert.equal(info.height % 2, 0, "the two mirrored halves must be equal");
  assert.ok(
    info.width / info.height >= 1 && info.width / info.height <= 1.5,
    "the asset must retain both full brush halves",
  );

  const rowLength = info.width * info.channels;
  const halfHeight = info.height / 2;

  for (let y = 0; y < halfHeight; y += 1) {
    const topStart = y * rowLength;
    const bottomStart = (info.height - y - 1) * rowLength;

    assert.deepEqual(
      data.subarray(topStart, topStart + rowLength),
      data.subarray(bottomStart, bottomStart + rowLength),
      `rows ${y} and ${info.height - y - 1} must mirror each other`,
    );
  }

  const alphaChannel = info.channels - 1;
  let transparentPixels = 0;

  for (let offset = alphaChannel; offset < data.length; offset += info.channels) {
    if (data[offset] === 0) transparentPixels += 1;
  }

  assert.ok(transparentPixels > 0, "the area outside the paint must be transparent");
});
