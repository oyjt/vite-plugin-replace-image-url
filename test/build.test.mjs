import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { build, createLogger } from "vite";
import ReplaceImageUrl from "vite-plugin-replace-image-url";

async function fixture(t, entry) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "replace-image-url-test-"));
  t.after(() => rm(dir, { recursive: true, force: true }));

  const root = path.join(dir, "app");
  await mkdir(path.join(root, "src/static/nested"), { recursive: true });
  await mkdir(path.join(root, "src/assets"), { recursive: true });
  await writeFile(
    path.join(root, "index.html"),
    '<script type="module" src="/src/main.js"></script>',
  );
  await writeFile(path.join(root, "src/main.js"), entry);
  await writeFile(path.join(root, "src/static/nested/logo.png"), "logo");
  await writeFile(path.join(root, "src/static/inline.png"), "inline");
  await writeFile(path.join(root, "src/assets/outside.png"), "outside");
  return root;
}

async function bundle(root, plugin, customLogger) {
  const result = await build({
    configFile: false,
    root,
    customLogger,
    logLevel: "silent",
    plugins: [plugin],
    build: {
      assetsInlineLimit: 0,
      minify: false,
      write: false,
    },
  });
  const outputs = Array.isArray(result) ? result : [result];
  return outputs
    .flatMap(output => output.output)
    .find(output => output.type === "chunk" && output.isEntry)?.code ?? "";
}

const mockLogger = t => {
  const logger = createLogger();
  return {
    logger,
    info: t.mock.method(logger, "info", () => {}),
  };
};

const pluginLogs = mock => mock.mock.calls
  .map(call => call.arguments[0])
  .filter(message => message.startsWith("[vite-plugin-replace-image-url]"));

test("replaces images inside sourceDir relative to Vite root", async t => {
  const root = await fixture(
    t,
    `import logo from "./static/nested/logo.png?url";
import outside from "./assets/outside.png";
import inline from "./static/inline.png?inline";
console.log(logo, outside, inline);`,
  );

  const code = await bundle(
    root,
    ReplaceImageUrl({ publicPath: "https://cdn.example.com/images///" }),
  );

  assert.match(code, /https:\/\/cdn\.example\.com\/images\/nested\/logo\.png/);
  assert.doesNotMatch(code, /cdn\.example\.com.*outside\.png/);
  assert.match(code, /data:image\/png;base64/);
});

test("supports custom sourceDir, filters, and safe JavaScript output", async t => {
  const root = await fixture(
    t,
    `import logo from "./static/nested/logo.png";
console.log(logo);`,
  );

  const code = await bundle(
    root,
    ReplaceImageUrl({
      publicPath: 'https://cdn.example.com/"quoted"',
      sourceDir: "src/static",
      include: "**/*.png",
    }),
  );

  assert.match(code, /cdn\.example\.com/);
  assert.match(code, /quoted/);
  assert.match(code, /nested\/logo\.png/);
});

test("verbose logging follows the shared plugin format", async t => {
  const root = await fixture(
    t,
    `import logo from "./static/nested/logo.png";
console.log(logo);`,
  );
  const { logger, info } = mockLogger(t);

  await bundle(
    root,
    ReplaceImageUrl({ publicPath: "https://cdn.example.com", verbose: true }),
    logger,
  );

  assert.deepEqual(pluginLogs(info), [
    "[vite-plugin-replace-image-url] Replaced 1 image URL:\n" +
      "  - nested/logo.png -> https://cdn.example.com/nested/logo.png",
  ]);
});

test("verbose logging reports when no images match", async t => {
  const root = await fixture(t, 'console.log("no images");');
  const { logger, info } = mockLogger(t);

  await bundle(root, ReplaceImageUrl({ verbose: true }), logger);

  assert.deepEqual(pluginLogs(info), [
    "[vite-plugin-replace-image-url] No matching images found.",
  ]);
});
