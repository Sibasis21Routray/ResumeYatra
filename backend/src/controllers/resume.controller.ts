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

// Helper function to extract guestId from headers (handles array case)
function getGuestId(headers: any): string | null {
  const guestId = headers["x-guest-id"];
  if (Array.isArray(guestId)) {
    return guestId[0] || null;
  }
  return guestId || null;
}

import ResumeModel from "../models/Resume";

export async function createResume(req: Request, res: Response) {
  try {
    // Prefer `req.userId` set by auth.middleware; fall back to older `req.user` shape if present
    const userId = (req as any).userId || null;

    let guestId = null;

    if (!userId) {
      // Only allow guestId if NOT logged in
      guestId = getGuestId(req.headers);
    }

    if (!userId && !guestId) {
      return res.status(400).json({ error: "Missing user or guest" });
    }

    // No creation limits — users can create unlimited resumes.
    // Plan limits only control how many are DISPLAYED on the dashboard.

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

    // Ensure required schema fields are provided: ownerId and title
    const resumePayload: any = {
      ownerId: userId || null, // Explicitly set to null for guests
      guestId: guestId || null,
      title: defaultData.title,
      template: req.body?.template || "modern",
      data: defaultData,
    };

    const resume = await ResumeModel.create(resumePayload);
    
    // add to user's resumes array if user
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { resumes: resume._id } });
    }
    
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
    const userId = (req as any).userId || null;

    const guestId = getGuestId(req.headers);

    console.log("[listResumes] userId:", userId, "guestId:", guestId);

    if (!userId && !guestId) {
      console.log("[listResumes] No userId or guestId found");
      return res.status(401).json({ error: "not authenticated" });
    }

    const items = await resumeService.list(userId, guestId);
    console.log("[listResumes] Found resumes:", items.length);

    // Auto-link any guest-owned resumes to this user if they are logged in
    if (userId && guestId) {
      // Find guest resumes for this id
      const guestResumes = items.filter(item => !item.ownerId && item.id);
      
      if (guestResumes.length > 0) {
        const guestIds = guestResumes.map(r => r.id);
        
        // Update in DB: Assign owner and CLEAR guestId to prevent leakage
        await Resume.updateMany(
          { _id: { $in: guestIds } },
          { 
            $set: { ownerId: userId, guestId: null } 
          }
        );

        // Also ensure they are in the user's resumes array
        await User.findByIdAndUpdate(userId, { $addToSet: { resumes: { $each: guestIds } } });
      }
    }

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
        `[listResumes] Filtered ${items.length - validItems.length
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
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);

    if (!userId && !guestId) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Check for admin access first
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.role === "admin") {
        // Admin can access any resume
        const adminResume = await Resume.findById(id);
        if (!adminResume) {
          return res.status(404).json({ error: "Resume not found" });
        }

        const item = await resumeService.get(id, null, null);
        if (!item) return res.status(404).json({ error: "not found" });

        // Get the latest version and populate data
        const latestVersion = (item.versions as any)?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        if (latestVersion) {
          await populateVersionData(latestVersion);
        }

        return res.json(item);
      }
    }

    // Regular user/guest access - use service with proper auth
    const item = await resumeService.get(id, userId, guestId);
    if (!item) return res.status(404).json({ error: "not found" });

    // Auto-link ownerId if the user is authenticated but the resume only has a guestId
    if (userId && !item.ownerId) {
      await Resume.findByIdAndUpdate(id, { 
        $set: { ownerId: userId, guestId: null } 
      });
      // Also update user's resumes array
      await User.findByIdAndUpdate(userId, { $addToSet: { resumes: id } });
    }

    // Get the latest version
    const latestVersion = (item.versions as any)?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (latestVersion) {
      await populateVersionData(latestVersion);
    }

    res.json(item);
  } catch (err: any) {
    console.error("getResume error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

// Helper function to populate version data
async function populateVersionData(latestVersion: any) {
  // console.log(
  //   "[getResume] Latest version data keys:",
  //   Object.keys(latestVersion.data || {})
  // );

  // Languages
  if (latestVersion.languages && latestVersion.languages.length > 0) {
    const languages = await Language.find({
      _id: { $in: latestVersion.languages }
    }).select("name proficiency capability");

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

  // Internships
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

  // References
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

  // Client Projects
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

  // Portfolio
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

  // Methodologies
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

  // Industry Expertise
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

  // Volunteering
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

  // Military Service
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

  // Teaching Experience
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

  // Mentorship Experience
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

  // Research Grants
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

  // Test Scores
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

  // Patents
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

  // Publications
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

  // Professional Context
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

  // console.log(
  //   "[getResume] Final data keys:",
  //   Object.keys(latestVersion.data || {})
  // );
}

export async function updateResume(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = (req as any).userId || null;

    const guestId = getGuestId(req.headers);
    const { data, template, title } = req.body;

    console.log("[updateResume] Received data keys:", Object.keys(data || {}));

    if (!userId && !guestId) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!data && !template && !title)
      return res
        .status(400)
        .json({ error: "data, template, or title required" });

    // Verify resume ownership - use single field based on auth type
    let query: any = { _id: id };

    if (userId && guestId) {
      query.$or = [{ ownerId: userId }, { guestId: guestId }];
    } else if (userId) {
      query.ownerId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    }

    const resume = await Resume.findOne(query);

    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Auto-link ownerId if the user is authenticated but the resume only has a guestId
    if (userId && !resume.ownerId) {
      resume.ownerId = new mongoose.Types.ObjectId(userId) as any;
      await resume.save();
    }

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
      // IMPORTANT: Do NOT merge with previous data
      // Instead, use the incoming data as the complete source of truth
      // This ensures deletions are properly handled
      const newData = { ...data };

      const version = new ResumeVersion({
        resumeId: id,
        resume: id,
        data: newData,
      });

      await version.save();
      resume.versions.push(version._id);
      await resume.save();

      console.log(
        "[updateResume] Created version with data keys:",
        Object.keys(version.data)
      );

      // Handle all the sub-documents (languages, hobbies, etc.)
      // IMPORTANT: Delete all existing sub-documents for this version
      // and recreate them from the incoming data

      // Languages
      await Language.deleteMany({ resumeVersion: version._id });
      if (newData.languages && Array.isArray(newData.languages) && newData.languages.length > 0) {
        const langDocs = newData.languages.map((lang: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          name: lang.language,
          proficiency: lang.level,
          capability: lang.capability,
        }));
        await Language.insertMany(langDocs);
      }

      // Hobbies
      await Hobby.deleteMany({ resumeVersion: version._id });
      if (newData.hobbies && Array.isArray(newData.hobbies) && newData.hobbies.length > 0) {
        const hobbyDocs = newData.hobbies.map((hobby: string) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          name: hobby,
        }));
        await Hobby.insertMany(hobbyDocs);
      }

      // Certifications
      await Certification.deleteMany({ resumeVersion: version._id });
      if (newData.certifications && Array.isArray(newData.certifications) && newData.certifications.length > 0) {
        const certDocs = newData.certifications.map((cert: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          url: cert.url,
        }));
        await Certification.insertMany(certDocs);
      }

      // Awards
      await Award.deleteMany({ resumeVersion: version._id });
      if (newData.awards && Array.isArray(newData.awards) && newData.awards.length > 0) {
        const awardDocs = newData.awards.map((award: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          title: award.title,
          organization: award.organization,
          issueYear: award.issueYear,
          description: award.description,
        }));
        await Award.insertMany(awardDocs);
      }

      // Speaking Engagements
      await SpeakingEngagement.deleteMany({ resumeVersion: version._id });
      if (newData.speakingEngagements && Array.isArray(newData.speakingEngagements) && newData.speakingEngagements.length > 0) {
        const docs = newData.speakingEngagements.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          topic: item.topic,
          eventName: item.eventName,
          organization: item.organization,
          date: item.date,
          location: item.location,
          description: item.description,
          url: item.url,
        }));
        await SpeakingEngagement.insertMany(docs);
      }

      // Memberships
      await Membership.deleteMany({ resumeVersion: version._id });
      if (newData.memberships && Array.isArray(newData.memberships) && newData.memberships.length > 0) {
        const docs = newData.memberships.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          organization: item.organization,
          membershipType: item.membershipType,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
          url: item.url,
        }));
        await Membership.insertMany(docs);
      }

      // Workshops
      await Workshop.deleteMany({ resumeVersion: version._id });
      if (newData.workshops && Array.isArray(newData.workshops) && newData.workshops.length > 0) {
        const docs = newData.workshops.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          title: item.title,
          instructor: item.instructor,
          organization: item.organization,
          date: item.date,
          location: item.location,
          description: item.description,
          certificateUrl: item.certificateUrl,
        }));
        await Workshop.insertMany(docs);
      }

      // Social Links
      await SocialLink.deleteMany({ resumeVersion: version._id });
      if (newData.socialLinks && Array.isArray(newData.socialLinks) && newData.socialLinks.length > 0) {
        const validSocialLinks = newData.socialLinks.filter(
          (link: any) => link.urlText && link.url && link.url.trim() !== ""
        );
        if (validSocialLinks.length > 0) {
          const socialLinkDocs = validSocialLinks.map((link: any) => ({
            resumeId: version._id,
            resumeVersion: version._id,
            text: link.urlText,
            url: link.url,
          }));
          await SocialLink.insertMany(socialLinkDocs);
        }
      }

      // Custom Sections
      await CustomSection.deleteMany({ resumeVersion: version._id });
      if (newData.customSections && Array.isArray(newData.customSections) && newData.customSections.length > 0) {
        for (const section of newData.customSections) {
          const sectionDoc = new CustomSection({
            resumeId: version._id,
            resumeVersion: version._id,
            title: section.heading,
            isVisible: section.isVisible,
          });
          await sectionDoc.save();

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

      // Internships
      await Internship.deleteMany({ resumeVersion: version._id });
      if (newData.internships && Array.isArray(newData.internships) && newData.internships.length > 0) {
        const docs = newData.internships.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          title: item.title,
          company: item.company,
          location: item.location,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
          duration: item.duration,
        }));
        await Internship.insertMany(docs);
      }

      // Academic Projects
      await AcademicProject.deleteMany({ resumeVersion: version._id });
      if (newData.academicProjects && Array.isArray(newData.academicProjects) && newData.academicProjects.length > 0) {
        const docs = newData.academicProjects.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          title: item.name || item.title,
          course: item.course,
          institution: item.institution,
          duration: item.duration,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
          technologies: Array.isArray(item.technologies) ? item.technologies : [],
          url: item.url,
        }));
        await AcademicProject.insertMany(docs);
      }

      // Leadership Positions
      await LeadershipPosition.deleteMany({ resumeVersion: version._id });
      if (newData.leadershipPositions && Array.isArray(newData.leadershipPositions) && newData.leadershipPositions.length > 0) {
        const docs = newData.leadershipPositions.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          title: item.position || item.title,
          organization: item.organization,
          startDate: item.startDate,
          endDate: item.endDate,
          description: item.description,
        }));
        await LeadershipPosition.insertMany(docs);
      }

      // Training Programs
      await TrainingProgram.deleteMany({ resumeVersion: version._id });
      if (newData.trainingPrograms && Array.isArray(newData.trainingPrograms) && newData.trainingPrograms.length > 0) {
        const docs = newData.trainingPrograms.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          name: item.name,
          organization: item.provider,
          completionDate: item.completionDate,
          duration: item.duration,
          description: item.description,
        }));
        await TrainingProgram.insertMany(docs);
      }

      // Scholarships
      await Scholarship.deleteMany({ resumeVersion: version._id });
      if (newData.scholarships && Array.isArray(newData.scholarships) && newData.scholarships.length > 0) {
        const docs = newData.scholarships.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
          name: item.name,
          provider: item.provider,
          year: item.year,
          amount: item.amount,
          description: item.description,
        }));
        await Scholarship.insertMany(docs);
      }

      // Co-curricular
      await CoCurricular.deleteMany({ resumeVersion: version._id });
      if (newData.coCurricular && Array.isArray(newData.coCurricular) && newData.coCurricular.length > 0) {
        const docs = newData.coCurricular.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
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

      // Extracurricular
      await Extracurricular.deleteMany({ resumeVersion: version._id });
      if (newData.extracurricular && Array.isArray(newData.extracurricular) && newData.extracurricular.length > 0) {
        const docs = newData.extracurricular.map((item: any) => ({
          resumeId: version._id,
          resumeVersion: version._id,
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

      // Career Objective
      await CareerObjective.deleteMany({ resumeVersion: version._id });
      if (newData.careerObjective && typeof newData.careerObjective === "string" && newData.careerObjective.trim()) {
        const doc = new CareerObjective({
          resumeId: version._id,
          resumeVersion: version._id,
          objective: newData.careerObjective,
        });
        await doc.save();
      }

      // Professional Context
      await ProfessionalContext.deleteMany({ resumeVersion: version._id });
      if (newData.professionalContext && typeof newData.professionalContext === "object") {
        const {
          totalExperience,
          teamSize,
          industry,
          industryCustom,
          functionalDomain,
          functionalDomainCustom,
          geographicScope,
          revenueResponsibility,
        } = newData.professionalContext;

        if (totalExperience || teamSize || industry || industryCustom ||
          functionalDomain || functionalDomainCustom || geographicScope || revenueResponsibility) {
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
        }
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
    const userId = (req as any).userId || null;

    const guestId = getGuestId(req.headers);

    if (!userId && !guestId) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    const deleted = await resumeService.remove(id, userId, guestId);
    res.json(deleted);
  } catch (err: any) {
    console.error("deleteResume error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function generateFiles(req: Request, res: Response) {
  try {
    const id = getStringParam(req.params.id);
    const userId = (req as any).userId || null;

    const guestId = getGuestId(req.headers);
    const { data, template } = req.body;

    if (!userId && !guestId) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume ownership - use single field based on auth type
    let query: any = { _id: id };

    if (userId) {
      query.ownerId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    }

    const resume = await Resume.findOne(query);

    if (!resume) return res.status(404).json({ error: "resume not found" });

    // Check if resume is paid
    if (!resume.isDownloadPaid) {
      return res.status(402).json({ error: "Payment required to generate files", type: "download" });
    }

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
    const userId = (req as any).userId || null;

    const guestId = getGuestId(req.headers);

    if (!userId && !guestId) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!id || id === "undefined")
      return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid resume ID" });

    // Verify resume ownership - use single field based on auth type
    let query: any = { _id: id };

    if (userId) {
      query.ownerId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    }

    const resume = await Resume.findOne(query);

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
    const userId = (req as any).userId || null;

    const guestId = getGuestId(req.headers);

    if (!userId && !guestId) {
      return res.status(401).json({ error: "not authenticated" });
    }

    if (!fileId || fileId === "undefined")
      return res.status(400).json({ error: "Invalid file ID" });
    if (!mongoose.Types.ObjectId.isValid(fileId))
      return res.status(400).json({ error: "Invalid file ID" });

    // Get file info and verify ownership
    const file = await ResumeFile.findById(fileId).populate("resumeId");

    if (!file || !file.resumeId) {
      return res.status(404).json({ error: "file not found" });
    }

    // Check ownership - use single field based on auth type
    let query: any = { _id: file.resumeId };

    if (userId) {
      query.ownerId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    }

    const resume = await Resume.findOne(query);

    if (!resume) {
      return res.status(404).json({ error: "file not found" });
    }

    // Check if resume is paid
    if (!resume.isDownloadPaid) {
      return res.status(402).json({ error: "Payment required to download files", type: "download" });
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

export async function markPaid(req: Request, res: Response) {
  try {
    const id = req.params.id || req.body.id;
    const { type } = req.body; // "download" or "ai"
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);

    console.log(`[markPaid] START - id: ${id}, userId: ${userId}, guestId: ${guestId}, type: ${type}`);

    if (!id || id === "undefined") return res.status(400).json({ error: "Invalid resume ID" });
    if (!type || !["download", "ai"].includes(type)) return res.status(400).json({ error: "Invalid payment type" });

    // 1. Fetch resume by ID ONLY (first)
    const resume = await Resume.findById(id);
    if (!resume) {
      console.warn(`[markPaid] Resume not found for ID: ${id}`);
      return res.status(404).json({ error: "resume not found" });
    }

    // 2. Ownership & Branding Check
    // If user is logged in, they can pay for their own or a guest resume (to take ownership)
    const isOwner = (userId && resume.ownerId && resume.ownerId.toString() === userId.toString());
    const isGuestOwner = (guestId && resume.guestId === guestId);

    if (!isOwner && !isGuestOwner) {
      // If resume is unowned (guest) and user is logged in, link them now!
      if (!resume.ownerId && userId) {
        console.log(`[markPaid] Linking guest resume ${id} to user ${userId}`);
        resume.ownerId = new mongoose.Types.ObjectId(userId) as any;
      } else {
        console.warn(`[markPaid] ACCESS DENIED: Identity mismatch for resume ${id}`);
        return res.status(401).json({ error: "Not authenticated/Access denied" });
      }
    }

    console.log(`[markPaid] Found Resume: ${resume._id}. Initial DownloadPaid: ${resume.isDownloadPaid}, AI Paid: ${resume.isAiPaid}`);

    if (type === "download") {
      resume.isDownloadPaid = true;
    } else if (type === "ai") {
      resume.isAiPaid = true;
    }

    await resume.save();
    res.json({ success: true, isDownloadPaid: resume.isDownloadPaid, isAiPaid: resume.isAiPaid });
  } catch (err: any) {
    console.error("markPaid error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}

export async function markDownloaded(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);

    if (!id || id === "undefined") return res.status(400).json({ error: "Invalid resume ID" });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid resume ID" });

    const query: any = { _id: id };
    if (userId && guestId) {
      query.$or = [{ ownerId: userId }, { guestId }];
    } else if (userId) {
      query.ownerId = userId;
    } else if (guestId) {
      query.guestId = guestId;
    } else {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const resume = await Resume.findOne(query);
    if (!resume) return res.status(404).json({ error: "Resume not found or access denied" });

    resume.isDownloaded = true;
    await resume.save();

    console.log(`[markDownloaded] Resume ${id} marked as downloaded`);
    return res.json({ success: true, isDownloaded: true });
  } catch (err: any) {
    console.error("markDownloaded error:", err);
    res.status(500).json({ error: err.message || "internal error" });
  }
}


//rename resume title
export async function renameResume(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //  Plan check
    if (user.subscriptionPlan !== "freelancer") {
      return res.status(403).json({
        error: "Only freelancer plan can rename resume",
      });
    }

    // Update resume (ownership check included)
    const resume = await Resume.findOneAndUpdate(
      { _id: id, ownerId: userId },
      { title: title.trim() },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    return res.json({
      message: "Title updated successfully",
      resume,
    });
  } catch (err: any) {
    console.error("renameResume error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
}