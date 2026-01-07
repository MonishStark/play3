/** @format */

const { test, expect } = require("@playwright/test");

test.use({
	userAgent:
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	locale: "en-US",
	permissions: ["geolocation"],
});

async function preparePageForScreenshot(page) {
	await page.addInitScript(() => {
		window.__PLAYWRIGHT__ = true;
	});

	// 1. Force eager loading and wait for images
	await page.evaluate(async () => {
		// Force all images to load eagerly
		const images = document.querySelectorAll("img");
		images.forEach((img) => {
			img.setAttribute("loading", "eager");
			img.setAttribute("decoding", "sync");
		});

		// Wait for all images to be completely loaded
		await Promise.all(
			Array.from(images).map((img) => {
				if (img.complete) return;
				return new Promise((resolve) => {
					img.onload = resolve;
					img.onerror = resolve; // Resolve even on error to avoid hanging
				});
			})
		);

		// Wait for fonts
		await document.fonts.ready;
	});

	// 2. Disable animations and hide dynamic overlays
	await page.addStyleTag({
		content: `
      * {
        animation: none !important;
        transition: none !important;
      }

      /* Force visibility on Elementor animations */
      .elementor-invisible,
      .elementor-motion-effects-element,
      .elementor-motion-effects-parent {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
      }

      /* Hide potential popups or cookie bars that affect height/layout */
      #moove_gdpr_cookie_info_bar,
      .dialog-widget-content,
      .popup-overlay {
        display: none !important;
      }
    `,
	});

	// 3. Scroll to bottom to trigger any scroll-based interactions
	await page.evaluate(async () => {
		const delay = (ms) => new Promise((r) => setTimeout(r, ms));
		const height = document.body.scrollHeight;

		for (let y = 0; y < height; y += 400) {
			window.scrollTo(0, y);
			await delay(50);
		}

		window.scrollTo(0, 0);
		await delay(500); // Allow top layout to settle
	});

	// Final safety wait for any latyout shifts
	await page.waitForTimeout(3000);
}

const pagesToTest = [
	{ path: "/", name: "01_Home" },
	{ path: "/about/", name: "02_About_Us" },
	{ path: "/sports/", name: "03_Sports_Programs" },
	{ path: "/business/", name: "04_Corporate_Programs" },
	{ path: "/4-the-boys/", name: "05_Scholarship" },
	{ path: "/book-now/", name: "06_Contact_Us" },
	{ path: "/forsportsandeducation/", name: "07_Non_Profit" },
	{ path: "/my-courses/", name: "08_Login_Page" },
	{ path: "/my-courses/lost-password/", name: "09_Password_Reset" },
	{ path: "/tlw/", name: "10_The_Little_Warriors" },
	{ path: "/membership/front-of-line-membership/", name: "11_Membership_Flow" },
	{ path: "/purchase/", name: "12_Purchase_Flow" },
];

test.describe("I Got Mind – Public Visual Audit", () => {
	for (const pageInfo of pagesToTest) {
		test(`Visual: ${pageInfo.name}`, async ({ page }) => {
			await page.goto(pageInfo.path, { waitUntil: "domcontentloaded" });

			await preparePageForScreenshot(page);

			await expect(page).toHaveScreenshot({
				fullPage: true,

				mask: [
					page.locator('iframe[src*="paypal"]'),
					page.locator('iframe[src*="calendly"]'),
					page.locator('div[class*="campaigns_widget"]'),
				],
			});
		});
	}
});
