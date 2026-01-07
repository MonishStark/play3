/** @format */

const { test, expect } = require("@playwright/test");
const { stabilizePage } = require("./utils/stabilizePage");
const pages = require("./pages"); // Import static page list

test.describe("Visual Regression Tests", () => {
	// Increase timeout for mobile full-page screenshots
	test.setTimeout(120000);

	for (const pageConfig of pages) {
		// Use the explicit name defined in pages.js
		const snapshotName = `${pageConfig.name}.png`;

		test(`Visual Check: ${pageConfig.name}`, async ({ page }, testInfo) => {
			// Navigate using the relative path from the config (baseURL is set in playwright.config.js)
			await page.goto(pageConfig.path, { waitUntil: "domcontentloaded" });

			// Use standard stabilization (handles fonts, sticky headers, lazy load, network idle)
			await stabilizePage(page);

			// ✅ Always attach full-page screenshot to HTML report (even if test passes)
			const safeName = String(pageConfig.name).replace(/[^a-z0-9._-]+/gi, "-");
			const screenshotPath = testInfo.outputPath(`FULL-PAGE-${safeName}.png`);
			await page.screenshot({
				fullPage: true,
				scale: "css",
				animations: "disabled",
				path: screenshotPath,
			});

			await testInfo.attach(`FULL PAGE – ${pageConfig.name}`, {
				path: screenshotPath,
				contentType: "image/png",
			});

			// Take full page screenshot and compare with baseline
			// Allowing short tolerance for minor pixel differences (rendering noise)
			await expect(page).toHaveScreenshot(snapshotName, {
				fullPage: true,
				timeout: 45000,
				maxDiffPixelRatio: 0.03,

				// Adding scale: 'css' as per microlocs improvements to ensure consistent sizing
				scale: "css",
			});
		});
	}
});
