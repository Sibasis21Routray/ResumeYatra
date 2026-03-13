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
import merge from "lodash.merge";

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

    const item = await resumeService.get(id, resume.ownerId.toString());
    if (!item) return res.status(404).json({ error: "not found" });

    // Get the latest version
    const latestVersion = (item.versions as any)?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (latestVersion) {
      console.log(
        "[getResume] Latest version data keys:",
        Object.keys(latestVersion.data || {})
      );

      // IMPORTANT: We need to populate ALL the referenced data
      // Instead of creating enrichedData, we should fetch all related data
      // and attach it to the version object itself
      
      // Fetch all related data using the IDs stored in the version
      
      // Languages
      if (latestVersion.languages && latestVersion.languages.length > 0) {
        const languages = await Language.find({
          _id: { $in: latestVersion.languages }
        }).select("name proficiency capability");
        
        // Add to the data object
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.languages = languages.map((l: any) => ({
          language: l.name,
          level: l.proficiency || "Intermediate",
          capability: l.capability || "",
        }));
      }

      // Hobbies
      if (latestVersion.hobbies && latestVersion.hobbies.length > 0) {
        const hobbies = await Hobby.find({
          _id: { $in: latestVersion.hobbies }
        }).select("name");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.hobbies = hobbies.map((h: any) => h.name);
      }

      // Certifications
      if (latestVersion.certifications && latestVersion.certifications.length > 0) {
        const certifications = await Certification.find({
          _id: { $in: latestVersion.certifications }
        }).select("name issuer date url");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.certifications = certifications.map((c: any) => ({
          id: c._id.toString(),
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          url: c.url,
        }));
      }

      // Awards
      if (latestVersion.awards && latestVersion.awards.length > 0) {
        const awards = await Award.find({
          _id: { $in: latestVersion.awards }
        }).select("title organization issueYear description");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.awards = awards.map((a: any) => ({
          id: a._id.toString(),
          title: a.title,
          organization: a.organization,
          issueYear: a.issueYear,
          description: a.description,
        }));
      }

      // Speaking Engagements
      if (latestVersion.speakingEngagements && latestVersion.speakingEngagements.length > 0) {
        const speakingEngagements = await SpeakingEngagement.find({
          _id: { $in: latestVersion.speakingEngagements }
        }).select("topic eventName organization date location description url");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.speakingEngagements = speakingEngagements.map((s: any) => ({
          id: s._id.toString(),
          topic: s.topic,
          eventName: s.eventName,
          organization: s.organization,
          date: s.date,
          location: s.location,
          description: s.description,
          url: s.url,
        }));
      }

      // Memberships
      if (latestVersion.memberships && latestVersion.memberships.length > 0) {
        const memberships = await Membership.find({
          _id: { $in: latestVersion.memberships }
        }).select("organization membershipType startDate endDate description url");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.memberships = memberships.map((m: any) => ({
          id: m._id.toString(),
          organization: m.organization,
          membershipType: m.membershipType,
          startDate: m.startDate,
          endDate: m.endDate,
          description: m.description,
          url: m.url,
        }));
      }

      // Workshops
      if (latestVersion.workshops && latestVersion.workshops.length > 0) {
        const workshops = await Workshop.find({
          _id: { $in: latestVersion.workshops }
        }).select("title instructor organization date location description certificateUrl");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.workshops = workshops.map((w: any) => ({
          id: w._id.toString(),
          title: w.title,
          instructor: w.instructor,
          organization: w.organization,
          date: w.date,
          location: w.location,
          description: w.description,
          certificateUrl: w.certificateUrl,
        }));
      }

      // Custom Sections with entries
      if (latestVersion.customSections && latestVersion.customSections.length > 0) {
        const customSections = await CustomSection.find({
          _id: { $in: latestVersion.customSections }
        }).populate("entries");
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.customSections = customSections.map((cs: any) => ({
          heading: cs.title,
          isVisible: cs.isVisible,
          entries: cs.entries.map((entry: any) => ({
            title: entry.title,
            organization: entry.organization,
            date: entry.date,
            description: entry.description,
            isVisible: entry.isVisible,
          })),
        }));
      }

      // INTERNSHIPS - FIXED with all fields
      if (latestVersion.internships && latestVersion.internships.length > 0) {
        const internships = await Internship.find({
          _id: { $in: latestVersion.internships }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.internships = internships.map((i: any) => ({
          id: i._id.toString(),
          title: i.title,
          company: i.company,
          location: i.location,
          startDate: i.startDate,
          endDate: i.endDate,
          description: i.description,
          duration: i.duration
        }));
      }

      // REFERENCES - FIXED with all fields
      if (latestVersion.references && latestVersion.references.length > 0) {
        const references = await Reference.find({
          _id: { $in: latestVersion.references }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.references = references.map((r: any) => ({
          id: r._id.toString(),
          name: r.name,
          title: r.title,
          company: r.company,
          email: r.email,
          phone: r.phone,
          relationship: r.relationship,
          designationRelationship: r.designationRelationship,
          contactInformation: r.contactInformation
        }));
      }

      // CLIENT PROJECTS - FIXED with all fields
      if (latestVersion.clientProjects && latestVersion.clientProjects.length > 0) {
        const clientProjects = await ClientProject.find({
          _id: { $in: latestVersion.clientProjects }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.clientProjects = clientProjects.map((p: any) => ({
          id: p._id.toString(),
          name: p.name,
          client: p.client,
          role: p.role,
          startDate: p.startDate,
          endDate: p.endDate,
          description: p.description,
          technologies: p.technologies,
          url: p.url,
          clientOrganization: p.clientOrganization,
          duration: p.duration,
          toolsTechnologies: p.toolsTechnologies,
          projectUrl: p.projectUrl
        }));
      }

      // PORTFOLIO - FIXED with all fields
      if (latestVersion.portfolio && latestVersion.portfolio.length > 0) {
        const portfolio = await Portfolio.find({
          _id: { $in: latestVersion.portfolio }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.portfolio = portfolio.map((p: any) => ({
          id: p._id.toString(),
          name: p.name,
          type: p.type,
          platform: p.platform,
          description: p.description,
          url: p.url
        }));
      }

      // METHODOLOGIES - FIXED with all fields
      if (latestVersion.methodologies && latestVersion.methodologies.length > 0) {
        const methodologies = await Methodology.find({
          _id: { $in: latestVersion.methodologies }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.methodologies = methodologies.map((m: any) => ({
          id: m._id.toString(),
          name: m.name,
          description: m.description,
          certification: m.certification,
          experienceDuration: m.experienceDuration
        }));
      }

      // INDUSTRY EXPERTISE - FIXED with all fields
      if (latestVersion.industryExpertise && latestVersion.industryExpertise.length > 0) {
        const industryExpertise = await IndustryExpertise.find({
          _id: { $in: latestVersion.industryExpertise }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.industryExpertise = industryExpertise.map((i: any) => ({
          id: i._id.toString(),
          industry: i.industry,
          years: i.years,
          description: i.description,
          domainArea: i.domainArea,
          experienceDuration: i.experienceDuration
        }));
      }

      // VOLUNTEERING - FIXED with all fields
      if (latestVersion.volunteering && latestVersion.volunteering.length > 0) {
        const volunteering = await Volunteering.find({
          _id: { $in: latestVersion.volunteering }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.volunteering = volunteering.map((v: any) => ({
          id: v._id.toString(),
          organization: v.organization,
          role: v.role,
          startDate: v.startDate,
          endDate: v.endDate,
          description: v.description,
          causeArea: v.causeArea,
          duration: v.duration
        }));
      }

      // MILITARY SERVICE - FIXED with all fields
      if (latestVersion.militaryService && latestVersion.militaryService.length > 0) {
        const militaryService = await MilitaryService.find({
          _id: { $in: latestVersion.militaryService }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.militaryService = militaryService.map((m: any) => ({
          id: m._id.toString(),
          branch: m.branch,
          rank: m.rank,
          unit: m.unit,
          startDate: m.startDate,
          endDate: m.endDate,
          description: m.description,
          duration: m.duration,
          specialization: m.specialization
        }));
      }

      // TEACHING EXPERIENCE - FIXED with all fields
      if (latestVersion.teachingExperience && latestVersion.teachingExperience.length > 0) {
        const teachingExperience = await TeachingExperience.find({
          _id: { $in: latestVersion.teachingExperience }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.teachingExperience = teachingExperience.map((t: any) => ({
          id: t._id.toString(),
          title: t.title,
          institution: t.institution,
          course: t.course,
          startDate: t.startDate,
          endDate: t.endDate,
          description: t.description,
          subjectCourseTaught: t.subjectCourseTaught,
          duration: t.duration
        }));
      }

      // MENTORSHIP EXPERIENCE - FIXED with all fields
      if (latestVersion.mentorshipExperience && latestVersion.mentorshipExperience.length > 0) {
        const mentorshipExperience = await MentorshipExperience.find({
          _id: { $in: latestVersion.mentorshipExperience }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.mentorshipExperience = mentorshipExperience.map((m: any) => ({
          id: m._id.toString(),
          menteeName: m.menteeName,
          menteeCount: m.menteeCount,
          program: m.program,
          organization: m.organization,
          startDate: m.startDate,
          endDate: m.endDate,
          description: m.description,
          mentorshipArea: m.mentorshipArea,
          organizationPlatform: m.organizationPlatform,
          menteeLevel: m.menteeLevel,
          duration: m.duration
        }));
      }

      // RESEARCH GRANTS - FIXED with all fields
      if (latestVersion.researchGrants && latestVersion.researchGrants.length > 0) {
        const researchGrants = await ResearchGrant.find({
          _id: { $in: latestVersion.researchGrants }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.researchGrants = researchGrants.map((r: any) => ({
          id: r._id.toString(),
          title: r.title,
          agency: r.agency,
          amount: r.amount,
          startDate: r.startDate,
          endDate: r.endDate,
          description: r.description,
          year: r.year
        }));
      }

      // TEST SCORES - FIXED with all fields
      if (latestVersion.testScores && latestVersion.testScores.length > 0) {
        const testScores = await TestScore.find({
          _id: { $in: latestVersion.testScores }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.testScores = testScores.map((t: any) => ({
          id: t._id.toString(),
          testName: t.testName,
          score: t.score,
          maxScore: t.maxScore,
          date: t.date,
          percentileRank: t.percentileRank,
          year: t.year
        }));
      }

      // PATENTS - FIXED with all fields
      if (latestVersion.patents && latestVersion.patents.length > 0) {
        const patents = await Patent.find({
          _id: { $in: latestVersion.patents }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.patents = patents.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          inventors: p.inventors,
          patentNumber: p.patentNumber,
          filingDate: p.filingDate,
          issueDate: p.issueDate,
          status: p.status,
          issuingAuthority: p.issuingAuthority,
          year: p.year
        }));
      }

      // PUBLICATIONS
      if (latestVersion.publications && latestVersion.publications.length > 0) {
        const publications = await Publication.find({
          _id: { $in: latestVersion.publications }
        });
        
        if (!latestVersion.data) latestVersion.data = {};
        latestVersion.data.publications = publications.map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          journalPublisher: p.journal,
          publicationType: p.conference,
          year: p.publicationDate,
          urlDoi: p.doi,
          authors: p.authors,
        }));
      }

      // PROFESSIONAL CONTEXT
      if (latestVersion.professionalContext && latestVersion.professionalContext.length > 0) {
        const professionalContext = await ProfessionalContext.find({
          _id: { $in: latestVersion.professionalContext }
        });
        
        if (professionalContext.length > 0 && !latestVersion.data) {
          latestVersion.data = {};
        }
        
        if (professionalContext.length > 0) {
          const pc = professionalContext[0];
          latestVersion.data.professionalContext = {
            id: pc._id.toString(),
            totalExperience: pc.totalExperience,
            teamSize: pc.teamSize,
            industry: pc.industry,
            industryCustom: pc.industryCustom,
            functionalDomain: pc.functionalDomain,
            functionalDomainCustom: pc.functionalDomainCustom,
            geographicScope: pc.geographicScope,
            revenueResponsibility: pc.revenueResponsibility,
          };
        }
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

      // Get the latest version of this resume
      const lastVersion = await ResumeVersion
        .findOne({ resumeId: id })
        .sort({ createdAt: -1 });

      // Merge previous data with new incoming data
    const mergedData = merge({}, lastVersion?.data || {}, data);

      const version = new ResumeVersion({
        resumeId: id,
        resume: id,
        data: mergedData,
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
        mergedData.careerObjective  // Changed from data to mergedData
      );

      // Handle languages if provided
      if (mergedData.languages && Array.isArray(mergedData.languages)) {  // Changed from data to mergedData
        // Delete existing languages for this version
        await Language.deleteMany({ resumeId: version._id });

        // Create new languages
        if (mergedData.languages.length > 0) {  // Changed from data to mergedData
          const langDocs = mergedData.languages.map((lang: any) => ({  // Changed from data to mergedData
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
      if (mergedData.hobbies && Array.isArray(mergedData.hobbies)) {  // Changed from data to mergedData
        // Delete existing hobbies for this version
        await Hobby.deleteMany({ resumeId: version._id });

        // Create new hobbies
        if (mergedData.hobbies.length > 0) {  // Changed from data to mergedData
          const hobbyDocs = mergedData.hobbies.map((hobby: string) => ({  // Changed from data to mergedData
            resumeId: version._id,
            resumeVersion: version._id,
            name: hobby,
          }));
          await Hobby.insertMany(hobbyDocs);
        }
      }

      // Handle keyAchievements if provided
      if (mergedData.keyAchievements && Array.isArray(mergedData.keyAchievements)) {  // Changed from data to mergedData
        // Delete existing keyAchievements for this version
        await KeyAchievement.deleteMany({ resumeId: version._id });

        // Create new keyAchievements
        if (mergedData.keyAchievements.length > 0) {  // Changed from data to mergedData
          const achDocs = mergedData.keyAchievements.map((achievement: string) => ({  // Changed from data to mergedData
            resumeId: version._id,
            resumeVersion: version._id,
            description: achievement,
          }));
          await KeyAchievement.insertMany(achDocs);
        }
      }

      // Handle responsibilities if provided
      if (mergedData.responsibilities && Array.isArray(mergedData.responsibilities)) {  // Changed from data to mergedData
        // Delete existing responsibilities for this version
        await Responsibility.deleteMany({ resumeId: version._id });

        // Create new responsibilities
        if (mergedData.responsibilities.length > 0) {  // Changed from data to mergedData
          const respDocs = mergedData.responsibilities.map(  // Changed from data to mergedData
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
      if (mergedData.tools && Array.isArray(mergedData.tools)) {  // Changed from data to mergedData
        // Delete existing tools for this version
        await Tool.deleteMany({ resumeId: version._id });

        // Create new tools
        if (mergedData.tools.length > 0) {  // Changed from data to mergedData
          const toolDocs = mergedData.tools.map((tool: string) => ({  // Changed from data to mergedData
            resumeId: version._id,
            resumeVersion: version._id,
            name: tool,
          }));
          await Tool.insertMany(toolDocs);
        }
      }

      // Handle socialLinks if provided
      if (mergedData.socialLinks && Array.isArray(mergedData.socialLinks)) {  // Changed from data to mergedData
        console.log("[updateResume] socialLinks data:", mergedData.socialLinks);  // Changed from data to mergedData
        // Delete existing socialLinks for this version
        await SocialLink.deleteMany({ resumeId: version._id });

        // Filter out social links with empty URLs before saving
        const validSocialLinks = mergedData.socialLinks.filter(  // Changed from data to mergedData
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
      if (mergedData.certifications && Array.isArray(mergedData.certifications)) {  // Changed from data to mergedData
        // Delete existing certifications for this version
        await Certification.deleteMany({ resumeId: version._id });

        // Create new certifications
        if (mergedData.certifications.length > 0) {  // Changed from data to mergedData
          const certDocs = mergedData.certifications.map((cert: any) => ({  // Changed from data to mergedData
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
      if (mergedData.customSections && Array.isArray(mergedData.customSections)) {  // Changed from data to mergedData
        console.log("[updateResume] customSections data:", mergedData.customSections);  // Changed from data to mergedData
        // Delete existing customSections for this version
        await CustomSection.deleteMany({ resumeId: version._id });

        // Create new customSections
        if (mergedData.customSections.length > 0) {  // Changed from data to mergedData
          for (const section of mergedData.customSections) {  // Changed from data to mergedData
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
      if (mergedData.clientProjects && Array.isArray(mergedData.clientProjects)) {  // Changed from data to mergedData
        await ClientProject.deleteMany({ resumeId: version._id });
        if (mergedData.clientProjects.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.clientProjects.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.portfolio && Array.isArray(mergedData.portfolio)) {  // Changed from data to mergedData
        await Portfolio.deleteMany({ resumeId: version._id });

        if (mergedData.portfolio.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.portfolio.map((item: any) => ({  // Changed from data to mergedData
            resumeId: version._id,
            name: item.name,
            type: item.type,
            platform: item.platform,
            description: item.description,
            url: item.url
          }));

          await Portfolio.insertMany(docs);
        }
      }

      // Handle volunteering if provided
      if (mergedData.volunteering && Array.isArray(mergedData.volunteering)) {  // Changed from data to mergedData
        await Volunteering.deleteMany({ resumeId: version._id });
        if (mergedData.volunteering.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.volunteering.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.militaryService && Array.isArray(mergedData.militaryService)) {  // Changed from data to mergedData
        await MilitaryService.deleteMany({ resumeId: version._id });
        if (mergedData.militaryService.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.militaryService.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.toolTechnologies && Array.isArray(mergedData.toolTechnologies)) {  // Changed from data to mergedData
        await ToolTechnology.deleteMany({ resumeId: version._id });
        if (mergedData.toolTechnologies.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.toolTechnologies.map((item: any) => ({  // Changed from data to mergedData
            resumeId: version._id,
            name: item.name,
            category: item.category,
          }));
          await ToolTechnology.insertMany(docs);
        }
      }

      // Handle methodologies if provided
      if (mergedData.methodologies && Array.isArray(mergedData.methodologies)) {  // Changed from data to mergedData
        await Methodology.deleteMany({ resumeId: version._id });
        if (mergedData.methodologies.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.methodologies.map((item: any) => ({  // Changed from data to mergedData
            resumeId: version._id,
            name: item.name,
            description: item.description,
          }));
          await Methodology.insertMany(docs);
        }
      }

      // Handle industryExpertise if provided
      if (mergedData.industryExpertise && Array.isArray(mergedData.industryExpertise)) {  // Changed from data to mergedData
        await IndustryExpertise.deleteMany({ resumeId: version._id });
        if (mergedData.industryExpertise.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.industryExpertise.map((item: any) => ({  // Changed from data to mergedData
            resumeId: version._id,
            industry: item.industry,
            years: item.years,
            description: item.description,
          }));
          await IndustryExpertise.insertMany(docs);
        }
      }

      // Handle references if provided
      if (mergedData.references && Array.isArray(mergedData.references)) {  // Changed from data to mergedData
        await Reference.deleteMany({ resumeId: version._id });
        if (mergedData.references.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.references.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.socialProfiles && Array.isArray(mergedData.socialProfiles)) {  // Changed from data to mergedData
        await SocialProfile.deleteMany({ resumeId: version._id });
        if (mergedData.socialProfiles.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.socialProfiles.map((item: any) => ({  // Changed from data to mergedData
            resumeId: version._id,
            platform: item.platform,
            url: item.url,
          }));
          await SocialProfile.insertMany(docs);
        }
      }

      // Handle availabilityWorkAuth if provided
      if (
        mergedData.availabilityWorkAuth &&  // Changed from data to mergedData
        Array.isArray(mergedData.availabilityWorkAuth)  // Changed from data to mergedData
      ) {
        await AvailabilityWorkAuth.deleteMany({ resumeId: version._id });
        if (mergedData.availabilityWorkAuth.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.availabilityWorkAuth.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.internships && Array.isArray(mergedData.internships)) {  // Changed from data to mergedData
        await Internship.deleteMany({ resumeId: version._id });
        if (mergedData.internships.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.internships.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.academicProjects && Array.isArray(mergedData.academicProjects)) {  // Changed from data to mergedData
        console.log(
          "[updateResume] academicProjects received:",
          JSON.stringify(mergedData.academicProjects)  // Changed from data to mergedData
        );
        await AcademicProject.deleteMany({ resumeId: version._id });
        if (mergedData.academicProjects.length > 0) {  // Changed from data to mergedData
          console.log(
            "[updateResume] Saving academicProjects:",
            mergedData.academicProjects.length,  // Changed from data to mergedData
            "items"
          );
          const docs = mergedData.academicProjects.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.leadershipPositions && Array.isArray(mergedData.leadershipPositions)) {  // Changed from data to mergedData
        await LeadershipPosition.deleteMany({ resumeId: version._id });
        if (mergedData.leadershipPositions.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.leadershipPositions.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.trainingPrograms && Array.isArray(mergedData.trainingPrograms)) {  // Changed from data to mergedData
        await TrainingProgram.deleteMany({ resumeId: version._id });
        if (mergedData.trainingPrograms.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.trainingPrograms.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.scholarships && Array.isArray(mergedData.scholarships)) {  // Changed from data to mergedData
        await Scholarship.deleteMany({ resumeId: version._id });
        if (mergedData.scholarships.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.scholarships.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.coCurricular && Array.isArray(mergedData.coCurricular)) {  // Changed from data to mergedData
        await CoCurricular.deleteMany({ resumeId: version._id });
        if (mergedData.coCurricular.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.coCurricular.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.extracurricular && Array.isArray(mergedData.extracurricular)) {  // Changed from data to mergedData
        await Extracurricular.deleteMany({ resumeId: version._id });
        if (mergedData.extracurricular.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.extracurricular.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.careerObjective && typeof mergedData.careerObjective === "string") {  // Changed from data to mergedData
        console.log(
          "[updateResume] Handling careerObjective:",
          mergedData.careerObjective  // Changed from data to mergedData
        );
        await CareerObjective.deleteMany({ resumeId: version._id });
        if (mergedData.careerObjective.trim()) {  // Changed from data to mergedData
          const doc = new CareerObjective({
            resumeId: version._id,
            objective: mergedData.careerObjective,  // Changed from data to mergedData
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
      if (mergedData.teachingExperience && Array.isArray(mergedData.teachingExperience)) {  // Changed from data to mergedData
        await TeachingExperience.deleteMany({ resumeId: version._id });
        if (mergedData.teachingExperience.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.teachingExperience.map((item: any) => ({  // Changed from data to mergedData
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
        mergedData.mentorshipExperience &&  // Changed from data to mergedData
        Array.isArray(mergedData.mentorshipExperience)  // Changed from data to mergedData
      ) {
        await MentorshipExperience.deleteMany({ resumeId: version._id });
        if (mergedData.mentorshipExperience.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.mentorshipExperience.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.researchGrants && Array.isArray(mergedData.researchGrants)) {  // Changed from data to mergedData
        await ResearchGrant.deleteMany({ resumeId: version._id });
        if (mergedData.researchGrants.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.researchGrants.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.testScores && Array.isArray(mergedData.testScores)) {  // Changed from data to mergedData
        await TestScore.deleteMany({ resumeId: version._id });
        if (mergedData.testScores.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.testScores.map((item: any) => ({  // Changed from data to mergedData
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
      if (mergedData.publications && Array.isArray(mergedData.publications)) {  // Changed from data to mergedData
        await Publication.deleteMany({ resumeId: version._id });

        if (mergedData.publications.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.publications.map((item: any) => ({  // Changed from data to mergedData
            resumeId: version._id,
            title: item.title,
            journal: item.journalPublisher,      // map frontend → backend
            conference: item.publicationType,    // map frontend → backend
            publicationDate: item.year,          // map frontend → backend
            doi: item.urlDoi,                    // map frontend → backend
            url: item.urlDoi,
            authors: item.authors || "",
          }));

          await Publication.insertMany(docs);
        }
      }

      // Handle patents if provided
      if (mergedData.patents && Array.isArray(mergedData.patents)) {  // Changed from data to mergedData
        await Patent.deleteMany({ resumeId: version._id });
        if (mergedData.patents.length > 0) {  // Changed from data to mergedData
          const docs = mergedData.patents.map((item: any) => ({  // Changed from data to mergedData
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
        mergedData.professionalContext &&  // Changed from data to mergedData
        typeof mergedData.professionalContext === "object"  // Changed from data to mergedData
      ) {
        console.log(
          "[updateResume] Handling professionalContext:",
          mergedData.professionalContext  // Changed from data to mergedData
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
        } = mergedData.professionalContext;  // Changed from data to mergedData

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