import Resume from "../models/Resume";
import ResumeVersion from "../models/ResumeVersion";
import ResumeFile from "../models/ResumeFile";
import SocialLink from "../models/SocialLink";
import * as cloudinaryService from "./cloudinary.service";
import * as templateService from "./template.service";
import * as pdfService from "./pdf.service";

function transformDates(obj: any): any {
  if (typeof obj === "string") {
    const date = new Date(obj);
    if (!isNaN(date.getTime())) {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
      };
      return date.toLocaleDateString("en-US", options).toLowerCase();
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(transformDates);
  } else if (obj && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = transformDates(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function create(payload: any, ownerId: string) {
  const resumeData: any = {
    title: payload.title || "Untitled",
    template: payload.template || "modern",
    ownerId,
  };
  // Extract candidateName from initial data if provided
  if (payload.data?.personal?.name) {
    resumeData.candidateName = payload.data.personal.name;
  }
  const r = new Resume(resumeData);
  await r.save();

  // Always create an initial version with default data
  const initialData = payload.data
    ? transformDates(payload.data)
    : {
        personal: {
          name: "Your Name",
          email: "",
          phone: "",
          alternatePhone: "",
          location: "",
          pinCode: "",
          country: "",
          dob: "",
          maritalStatus: "",
          gender: "",
          fathersName: "",
          fullAddress: "",
          image: "",
          middleName: "",
        },
        summary:
          "Brief professional summary highlighting your key skills and experience.",
        careerObjective: "",
        experience: [
          {
            id: "exp-1",
            title: "Software Engineer",
            company: "Example Company",
            domain: "Technology",
            location: "San Francisco, CA",
            startDate: "2022-01",
            endDate: "Present",
            isCurrent: true,
            description:
              "Leading development of scalable web applications using React and Node.js.",
            achievements:
              "• Increased user engagement by 25%\n• Led team of 5 developers\n• Implemented CI/CD pipeline reducing deployment time by 40%",
          },
        ],
        projects: [],
        education: [],
        skills: ["Skill 1", "Skill 2", "Skill 3"],
        languages: [],
        hobbies: [],
        keyAchievements: [],
        responsibilities: [],
        tools: [],
        socialLinks: [],
        certifications: [],
        awards: [],
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
      };
  const version = new ResumeVersion({
    resumeId: r._id,
    resume: r._id,
    data: initialData,
  });
  await version.save();
  r.versions.push(version._id);
  await r.save();

  return r;
}

export async function list(ownerId: string) {
  console.log("[resumeService.list] Starting query for ownerId:", ownerId);

  try {
    // First, count resumes without population for debugging
    const count = await Resume.countDocuments({ ownerId });
    console.log(
      "[resumeService.list] Found",
      count,
      "resumes for ownerId:",
      ownerId
    );

    if (count === 0) {
      console.log(
        "[resumeService.list] No resumes found, returning empty array"
      );
      return [];
    }

    // Now fetch with population
    console.log("[resumeService.list] Fetching resumes with population...");
    const resumes = await Resume.find({ ownerId })
      .populate({
        path: "versions",
        options: { sort: { createdAt: -1 }, limit: 1 }, // Only get latest version
      })
      .populate("files")
      .sort({ updatedAt: -1 }); // Sort by most recently updated

    console.log(
      "[resumeService.list] Successfully fetched",
      resumes.length,
      "resumes"
    );

    // Transform the data to match frontend expectations
    const transformed = resumes.map((resume) => ({
      id: resume._id.toString(),
      title: resume.title,
      candidateName: resume.candidateName || "Unknown Candidate",
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      template: resume.template,
      versions: resume.versions,
      files: resume.files,
    }));

    console.log(
      "[resumeService.list] Transformed",
      transformed.length,
      "resumes"
    );
    return transformed;
  } catch (error) {
    console.error("[resumeService.list] Error:", error);
    throw error;
  }
}

export async function get(id: string, ownerId: string) {
  return Resume.findOne({ _id: id, ownerId })
    .populate("versions")
    .populate("files");
}

export async function remove(id: string, ownerId: string) {
  // Get resume files to delete from Cloudinary
  const files = await ResumeFile.find({ resumeId: id });

  // Delete files from Cloudinary
  for (const file of files) {
    if (file.publicId) {
      try {
        await cloudinaryService.deleteFile(file.publicId);
      } catch (error) {
        console.error(
          `Failed to delete Cloudinary file ${file.publicId}:`,
          error
        );
      }
    }
  }

  // Get version ids to delete socialLinks
  const versions = await ResumeVersion.find({ resumeId: id }).select("_id");

  // Delete associated files, socialLinks, and versions first
  await ResumeFile.deleteMany({ resumeId: id });
  await SocialLink.deleteMany({
    resumeId: { $in: versions.map((v) => v._id) },
  });
  await ResumeVersion.deleteMany({ resumeId: id });
  return Resume.findByIdAndDelete(id);
}

export async function saveHtmlVersion(
  resumeId: string,
  htmlContent: string,
  filename?: string
) {
  try {
    const uploadResult = await cloudinaryService.uploadHTML(
      htmlContent,
      resumeId,
      "html"
    );

    // Save file metadata to database
    const file = new ResumeFile({
      resumeId,
      resume: resumeId,
      filename: filename || `resume-${resumeId}-${Date.now()}.html`,
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      format: "html",
      mimeType: "text/html",
      size: uploadResult.bytes,
      resourceType: uploadResult.resource_type,
    });
    await file.save();
    return file;
  } catch (error) {
    console.error("Failed to save HTML version:", error);
    throw error;
  }
}

export async function savePdfVersion(
  resumeId: string,
  pdfBuffer: Buffer,
  filename?: string
) {
  try {
    const uploadResult = await cloudinaryService.uploadPDF(pdfBuffer, resumeId);

    // Save file metadata to database
    const file = new ResumeFile({
      resumeId,
      resume: resumeId,
      filename: filename || `resume-${resumeId}-${Date.now()}.pdf`,
      publicId: uploadResult.public_id,
      url: uploadResult.url,
      secureUrl: uploadResult.secure_url,
      format: "pdf",
      mimeType: "application/pdf",
      size: uploadResult.bytes,
      resourceType: uploadResult.resource_type,
    });
    await file.save();
    return file;
  } catch (error) {
    console.error("Failed to save PDF version:", error);
    throw error;
  }
}

export async function generateAndSaveFiles(
  resumeId: string,
  data: any,
  template?: string
) {
  try {
    // Generate HTML
    const htmlContent = await templateService.renderResumeHtml(
      resumeId,
      template,
      undefined,
      data
    );
    await saveHtmlVersion(resumeId, htmlContent);

    // Generate and save PDF
    const pdfBuffer = await pdfService.generatePdfBuffer(htmlContent);
    await savePdfVersion(resumeId, pdfBuffer);

    return { success: true };
  } catch (error) {
    console.error("Failed to generate and save files:", error);
    throw error;
  }
}
