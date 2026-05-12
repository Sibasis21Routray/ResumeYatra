import * as templateService from "../services/template.service";
import config from "../config/api";

const templates = [
  "impact-resume",
  "startup-tech",
  "modern-corporate",
  "senior-leadership",
  "corporate-standard"
];

async function uploadPreviews() {
  console.log("Starting upload of template previews to Cloudinary...");
  
  for (const templateId of templates) {
    try {
      console.log(`Uploading preview for: ${templateId}...`);
      const url = await templateService.renderTemplateSample(templateId);
      console.log(`Successfully uploaded ${templateId}. URL: ${url}`);
    } catch (error) {
      console.error(`Failed to upload preview for ${templateId}:`, error);
    }
  }
  
  console.log("Finished uploading previews.");
}

uploadPreviews().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
