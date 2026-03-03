import { Request, Response } from "express";
import User from "../models/User";
import Resume from "../models/Resume";
import ResumeVersion from "../models/ResumeVersion";
import Language from "../models/Language";
import Hobby from "../models/Hobby";
import KeyAchievement from "../models/KeyAchievement";
import Responsibility from "../models/Responsibility";
import Tool from "../models/Tool";
import SocialLink from "../models/SocialLink";
import Certification from "../models/Certification";
import Award from "../models/Award";
import SpeakingEngagement from "../models/SpeakingEngagement";
import Membership from "../models/Membership";
import Workshop from "../models/Workshop";
import CustomSection from "../models/CustomSection";
import CustomSectionEntry from "../models/CustomSectionEntry";
import ResumeFile from "../models/ResumeFile";
import * as resumeService from "../services/resume.service";
import mongoose from "mongoose";

// New model imports for sub-sections
import ClientProject from "../models/ClientProject";
import Portfolio from "../models/Portfolio";
import Volunteering from "../models/Volunteering";
import MilitaryService from "../models/MilitaryService";
import ToolTechnology from "../models/ToolTechnology";
import Methodology from "../models/Methodology";
import IndustryExpertise from "../models/IndustryExpertise";
import Reference from "../models/Reference";
import SocialProfile from "../models/SocialProfile";
import AvailabilityWorkAuth from "../models/AvailabilityWorkAuth";
import Internship from "../models/Internship";
import AcademicProject from "../models/AcademicProject";
import LeadershipPosition from "../models/LeadershipPosition";
import TrainingProgram from "../models/TrainingProgram";
import Scholarship from "../models/Scholarship";
import CoCurricular from "../models/CoCurricular";
import Extracurricular from "../models/Extracurricular";
import CareerObjective from "../models/CareerObjective";
import TeachingExperience from "../models/TeachingExperience";
import MentorshipExperience from "../models/MentorshipExperience";
import ResearchGrant from "../models/ResearchGrant";
import TestScore from "../models/TestScore";
import Publication from "../models/Publication";
import Patent from "../models/Patent";
import ProfessionalContext from "../models/ProfessionalContext";

// Helper function to extract string from params (handles array case)
function getStringParam(param: string | string[]): string | undefined {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}

// Common default export:
// import {ResumeModel} from '../models/resume.model'

// If the model is a named export:
// import { ResumeModel } from '../models/resume.model'
// or
import ResumeModel from "../models/Resume";

export async function createResume(req: Request, res: Response) {
  try {
    // Prefer `req.userId` set by auth.middleware; fall back to older `req.user` shape if present
    const userId =
      (req as any).userId || (req as any).user?.id || (req as any).user?.userId;
    if (!userId) {
      console.log("[createResume] Missing user id on request");
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    // Minimal default resume data (do not add unwanted sections here)
    const defaultData = {
      title: req.body?.title || "Untitled Resume",
      personal: {
        name: "",
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
        image: "",
        middleName: "",
      },
      summary: "",
      experience: [],
      projects: [],
      education: [],
      skills: [],
      customSections: [],
      professionalContext: {},
    };

    // Ensure required schema fields are provided: ownerId and title (some schemas use ownerId)
    const resumePayload: any = {
      // use the schema's expected owner field name — ownerId here per validation error
      ownerId: userId,
      title: defaultData.title,
      template: req.body?.template || "modern", // Default to modern if no template specified
      data: defaultData,
    };

    const resume = await ResumeModel.create(resumePayload);
    return res.status(201).json(resume);
  } catch (err) {
    console.error("createResume error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create resume", error: err });
  }
}

