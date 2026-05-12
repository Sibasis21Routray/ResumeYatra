import { Queue, Worker, Job, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import * as pdfService from "./pdf.service";
import * as docxService from "./docx.service";
import * as txtService from "./txt.service";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const exportQueue = new Queue("export-tasks", { connection });
const queueEvents = new QueueEvents("export-tasks", { connection });

// Define job data type
export interface ExportJobData {
  type: "pdf" | "docx" | "txt";
  html?: string;
  data?: any;
  resumeId: string;
}

// Worker implementation
const worker = new Worker(
  "export-tasks",
  async (job: Job<ExportJobData>) => {
    const { type, html, data } = job.data;
    console.log(`👷 Worker processing ${type} export for job ${job.id}`);

    try {
      if (type === "pdf") {
        if (!html) throw new Error("HTML missing for PDF export");
        const buffer = await pdfService.generatePdfBuffer(html);
        return buffer.toString("base64");
      }

      if (type === "docx") {
        if (!html) throw new Error("HTML missing for DOCX export");
        const pdfBuffer = await pdfService.generatePdfBuffer(html);
        const docxBuffer = await docxService.generateDocxFromPdfBuffer(pdfBuffer, data);
        return docxBuffer.toString("base64");
      }

      if (type === "txt") {
        const txt = await txtService.generateTxt(data);
        return Buffer.from(txt).toString("base64");
      }
    } catch (error) {
      console.error(`❌ Worker error on job ${job.id}:`, error);
      throw error;
    }
  },
  { 
    connection,
    concurrency: 5 // Process 5 exports at a time across all workers
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`🔥 Job ${job.id} failed:`, err);
});

/**
 * Adds a job to the queue and waits for it to complete.
 * This allows the controller to stay synchronous to the client 
 * while being asynchronous (and throttled) on the server.
 */
export async function queueExportTask(jobData: ExportJobData): Promise<Buffer> {
  const job = await exportQueue.add(`${jobData.type}-export-${Date.now()}`, jobData, {
    removeOnComplete: true,
    removeOnFail: true,
  });

  // Wait for job to finish and get result
  const resultBase64 = await job.waitUntilFinished(queueEvents);
  return Buffer.from(resultBase64 as string, "base64");
}
