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

  export async function create(
    payload: any,
    userId: string | null,
    guestId: string | null
  ) {
    const resumeData: any = {
      title: payload.title || "Untitled",
      template: payload.template || "modern",
      ownerId: userId || null,
      guestId: guestId || null,
    };

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

  export async function list(userId: string | null, guestId: string | null) {
    let query: any = {};

    if (userId && guestId) {
      // Fetch both user-owned and guest-owned resumes
      query.$or = [{ ownerId: userId }, { guestId: guestId }];
    } else if (userId) {
      // Logged-in → ONLY user resumes
      query = { ownerId: userId };
    } else if (guestId) {
      //  Guest → ONLY guest resumes
      query = { guestId: guestId };
    } else {
      return [];
    }

    const resumes = await Resume.find(query)
      .populate({
        path: "versions",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .populate("files")
      .sort({ updatedAt: -1 });

    return resumes.map((resume) => ({
      id: resume._id.toString(),
      title: resume.title,
      candidateName: resume.candidateName || "Unknown Candidate",
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
       isParsed: resume.isParsed, 
      isAiEnhanced: resume.isAiEnhanced,
      isDownloaded: resume.isDownloaded,
      template: resume.template,
      versions: resume.versions,
      files: resume.files,
      ownerId: resume.ownerId,
    }));
  }

  export async function get(id: string, userId: string | null, guestId: string | null) {
    // If both are null, return null (no access)
    if (!userId && !guestId) {
      return null;
    }

    const query: any = { _id: id };

    if (userId && guestId) {
      query.$or = [{ ownerId: userId }, { guestId: guestId }];
    } else if (userId) {
      // 🔵 Logged-in → check ownerId
      query.ownerId = userId;
    } else if (guestId) {
      // 🟢 Guest → check guestId
      query.guestId = guestId;
    }

    return Resume.findOne(query)
      .populate("versions")
      .populate("files");
  }

  export async function remove(id: string, userId: string | null, guestId: string | null) {
    // If both are null, throw error
    if (!userId && !guestId) {
      throw new Error("Unauthorized: No user or guest ID provided");
    }

    const query: any = { _id: id };

    if (userId && guestId) {
      query.$or = [{ ownerId: userId }, { guestId: guestId }];
    } else if (userId) {
      // 🔵 Logged-in → check ownerId
      query.ownerId = userId;
    } else if (guestId) {
      // 🟢 Guest → check guestId
      query.guestId = guestId;
    }

    const resume = await Resume.findOne(query);

    if (!resume) {
      throw new Error("Unauthorized or not found");
    }

    // delete files
    const files = await ResumeFile.find({ resumeId: id });

    for (const file of files) {
      if (file.publicId) {
        try {
          await cloudinaryService.deleteFile(file.publicId, (file.resourceType || 'raw') as 'raw' | 'image' | 'video');
        } catch (error) {
          console.error("Cloudinary delete failed:", error);
        }
      }
    }

    const versions = await ResumeVersion.find({ resumeId: id }).select("_id");

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
        url: uploadResult.secure_url,
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
        url: uploadResult.secure_url,
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