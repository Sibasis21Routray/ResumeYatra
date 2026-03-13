export function buildMinimalAtsTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#1a1a1a",
    secondary: "#4b5563",
    background: "#ffffff",
    accent: "#ffffff",
    lightBackground: "#f3f4f6",
    headingFont: "Arial, Helvetica, sans-serif",
    bodyFont: "Arial, Helvetica, sans-serif",
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = "12pt";
  const headingFontSize = "14pt";
  const nameFontSize = "28pt";

  const isEmpty = (val: any): boolean => {
    if (val === null || val === undefined) return true;
    if (typeof val === "string") return val.trim().length === 0;
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === "object") return Object.keys(val).length === 0;
    return false;
  };

  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

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

  const sortedExperience = hasContent(data.experience)
    ? [...data.experience].sort(
        (a: any, b: any) =>
          new Date(b.startDate || "1900-01-01").getTime() -
          new Date(a.startDate || "1900-01-01").getTime()
      )
    : [];

  // Parse skills (handles HTML string or array)
  const parseSkills = (): any[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) return data.skills.filter((s: any) => s && s.trim());
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
  const nonEmptyEducation = getNonEmptyArray(data.education);
  const nonEmptyProjects = getNonEmptyArray(data.projects);
  const nonEmptyCertifications = getNonEmptyArray(data.certifications);
  const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
  const nonEmptyResponsibilities = getNonEmptyArray(
    Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyArray(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n")
  );
  const nonEmptyLanguages = getNonEmptyArray(data.languages);
  const nonEmptySocialLinks = getNonEmptyArray(data.socialLinks);
  const nonEmptyInternships = getNonEmptyArray(data.internships);
  const nonEmptyAcademicProjects = getNonEmptyArray(data.academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyArray(data.leadershipPositions);
  const nonEmptyTrainingPrograms = getNonEmptyArray(data.trainingPrograms);
  const nonEmptyScholarships = getNonEmptyArray(data.scholarships);
  const nonEmptyCoCurricular = getNonEmptyArray(data.coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(data.extracurricular);
  const nonEmptyAwards = getNonEmptyArray(data.awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(data.speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(data.memberships);
  const nonEmptyWorkshops = getNonEmptyArray(data.workshops);
  const nonEmptyPortfolio = getNonEmptyArray(data.portfolio);
  const nonEmptyClientProjects = getNonEmptyArray(data.clientProjects);
  const nonEmptyVolunteering = getNonEmptyArray(data.volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(data.militaryService);
  const nonEmptyToolsTechnologies = getNonEmptyArray(data.toolsTechnologies);
  const nonEmptyMethodologies = getNonEmptyArray(data.methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(data.industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(data.references);
  const nonEmptySocialProfiles = getNonEmptyArray(data.socialProfiles);
  const nonEmptyTeachingExperience = getNonEmptyArray(data.teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(data.mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(data.researchGrants);
  const nonEmptyTestScores = getNonEmptyArray(data.testScores);
  const nonEmptyPublications = getNonEmptyArray(data.publications);
  const nonEmptyPatents = getNonEmptyArray(data.patents);
  const nonEmptyCustomSections = getNonEmptyArray(data.customSections);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --sidebar-bg: #212121;
      --sidebar-text: #ffffff;
      --main-text: #363434ff;
      --accent-color: #666666;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${currentTheme.bodyFont};
      font-size: ${bodyFontSize};
      color: var(--main-text);
      line-height: 1.4;
      background: white;
    }

    .resume-wrapper {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }

    /* Left Sidebar */
    .sidebar {
      width: 30%;
      background-color: var(--sidebar-bg);
      color: var(--sidebar-text);
      padding: 40px 20px;
    }

    .profile-img {
      width: 140px;
      height: 140px;
      background: #444;
      margin-bottom: 30px;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .profile-img img { width: 100%; height: 100%; object-fit: cover; }

    .sidebar-section { margin-bottom: 25px; }

    .sidebar-title {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      border-bottom: 1px solid #444;
      padding-bottom: 4px;
    }

    .sidebar-item {
      font-size: 9pt;
      margin-bottom: 8px;
      color: #ccc;
    }

    .sidebar-item strong {
      color: #fff;
      font-weight: 600;
    }

    /* Right Main Content */
    .main-content {
      width: 70%;
      padding: 40px 35px;
      background: white;
    }

    .header-name {
      font-size: ${nameFontSize};
      font-weight: bold;
      color: #000;
      margin-bottom: 20px;
      font-family: ${currentTheme.headingFont};
    }

    .main-section { margin-bottom: 25px; }

    .main-section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #eee;
      margin-bottom: 12px;
      padding-bottom: 2px;
    }

    .summary-text { margin-bottom: 15px; color: #555; text-align: justify; }

    .experience-item { margin-bottom: 18px; }
    .exp-header { display: flex; justify-content: space-between; font-weight: bold; }
    .exp-sub { color: #666; font-style: italic; margin-bottom: 5px; font-size: 11pt; }
    .exp-desc { color: #555; margin-left: 10px; font-size: 11pt; }
    .exp-details { color: #555; margin-top: 4px; font-size: 10.5pt; }

    .skill-tag {
      display: inline-block;
      background: #f0f0f0;
      padding: 2px 8px;
      margin: 2px;
      border-radius: 3px;
      font-size: 8.5pt;
      color: #444;
    }

    .two-column-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .badge {
      background: #f0f0f0;
      color: #333;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9pt;
      display: inline-block;
      margin-right: 5px;
      margin-bottom: 5px;
    }

    @media print {
      .sidebar { -webkit-print-color-adjust: exact; background-color: #212121 !important; }
    }
  </style>
</head>
<body>
<div class="resume-wrapper">
  <div class="sidebar">
    <div class="profile-img">
      ${data.personal?.image ? `<img src="${data.personal.image}" />` : ""}
    </div>

    <div class="sidebar-section" data-section="contact">
      <div class="sidebar-title" data-section="contact">Contact</div>
      ${data.personal?.phone ? `<div class="sidebar-item" data-section="contact">📞 ${data.personal.phone}</div>` : ""}
      ${data.personal?.alternatePhone ? `<div class="sidebar-item" data-section="contact">📞 ${data.personal.alternatePhone}</div>` : ""}
      ${data.personal?.email ? `<div class="sidebar-item" data-section="contact">✉️ ${data.personal.email}</div>` : ""}
      ${
        data.personal?.fullAddress || data.personal?.location || data.personal?.country || data.personal?.pinCode
          ? `<div class="sidebar-item" data-section="contact">📍 ${[
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode,
            ]
              .filter(Boolean)
              .join(", ")}</div>`
          : ""
      }
    </div>

    <!-- Personal Details in Sidebar (if not inline) -->
    ${
      data.personal?.personalInfoDisplay !== "inline" &&
      (data.personal?.fathersName ||
        data.personal?.dateOfBirth ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo)
        ? `
    <div class="sidebar-section" data-section="personal">
      <div class="sidebar-title" data-section="personal">Personal Details</div>
      ${
        data.personal?.fathersName
          ? `<div class="sidebar-item" data-section="personal"><strong>Father:</strong> ${data.personal.fathersName}</div>`
          : ""
      }
      ${
        data.personal?.dateOfBirth || data.personal?.dob
          ? `<div class="sidebar-item" data-section="personal"><strong>DOB:</strong> ${
              data.personal?.dateOfBirth || data.personal?.dob
            }</div>`
          : ""
      }
      ${
        data.personal?.gender
          ? `<div class="sidebar-item" data-section="personal"><strong>Gender:</strong> ${data.personal.gender}</div>`
          : ""
      }
      ${
        data.personal?.maritalStatus
          ? `<div class="sidebar-item" data-section="personal"><strong>Marital:</strong> ${data.personal.maritalStatus}</div>`
          : ""
      }
      ${
        data.personal?.nationality
          ? `<div class="sidebar-item" data-section="personal"><strong>Nationality:</strong> ${data.personal.nationality}</div>`
          : ""
      }
      ${
        data.personal?.passportNo
          ? `<div class="sidebar-item" data-section="personal"><strong>Passport:</strong> ${data.personal.passportNo}</div>`
          : ""
      }
    </div>`
        : ""
    }

    <!-- Professional Context -->
    ${
      data.professionalContext && Object.values(data.professionalContext).some(v => v)
        ? `
    <div class="sidebar-section" data-section="professionalContext">
      <div class="sidebar-title" data-section="professionalContext">Professional Context</div>
      ${data.professionalContext.totalExperience ? `<div class="sidebar-item"><strong>Experience:</strong> ${data.professionalContext.totalExperience}</div>` : ''}
      ${data.professionalContext.teamSize ? `<div class="sidebar-item"><strong>Team Size:</strong> ${data.professionalContext.teamSize}</div>` : ''}
      ${data.professionalContext.industry ? `<div class="sidebar-item"><strong>Industry:</strong> ${data.professionalContext.industry}</div>` : ''}
      ${data.professionalContext.functionalDomain ? `<div class="sidebar-item"><strong>Domain:</strong> ${data.professionalContext.functionalDomain}</div>` : ''}
      ${data.professionalContext.geographicScope ? `<div class="sidebar-item"><strong>Scope:</strong> ${data.professionalContext.geographicScope}</div>` : ''}
      ${data.professionalContext.revenueResponsibility ? `<div class="sidebar-item"><strong>Revenue:</strong> ${data.professionalContext.revenueResponsibility}</div>` : ''}
    </div>`
        : ""
    }

    <!-- Skills -->
    ${
      nonEmptySkills.length > 0
        ? `
    <div class="sidebar-section" data-section="skills">
      <div class="sidebar-title" data-section="skills">Skills</div>
      ${nonEmptySkills
        .map(
          (s: any, index: number) =>
            `<div class="sidebar-item" data-section="skills" data-index="${index}">• ${s}</div>`
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Tools & Technologies -->
    ${
      nonEmptyToolsTechnologies.length > 0
        ? `
    <div class="sidebar-section" data-section="toolsTechnologies">
      <div class="sidebar-title" data-section="toolsTechnologies">Tools & Technologies</div>
      ${nonEmptyToolsTechnologies
        .map(
          (item: any, index: number) =>
            `<div class="sidebar-item" data-section="toolsTechnologies" data-index="${index}">• ${item.name || ""}${item.proficiency ? ` (${item.proficiency})` : ""}${item.experienceDuration ? ` - ${item.experienceDuration}` : ""}</div>`
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Methodologies -->
    ${
      nonEmptyMethodologies.length > 0
        ? `
    <div class="sidebar-section" data-section="methodologies">
      <div class="sidebar-title" data-section="methodologies">Methodologies</div>
      ${nonEmptyMethodologies
        .map(
          (item: any, index: number) =>
            `<div class="sidebar-item" data-section="methodologies" data-index="${index}">• ${item.name || ""}${item.certification ? ` (${item.certification})` : ""}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ""}</div>`
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Industry Expertise -->
    ${
      nonEmptyIndustryExpertise.length > 0
        ? `
    <div class="sidebar-section" data-section="industryExpertise">
      <div class="sidebar-title" data-section="industryExpertise">Industry Expertise</div>
      ${nonEmptyIndustryExpertise
        .map(
          (item: any, index: number) =>
            `<div class="sidebar-item" data-section="industryExpertise" data-index="${index}">• ${item.industry || ""}${item.domainArea ? ` - ${item.domainArea}` : ""}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ""}</div>`
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Languages -->
    ${
      nonEmptyLanguages.length > 0
        ? `
    <div class="sidebar-section" data-section="languages">
      <div class="sidebar-title" data-section="languages">Languages</div>
      ${nonEmptyLanguages
        .map((l, index: number) => {
          const langName = typeof l === 'object' ? l.language || '' : l;
          const level = typeof l === 'object' && l.level ? ` (${l.level})` : '';
          const capability = typeof l === 'object' && l.capability ? ` - ${l.capability}` : '';
          return `<div class="sidebar-item" data-section="languages" data-index="${index}">• ${langName}${level}${capability}</div>`;
        })
        .join("")}
    </div>`
        : ""
    }

    <!-- Certifications (in sidebar if they don't take much space) -->
    ${
      nonEmptyCertifications.length > 0 && nonEmptyCertifications.length <= 3
        ? `
    <div class="sidebar-section" data-section="certifications">
      <div class="sidebar-title" data-section="certifications">Certifications</div>
      ${nonEmptyCertifications
        .map((cert, index: number) => `
          <div class="sidebar-item" data-section="certifications" data-index="${index}">
            <strong>${cert.name || ''}</strong>${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}
          </div>
        `)
        .join("")}
    </div>`
        : ""
    }

    <!-- Availability & Work Authorization -->
    ${
      data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
        ? `
    <div class="sidebar-section" data-section="availabilityWorkAuth">
      <div class="sidebar-title" data-section="availabilityWorkAuth">Availability</div>
      ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<div class="sidebar-item"><strong>Notice:</strong> ${data.availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
      ${data.availabilityWorkAuth.workAuthorizationStatus ? `<div class="sidebar-item"><strong>Work Auth:</strong> ${data.availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
      ${data.availabilityWorkAuth.preferredLocation ? `<div class="sidebar-item"><strong>Preferred:</strong> ${data.availabilityWorkAuth.preferredLocation}</div>` : ''}
    </div>`
        : ""
    }

    <!-- Social Profiles -->
    ${
      nonEmptySocialProfiles.length > 0
        ? `
    <div class="sidebar-section" data-section="socialProfiles">
      <div class="sidebar-title" data-section="socialProfiles">Social Profiles</div>
      ${nonEmptySocialProfiles
        .map((profile: any, index: number) => `
          <div class="sidebar-item" data-section="socialProfiles" data-index="${index}">
            ${profile.platform || 'Profile'}: ${profile.url || ''}
          </div>
        `)
        .join("")}
    </div>`
        : ""
    }
  </div>

  <div class="main-content" data-section="personal">
    <h1 class="header-name" data-section="personal">${
      data.personal?.name || "Your Name"
    }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</h1>

    <!-- Career Objective -->
    ${
      data.careerObjective && data.careerObjective.trim().length > 0
        ? `
    <div class="main-section" data-section="careerObjective">
      <div class="main-section-title" data-section="careerObjective">Career Objective</div>
      <div class="summary-text" data-section="careerObjective">${data.careerObjective}</div>
    </div>`
        : ""
    }

    <!-- Summary -->
    ${
      data.summary && data.summary.trim().length > 0 && !data.careerObjective
        ? `
    <div class="main-section" data-section="summary">
      <div class="main-section-title" data-section="summary">Profile Summary</div>
      <div class="summary-text" data-section="summary">${data.summary}</div>
    </div>`
        : ""
    }

    <!-- Work Experience -->
    ${
      sortedExperience.length > 0
        ? `
    <div class="main-section" data-section="experience">
      <div class="main-section-title" data-section="experience">Work Experience</div>
      ${sortedExperience
        .map(
          (exp, index: number) => `
        <div class="experience-item" data-section="experience" data-index="${index}">
          <div class="exp-header" data-section="experience" data-field="title" data-index="${index}">
            <span>${exp.title || ''}</span>
            <span>${exp.startDate || ''} - ${exp.endDate || (exp.isCurrent ? 'Present' : '')}</span>
          </div>
          <div class="exp-sub" data-section="experience" data-field="company" data-index="${index}">${
            exp.company || ''
          }${exp.location ? ` | ${exp.location}` : ''}</div>
          <div class="exp-desc" data-section="experience" data-field="description" data-index="${index}">${
            exp.description || ''
          }</div>
          ${exp.achievements ? `<div class="exp-details"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Internships -->
    ${
      nonEmptyInternships.length > 0
        ? `
    <div class="main-section" data-section="internships">
      <div class="main-section-title" data-section="internships">Internships</div>
      ${nonEmptyInternships
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="internships" data-index="${index}">
          <div class="exp-header" data-section="internships" data-field="title" data-index="${index}">
            <span>${item.title || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="internships" data-field="company" data-index="${index}">${
            item.company || ''
          }</div>
          <div class="exp-desc" data-section="internships" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Training Programs -->
    ${
      nonEmptyTrainingPrograms.length > 0
        ? `
    <div class="main-section" data-section="trainingPrograms">
      <div class="main-section-title" data-section="trainingPrograms">Training Programs</div>
      ${nonEmptyTrainingPrograms
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="trainingPrograms" data-index="${index}">
          <div class="exp-header" data-section="trainingPrograms" data-field="name" data-index="${index}">
            <span>${item.name || ''}</span>
            <span>${item.completionDate || ''}</span>
          </div>
          <div class="exp-sub" data-section="trainingPrograms" data-field="provider" data-index="${index}">${
            item.provider || item.organization || ''
          }${item.duration ? ` | ${item.duration}` : ''}</div>
          <div class="exp-desc" data-section="trainingPrograms" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Education -->
    ${
      nonEmptyEducation.length > 0
        ? `
    <div class="main-section" data-section="education">
      <div class="main-section-title" data-section="education">Education</div>
      ${nonEmptyEducation
        .map(
          (edu, index: number) => `
        <div class="experience-item" data-section="education" data-index="${index}">
          <div class="exp-header" data-section="education" data-index="${index}">
            <span>${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}</span>
            <span>${edu.graduationDate || ''}</span>
          </div>
          <div class="exp-sub" data-section="education" data-index="${index}">${
            edu.school || ''
          }${edu.location ? `, ${edu.location}` : ''}${edu.grade ? ` |  ${edu.grade}` : ''}</div>
          ${edu.description ? `<div class="exp-details">${edu.description}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Certifications (if not in sidebar or more than 3) -->
    ${
      nonEmptyCertifications.length > 3
        ? `
    <div class="main-section" data-section="certifications">
      <div class="main-section-title" data-section="certifications">Certifications</div>
      ${nonEmptyCertifications
        .map(
          (cert, index: number) => `
        <div style="margin-bottom: 8px;" data-section="certifications" data-index="${index}">
          <strong data-section="certifications" data-field="name" data-index="${index}">${cert.name || ''}</strong> - <span data-section="certifications" data-field="issuer" data-index="${index}">${cert.issuer || ''}</span>${cert.date ? ` (${cert.date})` : ''}
          ${cert.url ? `<div><a href="${cert.url}" target="_blank">View Certificate</a></div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Academic Projects -->
    ${
      nonEmptyAcademicProjects.length > 0
        ? `
    <div class="main-section" data-section="academicProjects">
      <div class="main-section-title" data-section="academicProjects">Academic Projects</div>
      ${nonEmptyAcademicProjects
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="academicProjects" data-index="${index}">
          <div class="exp-header" data-section="academicProjects" data-field="name" data-index="${index}">
            <span>${item.name || item.title || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="academicProjects" data-field="institution" data-index="${index}">${
            item.institution || item.course ? `Course: ${item.course}` : ''
          }</div>
          <div class="exp-desc" data-section="academicProjects" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
          ${item.technologies && item.technologies.length > 0 ? `<div class="exp-details"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
          ${item.url ? `<div><a href="${item.url}" target="_blank">View Project</a></div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Client Projects -->
    ${
      nonEmptyClientProjects.length > 0
        ? `
    <div class="main-section" data-section="clientProjects">
      <div class="main-section-title" data-section="clientProjects">Client Projects</div>
      ${nonEmptyClientProjects
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="clientProjects" data-index="${index}">
          <div class="exp-header" data-section="clientProjects" data-field="name" data-index="${index}">
            <span>${item.name || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="clientProjects" data-field="client" data-index="${index}">${
            item.clientOrganization || ''}${item.role ? ` | Role: ${item.role}` : ''
          }</div>
          <div class="exp-desc" data-section="clientProjects" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
          ${item.toolsTechnologies ? `<div class="exp-details"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
          ${item.projectUrl ? `<div><a href="${item.projectUrl}" target="_blank">View Project</a></div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Portfolio -->
    ${
      nonEmptyPortfolio.length > 0
        ? `
    <div class="main-section" data-section="portfolio">
      <div class="main-section-title" data-section="portfolio">Portfolio</div>
      ${nonEmptyPortfolio
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="portfolio" data-index="${index}">
          <div class="exp-header" data-section="portfolio" data-field="name" data-index="${index}">
            <span>${item.name || ''}</span>
            <span>${item.type || ''}${item.platform ? ` | ${item.platform}` : ''}</span>
          </div>
          <div class="exp-desc" data-section="portfolio" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
          ${item.url ? `<div><a href="${item.url}" target="_blank">View Portfolio</a></div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Leadership Positions -->
    ${
      nonEmptyLeadershipPositions.length > 0
        ? `
    <div class="main-section" data-section="leadershipPositions">
      <div class="main-section-title" data-section="leadershipPositions">Leadership Positions</div>
      ${nonEmptyLeadershipPositions
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="leadershipPositions" data-index="${index}">
          <div class="exp-header" data-section="leadershipPositions" data-field="position" data-index="${index}">
            <span>${item.position || item.title || ''}</span>
            <span>${item.startDate || ''} - ${item.endDate || ''}</span>
          </div>
          <div class="exp-sub" data-section="leadershipPositions" data-field="organization" data-index="${index}">${
            item.organization || ''
          }</div>
          <div class="exp-desc" data-section="leadershipPositions" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Volunteering -->
    ${
      nonEmptyVolunteering.length > 0
        ? `
    <div class="main-section" data-section="volunteering">
      <div class="main-section-title" data-section="volunteering">Volunteering</div>
      ${nonEmptyVolunteering
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="volunteering" data-index="${index}">
          <div class="exp-header" data-section="volunteering" data-field="role" data-index="${index}">
            <span>${item.role || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="volunteering" data-field="organization" data-index="${index}">${
            item.organization || ''
          }${item.causeArea ? ` | ${item.causeArea}` : ''}</div>
          <div class="exp-desc" data-section="volunteering" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Military Service -->
    ${
      nonEmptyMilitaryService.length > 0
        ? `
    <div class="main-section" data-section="militaryService">
      <div class="main-section-title" data-section="militaryService">Military Service</div>
      ${nonEmptyMilitaryService
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="militaryService" data-index="${index}">
          <div class="exp-header" data-section="militaryService" data-field="rank" data-index="${index}">
            <span>${item.rank || ''} - ${item.branch || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="militaryService" data-field="specialization" data-index="${index}">${
            item.specialization || ''
          }</div>
          <div class="exp-desc" data-section="militaryService" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Teaching Experience -->
    ${
      nonEmptyTeachingExperience.length > 0
        ? `
    <div class="main-section" data-section="teachingExperience">
      <div class="main-section-title" data-section="teachingExperience">Teaching Experience</div>
      ${nonEmptyTeachingExperience
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="teachingExperience" data-index="${index}">
          <div class="exp-header" data-section="teachingExperience" data-field="title" data-index="${index}">
            <span>${item.title || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="teachingExperience" data-field="institution" data-index="${index}">${
            item.institution || ''
          }${item.subjectCourseTaught ? ` | ${item.subjectCourseTaught}` : ''}</div>
          <div class="exp-desc" data-section="teachingExperience" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Mentorship Experience -->
    ${
      nonEmptyMentorshipExperience.length > 0
        ? `
    <div class="main-section" data-section="mentorshipExperience">
      <div class="main-section-title" data-section="mentorshipExperience">Mentorship Experience</div>
      ${nonEmptyMentorshipExperience
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="mentorshipExperience" data-index="${index}">
          <div class="exp-header" data-section="mentorshipExperience" data-field="area" data-index="${index}">
            <span>${item.mentorshipArea || ''}</span>
            <span>${item.duration || ''}</span>
          </div>
          <div class="exp-sub" data-section="mentorshipExperience" data-field="organization" data-index="${index}">${
            item.organizationPlatform || ''
          }${item.menteeLevel ? ` | Mentee Level: ${item.menteeLevel}` : ''}</div>
          <div class="exp-desc" data-section="mentorshipExperience" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Research Grants -->
    ${
      nonEmptyResearchGrants.length > 0
        ? `
    <div class="main-section" data-section="researchGrants">
      <div class="main-section-title" data-section="researchGrants">Research Grants</div>
      ${nonEmptyResearchGrants
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="researchGrants" data-index="${index}">
          <div class="exp-header" data-section="researchGrants" data-field="title" data-index="${index}">
            <span>${item.title || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          <div class="exp-sub" data-section="researchGrants" data-field="agency" data-index="${index}">${
            item.agency || ''
          }${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
          <div class="exp-desc" data-section="researchGrants" data-field="description" data-index="${index}">${
            item.description || ''
          }</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Publications -->
    ${
      nonEmptyPublications.length > 0
        ? `
    <div class="main-section" data-section="publications">
      <div class="main-section-title" data-section="publications">Publications</div>
      ${nonEmptyPublications
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="publications" data-index="${index}">
          <div class="exp-header" data-section="publications" data-field="title" data-index="${index}">
            <span>${item.title || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          <div class="exp-sub" data-section="publications" data-field="publisher" data-index="${index}">${
            item.journalPublisher || ''
          }${item.publicationType ? ` | ${item.publicationType}` : ''}</div>
          ${item.authors ? `<div class="exp-details"><strong>Authors:</strong> ${item.authors}</div>` : ''}
          ${item.urlDoi ? `<div><a href="${item.urlDoi}" target="_blank">View Publication</a></div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Patents -->
    ${
      nonEmptyPatents.length > 0
        ? `
    <div class="main-section" data-section="patents">
      <div class="main-section-title" data-section="patents">Patents</div>
      ${nonEmptyPatents
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="patents" data-index="${index}">
          <div class="exp-header" data-section="patents" data-field="title" data-index="${index}">
            <span>${item.title || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          <div class="exp-sub" data-section="patents" data-field="patentNumber" data-index="${index}">${
            item.patentNumber || ''
          }${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
          <div class="exp-details"><strong>Status:</strong> ${item.status || ''}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Test Scores -->
    ${
      nonEmptyTestScores.length > 0
        ? `
    <div class="main-section" data-section="testScores">
      <div class="main-section-title" data-section="testScores">Test Scores</div>
      ${nonEmptyTestScores
        .map(
          (item: any, index: number) => `
        <div style="margin-bottom: 8px;" data-section="testScores" data-index="${index}">
          <strong>${item.testName || ''}</strong> - Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}${item.year ? ` | ${item.year}` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Awards -->
    ${
      nonEmptyAwards.length > 0
        ? `
    <div class="main-section" data-section="awards">
      <div class="main-section-title" data-section="awards">Awards</div>
      ${nonEmptyAwards
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="awards" data-index="${index}">
          <div class="exp-header" data-section="awards" data-field="title" data-index="${index}">
            <span>${item.title || ''}</span>
            <span>${item.issueYear || ''}</span>
          </div>
          <div class="exp-sub" data-section="awards" data-field="organization" data-index="${index}">${
            item.organization || ''
          }</div>
          ${item.description ? `<div class="exp-desc">${item.description}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Speaking Engagements -->
    ${
      nonEmptySpeakingEngagements.length > 0
        ? `
    <div class="main-section" data-section="speakingEngagements">
      <div class="main-section-title" data-section="speakingEngagements">Speaking Engagements</div>
      ${nonEmptySpeakingEngagements
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="speakingEngagements" data-index="${index}">
          <div class="exp-header" data-section="speakingEngagements" data-field="topic" data-index="${index}">
            <span>${item.topic || ''}</span>
            <span>${item.date || ''}</span>
          </div>
          <div class="exp-sub" data-section="speakingEngagements" data-field="event" data-index="${index}">${
            item.eventName || ''
          }</div>
          ${item.description ? `<div class="exp-desc">${item.description}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Memberships -->
    ${
      nonEmptyMemberships.length > 0
        ? `
    <div class="main-section" data-section="memberships">
      <div class="main-section-title" data-section="memberships">Memberships</div>
      ${nonEmptyMemberships
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="memberships" data-index="${index}">
          <div class="exp-header" data-section="memberships" data-field="name" data-index="${index}">
            <span>${item.membershipName || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          <div class="exp-sub" data-section="memberships" data-field="organization" data-index="${index}">${
            item.organizationName || ''
          }</div>
          ${item.description ? `<div class="exp-desc">${item.description}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Workshops -->
    ${
      nonEmptyWorkshops.length > 0
        ? `
    <div class="main-section" data-section="workshops">
      <div class="main-section-title" data-section="workshops">Workshops</div>
      ${nonEmptyWorkshops
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="workshops" data-index="${index}">
          <div class="exp-header" data-section="workshops" data-field="title" data-index="${index}">
            <span>${item.programTitle || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          <div class="exp-sub" data-section="workshops" data-field="conductedBy" data-index="${index}">${
            item.conductedBy || ''
          }</div>
          ${item.description ? `<div class="exp-desc">${item.description}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Scholarships -->
    ${
      nonEmptyScholarships.length > 0
        ? `
    <div class="main-section" data-section="scholarships">
      <div class="main-section-title" data-section="scholarships">Scholarships</div>
      ${nonEmptyScholarships
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="scholarships" data-index="${index}">
          <div class="exp-header" data-section="scholarships" data-field="name" data-index="${index}">
            <span>${item.name || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          <div class="exp-sub" data-section="scholarships" data-field="provider" data-index="${index}">${
            item.provider || item.organization || ''
          }</div>
          ${item.description ? `<div class="exp-desc">${item.description}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Co-curricular Activities -->
    ${
      nonEmptyCoCurricular.length > 0
        ? `
    <div class="main-section" data-section="coCurricular">
      <div class="main-section-title" data-section="coCurricular">Co-curricular Activities</div>
      ${nonEmptyCoCurricular
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="coCurricular" data-index="${index}">
          <div class="exp-header" data-section="coCurricular" data-field="activity" data-index="${index}">
            <span>${item.activity || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          ${item.role ? `<div class="exp-sub">Role: ${item.role}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Extracurricular Activities -->
    ${
      nonEmptyExtracurricular.length > 0
        ? `
    <div class="main-section" data-section="extracurricular">
      <div class="main-section-title" data-section="extracurricular">Extracurricular Activities</div>
      ${nonEmptyExtracurricular
        .map(
          (item: any, index: number) => `
        <div class="experience-item" data-section="extracurricular" data-index="${index}">
          <div class="exp-header" data-section="extracurricular" data-field="activity" data-index="${index}">
            <span>${item.activity || ''}</span>
            <span>${item.year || ''}</span>
          </div>
          ${item.role ? `<div class="exp-sub">Role: ${item.role}</div>` : ''}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- References -->
    ${
      nonEmptyReferences.length > 0
        ? `
    <div class="main-section" data-section="references">
      <div class="main-section-title" data-section="references">References</div>
      <div class="two-column-grid">
      ${nonEmptyReferences
        .map(
          (ref: any, index: number) => `
        <div style="margin-bottom: 10px;" data-section="references" data-index="${index}">
          <strong>${ref.name || ''}</strong><br>
          ${ref.designationRelationship || ''}<br>
          ${ref.organization || ''}<br>
          ${ref.contactInformation || ''}
        </div>
      `
        )
        .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Custom Sections -->
    ${
      nonEmptyCustomSections.length > 0
        ? `
    <div class="main-section" data-section="customSections">
      ${nonEmptyCustomSections
        .filter((section: any) => section.isVisible !== false)
        .map(
          (section: any, sectionIndex: number) => `
        <div class="main-section" data-section="custom-${sectionIndex}">
          <div class="main-section-title">${section.heading || 'Custom Section'}</div>
          ${section.entries && section.entries.length > 0
            ? section.entries
              .filter((entry: any) => entry.isVisible !== false)
              .map(
                (entry: any, entryIndex: number) => `
              <div class="experience-item" data-index="${entryIndex}">
                <div class="exp-header">
                  <span>${entry.title || ''}</span>
                  <span>${entry.date || ''}</span>
                </div>
                <div class="exp-sub">${entry.organization || ''}</div>
                <div class="exp-desc">${entry.description || ''}</div>
              </div>
            `
              )
              .join("")
            : ''
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }
  </div>
</div>
</body>
</html>`;
}