export async function listResumes(req: Request, res: Response) {
  try {
    const userId = req.userId;
    console.log("[listResumes] userId:", userId);
    if (!userId) {
      console.log("[listResumes] No userId found in request");
      return res.status(401).json({ error: "not authenticated" });
    }

    const items = await resumeService.list(userId);
    console.log("[listResumes] Found resumes:", items.length);
    console.log("[listResumes] Resume data sample:", items.slice(0, 2)); // Log first 2 items

    // Validate the response structure
    if (!Array.isArray(items)) {
      console.error("[listResumes] Service returned non-array:", typeof items);
      return res
        .status(500)
        .json({ error: "Invalid response format from service" });
    }

    // Check for any invalid items
    const validItems = items.filter((item) => {
      const isValid =
        item &&
        typeof item === "object" &&
        item.id &&
        typeof item.id === "string";
      if (!isValid) {
        console.warn("[listResumes] Filtering out invalid item:", item);
      }
      return isValid;
    });

    if (validItems.length !== items.length) {
      console.warn(
        `[listResumes] Filtered ${
          items.length - validItems.length
        } invalid items`
      );
    }

    console.log("[listResumes] Returning valid resumes:", validItems.length);
    res.json(validItems);
  } catch (err: any) {
    console.error("listResumes error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function getResume(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "not authenticated" });
    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Check ownership or admin access
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Allow access if user is owner or admin
    if (resume.ownerId.toString() !== userId && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const item = await resumeService.get(id, resume.ownerId.toString()); // Use actual owner for data retrieval
    if (!item) return res.status(404).json({ error: "not found" });

    // Include languages and hobbies in the response
    const latestVersion = (item.versions as any)?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (latestVersion) {
      console.log(
        "[getResume] Latest version data keys:",
        Object.keys(latestVersion.data || {})
      );
      console.log(
        "[getResume] Certifications in data:",
        (latestVersion.data as any)?.certifications
      );
      console.log(
        "[getResume] CustomSections in data:",
        (latestVersion.data as any)?.customSections
      );
      const languages = await Language.find({
        resumeId: latestVersion._id,
      }).select("name proficiency capability");

      const hobbies = await Hobby.find({ resumeId: latestVersion._id }).select(
        "name"
      );

      const keyAchievements = await KeyAchievement.find({
        resumeId: latestVersion._id,
      }).select("description");

      const responsibilities = await Responsibility.find({
        resumeId: latestVersion._id,
      }).select("description");

      const tools = await Tool.find({ resumeId: latestVersion._id }).select(
        "name"
      );

      const socialLinks = await SocialLink.find({
        resumeId: latestVersion._id,
      }).select("text url");
      console.log("[getResume] fetched socialLinks count:", socialLinks.length);

      const certifications = await Certification.find({
        resumeId: latestVersion._id,
      }).select("name issuer date url");

      const awards = await Award.find({
        resumeId: latestVersion._id,
      }).select("title organization issueYear description");

      const speakingEngagements = await SpeakingEngagement.find({
        resumeId: latestVersion._id,
      }).select("topic eventName organization date location description url");

      const memberships = await Membership.find({
        resumeId: latestVersion._id,
      }).select(
        "organization membershipType startDate endDate description url"
      );

      const workshops = await Workshop.find({
        resumeId: latestVersion._id,
      }).select(
        "title instructor organization date location description certificateUrl"
      );

      const customSections = await CustomSection.find({
        resumeId: latestVersion._id,
      }).populate("entries");

      // Fetch new sub-section data
      const clientProjects = await ClientProject.find({
        resumeId: latestVersion._id,
      });

      const portfolio = await Portfolio.find({
        resumeId: latestVersion._id,
      });

      const volunteering = await Volunteering.find({
        resumeId: latestVersion._id,
      });

      const militaryService = await MilitaryService.find({
        resumeId: latestVersion._id,
      });

      const toolTechnologies = await ToolTechnology.find({
        resumeId: latestVersion._id,
      });

      const methodologies = await Methodology.find({
        resumeId: latestVersion._id,
      });

      const industryExpertise = await IndustryExpertise.find({
        resumeId: latestVersion._id,
      });

      const references = await Reference.find({
        resumeId: latestVersion._id,
      });

      const socialProfiles = await SocialProfile.find({
        resumeId: latestVersion._id,
      });

      const availabilityWorkAuth = await AvailabilityWorkAuth.find({
        resumeId: latestVersion._id,
      });

      const internships = await Internship.find({
        resumeId: latestVersion._id,
      });

      const academicProjects = await AcademicProject.find({
        resumeId: latestVersion._id,
      });

      const leadershipPositions = await LeadershipPosition.find({
        resumeId: latestVersion._id,
      });

      const trainingPrograms = await TrainingProgram.find({
        resumeId: latestVersion._id,
      });

      const scholarships = await Scholarship.find({
        resumeId: latestVersion._id,
      });

      const coCurricular = await CoCurricular.find({
        resumeId: latestVersion._id,
      });

      const extracurricular = await Extracurricular.find({
        resumeId: latestVersion._id,
      });

      const careerObjective = await CareerObjective.find({
        resumeId: latestVersion._id,
      });

      const teachingExperience = await TeachingExperience.find({
        resumeId: latestVersion._id,
      });

      const mentorshipExperience = await MentorshipExperience.find({
        resumeId: latestVersion._id,
      });

      const researchGrants = await ResearchGrant.find({
        resumeId: latestVersion._id,
      });

      const testScores = await TestScore.find({
        resumeId: latestVersion._id,
      });

      const publications = await Publication.find({
        resumeId: latestVersion._id,
      });

      const patents = await Patent.find({
        resumeId: latestVersion._id,
      });

      const professionalContext = await ProfessionalContext.findOne({
        resumeVersion: latestVersion._id,
      });

      // Add all data to the response
      if (latestVersion.data && typeof latestVersion.data === "object") {
        (latestVersion.data as any).languages = languages.map((l: any) => ({
          language: l.name,
          level: l.proficiency || "Intermediate",
          capability: l.capability || "",
        }));
        (latestVersion.data as any).hobbies = hobbies.map((h: any) => h.name);
        (latestVersion.data as any).keyAchievements = keyAchievements.map(
          (k: any) => k.description
        );
        (latestVersion.data as any).responsibilities = responsibilities.map(
          (r: any) => r.description
        );
        (latestVersion.data as any).tools = tools.map((t: any) => t.name);
        (latestVersion.data as any).socialLinks = socialLinks.map((l: any) => ({
          urlText: l.text,
          url: l.url,
        }));
        (latestVersion.data as any).certifications = certifications.map(
          (c: any) => ({
            id: c._id.toString(),
            name: c.name,
            issuer: c.issuer,
            date: c.date,
            url: c.url,
          })
        );
        (latestVersion.data as any).awards = awards.map((a: any) => ({
          id: a._id.toString(),
          title: a.title,
          organization: a.organization,
          issueYear: a.issueYear,
          description: a.description,
        }));
        (latestVersion.data as any).speakingEngagements =
          speakingEngagements.map((s: any) => ({
            id: s._id.toString(),
            topic: s.topic,
            eventName: s.eventName,
            organization: s.organization,
            date: s.date,
            location: s.location,
            description: s.description,
            url: s.url,
          }));
        (latestVersion.data as any).memberships = memberships.map((m: any) => ({
          id: m._id.toString(),
          organization: m.organization,
          membershipType: m.membershipType,
          startDate: m.startDate,
          endDate: m.endDate,
          description: m.description,
          url: m.url,
        }));
        (latestVersion.data as any).workshops = workshops.map((w: any) => ({
          id: w._id.toString(),
          title: w.title,
          instructor: w.instructor,
          organization: w.organization,
          date: w.date,
          location: w.location,
          description: w.description,
          certificateUrl: w.certificateUrl,
        }));
        (latestVersion.data as any).customSections = customSections.map(
          (cs: any) => ({
            heading: cs.title,
            isVisible: cs.isVisible,
            entries: cs.entries.map((entry: any) => ({
              title: entry.title,
              organization: entry.organization,
              date: entry.date,
              description: entry.description,
              isVisible: entry.isVisible,
            })),
          })
        );

        // Add new sub-section data to response
        (latestVersion.data as any).clientProjects = clientProjects.map(
          (p: any) => ({
            id: p._id.toString(),
            name: p.name,
            client: p.client,
            role: p.role,
            startDate: p.startDate,
            endDate: p.endDate,
            description: p.description,
            technologies: p.technologies,
            url: p.url,
          })
        );

        (latestVersion.data as any).portfolio = portfolio.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          description: p.description,
          url: p.url,
          imageUrl: p.imageUrl,
        }));

        (latestVersion.data as any).volunteering = volunteering.map(
          (v: any) => ({
            id: v._id.toString(),
            organization: v.organization,
            role: v.role,
            startDate: v.startDate,
            endDate: v.endDate,
            description: v.description,
          })
        );

        (latestVersion.data as any).militaryService = militaryService.map(
          (m: any) => ({
            id: m._id.toString(),
            branch: m.branch,
            rank: m.rank,
            unit: m.unit,
            startDate: m.startDate,
            endDate: m.endDate,
            description: m.description,
          })
        );

        (latestVersion.data as any).toolTechnologies = toolTechnologies.map(
          (t: any) => ({
            id: t._id.toString(),
            name: t.name,
            category: t.category,
          })
        );

        (latestVersion.data as any).methodologies = methodologies.map(
          (m: any) => ({
            id: m._id.toString(),
            name: m.name,
            description: m.description,
          })
        );

        (latestVersion.data as any).industryExpertise = industryExpertise.map(
          (i: any) => ({
            id: i._id.toString(),
            industry: i.industry,
            years: i.years,
            description: i.description,
          })
        );

        (latestVersion.data as any).references = references.map((r: any) => ({
          id: r._id.toString(),
          name: r.name,
          title: r.title,
          company: r.company,
          email: r.email,
          phone: r.phone,
          relationship: r.relationship,
        }));

        (latestVersion.data as any).socialProfiles = socialProfiles.map(
          (s: any) => ({
            id: s._id.toString(),
            platform: s.platform,
            url: s.url,
          })
        );

        (latestVersion.data as any).availabilityWorkAuth =
          availabilityWorkAuth.map((a: any) => ({
            id: a._id.toString(),
            status: a.status,
            noticePeriod: a.noticePeriod,
            workLocation: a.workLocation,
            visaStatus: a.visaStatus,
          }));

        (latestVersion.data as any).internships = internships.map((i: any) => ({
          id: i._id.toString(),
          title: i.title,
          company: i.company,
          startDate: i.startDate,
          endDate: i.endDate,
          location: i.location,
          description: i.description,
        }));

        (latestVersion.data as any).academicProjects = academicProjects.map(
          (p: any) => ({
            id: p._id.toString(),
            name: p.title,
            course: p.course,
            institution: p.institution,
            duration: p.duration,
            startDate: p.startDate,
            endDate: p.endDate,
            description: p.description,
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            url: p.url,
          })
        );

        (latestVersion.data as any).leadershipPositions =
          leadershipPositions.map((l: any) => ({
            id: l._id.toString(),
            position: l.title, // Map "title" (DB) to "position" (frontend)
            organization: l.organization,
            startDate: l.startDate,
            endDate: l.endDate,
            description: l.description,
          }));

        (latestVersion.data as any).trainingPrograms = trainingPrograms.map(
          (t: any) => ({
            id: t._id.toString(),
            name: t.name,
            provider: t.organization,
            completionDate: t.completionDate,
            duration: t.duration,
            description: t.description,
          })
        );

        (latestVersion.data as any).scholarships = scholarships.map(
          (s: any) => ({
            id: s._id.toString(),
            name: s.name,
            provider: s.provider,
            organization: s.provider,
            year: s.year,
            amount: s.amount,
            description: s.description,
          })
        );

        (latestVersion.data as any).coCurricular = coCurricular.map(
          (c: any) => ({
            id: c._id.toString(),
            activity: c.activity,
            role: c.role,
            organization: c.organization,
            year: c.year,
            startDate: c.startDate,
            endDate: c.endDate,
            description: c.description,
          })
        );

        (latestVersion.data as any).extracurricular = extracurricular.map(
          (e: any) => ({
            id: e._id.toString(),
            activity: e.activity,
            role: e.role,
            organization: e.organization,
            year: e.year,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
          })
        );

        (latestVersion.data as any).careerObjective =
          careerObjective.length > 0 ? careerObjective[0].objective : "";

        (latestVersion.data as any).teachingExperience = teachingExperience.map(
          (t: any) => ({
            id: t._id.toString(),
            title: t.title,
            institution: t.institution,
            course: t.course,
            startDate: t.startDate,
            endDate: t.endDate,
            description: t.description,
          })
        );

        (latestVersion.data as any).mentorshipExperience =
          mentorshipExperience.map((m: any) => ({
            id: m._id.toString(),
            menteeName: m.menteeName,
            menteeCount: m.menteeCount,
            program: m.program,
            organization: m.organization,
            startDate: m.startDate,
            endDate: m.endDate,
            description: m.description,
          }));

        (latestVersion.data as any).researchGrants = researchGrants.map(
          (r: any) => ({
            id: r._id.toString(),
            title: r.title,
            agency: r.agency,
            amount: r.amount,
            startDate: r.startDate,
            endDate: r.endDate,
            description: r.description,
          })
        );

        (latestVersion.data as any).testScores = testScores.map((t: any) => ({
          id: t._id.toString(),
          testName: t.testName,
          score: t.score,
          maxScore: t.maxScore,
          date: t.date,
        }));

        (latestVersion.data as any).publications = publications.map(
          (p: any) => ({
            id: p._id.toString(),
            title: p.title,
            authors: p.authors,
            journal: p.journal,
            conference: p.conference,
            publicationDate: p.publicationDate,
            doi: p.doi,
            url: p.url,
          })
        );

        (latestVersion.data as any).patents = patents.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          inventors: p.inventors,
          patentNumber: p.patentNumber,
          filingDate: p.filingDate,
          issueDate: p.issueDate,
          status: p.status,
        }));

        // Add professionalContext to response
        (latestVersion.data as any).professionalContext =
          professionalContext
            ? {
                id: professionalContext._id.toString(),
                totalExperience: professionalContext.totalExperience,
                teamSize: professionalContext.teamSize,
                industry: professionalContext.industry,
                industryCustom: professionalContext.industryCustom,
                functionalDomain: professionalContext.functionalDomain,
                functionalDomainCustom:
                  professionalContext.functionalDomainCustom,
                geographicScope: professionalContext.geographicScope,
                revenueResponsibility:
                  professionalContext.revenueResponsibility,
              }
            : {};
      }
      console.log(
        "[getResume] Final data keys:",
        Object.keys(latestVersion.data || {})
      );
    }

    res.json(item);
  } catch (err: any) {
    console.error("getResume error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function updateResume(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = req.userId;
    const { data, template, title } = req.body;
    console.log("[updateResume] Received data keys:", Object.keys(data || {}));
    console.log("[updateResume] Certifications in data:", data?.certifications);
    console.log("[updateResume] CustomSections in data:", data?.customSections);
    if (!userId) return res.status(401).json({ error: "not authenticated" });
    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!data && !template && !title)
      return res
        .status(400)
        .json({ error: "data, template, or title required" });

    // Verify resume ownership
    const resume = await Resume.findOne({ _id: id, ownerId: userId });
    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Update template if provided
    if (template) {
      resume.template = template;
      await resume.save();
    }

    // Update title if provided
    if (title) {
      resume.title = title;
      await resume.save();
    }

    // Update candidateName if personal.name is provided
    if (data?.personal?.name) {
      resume.candidateName = data.personal.name;
      await resume.save();
    }

    // Create new version if data is provided
    if (data) {
      const version = new ResumeVersion({
        resumeId: id,
        resume: id,
        data,
      });
      await version.save();
      resume.versions.push(version._id);
      await resume.save();
      console.log(
        "[updateResume] Created version with data keys:",
        Object.keys(version.data)
      );
      console.log(
        "[updateResume] careerObjective in data:",
        data.careerObjective
      );

      // Handle languages if provided
      if (data.languages && Array.isArray(data.languages)) {
        // Delete existing languages for this version
        await Language.deleteMany({ resumeId: version._id });

        // Create new languages
        if (data.languages.length > 0) {
          const langDocs = data.languages.map((lang: any) => ({
            resumeId: version._id,
            resumeVersion: version._id,
            name: lang.language,
            proficiency: lang.level,
            capability: lang.capability,
          }));
          await Language.insertMany(langDocs);
        }
      }

      // Handle hobbies if provided
      if (data.hobbies && Array.isArray(data.hobbies)) {
        // Delete existing hobbies for this version
        await Hobby.deleteMany({ resumeId: version._id });

        // Create new hobbies
        if (data.hobbies.length > 0) {
          const hobbyDocs = data.hobbies.map((hobby: string) => ({
            resumeId: version._id,
            resumeVersion: version._id,
            name: hobby,
          }));
          await Hobby.insertMany(hobbyDocs);
        }
      }

      // Handle keyAchievements if provided
      if (data.keyAchievements && Array.isArray(data.keyAchievements)) {
        // Delete existing keyAchievements for this version
        await KeyAchievement.deleteMany({ resumeId: version._id });

        // Create new keyAchievements
        if (data.keyAchievements.length > 0) {
          const achDocs = data.keyAchievements.map((achievement: string) => ({
            resumeId: version._id,
            resumeVersion: version._id,
            description: achievement,
          }));
          await KeyAchievement.insertMany(achDocs);
        }
      }

      // Handle responsibilities if provided
      if (data.responsibilities && Array.isArray(data.responsibilities)) {
        // Delete existing responsibilities for this version
        await Responsibility.deleteMany({ resumeId: version._id });

        // Create new responsibilities
        if (data.responsibilities.length > 0) {
          const respDocs = data.responsibilities.map(
            (responsibility: string) => ({
              resumeId: version._id,
              resumeVersion: version._id,
              description: responsibility,
            })
          );
          await Responsibility.insertMany(respDocs);
        }
      }

      // Handle tools if provided
      if (data.tools && Array.isArray(data.tools)) {
        // Delete existing tools for this version
        await Tool.deleteMany({ resumeId: version._id });

        // Create new tools
        if (data.tools.length > 0) {
          const toolDocs = data.tools.map((tool: string) => ({
            resumeId: version._id,
            resumeVersion: version._id,
            name: tool,
          }));
          await Tool.insertMany(toolDocs);
        }
      }

      // Handle socialLinks if provided
      if (data.socialLinks && Array.isArray(data.socialLinks)) {
        console.log("[updateResume] socialLinks data:", data.socialLinks);
        // Delete existing socialLinks for this version
        await SocialLink.deleteMany({ resumeId: version._id });

        // Filter out social links with empty URLs before saving
        const validSocialLinks = data.socialLinks.filter(
          (link: any) => link.urlText && link.url && link.url.trim() !== ""
        );

        // Create new socialLinks
        if (validSocialLinks.length > 0) {
          const socialLinkDocs = validSocialLinks.map((link: any) => {
            console.log("[updateResume] processing link:", link);
            return {
              resumeId: version._id,
              resumeVersion: version._id,
              text: link.urlText,
              url: link.url,
            };
          });
          console.log(
            "[updateResume] socialLinkDocs to insert:",
            socialLinkDocs
          );
          await SocialLink.insertMany(socialLinkDocs);
          console.log("[updateResume] socialLinks inserted successfully");
        }
      } else {
        console.log("[updateResume] no socialLinks in data or not array");
      }

      // Handle certifications if provided
      if (data.certifications && Array.isArray(data.certifications)) {
        // Delete existing certifications for this version
        await Certification.deleteMany({ resumeId: version._id });

        // Create new certifications
        if (data.certifications.length > 0) {
          const certDocs = data.certifications.map((cert: any) => ({
            resumeId: version._id,
            resumeVersion: version._id,
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            url: cert.url,
          }));
          await Certification.insertMany(certDocs);
        }
      }

      // Handle customSections if provided
      if (data.customSections && Array.isArray(data.customSections)) {
        console.log("[updateResume] customSections data:", data.customSections);
        // Delete existing customSections for this version
        await CustomSection.deleteMany({ resumeId: version._id });

        // Create new customSections
        if (data.customSections.length > 0) {
          for (const section of data.customSections) {
            console.log("[updateResume] processing section:", section);
            const sectionDoc = new CustomSection({
              resumeId: version._id,
              resumeVersion: version._id,
              title: section.heading,
              isVisible: section.isVisible,
            });
            await sectionDoc.save();

            // Handle entries for this section
            if (section.entries && Array.isArray(section.entries)) {
              const entryDocs = section.entries.map((entry: any) => ({
                customSectionId: sectionDoc._id,
                resumeId: version._id,
                resumeVersion: version._id,
                title: entry.title,
                organization: entry.organization,
                date: entry.date,
                description: entry.description,
                isVisible: entry.isVisible,
              }));
              await CustomSectionEntry.insertMany(entryDocs);
            }
          }
        }
      }

      // Handle clientProjects if provided
      if (data.clientProjects && Array.isArray(data.clientProjects)) {
        await ClientProject.deleteMany({ resumeId: version._id });
        if (data.clientProjects.length > 0) {
          const docs = data.clientProjects.map((item: any) => ({
            resumeId: version._id,
            name: item.name,
            client: item.client,
            role: item.role,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            technologies: item.technologies,
            url: item.url,
          }));
          await ClientProject.insertMany(docs);
        }
      }

      // Handle portfolio if provided
      if (data.portfolio && Array.isArray(data.portfolio)) {
        await Portfolio.deleteMany({ resumeId: version._id });
        if (data.portfolio.length > 0) {
          const docs = data.portfolio.map((item: any) => ({
            resumeId: version._id,
            title: item.title,
            description: item.description,
            url: item.url,
            imageUrl: item.imageUrl,
          }));
          await Portfolio.insertMany(docs);
        }
      }

      // Handle volunteering if provided
      if (data.volunteering && Array.isArray(data.volunteering)) {
        await Volunteering.deleteMany({ resumeId: version._id });
        if (data.volunteering.length > 0) {
          const docs = data.volunteering.map((item: any) => ({
            resumeId: version._id,
            organization: item.organization,
            role: item.role,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await Volunteering.insertMany(docs);
        }
      }

      // Handle militaryService if provided
      if (data.militaryService && Array.isArray(data.militaryService)) {
        await MilitaryService.deleteMany({ resumeId: version._id });
        if (data.militaryService.length > 0) {
          const docs = data.militaryService.map((item: any) => ({
            resumeId: version._id,
            branch: item.branch,
            rank: item.rank,
            unit: item.unit,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await MilitaryService.insertMany(docs);
        }
      }

      // Handle toolTechnologies if provided
      if (data.toolTechnologies && Array.isArray(data.toolTechnologies)) {
        await ToolTechnology.deleteMany({ resumeId: version._id });
        if (data.toolTechnologies.length > 0) {
          const docs = data.toolTechnologies.map((item: any) => ({
            resumeId: version._id,
            name: item.name,
            category: item.category,
          }));
          await ToolTechnology.insertMany(docs);
        }
      }

      // Handle methodologies if provided
      if (data.methodologies && Array.isArray(data.methodologies)) {
        await Methodology.deleteMany({ resumeId: version._id });
        if (data.methodologies.length > 0) {
          const docs = data.methodologies.map((item: any) => ({
            resumeId: version._id,
            name: item.name,
            description: item.description,
          }));
          await Methodology.insertMany(docs);
        }
      }

      // Handle industryExpertise if provided
      if (data.industryExpertise && Array.isArray(data.industryExpertise)) {
        await IndustryExpertise.deleteMany({ resumeId: version._id });
        if (data.industryExpertise.length > 0) {
          const docs = data.industryExpertise.map((item: any) => ({
            resumeId: version._id,
            industry: item.industry,
            years: item.years,
            description: item.description,
          }));
          await IndustryExpertise.insertMany(docs);
        }
      }

      // Handle references if provided
      if (data.references && Array.isArray(data.references)) {
        await Reference.deleteMany({ resumeId: version._id });
        if (data.references.length > 0) {
          const docs = data.references.map((item: any) => ({
            resumeId: version._id,
            name: item.name,
            title: item.title,
            company: item.company,
            email: item.email,
            phone: item.phone,
            relationship: item.relationship,
          }));
          await Reference.insertMany(docs);
        }
      }

      // Handle socialProfiles if provided
      if (data.socialProfiles && Array.isArray(data.socialProfiles)) {
        await SocialProfile.deleteMany({ resumeId: version._id });
        if (data.socialProfiles.length > 0) {
          const docs = data.socialProfiles.map((item: any) => ({
            resumeId: version._id,
            platform: item.platform,
            url: item.url,
          }));
          await SocialProfile.insertMany(docs);
        }
      }

      // Handle availabilityWorkAuth if provided
      if (
        data.availabilityWorkAuth &&
        Array.isArray(data.availabilityWorkAuth)
      ) {
        await AvailabilityWorkAuth.deleteMany({ resumeId: version._id });
        if (data.availabilityWorkAuth.length > 0) {
          const docs = data.availabilityWorkAuth.map((item: any) => ({
            resumeId: version._id,
            status: item.status,
            noticePeriod: item.noticePeriod,
            workLocation: item.workLocation,
            visaStatus: item.visaStatus,
          }));
          await AvailabilityWorkAuth.insertMany(docs);
        }
      }

      // Handle internships if provided
      if (data.internships && Array.isArray(data.internships)) {
        await Internship.deleteMany({ resumeId: version._id });
        if (data.internships.length > 0) {
          const docs = data.internships.map((item: any) => ({
            resumeId: version._id,
            title: item.title,
            company: item.company,
            location: item.location,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await Internship.insertMany(docs);
        }
      }

      // Handle academicProjects if provided
      if (data.academicProjects && Array.isArray(data.academicProjects)) {
        console.log(
          "[updateResume] academicProjects received:",
          JSON.stringify(data.academicProjects)
        );
        await AcademicProject.deleteMany({ resumeId: version._id });
        if (data.academicProjects.length > 0) {
          console.log(
            "[updateResume] Saving academicProjects:",
            data.academicProjects.length,
            "items"
          );
          const docs = data.academicProjects.map((item: any) => ({
            resumeId: version._id,
            title: item.name || item.title,
            course: item.course,
            institution: item.institution,
            duration: item.duration,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            technologies: Array.isArray(item.technologies)
              ? item.technologies
              : [],
            url: item.url,
          }));
          console.log(
            "[updateResume] academicProjects docs to insert:",
            JSON.stringify(docs)
          );
          await AcademicProject.insertMany(docs);
          console.log("[updateResume] academicProjects inserted successfully");
        }
      } else {
        console.log("[updateResume] No academicProjects in data or not array");
      }

      // Handle leadershipPositions if provided
      if (data.leadershipPositions && Array.isArray(data.leadershipPositions)) {
        await LeadershipPosition.deleteMany({ resumeId: version._id });
        if (data.leadershipPositions.length > 0) {
          const docs = data.leadershipPositions.map((item: any) => ({
            resumeId: version._id,
            title: item.position || item.title, // Support both "position" (frontend) and "title" (backend)
            organization: item.organization,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await LeadershipPosition.insertMany(docs);
        }
      }

      // Handle trainingPrograms if provided
      if (data.trainingPrograms && Array.isArray(data.trainingPrograms)) {
        await TrainingProgram.deleteMany({ resumeId: version._id });
        if (data.trainingPrograms.length > 0) {
          const docs = data.trainingPrograms.map((item: any) => ({
            resumeId: version._id,
            name: item.name,
            organization: item.provider, // Map frontend "provider" to database "organization"
            completionDate: item.completionDate,
            duration: item.duration,
            description: item.description,
          }));
          await TrainingProgram.insertMany(docs);
        }
      }

      // Handle scholarships if provided
      if (data.scholarships && Array.isArray(data.scholarships)) {
        await Scholarship.deleteMany({ resumeId: version._id });
        if (data.scholarships.length > 0) {
          const docs = data.scholarships.map((item: any) => ({
            resumeId: version._id,
            name: item.name,
            provider: item.provider, // Use provider for "Awarding Body"
            year: item.year,
            amount: item.amount,
            description: item.description,
          }));
          await Scholarship.insertMany(docs);
        }
      }

      // Handle coCurricular if provided
      if (data.coCurricular && Array.isArray(data.coCurricular)) {
        await CoCurricular.deleteMany({ resumeId: version._id });
        if (data.coCurricular.length > 0) {
          const docs = data.coCurricular.map((item: any) => ({
            resumeId: version._id,
            activity: item.activity,
            role: item.role,
            organization: item.organization,
            year: item.year,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await CoCurricular.insertMany(docs);
        }
      }

      // Handle extracurricular if provided
      if (data.extracurricular && Array.isArray(data.extracurricular)) {
        await Extracurricular.deleteMany({ resumeId: version._id });
        if (data.extracurricular.length > 0) {
          const docs = data.extracurricular.map((item: any) => ({
            resumeId: version._id,
            activity: item.activity,
            role: item.role,
            organization: item.organization,
            year: item.year,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await Extracurricular.insertMany(docs);
        }
      }

      // Handle careerObjective if provided
      if (data.careerObjective && typeof data.careerObjective === "string") {
        console.log(
          "[updateResume] Handling careerObjective:",
          data.careerObjective
        );
        await CareerObjective.deleteMany({ resumeId: version._id });
        if (data.careerObjective.trim()) {
          const doc = new CareerObjective({
            resumeId: version._id,
            objective: data.careerObjective,
          });
          await doc.save();
          console.log("[updateResume] CareerObjective saved successfully");
        } else {
          console.log(
            "[updateResume] careerObjective is empty, not saving to collection"
          );
        }
      } else {
        console.log("[updateResume] No careerObjective in data or wrong type");
      }

      // Handle teachingExperience if provided
      if (data.teachingExperience && Array.isArray(data.teachingExperience)) {
        await TeachingExperience.deleteMany({ resumeId: version._id });
        if (data.teachingExperience.length > 0) {
          const docs = data.teachingExperience.map((item: any) => ({
            resumeId: version._id,
            title: item.title,
            institution: item.institution,
            course: item.course,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await TeachingExperience.insertMany(docs);
        }
      }

      // Handle mentorshipExperience if provided
      if (
        data.mentorshipExperience &&
        Array.isArray(data.mentorshipExperience)
      ) {
        await MentorshipExperience.deleteMany({ resumeId: version._id });
        if (data.mentorshipExperience.length > 0) {
          const docs = data.mentorshipExperience.map((item: any) => ({
            resumeId: version._id,
            menteeName: item.menteeName,
            menteeCount: item.menteeCount,
            program: item.program,
            organization: item.organization,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await MentorshipExperience.insertMany(docs);
        }
      }

      // Handle researchGrants if provided
      if (data.researchGrants && Array.isArray(data.researchGrants)) {
        await ResearchGrant.deleteMany({ resumeId: version._id });
        if (data.researchGrants.length > 0) {
          const docs = data.researchGrants.map((item: any) => ({
            resumeId: version._id,
            title: item.title,
            agency: item.agency,
            amount: item.amount,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
          }));
          await ResearchGrant.insertMany(docs);
        }
      }

      // Handle testScores if provided
      if (data.testScores && Array.isArray(data.testScores)) {
        await TestScore.deleteMany({ resumeId: version._id });
        if (data.testScores.length > 0) {
          const docs = data.testScores.map((item: any) => ({
            resumeId: version._id,
            testName: item.testName,
            score: item.score,
            maxScore: item.maxScore,
            date: item.date,
          }));
          await TestScore.insertMany(docs);
        }
      }

      // Handle publications if provided
      if (data.publications && Array.isArray(data.publications)) {
        await Publication.deleteMany({ resumeId: version._id });
        if (data.publications.length > 0) {
          const docs = data.publications.map((item: any) => ({
            resumeId: version._id,
            title: item.title,
            authors: item.authors,
            journal: item.journal,
            conference: item.conference,
            publicationDate: item.publicationDate,
            doi: item.doi,
            url: item.url,
          }));
          await Publication.insertMany(docs);
        }
      }

      // Handle patents if provided
      if (data.patents && Array.isArray(data.patents)) {
        await Patent.deleteMany({ resumeId: version._id });
        if (data.patents.length > 0) {
          const docs = data.patents.map((item: any) => ({
            resumeId: version._id,
            title: item.title,
            inventors: item.inventors,
            patentNumber: item.patentNumber,
            filingDate: item.filingDate,
            issueDate: item.issueDate,
            status: item.status,
          }));
          await Patent.insertMany(docs);
        }
      }

      // Handle professionalContext if provided
      if (
        data.professionalContext &&
        typeof data.professionalContext === "object"
      ) {
        console.log(
          "[updateResume] Handling professionalContext:",
          data.professionalContext
        );
        await ProfessionalContext.deleteMany({ resumeVersion: version._id });
        const {
          totalExperience,
          teamSize,
          industry,
          industryCustom,
          functionalDomain,
          functionalDomainCustom,
          geographicScope,
          revenueResponsibility,
        } = data.professionalContext;

        if (
          totalExperience ||
          teamSize ||
          industry ||
          industryCustom ||
          functionalDomain ||
          functionalDomainCustom ||
          geographicScope ||
          revenueResponsibility
        ) {
          const doc = new ProfessionalContext({
            resumeVersion: version._id,
            totalExperience,
            teamSize,
            industry,
            industryCustom,
            functionalDomain,
            functionalDomainCustom,
            geographicScope,
            revenueResponsibility,
          });
          await doc.save();
          console.log("[updateResume] ProfessionalContext saved successfully");
        } else {
          console.log(
            "[updateResume] professionalContext is empty, not saving to collection"
          );
        }
      } else {
        console.log(
          "[updateResume] No professionalContext in data or wrong type"
        );
      }

      res.json(version);
    } else {
      res.json({ success: true });
    }
  } catch (err: any) {
    console.error("updateResume error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function deleteResume(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "not authenticated" });
    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    const deleted = await resumeService.remove(id, userId);
    res.json(deleted);
  } catch (err: any) {
    console.error("deleteResume error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function generateFiles(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = req.userId;
    const { data, template } = req.body;
    if (!userId) return res.status(401).json({ error: "not authenticated" });
    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume ownership
    const resume = await Resume.findOne({ _id: id, ownerId: userId });
    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Generate and save files to Cloudinary
    const result = await resumeService.generateAndSaveFiles(id, data, template);
    res.json(result);
  } catch (err: any) {
    console.error("generateFiles error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function getFiles(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "not authenticated" });
    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume ownership
    const resume = await Resume.findOne({ _id: id, ownerId: userId });
    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Get files from database
    const files = await ResumeFile.find({ resumeId: id }).sort({
      createdAt: -1,
    });

    res.json(files);
  } catch (err: any) {
    console.error("getFiles error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function downloadFile(req: Request, res: Response) {
  try {
    const fileId = getStringParam(req.params.fileId);
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "not authenticated" });
    if (!fileId || fileId === "undefined")
      return res.status(400).json({ error: "Invalid file ID" });
    if (!mongoose.Types.ObjectId.isValid(fileId))
      return res.status(400).json({ error: "Invalid file ID" });

    // Get file info and verify ownership
    const file = await ResumeFile.findById(fileId).populate("resumeId");

    if (!file || !file.resumeId) {
      return res.status(404).json({ error: "file not found" });
    }

    // Check ownership by getting the resume
    const resume = await Resume.findById(file.resumeId);
    if (!resume || resume.ownerId.toString() !== userId) {
      return res.status(404).json({ error: "file not found" });
    }

    // Redirect to Cloudinary URL for download
    const downloadUrl = file.secureUrl || file.url;
    res.json({
      downloadUrl,
      filename: file.filename,
      format: file.format,
      size: file.size,
    });
  } catch (err: any) {
    console.error("downloadFile error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}