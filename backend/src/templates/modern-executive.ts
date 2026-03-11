export function buildModernExecutiveTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#7aa333",
    secondary: "#ffffff",
    background: "#ffffff",
    headingFont: "Helvetica, sans-serif",
    bodyFont: "Inter, sans-serif",
  };
  const currentTheme = { ...defaultTheme, ...theme };
  const green = currentTheme.primary;

  const headingFontSize = data.formatting?.headingFontSize || 18;
  const bodyFontSize = data.formatting?.bodyFontSize || 14;
  const fontFamily = data.formatting?.fontFamily || currentTheme.bodyFont;

  // Helper function to check if an array has non-empty items
  const hasNonEmptyItems = (arr: any[]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to get non-empty array items
  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to check if an object has any non-empty values
  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  // Helper to safely join strings with separator, filtering empty values
  const safeJoin = (items: any[], separator: string = ", "): string => {
    if (!items || !Array.isArray(items)) return "";
    const filtered = items.filter(item => item && typeof item === "string" && item.trim().length > 0);
    return filtered.join(separator);
  };

  // Helper to format date range without empty parentheses
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" – ");
  };

  // Helper to format subtitle with multiple fields
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" | ");
  };

  // Parse skills (handles HTML string or array)
  const parseSkills = (): any[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) return data.skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof data.skills === 'string') {
      if (data.skills.includes('<ul>')) {
        const matches = data.skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/?li>/g, '').trim());
        }
      }
      return data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const nonEmptySkills = parseSkills();
  const nonEmptyInternships = getNonEmptyArray(data.internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(data.trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(data.academicProjects);
  const nonEmptyClientProjects = getNonEmptyArray(data.clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(data.portfolio);
  const nonEmptyLeadershipPositions = getNonEmptyArray(data.leadershipPositions);
  const nonEmptyVolunteering = getNonEmptyArray(data.volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(data.militaryService);
  const nonEmptyTeachingExperience = getNonEmptyArray(data.teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(data.mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(data.researchGrants);
  const nonEmptyPublications = getNonEmptyArray(data.publications);
  const nonEmptyPatents = getNonEmptyArray(data.patents);
  const nonEmptyTestScores = getNonEmptyArray(data.testScores);
  const nonEmptyScholarships = getNonEmptyArray(data.scholarships);
  const nonEmptyAwards = getNonEmptyArray(data.awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(data.speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(data.memberships);
  const nonEmptyWorkshops = getNonEmptyArray(data.workshops);
  const nonEmptyCoCurricular = getNonEmptyArray(data.coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(data.extracurricular);
  const nonEmptyToolsTechnologies = getNonEmptyArray(data.toolsTechnologies);
  const nonEmptyMethodologies = getNonEmptyArray(data.methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(data.industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(data.references);
  const nonEmptySocialProfiles = getNonEmptyArray(data.socialProfiles);
  const nonEmptySocialLinks = getNonEmptyArray(data.socialLinks);
  const nonEmptyLanguages = getNonEmptyArray(data.languages);
  const nonEmptyHobbies = getNonEmptyArray(data.hobbies);
  const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
  const nonEmptyResponsibilities = getNonEmptyArray(
    Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyArray(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n")
  );
  const nonEmptyProjects = getNonEmptyArray(data.projects);
  const nonEmptyCertifications = getNonEmptyArray(data.certifications);
  const nonEmptyCustomSections = getNonEmptyArray(data.customSections);
  const nonEmptyProfessionalContext = data.professionalContext && hasObjectValues(data.professionalContext) ? data.professionalContext : null;
  const nonEmptyAvailabilityWorkAuth = data.availabilityWorkAuth && hasObjectValues(data.availabilityWorkAuth) ? data.availabilityWorkAuth : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${data.personal?.name || "Resume"}</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #e5e7eb;
  font-family: ${fontFamily};
  padding: 40px 0;
}

.resume {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  margin: auto;
  display: flex;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,.12);
}

/* LEFT GREEN BAR */
.left-bar {
  width: 150px;
  background: ${green};
}

/* CONTENT */
.content {
  flex: 1;
  padding: 30px 38px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.name {
  font-size:40px;
  font-weight: 700;
  color: ${green};
}

.role {
  font-size: ${bodyFontSize}px;
  font-weight: 500;
  color: #374151;
  margin-top: 2px;
}

.photo {
  width: 88px;
  height: 88px;
  border: 1px solid #d1d5db;
  object-fit: cover;
}

/* CONTACT */
.contact {
  font-size: ${bodyFontSize}px;
  margin-bottom: 18px;
}

.contact div {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.contact i {
  width: 20px;
  height: 20px;
  background: ${green};
  color: #fff;
  font-size: 11px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SECTION */
.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: ${headingFontSize}px;
  font-weight: 700;
  color: ${green};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* TIMELINE */
.timeline {
  position: relative;
  padding-left: 26px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: ${green};
  opacity: .4;
}

/* TIMELINE ITEM */
.timeline-item {
  position: relative;
  padding-left: 14px;
  margin-bottom: 12px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -19px;
  top: 6px;
  width: 10px;
  height: 10px;
  background: ${green};
  border-radius: 50%;
}

/* TEXT */
.text {
  font-size: ${bodyFontSize}px;
  line-height: 1.6;
}

/* LIST */
li {
  font-size: ${bodyFontSize}px;
  margin-bottom: 6px;
}

/* EXPERIENCE */
.exp-title {
  font-weight: 600;
  font-size: ${bodyFontSize + 0.5}px;
}

.exp-meta {
  font-size: ${bodyFontSize - 1}px;
  color: #374151;
  margin-bottom: 4px;
}

/* STAMP */
.recommended {
  position: absolute;
  bottom: 28px;
  right: 40px;
  font-size: 13px;
  font-weight: 800;
  color: #b91c1c;
  border: 2px solid #b91c1c;
  padding: 4px 14px;
  transform: rotate(-6deg);
}

/* PRINT */
@media print {
  body { background: #fff; padding: 0; }
  .resume { box-shadow: none; }
}
</style>
</head>

<body>
<div class="resume">
  <div class="left-bar"></div>

  <div class="content">
    <div class="header">
      <div>
        <div class="name">${data.personal?.name || "Your Name"}</div>
        <div class="role">${data.personal?.role || ""}</div>
      </div>
      ${
        data.personal?.image
          ? `<img class="photo" src="${data.personal.image}" />`
          : `<div class="photo"></div>`
      }
    </div>

    <div class="contact" data-section="personal">
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 
          ? `<div><i class="fa-solid fa-location-dot"></i>${addressParts.join(", ")}</div>`
          : "";
      })()}
      ${data.personal?.phone ? `<div><i class="fa-solid fa-phone"></i>${data.personal.phone}</div>` : ""}
      ${data.personal?.email ? `<div><i class="fa-solid fa-envelope"></i>${data.personal.email}</div>` : ""}
      ${data.personal?.alternatePhone ? `<div><i class="fa-solid fa-phone"></i>${data.personal.alternatePhone}</div>` : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.fathersName ? `<div><i class="fa-solid fa-user"></i>Father: ${data.personal.fathersName}</div>` : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.dob ? `<div><i class="fa-solid fa-calendar"></i>DOB: ${data.personal.dob}</div>` : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.gender ? `<div><i class="fa-solid fa-venus-mars"></i>Gender: ${data.personal.gender}</div>` : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.maritalStatus ? `<div><i class="fa-solid fa-ring"></i>Marital: ${data.personal.maritalStatus}</div>` : ""}
      ${data.personal?.personalInfoDisplay === "inline" && data.personal?.nationality ? `<div><i class="fa-solid fa-globe"></i>Nationality: ${data.personal.nationality}</div>` : ""}
      ${data.personal?.linkedinUrl ? `<div><i class="fa-brands fa-linkedin"></i><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ""}
      ${data.personal?.githubUrl ? `<div><i class="fa-brands fa-github"></i><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ""}
      ${data.personal?.portfolioUrl ? `<div><i class="fa-solid fa-globe"></i><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ""}
      ${data.personal?.website ? `<div><i class="fa-solid fa-link"></i><a href="${data.personal.website}" target="_blank">Website</a></div>` : ""}
    </div>

    <!-- Personal Details (non-inline) -->
    ${
      data.personal?.personalInfoDisplay !== "inline" &&
      (data.personal?.fathersName ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo) ? `
        <div class="section" data-section="personal">
            <div class="section-title"><i class="fa-solid fa-id-card"></i>Personal Details</div>
            <div class="timeline">
              ${data.personal?.fathersName ? `<div class="timeline-item" data-section="personal"><b>Father's Name:</b> ${data.personal.fathersName}</div>` : ""}
              ${data.personal?.dob ? `<div class="timeline-item" data-section="personal"><b>Date of Birth:</b> ${data.personal.dob}</div>` : ""}
              ${data.personal?.gender ? `<div class="timeline-item" data-section="personal"><b>Gender:</b> ${data.personal.gender}</div>` : ""}
              ${data.personal?.maritalStatus ? `<div class="timeline-item" data-section="personal"><b>Marital Status:</b> ${data.personal.maritalStatus}</div>` : ""}
              ${data.personal?.nationality ? `<div class="timeline-item" data-section="personal"><b>Nationality:</b> ${data.personal.nationality}</div>` : ""}
              ${data.personal?.passportNo ? `<div class="timeline-item" data-section="personal"><b>Passport No:</b> ${data.personal.passportNo}</div>` : ""}
            </div>
          </div>`
        : ""
    }

    <!-- Professional Context -->
    ${nonEmptyProfessionalContext ? `
      <div class="section" data-section="professionalContext">
        <div class="section-title"><i class="fa-solid fa-chart-line"></i>Professional Context</div>
        <div class="timeline">
          ${nonEmptyProfessionalContext.totalExperience ? `<div class="timeline-item"><b>Total Experience:</b> ${nonEmptyProfessionalContext.totalExperience}</div>` : ""}
          ${nonEmptyProfessionalContext.teamSize ? `<div class="timeline-item"><b>Team Size:</b> ${nonEmptyProfessionalContext.teamSize}</div>` : ""}
          ${nonEmptyProfessionalContext.industry ? `<div class="timeline-item"><b>Industry:</b> ${nonEmptyProfessionalContext.industry}</div>` : ""}
          ${nonEmptyProfessionalContext.functionalDomain ? `<div class="timeline-item"><b>Domain:</b> ${nonEmptyProfessionalContext.functionalDomain}</div>` : ""}
          ${nonEmptyProfessionalContext.geographicScope ? `<div class="timeline-item"><b>Geographic Scope:</b> ${nonEmptyProfessionalContext.geographicScope}</div>` : ""}
          ${nonEmptyProfessionalContext.revenueResponsibility ? `<div class="timeline-item"><b>Revenue Responsibility:</b> ${nonEmptyProfessionalContext.revenueResponsibility}</div>` : ""}
        </div>
      </div>
    ` : ""}

    <!-- Availability & Work Auth -->
    ${nonEmptyAvailabilityWorkAuth ? `
      <div class="section" data-section="availabilityWorkAuth">
        <div class="section-title"><i class="fa-solid fa-clock"></i>Availability</div>
        <div class="timeline">
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<div class="timeline-item"><b>Notice Period:</b> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>` : ""}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<div class="timeline-item"><b>Work Auth:</b> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>` : ""}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<div class="timeline-item"><b>Preferred Location:</b> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>` : ""}
        </div>
      </div>
    ` : ""}

    <!-- Summary -->
    ${data.summary && data.summary.trim() ? `
      <div class="section" data-section="summary">
        <div class="section-title"><i class="fa-solid fa-user"></i>Profile</div>
        <div class="text">${data.summary}</div>
      </div>
    ` : ""}

    <!-- Career Objective -->
    ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title"><i class="fa-solid fa-bullseye"></i>Career Objective</div>
        <div class="text">${data.careerObjective}</div>
      </div>
    ` : ""}

    <!-- Skills -->
    ${nonEmptySkills.length > 0 ? `
      <div class="section" data-section="skills">
        <div class="section-title"><i class="fa-solid fa-list-check"></i>Skills</div>
        <div class="timeline">
          ${nonEmptySkills.map((s: any, i: number) => `
            <div class="timeline-item" data-section="skills" data-index="${i}">
              ${s.trim()}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Work Experience -->
    ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <div class="section-title"><i class="fa-solid fa-briefcase"></i>Work History</div>
        <div class="timeline">
          ${getNonEmptyArray(data.experience).map((exp: any, i: number) => {
            const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
            const metaParts = formatSubtitle([exp.company, exp.domain, exp.location]);
            
            return `
            <div class="timeline-item" data-section="experience" data-index="${i}">
              <div class="exp-title">${exp.title}</div>
              <div class="exp-meta">${metaParts} ${dateRange ? `• ${dateRange}` : ""}</div>
              <div class="text">${exp.description || ""}</div>
              ${exp.achievements ? `<div class="text" style="margin-top: 8px;"><strong style="color: #333;">Key Achievements:</strong><br/>${exp.achievements}</div>` : ""}
            </div>
          `}).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Internships -->
    ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <div class="section-title"><i class="fa-solid fa-internship"></i>Internships</div>
        <div class="timeline">
          ${nonEmptyInternships.map((item: any, i: number) => {
            const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
            const metaParts = formatSubtitle([item.company, item.location]);
            
            return `
            <div class="timeline-item" data-section="internships" data-index="${i}">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-meta">${metaParts} ${dateRange ? `• ${dateRange}` : ""}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `}).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Training Programs -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title"><i class="fa-solid fa-chalkboard-teacher"></i>Training Programs</div>
        <div class="timeline">
          ${nonEmptyTrainingPrograms.map((item: any, i: number) => {
            const metaParts = formatSubtitle([item.provider || item.organization, item.duration]);
            
            return `
            <div class="timeline-item" data-section="trainingPrograms" data-index="${i}">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-meta">${metaParts} ${item.completionDate ? `• ${item.completionDate}` : ""}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `}).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Education -->
    ${hasNonEmptyItems(data.education) ? `
      <div class="section" data-section="education">
        <div class="section-title"><i class="fa-solid fa-graduation-cap"></i>Education</div>
        <div class="timeline">
          ${getNonEmptyArray(data.education).map((edu: any, i: number) => {
            const degree = edu.degree ? edu.degree : "";
            const field = edu.field ? ` in ${edu.field}` : "";
            const metaParts = formatSubtitle([edu.school, edu.location, edu.grade ? `Grade: ${edu.grade}` : ""]);
            
            return `
            <div class="timeline-item" data-section="education" data-index="${i}">
              <div class="exp-title">${degree}${field}</div>
              <div class="exp-meta">${metaParts} ${edu.graduationDate ? `• ${edu.graduationDate}` : ""}</div>
              <div class="text">${edu.description || ""}</div>
            </div>
          `}).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Academic Projects -->
    ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title"><i class="fa-solid fa-book"></i>Academic Projects</div>
        <div class="timeline">
          ${nonEmptyAcademicProjects.map((item: any, i: number) => `
            <div class="timeline-item" data-section="academicProjects" data-index="${i}">
              <div class="exp-title">${item.name || item.title || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.duration, item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
              <div class="text">${item.description || ""}</div>
              ${item.technologies ? `<div class="text"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ""}
              ${item.url ? `<div><a href="${item.url}" target="_blank">${item.url}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Client Projects -->
    ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title"><i class="fa-solid fa-briefcase"></i>Client Projects</div>
        <div class="timeline">
          ${nonEmptyClientProjects.map((item: any, i: number) => `
            <div class="timeline-item" data-section="clientProjects" data-index="${i}">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : "", item.duration])}</div>
              <div class="text">${item.description || ""}</div>
              ${item.toolsTechnologies ? `<div class="text"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
              ${item.projectUrl ? `<div><a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Portfolio -->
    ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <div class="section-title"><i class="fa-solid fa-folder-open"></i>Portfolio</div>
        <div class="timeline">
          ${nonEmptyPortfolio.map((item: any, i: number) => `
            <div class="timeline-item" data-section="portfolio" data-index="${i}">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ""])}</div>
              <div class="text">${item.description || ""}</div>
              ${item.url ? `<div><a href="${item.url}" target="_blank">${item.url}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Leadership Positions -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title"><i class="fa-solid fa-users-cog"></i>Leadership & Positions</div>
        <div class="timeline">
          ${nonEmptyLeadershipPositions.map((item: any, i: number) => {
            const dateRange = formatDateRange(item.startDate, item.endDate);
            
            return `
            <div class="timeline-item" data-section="leadershipPositions" data-index="${i}">
              <div class="exp-title">${item.position || item.title || ""}</div>
              <div class="exp-meta">${item.organization || ""} ${dateRange ? `• ${dateRange}` : ""}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `}).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Volunteering -->
    ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <div class="section-title"><i class="fa-solid fa-hand-holding-heart"></i>Volunteering</div>
        <div class="timeline">
          ${nonEmptyVolunteering.map((item: any, i: number) => `
            <div class="timeline-item" data-section="volunteering" data-index="${i}">
              <div class="exp-title">${item.role || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.organization, item.causeArea, item.duration])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Military Service -->
    ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <div class="section-title"><i class="fa-solid fa-shield-halved"></i>Military Service</div>
        <div class="timeline">
          ${nonEmptyMilitaryService.map((item: any, i: number) => `
            <div class="timeline-item" data-section="militaryService" data-index="${i}">
              <div class="exp-title">${item.rank ? item.rank : ""}${item.rank && item.branch ? " - " : ""}${item.branch || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.specialization, item.duration])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Teaching Experience -->
    ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title"><i class="fa-solid fa-chalkboard"></i>Teaching Experience</div>
        <div class="timeline">
          ${nonEmptyTeachingExperience.map((item: any, i: number) => `
            <div class="timeline-item" data-section="teachingExperience" data-index="${i}">
              <div class="exp-title">${item.subjectCourseTaught || item.title || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.institution, item.duration])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Mentorship Experience -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title"><i class="fa-solid fa-user-graduate"></i>Mentorship Experience</div>
        <div class="timeline">
          ${nonEmptyMentorshipExperience.map((item: any, i: number) => `
            <div class="timeline-item" data-section="mentorshipExperience" data-index="${i}">
              <div class="exp-title">${item.mentorshipArea || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : "", item.duration])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Research Grants -->
    ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title"><i class="fa-solid fa-flask"></i>Research Grants</div>
        <div class="timeline">
          ${nonEmptyResearchGrants.map((item: any, i: number) => `
            <div class="timeline-item" data-section="researchGrants" data-index="${i}">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : "", item.year])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Publications -->
    ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <div class="section-title"><i class="fa-solid fa-book-open"></i>Publications</div>
        <div class="timeline">
          ${nonEmptyPublications.map((item: any, i: number) => `
            <div class="timeline-item" data-section="publications" data-index="${i}">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.journalPublisher, item.publicationType, item.year])}</div>
              ${item.authors ? `<div class="text"><strong>Authors:</strong> ${item.authors}</div>` : ""}
              ${item.urlDoi ? `<div><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Patents -->
    ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <div class="section-title"><i class="fa-solid fa-file-patent"></i>Patents</div>
        <div class="timeline">
          ${nonEmptyPatents.map((item: any, i: number) => `
            <div class="timeline-item" data-section="patents" data-index="${i}">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : "", item.issuingAuthority, item.year])}</div>
              ${item.status ? `<div class="text"><strong>Status:</strong> ${item.status}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Test Scores -->
    ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <div class="section-title"><i class="fa-solid fa-chart-simple"></i>Test Scores</div>
        <div class="timeline">
          ${nonEmptyTestScores.map((item: any, i: number) => `
            <div class="timeline-item" data-section="testScores" data-index="${i}">
              <div class="exp-title">${item.testName || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.score ? `Score: ${item.score}` : "", item.percentileRank ? `${item.percentileRank} percentile` : "", item.year])}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Certifications -->
    ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <div class="section-title"><i class="fa-solid fa-certificate"></i>Certifications</div>
        <div class="timeline">
          ${nonEmptyCertifications.map((cert: any, i: number) => `
            <div class="timeline-item" data-section="certifications" data-index="${i}">
              <div class="exp-title">${cert.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([cert.issuer, cert.date])}</div>
              ${cert.description ? `<div class="text">${cert.description}</div>` : ""}
              ${cert.url ? `<div><a href="${cert.url}" target="_blank">View Certificate</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Scholarships -->
    ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title"><i class="fa-solid fa-medal"></i>Scholarships</div>
        <div class="timeline">
          ${nonEmptyScholarships.map((item: any, i: number) => `
            <div class="timeline-item" data-section="scholarships" data-index="${i}">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.provider || item.organization, item.amount, item.year])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Co-curricular Activities -->
    ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title"><i class="fa-solid fa-puzzle-piece"></i>Co-curricular Activities</div>
        <div class="timeline">
          ${nonEmptyCoCurricular.map((item: any, i: number) => `
            <div class="timeline-item" data-section="coCurricular" data-index="${i}">
              <div class="exp-title">${item.activity || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.organization, item.role, item.year])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Extracurricular Activities -->
    ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title"><i class="fa-solid fa-running"></i>Extracurricular Activities</div>
        <div class="timeline">
          ${nonEmptyExtracurricular.map((item: any, i: number) => `
            <div class="timeline-item" data-section="extracurricular" data-index="${i}">
              <div class="exp-title">${item.activity || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.organization, item.role, item.year])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Awards -->
    ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title"><i class="fa-solid fa-award"></i>Awards</div>
        <div class="timeline">
          ${nonEmptyAwards.map((award: any, i: number) => `
            <div class="timeline-item" data-section="awards" data-index="${i}">
              <div class="exp-title">${award.title || ""}</div>
              <div class="exp-meta">${formatSubtitle([award.organization, award.issueYear || award.year])}</div>
              ${award.description ? `<div class="text">${award.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Speaking Engagements -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title"><i class="fa-solid fa-microphone"></i>Speaking Engagements</div>
        <div class="timeline">
          ${nonEmptySpeakingEngagements.map((item: any, i: number) => `
            <div class="timeline-item" data-section="speakingEngagements" data-index="${i}">
              <div class="exp-title">${item.topic || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.eventName, item.date])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Memberships -->
    ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <div class="section-title"><i class="fa-solid fa-users"></i>Memberships</div>
        <div class="timeline">
          ${nonEmptyMemberships.map((item: any, i: number) => `
            <div class="timeline-item" data-section="memberships" data-index="${i}">
              <div class="exp-title">${item.membershipName || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.organizationName, item.year])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Workshops -->
    ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <div class="section-title"><i class="fa-solid fa-wrench"></i>Workshops</div>
        <div class="timeline">
          ${nonEmptyWorkshops.map((item: any, i: number) => `
            <div class="timeline-item" data-section="workshops" data-index="${i}">
              <div class="exp-title">${item.programTitle || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.conductedBy, item.year])}</div>
              <div class="text">${item.description || ""}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Tools & Technologies -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title"><i class="fa-solid fa-screwdriver-wrench"></i>Tools & Technologies</div>
        <div class="timeline">
          ${nonEmptyToolsTechnologies.map((item: any, i: number) => `
            <div class="timeline-item" data-section="toolsTechnologies" data-index="${i}">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.category, item.proficiency, item.experienceDuration ? `Exp: ${item.experienceDuration}` : ""])}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Methodologies -->
    ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title"><i class="fa-solid fa-diagram-project"></i>Methodologies</div>
        <div class="timeline">
          ${nonEmptyMethodologies.map((item: any, i: number) => `
            <div class="timeline-item" data-section="methodologies" data-index="${i}">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.certification, item.experienceDuration ? `${item.experienceDuration} years` : ""])}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Industry Expertise -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title"><i class="fa-solid fa-industry"></i>Industry Expertise</div>
        <div class="timeline">
          ${nonEmptyIndustryExpertise.map((item: any, i: number) => `
            <div class="timeline-item" data-section="industryExpertise" data-index="${i}">
              <div class="exp-title">${item.industry || ""}</div>
              <div class="exp-meta">${formatSubtitle([item.domainArea, item.experienceDuration ? `${item.experienceDuration} years` : ""])}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Languages -->
    ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <div class="section-title"><i class="fa-solid fa-language"></i>Languages</div>
        <div class="timeline">
          ${nonEmptyLanguages.map((lang: any, i: number) => `
            <div class="timeline-item" data-section="languages" data-index="${i}">
              ${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Key Achievements -->
    ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title"><i class="fa-solid fa-trophy"></i>Key Achievements</div>
        <div class="timeline">
          ${nonEmptyKeyAchievements.map((achievement: string, i: number) => `
            <div class="timeline-item" data-section="keyAchievements" data-index="${i}">
              ${achievement}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Key Responsibilities -->
    ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title"><i class="fa-solid fa-tasks"></i>Key Responsibilities</div>
        <div class="timeline">
          ${nonEmptyResponsibilities.map((line: string, i: number) => `
            <div class="timeline-item" data-section="responsibilities" data-index="${i}">
              ${line.trim()}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Tools (Simple List) -->
    ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <div class="section-title"><i class="fa-solid fa-tools"></i>Tools & Technologies</div>
        <div class="timeline">
          ${nonEmptyTools.map((tool: string, i: number) => `
            <div class="timeline-item" data-section="tools" data-index="${i}">
              ${tool.trim()}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Projects -->
    ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <div class="section-title"><i class="fa-solid fa-project-diagram"></i>Projects</div>
        <div class="timeline">
          ${nonEmptyProjects.map((project: any, i: number) => {
            const dateRange = formatDateRange(project.startDate, project.endDate);
            
            return `
            <div class="timeline-item" data-section="projects" data-index="${i}">
              <div class="exp-title">${project.name || ""}${project.technologies ? ` | ${project.technologies}` : ""}</div>
              <div class="exp-meta">${dateRange}</div>
              <div class="text">${project.description || ""}</div>
              ${project.url ? `<div><a href="${project.url}" target="_blank">${project.urlText || "View Project"}</a></div>` : ""}
            </div>
          `}).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Hobbies -->
    ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title"><i class="fa-solid fa-heart"></i>Hobbies & Interests</div>
        <div class="timeline">
          ${nonEmptyHobbies.map((hobby: string, i: number) => `
            <div class="timeline-item" data-section="hobbies" data-index="${i}">
              ${hobby}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Social Links -->
    ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title"><i class="fa-solid fa-share-nodes"></i>Social Links</div>
        <div class="timeline">
          ${nonEmptySocialLinks.map((link: any, i: number) => `
            <div class="timeline-item" data-section="socialLinks" data-index="${i}">
              <a href="${link.url}" target="_blank">${link.urlText || link.url.replace("https://", "").replace("http://", "")}</a>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Social Profiles -->
    ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
           <!-- Social Profiles (continued) -->
        <div class="section-title"><i class="fa-solid fa-share-alt"></i>Social Profiles</div>
        <div class="timeline">
          ${nonEmptySocialProfiles.map((profile: any, i: number) => `
            <div class="timeline-item" data-section="socialProfiles" data-index="${i}">
              <a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- References -->
    ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <div class="section-title"><i class="fa-solid fa-address-book"></i>References</div>
        <div class="timeline">
          ${nonEmptyReferences.map((ref: any, i: number) => `
            <div class="timeline-item" data-section="references" data-index="${i}">
              <div class="exp-title">${ref.name || ""}</div>
              <div class="exp-meta">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
              ${ref.contactInformation ? `<div class="text"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Custom Sections -->
    ${nonEmptyCustomSections.length > 0 ? `
      ${data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any, sectionIndex: number) => `
        <div class="section" data-section="custom-${sectionIndex}">
          <div class="section-title"><i class="fa-solid fa-star"></i>${section.heading || "Custom Section"}</div>
          <div class="timeline">
            ${section.entries
              .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
              .map((entry: any, entryIndex: number) => `
              <div class="timeline-item" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
                <div class="exp-title">${entry.title || ""}${entry.organization ? ` - ${entry.organization}` : ""}</div>
                ${entry.date ? `<div class="exp-meta">${entry.date}</div>` : ""}
                ${entry.description ? `<div class="text">${entry.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    ` : ""}

    <!-- Stamp (optional decorative element) -->
    <!-- <div class="recommended">RECOMMENDED</div> -->
  </div>
</div>
</body>
</html>`;
}