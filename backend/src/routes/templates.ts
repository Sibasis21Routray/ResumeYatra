import { Router, Request, Response } from "express";
import * as templateService from "../services/template.service";

const router = Router();

// Public endpoint that returns URL to rendered HTML for a sample resume using the requested template.
// This is intentionally public so the frontend can fetch thumbnails without requiring auth.
router.get("/preview/:templateId", async (req: Request, res: Response) => {
  try {
    const templateId = Array.isArray(req.params.templateId)
      ? req.params.templateId[0]
      : req.params.templateId;
    const theme = req.query.theme
      ? JSON.parse(req.query.theme as string)
      : undefined;
    const url = await templateService.renderTemplateSample(templateId, theme);
    res.json({ url });
  } catch (err: any) {
    console.error("template preview error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
});

export default router;
