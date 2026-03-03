"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMachampTemplate = buildMachampTemplate;
function buildMachampTemplate(data, theme) {
    const defaultTheme = {
        primary: "#000000", // Black primary for headings/names
        secondary: "#64748b", // Grey for contact info
        background: "#ffffff",
        headingFont: "Inter, sans-serif",
        bodyFont: "Inter, sans-serif"
    };
    // --- PRESERVED LOGIC START ---
    const currentTheme = theme || defaultTheme;
    const typography = theme?.typography || {
        fontSize: "medium",
        alignment: "left",
        fontWeight: "normal",
    };
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Inter, sans-serif';
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
    const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
    const fontSizeMap = {
        small: { base: "11px", heading: "30px", subheading: "14px" },
        medium: { base: "14px", heading: "36px", subheading: "15px" },
        large: { base: "16px", heading: "42px", subheading: "17px" },
    };
    const alignmentMap = {
        left: "left",
        center: "center",
        justify: "justify",
    };
    const fontWeightMap = {
        normal: "400",
        bold: "700",
    };
    const currentFontSize = fontSizeMap[typography.fontSize] ||
        fontSizeMap.medium;
    const currentAlignment = alignmentMap[typography.alignment] || "left";
    const currentFontWeight = fontWeightMap[typography.fontWeight] ||
        "400";
    // --- PRESERVED LOGIC END ---
    const greyBackground = '#e0e0e0'; // Grey background for the top section
    // Helper function to check if a section has content
    const hasResponsibilitiesContent = (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0;
    const hasToolsContent = (Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line.trim()).length > 0;
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume</title>

<style>
  * {
    margin: 0; padding: 0; box-sizing: border-box;
  }

  :root {
    --primary-color: ${currentTheme.primary};
    --secondary-color: ${currentTheme.secondary};
    --background-color: ${currentTheme.background};
    --heading-font: ${currentTheme.headingFont};
    --body-font: ${currentTheme.bodyFont};
  }

  body {
    font-family: ${userFontFamily};
    background: #f3f6fa;
    color: #1e293b;
    line-height: 1.65;
    font-size: ${baseFontSize}px;
  }

  .container {
    max-width: 880px;
    margin: 40px auto;
    border-radius: 14px;
  }

  /* --- TOP GREY SECTION --- */
  .top-section {
    background-color: ${greyBackground};
    padding: 48px 48px 30px 48px;
    display: flex;
    align-items: flex-start;
    gap: 30px;
  }

  /* --- PROFILE PHOTO SECTION --- */
  .profile-photo-container {
    width: 160px;
    height: 160px;
    flex-shrink: 0;
  }

  .profile-photo {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f8fafc;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 14px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* --- HEADER CONTENT (Name & Summary) --- */
  .header-content {
    flex: 1;
  }

  .name {
    font-size: ${Math.round(baseFontSize * 3)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .summary-text {
    font-size: ${currentFontSize.base};
    line-height: 1.7;
    color: var(--secondary-color);
    text-align: ${currentAlignment};
    font-weight: ${currentFontWeight};
  }

  /* --- MAIN CONTENT LAYOUT (Below Grey Section) --- */
  .main-content {
    display: flex;
    padding: 30px 48px 48px 48px;
    gap: 40px;
  }

  .left-column {
    flex: 1;
  }

  .right-column {
    flex: 2;
  }

  /* --- SECTION STYLING --- */
  .section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb; /* Light grey underline */
  }

  /* --- CONTACT INFO STYLING (Left Column) --- */
  .contact-info {
    font-size: 14px;
    color: var(--secondary-color);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    word-break: break-all; /* Ensure long emails/links wrap */
  }
  
  .contact-item a {
    color: inherit;
    text-decoration: none;
  }

  /* --- SKILLS STYLING (Left Column) --- */
  .skills-list {
    list-style: none;
  }

  .skill-item {
    font-size: ${currentFontSize.base};
    color: var(--secondary-color);
    margin-bottom: 10px;
    padding-left: 15px;
    position: relative;
  }

  .skill-item:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* --- EDUCATION & EXPERIENCE (Right Column) --- */
  .entry {
    margin-bottom: 20px;
  }

  .entry-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 5px;
  }

  .entry-subtitle {
    font-size: 14px;
    color: var(--secondary-color);
    font-style: italic;
    margin-bottom: 8px;
  }

  .entry-content {
    font-size: 14px;
    color: var(--secondary-color);
    line-height: 1.6;
  }

  .entry-content ul {
    margin: 8px 0 8px 20px;
    padding: 0;
    list-style-type: disc;
  }

  .entry-content li {
    margin: 4px 0;
    padding: 0;
    color: var(--secondary-color);
  }

  .entry-content b {
    font-weight: 700;
    color: var(--primary-color);
  }

  /* Enhanced Education Styles */
  .education-field {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 4px;
    font-size: ${Math.round(baseFontSize * 0.95)}px;
  }

  .education-school {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 4px;
  }

  .education-location {
    color: var(--secondary-color);
    font-style: italic;
    margin-bottom: 6px;
    font-size: ${Math.round(baseFontSize * 0.9)}px;
  }

  .education-description {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
    color: var(--secondary-color);
    line-height: 1.6;
    margin-top: 6px;
    padding: 10px;
    background: rgba(255,255,255,0.7);
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
  }

  .education-description ul {
    margin: 5px 0 5px 20px;
    padding: 0;
    list-style-type: disc;
  }

  .education-description li {
    margin: 3px 0;
    color: var(--secondary-color);
  }

  .education-description b {
    font-weight: 700;
    color: var(--primary-color);
  }

  .education-achievements {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
  }

  .education-achievements h4 {
    font-size: ${Math.round(baseFontSize * 0.85)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .education-achievements ul {
    margin: 0;
    padding-left: 0;
    list-style: none;
  }

  .education-achievements li {
    position: relative;
    padding-left: 16px;
    margin-bottom: 4px;
    color: var(--secondary-color);
    font-size: ${Math.round(baseFontSize * 0.9)}px;
  }

  .education-achievements li:before {
    content: "💪";
    position: absolute;
    left: 0;
    font-size: ${Math.round(baseFontSize * 0.8)}px;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .top-section {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 30px;
    }
    
    .header-content {
      margin-bottom: 20px;
    }

    .profile-photo-container {
      width: 140px;
      height: 140px;
      order: -1; /* Photo above name on mobile */
      margin-bottom: 20px;
    }

    .main-content {
      flex-direction: column;
      padding: 30px;
      gap: 30px;
    }
    
    .name {
      font-size: 36px;
    }
    
    .container {
      margin: 20px auto;
      border-radius: 0; /* Remove border radius on mobile for full width look */
    }
  }

  @media (max-width: 480px) {
    .name {
      font-size: 30px;
    }
    
    .profile-photo-container {
      width: 120px;
      height: 120px;
    }
  }
</style>
</head>

<body>
<div class="container">

<div class="top-section" data-section="personal">
  <div class="profile-photo-container" data-section="personal">
    ${data.personal?.image ?
        `<img src="${data.personal.image}" alt="${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Profile Photo'}" class="profile-photo" />` :
        `<div class="photo-placeholder">Profile Photo</div>`}
  </div>
  <div class="header-content" data-section="personal">
    <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : "DEBANJALI LENKA"}</div>
    ${data.personal?.role ? `<div style="font-size: 18px; margin-bottom: 10px; font-weight: 600; color: #334155;" data-section="personal">${data.personal.role}</div>` : ''}
    ${(data.sectionVisibility?.summary !== false && data.summary) ? `
    <div class="summary-section" data-section="summary">
      <p class="summary-text" data-section="summary">${data.summary}</p>
    </div>` : ""}
    
    ${(typeof data.careerObjective === "string" && data.careerObjective.trim().length > 0) ? `
    <div class="summary-section" data-section="careerObjective" style="margin-top: 15px;">
      <p class="summary-text" data-section="careerObjective"><strong>Career Objective:</strong> ${data.careerObjective}</p>
    </div>` : ""}
  </div>
</div>

  <div class="main-content">
    <div class="left-column">

      ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `<div class="section" data-section="personal">
        <div class="section-title" data-section="personal">Personal Details</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: var(--secondary-color);">
          ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
          ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
          ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
          ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
        </div>
      </div>` : ''}

      <div class="section" data-section="personal">
        <div class="section-title" data-section="personal">Contact</div>
        <div class="contact-info" data-section="personal">
          ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<div class="contact-item" data-section="personal">${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</div>` : ""}
          ${data.personal?.phone ? `<div class="contact-item" data-section="personal">${data.personal.phone}</div>` : ""}
          ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="personal">${data.personal.alternatePhone}</div>` : ""}
          ${data.personal?.email ? `<div class="contact-item" data-section="personal">${data.personal.email}</div>` : ""}
          ${data.personal?.linkedinUrl ? `<div class="contact-item" data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ""}
          ${data.personal?.githubUrl ? `<div class="contact-item" data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ""}
          ${data.personal?.portfolioUrl ? `<div class="contact-item" data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ""}
          ${data.personal?.website ? `<div class="contact-item" data-section="personal"><a href="${data.personal.website}" target="_blank">Website</a></div>` : ""}
        </div>
      </div>

      ${(data.sectionVisibility?.skills !== false && data.skills) ? `
      <div class="section" data-section="skills">
        <div class="section-title" data-section="skills">Skills</div>
        <ul class="skills-list" data-section="skills">
          ${(Array.isArray(data.skills) ? data.skills : data.skills.split(",")).map((s, index) => `<li class="skill-item" data-section="skills" data-index="${index}">${typeof s === "string" ? s.trim() : s}</li>`).join("")}
        </ul>
      </div>` : ""}

      ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `
      <div class="section" data-section="languages">
        <div class="section-title" data-section="languages">Languages</div>
        <ul class="skills-list" data-section="languages">
          ${(data.languages || []).map((lang, index) => `<li class="skill-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</li>`).join("")}
        </ul>
      </div>` : ""}

      ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `
      <div class="section" data-section="hobbies">
        <div class="section-title" data-section="hobbies">Hobbies</div>
        <ul class="skills-list" data-section="hobbies">
          ${(data.hobbies || []).map((hobby, index) => `<li class="skill-item" data-section="hobbies" data-index="${index}">${hobby}</li>`).join("")}
        </ul>
      </div>` : ""}

      ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title" data-section="socialLinks">Social Links</div>
        <ul class="skills-list" data-section="socialLinks">
          ${data.socialLinks.map((link, index) => `<li class="skill-item" data-section="socialLinks" data-index="${index}"><a href="${link.url}" target="_blank" style="color: var(--secondary-color); text-decoration: none;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a></li>`).join("")}
        </ul>
      </div>` : ""}
    </div>

    <div class="right-column">
      ${data.experience?.length ? `
      <div class="section" data-section="experience">
        <div class="section-title" data-section="experience">Work Experience</div>
        ${data.experience.map((exp, index) => `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-title" data-section="experience" data-index="${index}">${exp.title}</div>
            <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company}${exp.location ? `, ${exp.location}` : ''} • ${exp.startDate} - ${exp.endDate || "Present"}</div>
            <div class="entry-content" data-section="experience" data-index="${index}">${exp.description}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `
      <div class="section" data-section="education">
        <div class="section-title" data-section="education">Education</div>
        ${data.education.map((edu, index) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-title" data-section="education" data-index="${index}">
              ${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ''}
            </div>
            
            ${edu.field ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>` : ''}
            ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
            ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
            <div class="entry-content" data-section="education" data-index="${index}">Graduation: ${edu.graduationDate || ""}</div>
            
            ${edu.description ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description.includes('<ul>') || edu.description.includes('<li>')
        ? edu.description
        : `<p>${edu.description}</p>`}
              </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Excellence</h4>
                <ul>
                  ${edu.achievements.filter((achievement) => achievement.trim()).map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      ${data.projects?.length ? `
      <div class="section" data-section="projects">
        <div class="section-title" data-section="projects">Projects</div>
        ${data.projects.map((project, index) => {
        const projectName = typeof project === 'string' ? (project.split(' – ')[0] || project) : (project.name || project.title || '');
        const projectDesc = typeof project === 'string' ? project : (project.description || '');
        return `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-title" data-section="projects" data-index="${index}">${projectName}</div>
            ${project.startDate || project.endDate ? `<div class="entry-subtitle" data-section="projects" data-index="${index}">${project.startDate || ''} ${project.startDate && project.endDate ? `- ${project.endDate}` : project.endDate ? `- ${project.endDate}` : ''}</div>` : ''}
            <div class="entry-content" data-section="projects" data-index="${index}">${projectDesc}</div>
            ${project.url ? `<div class="entry-content" data-section="projects" data-index="${index}" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>`;
    }).join("")}
      </div>` : ""}

      ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `
      <div class="section" data-section="certifications">
        <div class="section-title" data-section="certifications">Certifications</div>
        ${data.certifications.map((cert, index) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
            <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ''} • ${cert.date || ''}</div>
            ${cert.url ? `<div class="entry-content" data-section="certifications" data-index="${index}" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Certificate</a></div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      ${data.internships && data.internships.length > 0 ? `
      <div class="section" data-section="internships">
        <div class="section-title" data-section="internships">Internships</div>
        ${data.internships.map((item, index) => `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-title" data-section="internships" data-index="${index}">${item.title || ''}</div>
            <div class="entry-subtitle" data-section="internships" data-index="${index}">${item.company || ''}${item.location ? `, ${item.location}` : ''} • ${item.startDate || ''} - ${item.endDate || ''}</div>
            <div class="entry-content" data-section="internships" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${data.academicProjects && data.academicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title" data-section="academicProjects">Academic Projects</div>
        ${data.academicProjects.map((item, index) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ''}</div>
            <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${item.institution || ''}${item.duration ? ` • ${item.duration}` : ''}</div>
            <div class="entry-content" data-section="academicProjects" data-index="${index}">${item.description || ''}</div>
            ${item.technologies ? `<div class="entry-content" data-section="academicProjects" data-index="${index}" style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies}</div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      ${data.leadershipPositions && data.leadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
        ${data.leadershipPositions.map((item, index) => `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ''}</div>
            <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ''} • ${item.startDate || ''} - ${item.endDate || ''}</div>
            <div class="entry-content" data-section="leadershipPositions" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${data.trainingPrograms && data.trainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title" data-section="trainingPrograms">Training Programs</div>
        ${data.trainingPrograms.map((item, index) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || ''}</div>
            <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${item.provider || item.organization || ''}${item.duration ? ` • ${item.duration}` : ''}${item.completionDate ? ` • ${item.completionDate}` : ''}</div>
            <div class="entry-content" data-section="trainingPrograms" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${data.scholarships && data.scholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title" data-section="scholarships">Scholarships</div>
        ${data.scholarships.map((item, index) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || ''}</div>
            <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${item.provider || item.organization || ''}${item.amount ? ` • ${item.amount}` : ''} • ${item.year || ''}</div>
            <div class="entry-content" data-section="scholarships" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${data.coCurricular && data.coCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
        ${data.coCurricular.map((item, index) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || ''}</div>
            <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${item.organization || ''}${item.role ? ` • ${item.role}` : ''} • ${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            <div class="entry-content" data-section="coCurricular" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${data.extracurricular && data.extracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
        ${data.extracurricular.map((item, index) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || ''}</div>
            <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${item.organization || ''}${item.role ? ` • ${item.role}` : ''} • ${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            <div class="entry-content" data-section="extracurricular" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      ${data.keyAchievements && data.keyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title" data-section="keyAchievements">Key Achievements</div>
        <div class="entry-content" data-section="keyAchievements">
          <ul data-section="keyAchievements">
            ${data.keyAchievements.map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
          </ul>
        </div>
      </div>` : ""}


      ${hasResponsibilitiesContent ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
        <div class="entry-content" data-section="responsibilities">
          <ul data-section="responsibilities">
            ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ""}

      ${hasToolsContent ? `
      <div class="section" data-section="tools">
        <div class="section-title" data-section="tools">Tools & Technologies</div>
        <div class="entry-content" data-section="tools">
          <ul data-section="tools">
            ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ""}


      ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible && section.entries && section.entries.length > 0 && section.entries.some((entry) => entry.isVisible)).map((section) => `
      <div class="section" data-section="customSections">
        <div class="section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
        ${section.entries && section.entries.length > 0 ? section.entries.filter((entry) => entry.isVisible).map((entry, entryIndex) => `
          <div class="entry" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.date ? `<div class="entry-subtitle" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>` : ''}
            ${entry.description ? `<div class="entry-content" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>` : ''}
          </div>
        `).join('') : ''}
      </div>
      `).join('') : ''}
    </div>
  </div>

</div>
</body>
</html>`;
}
