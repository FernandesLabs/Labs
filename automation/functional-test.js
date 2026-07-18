/**
 * Fernandes Labs — Functional Test Runner (Playwright)
 *
 * Consumes automation/tool-test-manifest.js, starts a local static server,
 * visits each tool, executes the test steps, and asserts the output.
 *
 * Usage: node automation/functional-test.js
 *
 * Requires: npx playwright install (chromium)
 *
 * Exit code: 0 if all pass, 1 if any fail.
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const MANIFEST = require("./tool-test-manifest.js");
const ROOT = path.resolve(__dirname, "..");
const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;
const FAILURE_DIR = path.join(ROOT, "test-failures");

let passed = 0;
let failed = 0;
const failures = [];

// --- Start a static file server (Node built-in, no dependencies) -----------

function startServer() {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const mime = require("./mime-types.js");
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split("?")[0];
      if (urlPath === "/") urlPath = "/index.html";
      let filePath = path.join(ROOT, urlPath);
      if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      // If the path is a directory, serve index.html inside it.
      try {
        if (fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
      } catch (e) {
        // File doesn't exist — fall through to readFile which returns 404.
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found: " + urlPath);
          return;
        }
        const ext = path.extname(filePath).slice(1);
        res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
    server.on("error", reject);
  });
}

// --- Run a single assertion -------------------------------------------------

async function runAssertion(page, step) {
  const { selector, type, expected } = step;
  const element = await page.$(selector);
  if (!element) {
    return { pass: false, message: `Element not found: ${selector}` };
  }

  // Get the value: try .value (input/textarea) first, then textContent.
  let value = await element.evaluate((el) => {
    if (el.value !== undefined && el.value !== "") return el.value;
    return el.textContent || "";
  });
  value = value.trim();

  switch (type) {
    case "exact":
      return value === expected
        ? { pass: true }
        : { pass: false, message: `Expected "${expected}", got "${value}"` };

    case "regex": {
      const re = new RegExp(expected.source, expected.flags);
      return re.test(value)
        ? { pass: true }
        : { pass: false, message: `Value "${value}" does not match ${re}` };
    }

    case "contains":
      return value.includes(expected)
        ? { pass: true }
        : { pass: false, message: `Value does not contain "${expected}". Got: "${value.slice(0, 100)}"` };

    case "not-empty":
      return value.length > 0
        ? { pass: true }
        : { pass: false, message: "Value is empty" };

    case "json-valid":
      try {
        JSON.parse(value);
        return { pass: true };
      } catch (e) {
        return { pass: false, message: `Not valid JSON: ${e.message}` };
      }

    default:
      return { pass: false, message: `Unknown assertion type: ${type}` };
  }
}

// --- Run a single test case -------------------------------------------------

async function runTest(browser, testCase) {
  const { slug, category, url, tests } = testCase;
  const fullUrl = BASE_URL + url;
  // Create a fresh page per tool so failures don't cascade.
  const page = await browser.newPage();

  for (const test of tests) {
    const testPassed = await runSteps(page, fullUrl, test, slug);
    if (testPassed) {
      passed++;
      console.log(`  ✅ ${slug}: ${test.name}`);
    } else {
      failed++;
      failures.push(`${slug}: ${test.name}`);
      console.log(`  ❌ ${slug}: ${test.name}`);
    }
  }

  await page.close();
}

async function runSteps(page, fullUrl, test, slug) {
  // Collect console errors and uncaught exceptions.
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  try {
    await page.goto(fullUrl, { waitUntil: "domcontentloaded", timeout: 10000 });
    // Give the page a moment for scripts to initialise.
    await page.waitForTimeout(300);
  } catch (e) {
    console.log(`     ⚠ Navigation failed: ${e.message}`);
    return false;
  }

  for (const step of test.steps) {
    try {
      switch (step.action) {
        case "fill":
          await page.fill(step.selector, step.value, { timeout: 5000 });
          break;
        case "click":
          await page.click(step.selector, { timeout: 5000 });
          break;
        case "select":
          await page.selectOption(step.selector, step.value, { timeout: 5000 });
          break;
        case "wait":
          await page.waitForTimeout(step.ms);
          break;
        case "assert": {
          const result = await runAssertion(page, step);
          if (!result.pass) {
            console.log(`     Assertion failed: ${result.message}`);
            try {
              if (!fs.existsSync(FAILURE_DIR)) fs.mkdirSync(FAILURE_DIR, { recursive: true });
              await page.screenshot({ path: path.join(FAILURE_DIR, `${slug}.png`) });
            } catch (se) {
              // Ignore screenshot failure.
            }
            return false;
          }
          break;
        }
        default:
          console.log(`     Unknown action: ${step.action}`);
          return false;
      }
    } catch (e) {
      console.log(`     Step error: ${e.message}`);
      try {
        if (!fs.existsSync(FAILURE_DIR)) fs.mkdirSync(FAILURE_DIR, { recursive: true });
        await page.screenshot({ path: path.join(FAILURE_DIR, `${slug}.png`) });
      } catch (se) {
        // Page may already be closed; ignore screenshot failure.
      }
      return false;
    }
  }

  // Fail if there were console errors.
  if (errors.length > 0) {
    console.log(`     Console errors: ${errors.length}`);
    errors.slice(0, 3).forEach((e) => console.log(`       - ${e}`));
    return false;
  }

  return true;
}

// --- Main -------------------------------------------------------------------

(async () => {
  console.log("=== Fernandes Labs — Functional Test Suite ===");
  console.log(`Manifest: ${MANIFEST.length} tools with explicit test cases\n`);

  // Start the static server.
  const server = await startServer();
  console.log(`Static server running on port ${PORT}\n`);

  // Launch Playwright.
  const browser = await chromium.launch({ headless: true });

  // Run each test case.
  for (const testCase of MANIFEST) {
    await runTest(browser, testCase);
  }

  await browser.close();
  server.close();

  // Summary.
  console.log("\n=== Summary ===");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failures.length > 0) {
    console.log("\nFailed tests:");
    failures.forEach((f) => console.log(`  - ${f}`));
    console.log(`\nScreenshots saved to: ${FAILURE_DIR}/`);
  }

  process.exit(failed > 0 ? 1 : 0);
})();
