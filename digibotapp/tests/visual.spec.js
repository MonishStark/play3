/** @format */

const { test, expect } = require("@playwright/test");
const stabilizePage = require("./utils/stabilizePage");
const pages = require("./pages");

test.describe("DigiBot – Visual Regression", () => {
	for (const p of pages) {
		test(`Visual: ${p.name}`, async ({ page }, testInfo) => {
			await page.goto(p.path, { waitUntil: "networkidle" });

			await stabilizePage(page);

			// Attach raw full-page screenshot to HTML report
			const fullPageBuffer = await page.screenshot({ fullPage: true });
			await testInfo.attach(`FULL PAGE – ${p.name}`, {
				body: fullPageBuffer,
				contentType: "image/png",
			});

			// Visual baseline assertion
			await expect(page).toHaveScreenshot(`${p.name}.png`, {
				fullPage: true,
				timeout: 30000,
				maxDiffPixelRatio: 0.06,
				scale: "css",
				animations: "disabled",
			});
		});
	}
});
