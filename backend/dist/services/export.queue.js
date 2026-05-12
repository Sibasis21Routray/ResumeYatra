"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportQueue = void 0;
exports.queueExportTask = queueExportTask;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const pdfService = __importStar(require("./pdf.service"));
const docxService = __importStar(require("./docx.service"));
const txtService = __importStar(require("./txt.service"));
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new ioredis_1.default(REDIS_URL, { maxRetriesPerRequest: null });
exports.exportQueue = new bullmq_1.Queue("export-tasks", { connection });
const queueEvents = new bullmq_1.QueueEvents("export-tasks", { connection });
// Worker implementation
const worker = new bullmq_1.Worker("export-tasks", async (job) => {
    const { type, html, data } = job.data;
    console.log(`👷 Worker processing ${type} export for job ${job.id}`);
    try {
        if (type === "pdf") {
            if (!html)
                throw new Error("HTML missing for PDF export");
            const buffer = await pdfService.generatePdfBuffer(html);
            return buffer.toString("base64");
        }
        if (type === "docx") {
            if (!html)
                throw new Error("HTML missing for DOCX export");
            const pdfBuffer = await pdfService.generatePdfBuffer(html);
            const docxBuffer = await docxService.generateDocxFromPdfBuffer(pdfBuffer, data);
            return docxBuffer.toString("base64");
        }
        if (type === "txt") {
            const txt = await txtService.generateTxt(data);
            return Buffer.from(txt).toString("base64");
        }
    }
    catch (error) {
        console.error(`❌ Worker error on job ${job.id}:`, error);
        throw error;
    }
}, {
    connection,
    concurrency: 5 // Process 5 exports at a time across all workers
});
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
async function queueExportTask(jobData) {
    const job = await exports.exportQueue.add(`${jobData.type}-export-${Date.now()}`, jobData, {
        removeOnComplete: true,
        removeOnFail: true,
    });
    // Wait for job to finish and get result
    const resultBase64 = await job.waitUntilFinished(queueEvents);
    return Buffer.from(resultBase64, "base64");
}
