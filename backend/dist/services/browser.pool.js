"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowserCluster = getBrowserCluster;
exports.renderWithCluster = renderWithCluster;
const puppeteer_cluster_1 = require("puppeteer-cluster");
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
let cluster = null;
async function getBrowserCluster() {
    if (cluster)
        return cluster;
    console.log("🚀 Initializing Browser Cluster...");
    cluster = await puppeteer_cluster_1.Cluster.launch({
        concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_PAGE, // Use one browser, multiple pages
        maxConcurrency: 5, // Limit to 5 pages at a time to save RAM
        puppeteerOptions: {
            args: chromium_1.default.args,
            executablePath: await chromium_1.default.executablePath(),
            headless: true,
        },
    });
    console.log("✅ Browser Cluster ready");
    return cluster;
}
async function renderWithCluster(html) {
    const c = await getBrowserCluster();
    const result = await c.execute({ html }, async ({ page, data }) => {
        // 🚀 Performance optimization
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const type = req.resourceType();
            if (type === "font" || type === "media") {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        await page.setContent(data.html, {
            waitUntil: "networkidle0",
            timeout: 60000,
        });
        return await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                bottom: "10mm",
                left: "10mm",
                right: "10mm",
            },
        });
    });
    return result;
}
