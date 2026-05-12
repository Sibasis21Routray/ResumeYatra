import { Cluster } from "puppeteer-cluster";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

let cluster: Cluster | null = null;

export async function getBrowserCluster() {
  if (cluster) return cluster;

  console.log("🚀 Initializing Browser Cluster...");
  
  cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE, // Use one browser, multiple pages
    maxConcurrency: 5, // Limit to 5 pages at a time to save RAM
    puppeteerOptions: {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    },
  });

  console.log("✅ Browser Cluster ready");
  return cluster;
}

export async function renderWithCluster(html: string) {
  const c = await getBrowserCluster();
  
  const result = await c.execute({ html }, async ({ page, data }) => {
    // 🚀 Performance optimization
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "font" || type === "media") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setContent(data.html, {
waitUntil: "networkidle0" as any,
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
