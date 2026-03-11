export function buildOrionTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#7ca29e", // The sage/teal color from your image
    secondary: "#f4f7f6",
    background: "#ffffff",
    headingFont: "Inter",
    bodyFont: "Inter",
  };

  const currentTheme = theme || defaultTheme;
  const userFontSize = data.fontSize || 11;
  const userFontFamily = data.fontFamily || "Inter, sans-serif";

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.8);

  // Helper function to check if section has data
  const hasData = (section: any): boolean => {
    if (!section) return false;
    if (Array.isArray(section)) return section.length > 0;
    if (typeof section === "object") return Object.keys(section).length > 0;
    return !!section;
  };

  // Helper to format date range
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate) parts.push(startDate);
    if (endDate) parts.push(endDate);
    else if (isCurrent) parts.push("Present");
    return parts.join(" - ");
  };

  // Helper to safely get array from skills
  const getSkillsArray = (skills: any): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") {
      return skills.split(",").map(s => s.trim()).filter(s => s);
    }
    return [];
  };

  const skillsArray = getSkillsArray(data.skills);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${currentTheme.primary};
      --sidebar-bg: #fdfdfd;
      --border-color: #7ca29e;
      --text-dark: #333333;
      --text-light: #666666;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text-dark);
      line-height: 1.5;
      background: #e5e7eb;
      padding: 40px 0;
    }

    /* Main Frame from Image */
    .outer-container {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      border: 8px solid var(--border-color);
      border-radius: 12px;
      display: flex;
      min-height: 1100px;
      position: relative;
    }

    /* Left Column (Sidebar) */
    .sidebar {
      width: 35%;
      padding: 40px 30px;
      border-right: 1px solid #eeeeee;
    }

    /* Right Column (Content) */
    .main-content {
      flex: 1;
      padding: 40px 40px;
    }

    /* Profile Image (Top Right overlap style) */
    .profile-container {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 130px;
      height: 130px;
      z-index: 10;
    }

    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 1px solid #ddd;
    }

    /* Header Styling */
    .header-section {
      margin-bottom: 40px;
      padding-right: 140px; /* Leave room for photo */
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 300;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #333;
      margin-bottom: 5px;
    }

    .header-divider {
      width: 100%;
      height: 1px;
      background: #ddd;
      margin: 15px 0;
    }

    /* Section Headings */
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 15px;
      color: #000;
    }

    .sidebar-title {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }

    /* Content Styling */
    .entry {
      margin-bottom: 25px;
    }

    .entry-header {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: #333;
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .entry-title {
      font-weight: 700;
    }

    .entry-date {
      font-weight: 400;
      font-size: 0.9em;
      color: var(--text-light);
    }

    .entry-sub {
      color: var(--text-light);
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      margin-bottom: 8px;
    }

    .entry-detail {
      font-size: ${baseFontSize - 1}px;
      margin: 4px 0;
      color: var(--text-light);
    }

    .entry-detail strong {
      color: var(--primary);
      font-weight: 600;
    }

    .entry-desc {
      font-size: ${baseFontSize}px;
      color: var(--text-light);
      text-align: justify;
    }

    .contact-info {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: var(--text-light);
      list-style: none;
    }

    .contact-info li {
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      word-break: break-word;
    }

    .contact-info a {
      color: var(--primary);
      text-decoration: none;
    }

    .contact-info a:hover {
      text-decoration: underline;
    }

    .skill-tag {
      display: inline-block;
      margin-bottom: 8px;
      color: var(--text-light);
      font-size: ${Math.round(baseFontSize * 0.95)}px;
    }
    
    .skill-dot {
      color: var(--primary);
      margin-right: 8px;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 5px;
      margin-bottom: 10px;
    }

    .tech-tag {
      background-color: ${currentTheme.primary}15;
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: ${baseFontSize - 2}px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    @media print {
      body { background: white; padding: 0; }
      .outer-container { border-radius: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="outer-container">
    ${data.personal?.image ? `
      <div class="profile-container">
        <img src="${data.personal.image}" class="profile-photo" alt="Profile">
      </div>
    ` : data.personal?.name ? `
      <div class="profile-container" style="display:flex; align-items:center; justify-content:center; background:${currentTheme.primary}20; color:${currentTheme.primary}; border-radius:50%; font-size:48px;">
        ${data.personal.name.charAt(0).toUpperCase()}
      </div>
    ` : ""}

    <aside class="sidebar">
      <!-- Contact Information -->
      <div class="sidebar-section" data-section="contact">
        <h3 class="sidebar-title" data-section="contact">Contact</h3>
        <ul class="contact-info" data-section="contact">
          ${data.personal?.phone ? `<li data-section="contact">📞 ${data.personal.phone}</li>` : ""}
          ${data.personal?.alternatePhone ? `<li data-section="contact">📞 ${data.personal.alternatePhone}</li>` : ""}
          ${data.personal?.email ? `<li data-section="contact">✉️ ${data.personal.email}</li>` : ""}
          
          ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `
            <li data-section="contact">📍 ${[
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode
            ].filter(Boolean).join(", ")}</li>
          ` : ""}
          
          ${data.personal?.linkedinUrl ? `<li data-section="contact"><a href="${data.personal.linkedinUrl}" target="_blank">🔗 LinkedIn</a></li>` : ""}
          ${data.personal?.githubUrl ? `<li data-section="contact"><a href="${data.personal.githubUrl}" target="_blank">🐙 GitHub</a></li>` : ""}
          ${data.personal?.portfolioUrl ? `<li data-section="contact"><a href="${data.personal.portfolioUrl}" target="_blank">💼 Portfolio</a></li>` : ""}
          ${data.personal?.website ? `<li data-section="contact"><a href="${data.personal.website}" target="_blank">🌐 Website</a></li>` : ""}
        </ul>
      </div>

      <!-- Personal Details (if not inline) -->
      ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus || data.personal?.nationality || data.personal?.passportNo) && data.personal?.personalInfoDisplay !== "inline" ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="personal">
          <h3 class="sidebar-title" data-section="personal">Personal Details</h3>
          <ul class="contact-info" data-section="personal">
            ${data.personal?.fathersName ? `<li data-section="personal">👨 Father: ${data.personal.fathersName}</li>` : ""}
            ${data.personal?.dob ? `<li data-section="personal">📅 DOB: ${data.personal.dob}</li>` : ""}
            ${data.personal?.gender ? `<li data-section="personal">⚥ Gender: ${data.personal.gender}</li>` : ""}
            ${data.personal?.maritalStatus ? `<li data-section="personal">💍 Marital: ${data.personal.maritalStatus}</li>` : ""}
            ${data.personal?.nationality ? `<li data-section="personal">🌍 Nationality: ${data.personal.nationality}</li>` : ""}
            ${data.personal?.passportNo ? `<li data-section="personal">🛂 Passport: ${data.personal.passportNo}</li>` : ""}
          </ul>
        </div>
      ` : ""}

      <!-- Professional Context -->
      ${data.professionalContext && Object.keys(data.professionalContext).length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="professionalContext">
          <h3 class="sidebar-title">Professional Context</h3>
          <ul class="contact-info">
            ${data.professionalContext.totalExperience ? `<li>⏱️ Experience: ${data.professionalContext.totalExperience}</li>` : ""}
            ${data.professionalContext.teamSize ? `<li>👥 Team Size: ${data.professionalContext.teamSize}</li>` : ""}
            ${data.professionalContext.industry ? `<li>🏢 Industry: ${data.professionalContext.industry}</li>` : ""}
            ${data.professionalContext.functionalDomain ? `<li>📋 Domain: ${data.professionalContext.functionalDomain}</li>` : ""}
            ${data.professionalContext.geographicScope ? `<li>🌎 Scope: ${data.professionalContext.geographicScope}</li>` : ""}
            ${data.professionalContext.revenueResponsibility ? `<li>💰 Revenue: ${data.professionalContext.revenueResponsibility}</li>` : ""}
          </ul>
        </div>
      ` : ""}

      <!-- Availability & Work Auth -->
      ${data.availabilityWorkAuth && Object.keys(data.availabilityWorkAuth).length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="availabilityWorkAuth">
          <h3 class="sidebar-title">Availability</h3>
          <ul class="contact-info">
            ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<li>📅 Notice: ${data.availabilityWorkAuth.availabilityNoticePeriod}</li>` : ""}
            ${data.availabilityWorkAuth.workAuthorizationStatus ? `<li>🪪 Work Auth: ${data.availabilityWorkAuth.workAuthorizationStatus}</li>` : ""}
            ${data.availabilityWorkAuth.preferredLocation ? `<li>📍 Preferred: ${data.availabilityWorkAuth.preferredLocation}</li>` : ""}
          </ul>
        </div>
      ` : ""}

      <!-- Skills -->
      ${skillsArray.length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="skills">
          <h3 class="sidebar-title">Skills</h3>
          <div>
            ${skillsArray.map((skill: string) => `
              <div class="skill-tag"><span class="skill-dot">•</span>${skill}</div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Languages -->
      ${data.languages && data.languages.length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="languages">
          <h3 class="sidebar-title">Languages</h3>
          <div class="contact-info">
            ${data.languages.map((lang: any) => `
              <div style="margin-bottom: 5px;">
                <span class="skill-dot">•</span>
                ${lang.language || lang}
                ${lang.proficiency ? ` (${lang.proficiency})` : ""}
                ${lang.capability ? ` - ${lang.capability}` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Hobbies -->
      ${data.hobbies && data.hobbies.length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="hobbies">
          <h3 class="sidebar-title">Hobbies</h3>
          <div>
            ${(Array.isArray(data.hobbies) ? data.hobbies : (data.hobbies || "").split(","))
              .map((hobby: any) => `
                <div class="skill-tag"><span class="skill-dot">•</span>${typeof hobby === "string" ? hobby.trim() : hobby}</div>
              `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Social Links -->
      ${data.socialLinks && data.socialLinks.length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="socialLinks">
          <h3 class="sidebar-title">Social Links</h3>
          <ul class="contact-info">
            ${data.socialLinks.map((link: any) => `
              <li><a href="${link.url}" target="_blank">${link.platform || link.urlText || link.url}</a></li>
            `).join("")}
          </ul>
        </div>
      ` : ""}

      <!-- Social Profiles -->
      ${data.socialProfiles && data.socialProfiles.length > 0 ? `
        <div class="sidebar-section" style="margin-top: 40px;" data-section="socialProfiles">
          <h3 class="sidebar-title">Social Profiles</h3>
          <ul class="contact-info">
            ${data.socialProfiles.map((item: any) => `
              <li><a href="${item.url}" target="_blank">${item.platform || "Profile"}</a></li>
            `).join("")}
          </ul>
        </div>
      ` : ""}
    </aside>

    <main class="main-content">
      <header class="header-section">
        <h1 class="name">${data.personal?.name?.toUpperCase() || "YOUR NAME"}</h1>
        ${data.personal?.jobTitle || data.personal?.role ? `<div style="margin-top: 5px; color: var(--text-light);">${data.personal?.jobTitle || data.personal?.role}</div>` : ""}
        <div class="header-divider"></div>
      </header>

      <!-- Summary -->
      ${data.summary ? `
        <div class="entry" data-section="summary">
          <h3 class="section-title">Profile</h3>
          <div class="entry-desc">${data.summary}</div>
        </div>
      ` : ""}

      <!-- Career Objective -->
      ${data.careerObjective ? `
        <div class="entry" data-section="careerObjective">
          <h3 class="section-title">Career Objective</h3>
          <div class="entry-desc">${data.careerObjective}</div>
        </div>
      ` : ""}

      <!-- Work Experience -->
      ${data.experience && data.experience.length > 0 ? `
        <div class="entry" data-section="experience">
          <h3 class="section-title">Work Experience</h3>
          ${data.experience.map((exp: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${exp.title || ""}</span>
                <span class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
              </div>
              <div class="entry-sub">
                ${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}${exp.domain ? ` | ${exp.domain}` : ""}
              </div>
              ${exp.description ? `<div class="entry-desc">${exp.description}</div>` : ""}
              ${exp.achievements ? `
                <div class="entry-desc" style="margin-top: 8px;">
                  <strong>Key Achievements:</strong> ${exp.achievements}
                </div>
              ` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Education -->
      ${data.education && data.education.length > 0 ? `
        <div class="entry" data-section="education">
          <h3 class="section-title">Education</h3>
          ${data.education.map((edu: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</span>
                <span class="entry-date">${edu.graduationDate || edu.endDate || ""}</span>
              </div>
              <div class="entry-sub">
                ${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}
              </div>
              ${edu.startDate ? `<div class="entry-detail"><strong>Start Date:</strong> ${edu.startDate}</div>` : ""}
              ${edu.grade ? `<div class="entry-detail"><strong>Grade:</strong> ${edu.grade}</div>` : ""}
              ${edu.description ? `<div class="entry-desc">${edu.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Internships -->
      ${data.internships && data.internships.length > 0 ? `
        <div class="entry" data-section="internships">
          <h3 class="section-title">Internships</h3>
          ${data.internships.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.title || ""}</span>
                <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">${item.company || ""}${item.location ? `, ${item.location}` : ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Academic Projects -->
      ${data.academicProjects && data.academicProjects.length > 0 ? `
        <div class="entry" data-section="academicProjects">
          <h3 class="section-title">Academic Projects</h3>
          ${data.academicProjects.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.name || item.title || ""}</span>
                <span class="entry-date">${item.duration || ""}</span>
              </div>
              <div class="entry-sub">
                ${item.institution || ""}${item.course ? ` | ${item.course}` : ""}
              </div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
              ${item.technologies && item.technologies.length > 0 ? `
                <div class="tech-stack">
                  ${(Array.isArray(item.technologies) ? item.technologies : [item.technologies]).map((tech: string) => 
                    `<span class="tech-tag">${tech}</span>`
                  ).join("")}
                </div>
              ` : ""}
              ${item.url ? `<div class="entry-detail"><strong>URL:</strong> <a href="${item.url}" target="_blank" style="color: var(--primary);">${item.url}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Training Programs -->
      ${data.trainingPrograms && data.trainingPrograms.length > 0 ? `
        <div class="entry" data-section="trainingPrograms">
          <h3 class="section-title">Training Programs</h3>
          ${data.trainingPrograms.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.name || ""}</span>
                <span class="entry-date">${item.completionDate || ""}</span>
              </div>
              <div class="entry-sub">
                ${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}
              </div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Leadership Positions -->
      ${data.leadershipPositions && data.leadershipPositions.length > 0 ? `
        <div class="entry" data-section="leadershipPositions">
          <h3 class="section-title">Leadership & Positions</h3>
          ${data.leadershipPositions.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.position || item.title || ""}</span>
                <span class="entry-date">${formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">${item.organization || ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Co-curricular Activities -->
      ${data.coCurricular && data.coCurricular.length > 0 ? `
        <div class="entry" data-section="coCurricular">
          <h3 class="section-title">Co-curricular Activities</h3>
          ${data.coCurricular.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.activity || ""}</span>
                <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">
                ${item.organization || ""}${item.role ? ` | ${item.role}` : ""}
              </div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Extracurricular Activities -->
      ${data.extracurricular && data.extracurricular.length > 0 ? `
        <div class="entry" data-section="extracurricular">
          <h3 class="section-title">Extracurricular Activities</h3>
          ${data.extracurricular.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.activity || ""}</span>
                <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">
                ${item.organization || ""}${item.role ? ` | ${item.role}` : ""}
              </div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
        <div class="entry" data-section="projects">
          <h3 class="section-title">Projects</h3>
          ${data.projects.map((project: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${project.name || ""}</span>
                <span class="entry-date">${formatDateRange(project.startDate, project.endDate)}</span>
              </div>
              ${project.technologies ? `<div class="entry-detail"><strong>Technologies:</strong> ${project.technologies}</div>` : ""}
              ${project.description ? `<div class="entry-desc">${project.description}</div>` : ""}
              ${project.url ? `<div class="entry-detail"><a href="${project.url}" target="_blank" style="color: var(--primary);">${project.urlText || project.url}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Certifications -->
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="entry" data-section="certifications">
          <h3 class="section-title">Certifications</h3>
          ${data.certifications.map((cert: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${cert.name || ""}</span>
                <span class="entry-date">${cert.date || ""}</span>
              </div>
              <div class="entry-sub">${cert.issuer || ""}</div>
              ${cert.description ? `<div class="entry-desc">${cert.description}</div>` : ""}
              ${cert.url ? `<div class="entry-detail"><a href="${cert.url}" target="_blank" style="color: var(--primary);">View Certificate</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Scholarships -->
      ${data.scholarships && data.scholarships.length > 0 ? `
        <div class="entry" data-section="scholarships">
          <h3 class="section-title">Scholarships</h3>
          ${data.scholarships.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.name || ""}</span>
                <span class="entry-date">${item.year || ""}</span>
              </div>
              <div class="entry-sub">
                ${item.provider || item.organization || ""}${item.amount ? ` | ${item.amount}` : ""}
              </div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Awards -->
      ${data.awards && data.awards.length > 0 ? `
        <div class="entry" data-section="awards">
          <h3 class="section-title">Awards</h3>
          ${data.awards.map((award: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${award.title || ""}</span>
                <span class="entry-date">${award.issueYear || award.year || ""}</span>
              </div>
              <div class="entry-sub">${award.organization || ""}</div>
              ${award.description ? `<div class="entry-desc">${award.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Speaking Engagements -->
      ${data.speakingEngagements && data.speakingEngagements.length > 0 ? `
        <div class="entry" data-section="speakingEngagements">
          <h3 class="section-title">Speaking Engagements</h3>
          ${data.speakingEngagements.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.topic || ""}</span>
                <span class="entry-date">${item.date || ""}</span>
              </div>
              <div class="entry-sub">${item.eventName || ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Memberships -->
      ${data.memberships && data.memberships.length > 0 ? `
        <div class="entry" data-section="memberships">
          <h3 class="section-title">Memberships</h3>
          ${data.memberships.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.membershipName || ""}</span>
                <span class="entry-date">${item.year || ""}</span>
              </div>
              <div class="entry-sub">${item.organizationName || ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Workshops -->
      ${data.workshops && data.workshops.length > 0 ? `
        <div class="entry" data-section="workshops">
          <h3 class="section-title">Workshops</h3>
          ${data.workshops.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.programTitle || ""}</span>
                <span class="entry-date">${item.year || ""}</span>
              </div>
              <div class="entry-sub">${item.conductedBy || ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Portfolio -->
      ${data.portfolio && data.portfolio.length > 0 ? `
        <div class="entry" data-section="portfolio">
          <h3 class="section-title">Portfolio</h3>
          ${data.portfolio.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.name || ""}</span>
              </div>
              <div class="entry-sub">
                ${item.type || ""}${item.platform ? ` on ${item.platform}` : ""}
              </div>
              ${item.url ? `<div class="entry-detail"><a href="${item.url}" target="_blank" style="color: var(--primary);">${item.url}</a></div>` : ""}
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Client Projects -->
      ${data.clientProjects && data.clientProjects.length > 0 ? `
        <div class="entry" data-section="clientProjects">
          <h3 class="section-title">Client Projects</h3>
          ${data.clientProjects.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.name || ""}</span>
              </div>
              <div class="entry-sub">
                ${item.clientOrganization || ""}${item.role ? ` - ${item.role}` : ""}
              </div>
              ${item.duration ? `<div class="entry-detail"><strong>Duration:</strong> ${item.duration}</div>` : ""}
              ${item.toolsTechnologies ? `<div class="entry-detail"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
              ${item.projectUrl ? `<div class="entry-detail"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary);">${item.projectUrl}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Volunteering -->
      ${data.volunteering && data.volunteering.length > 0 ? `
        <div class="entry" data-section="volunteering">
          <h3 class="section-title">Volunteering</h3>
          ${data.volunteering.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.role || ""}</span>
                <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">${item.organization || ""}</div>
              ${item.causeArea ? `<div class="entry-detail"><strong>Cause:</strong> ${item.causeArea}</div>` : ""}
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Military Service -->
      ${data.militaryService && data.militaryService.length > 0 ? `
        <div class="entry" data-section="militaryService">
          <h3 class="section-title">Military Service</h3>
          ${data.militaryService.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.branch || ""} - ${item.rank || ""}</span>
                <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              ${item.specialization ? `<div class="entry-sub">${item.specialization}</div>` : ""}
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Key Achievements -->
      ${data.keyAchievements && data.keyAchievements.length > 0 ? `
        <div class="entry" data-section="keyAchievements">
          <h3 class="section-title">Key Achievements</h3>
          ${data.keyAchievements.map((achievement: string, index: number) => `
            <div class="entry" data-index="${index}">
              <div class="entry-desc">• ${achievement}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Responsibilities -->
      ${data.responsibilities && data.responsibilities.length > 0 ? `
        <div class="entry" data-section="responsibilities">
          <h3 class="section-title">Key Responsibilities</h3>
          ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || "").split("\n"))
            .filter((line: string) => line.trim())
            .map((line: string, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-desc">• ${line.trim()}</div>
              </div>
            `).join("")}
        </div>
      ` : ""}

      <!-- Tools & Technologies -->
      ${data.tools && data.tools.length > 0 ? `
        <div class="entry" data-section="tools">
          <h3 class="section-title">Tools & Technologies</h3>
          <div class="tech-stack">
            ${(Array.isArray(data.tools) ? data.tools : (data.tools || "").split(","))
              .map((tool: any) => `
                <span class="tech-tag">${typeof tool === "string" ? tool.trim() : tool}</span>
              `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Tools Technologies (from toolsTechnologies array) -->
      ${data.toolsTechnologies && data.toolsTechnologies.length > 0 ? `
        <div class="entry" data-section="toolsTechnologies">
          <h3 class="section-title">Tools & Technologies</h3>
          <div class="grid-2">
            ${data.toolsTechnologies.map((item: any) => `
              <div class="entry">
                <div class="entry-title">${item.name || ""}</div>
                ${item.category ? `<div class="entry-detail"><strong>Category:</strong> ${item.category}</div>` : ""}
                ${item.proficiency ? `<div class="entry-detail"><strong>Proficiency:</strong> ${item.proficiency}</div>` : ""}
                ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Methodologies -->
      ${data.methodologies && data.methodologies.length > 0 ? `
        <div class="entry" data-section="methodologies">
          <h3 class="section-title">Methodologies</h3>
          <div class="grid-2">
            ${data.methodologies.map((item: any) => `
              <div class="entry">
                <div class="entry-title">${item.name || ""}</div>
                ${item.certification ? `<div class="entry-detail"><strong>Certification:</strong> ${item.certification}</div>` : ""}
                ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Industry Expertise -->
      ${data.industryExpertise && data.industryExpertise.length > 0 ? `
        <div class="entry" data-section="industryExpertise">
          <h3 class="section-title">Industry Expertise</h3>
          <div class="grid-2">
            ${data.industryExpertise.map((item: any) => `
              <div class="entry">
                <div class="entry-title">${item.industry || ""}</div>
                ${item.domainArea ? `<div class="entry-detail"><strong>Domain:</strong> ${item.domainArea}</div>` : ""}
                ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Teaching Experience -->
      ${data.teachingExperience && data.teachingExperience.length > 0 ? `
        <div class="entry" data-section="teachingExperience">
          <h3 class="section-title">Teaching Experience</h3>
          ${data.teachingExperience.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.subjectCourseTaught || ""}</span>
                <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">${item.institution || ""} - ${item.title || ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Mentorship Experience -->
      ${data.mentorshipExperience && data.mentorshipExperience.length > 0 ? `
        <div class="entry" data-section="mentorshipExperience">
          <h3 class="section-title">Mentorship Experience</h3>
          ${data.mentorshipExperience.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.mentorshipArea || ""}</span>
                <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
              </div>
              <div class="entry-sub">${item.organizationPlatform || ""} - ${item.menteeLevel || ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Research Grants -->
      ${data.researchGrants && data.researchGrants.length > 0 ? `
        <div class="entry" data-section="researchGrants">
          <h3 class="section-title">Research Grants</h3>
          ${data.researchGrants.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.title || ""}</span>
                <span class="entry-date">${item.year || ""}</span>
              </div>
              <div class="entry-sub">${item.agency || ""}${item.amount ? ` | ${item.amount}` : ""}</div>
              ${item.description ? `<div class="entry-desc">${item.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Test Scores -->
      ${data.testScores && data.testScores.length > 0 ? `
        <div class="entry" data-section="testScores">
          <h3 class="section-title">Test Scores</h3>
          <div class="grid-2">
            ${data.testScores.map((item: any) => `
              <div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${item.testName || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-detail"><strong>Score:</strong> ${item.score || ""}</div>
                ${item.percentileRank ? `<div class="entry-detail"><strong>Percentile:</strong> ${item.percentileRank}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Publications -->
      ${data.publications && data.publications.length > 0 ? `
        <div class="entry" data-section="publications">
          <h3 class="section-title">Publications</h3>
          ${data.publications.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.title || ""}</span>
                <span class="entry-date">${item.year || ""}</span>
              </div>
              <div class="entry-sub">${item.journalPublisher || ""} (${item.publicationType || ""})</div>
              ${item.urlDoi ? `<div class="entry-detail"><a href="${item.urlDoi}" target="_blank" style="color: var(--primary);">${item.urlDoi}</a></div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Patents -->
      ${data.patents && data.patents.length > 0 ? `
        <div class="entry" data-section="patents">
          <h3 class="section-title">Patents</h3>
          ${data.patents.map((item: any) => `
            <div class="entry">
              <div class="entry-header">
                <span class="entry-title">${item.title || ""}</span>
                <span class="entry-date">${item.year || ""}</span>
              </div>
              <div class="entry-sub">
                Patent #: ${item.patentNumber || ""} | ${item.issuingAuthority || ""}
              </div>
              <div class="entry-detail"><strong>Status:</strong> ${item.status || ""}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- References -->
      ${data.references && data.references.length > 0 ? `
        <div class="entry" data-section="references">
          <h3 class="section-title">References</h3>
          ${data.references.map((item: any) => `
            <div class="entry">
              <div class="entry-title">${item.name || ""}</div>
              <div class="entry-sub">${item.designationRelationship || ""} at ${item.organization || ""}</div>
              ${item.contactInformation ? `<div class="entry-detail"><strong>Contact:</strong> ${item.contactInformation}</div>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Custom Sections -->
      ${data.customSections && data.customSections.length > 0 ? `
        ${data.customSections.map((section: any) => `
          ${section.visible !== false && section.entries && section.entries.length > 0 ? `
            <div class="entry" data-section="customSections" data-custom-section-id="${section.id}">
              <h3 class="section-title">${section.heading || section.title || "Custom Section"}</h3>
              ${section.entries.map((entry: any) => `
                <div class="entry">
                  <div class="entry-header">
                    <span class="entry-title">${entry.title || ""}</span>
                    ${entry.date ? `<span class="entry-date">${entry.date}</span>` : ""}
                  </div>
                  ${entry.subtitle || entry.organization ? `<div class="entry-sub">${entry.subtitle || entry.organization}</div>` : ""}
                  ${entry.description ? `<div class="entry-desc">${entry.description}</div>` : ""}
                </div>
              `).join("")}
            </div>
          ` : ""}
        `).join("")}
      ` : ""}
    </main>
  </div>
</body>
</html>`;
}