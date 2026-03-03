"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCharizardTemplate = buildCharizardTemplate;
function buildCharizardTemplate(data, theme) {
    const defaultTheme = {
        primary: "#363636",
        secondary: "#666666",
        background: "#ffffff",
        headingFont: "Arial",
        bodyFont: "Arial",
    };
    // --- PRESERVED SECTION START ---
    const currentTheme = theme || defaultTheme;
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Roboto, sans-serif";
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
    const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
    // --- PRESERVED SECTION END ---
    // Define colors based on the reference image (Monochrome/Grey) with theme support
    const headerTopBg = currentTheme.primary;
    const headerBottomBg = currentTheme.secondary;
    const primaryText = "#000000";
    const secondaryText = "#444444";
    const dateText = "#666666";
    const sectionBorder = currentTheme.primary;
    // SVG Icons for contact section
    const icons = {
        email: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
        phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
        location: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
        link: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    };
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
   * { margin: 0; padding: 0; box-sizing: border-box; }

   body {
     font-family: ${userFontFamily};
     color: ${primaryText};
     line-height: 1.6;
     background: #ffffff;
     font-size: ${baseFontSize}px;
   }
   .container {
     max-width: 850px;
     margin: 0 auto;
     background: #ffffff;
   }
   .header-name-bar {
     background-color: ${headerTopBg};
     padding: 35px 40px;
     text-transform: uppercase;
   }
   .name {
     font-size: ${headingFontSize}px;
     font-weight: 800;
     color: #f7efefff; /* FIXED: Changed from currentTheme.primary to white */
     letter-spacing: 2px;
     line-height: 1.1;
   }

   .role {
     font-size: ${Math.round(baseFontSize * 1.3)}px;
     font-weight: 400;
     color: rgba(255, 255, 255, 0.9);
     margin-top: 8px;
     letter-spacing: 1px;
   }

   .header-contact-bar {
       background-color: ${headerBottomBg};
       padding: 15px 40px;
       display: flex;
       flex-wrap: wrap;
       column-gap: 25px;
       row-gap: 10px;
       font-size: ${Math.round(baseFontSize * 0.85)}px;
       align-items: center;
   }
   .contact-item {
       display: flex;
       align-items: center;
       white-space: nowrap;
       color: black;
   }
   .contact-item a {
       color: black;
       text-decoration: none;
   }

   .content-wrapper {
     padding: 40px;
   }
   .section {
     margin-bottom: 35px;
   }
   .section-title {
     font-size: ${Math.round(subheadingFontSize * 1.2)}px;
     font-weight: 800;
     color: ${currentTheme.primary};
     text-transform: uppercase;
     margin-bottom: 18px;
     border-bottom: 2px solid ${sectionBorder};
     padding-bottom: 6px;
   }
   .entry {
     margin-bottom: 22px;
   }
   .entry-header {
     display: flex;
     justify-content: space-between;
     margin-bottom: 4px;
   }
   .entry-title {
     font-weight: 700;
     font-size: ${subheadingFontSize}px;
   }
   .entry-date {
     font-size: ${Math.round(baseFontSize * 0.9)}px;
     color: ${dateText};
     font-weight: 600;
   }
   .entry-subtitle {
     color: ${secondaryText};
     font-size: ${baseFontSize}px;
     margin-bottom: 10px;
     font-weight: 600;
   }
   .entry-content {
     font-size: ${baseFontSize}px;
     color: ${secondaryText};
   }

   .entry-content ul {
     margin: 10px 0 10px 20px;
   }

   .entry-content li {
     margin-bottom: 6px;
   }

   /* Enhanced Education Styles */
   .education-field {
     font-weight: 700;
     color: ${primaryText};
     margin-bottom: 6px;
     font-size: ${Math.round(baseFontSize * 0.95)}px;
   }

   .education-school {
     font-weight: 600;
     color: ${secondaryText};
     margin-bottom: 6px;
   }

   .education-location {
     color: ${dateText};
     font-style: italic;
     margin-bottom: 8px;
   }

   .education-description {
     font-size: ${baseFontSize}px;
     color: ${secondaryText};
     line-height: 1.6;
     margin-top: 12px;
     padding: 12px;
     background: #f8f9fa;
     border-left: 3px solid ${currentTheme.primary};
     border-radius: 4px;
   }

   .education-description ul {
     margin: 8px 0 8px 20px;
     padding: 0;
     list-style-type: disc;
   }

   .education-description li {
     margin: 4px 0;
     color: ${secondaryText};
   }

   .education-description b {
     font-weight: 700;
     color: ${primaryText};
   }

   .education-achievements {
     margin-top: 12px;
     padding-top: 10px;
     border-top: 1px solid #e0e0e0;
   }

   .education-achievements h4 {
     font-size: ${Math.round(baseFontSize * 0.9)}px;
     font-weight: 700;
     color: ${currentTheme.primary};
     margin-bottom: 8px;
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
     padding-left: 20px;
     margin-bottom: 6px;
     color: ${secondaryText};
     font-size: ${baseFontSize}px;
   }

   .education-achievements li:before {
     content: "■";
     color: ${currentTheme.primary};
     font-weight: bold;
     position: absolute;
     left: 0;
   }

   .skills-list {
       display: flex;
       flex-wrap: wrap;
       gap: 8px;
       margin-top: 10px;
   }

   .skill-tag {
       background: #f0f0f0;
       padding: 4px 12px;
       border-radius: 4px;
       font-size: ${Math.round(baseFontSize * 0.9)}px;
       color: ${secondaryText};
   }

   @media print {
     .header-name-bar, .header-contact-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
   }
 </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="header-name-bar" data-section="personal">
        <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== "undefined"
        ? data.personal.name
        : "Your Name"}</div>
        ${data.personal?.role
        ? `<div class="role" data-section="personal">${data.personal.role}</div>`
        : ""}
    </div>
    <div class="header-contact-bar" data-section="personal">
      ${data.personal?.phone
        ? `<span class="contact-item" data-section="personal">${icons.phone}${data.personal.phone}</span>`
        : ""}
      ${data.personal?.email
        ? `<span class="contact-item" data-section="personal">${icons.email}${data.personal.email}</span>`
        : ""}
      ${data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `<span class="contact-item" data-section="personal">${icons.location}${[
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</span>`
        : ""}
      ${data.personal?.linkedinUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>`
        : ""}
      ${data.personal?.githubUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>`
        : ""}
      ${data.personal?.portfolioUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>`
        : ""}
      ${data.personal?.website
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.website}" target="_blank">Website</a></span>`
        : ""}
      ${data.personal?.twitterUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></span>`
        : ""}
      ${data.personal?.facebookUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></span>`
        : ""}
      ${data.personal?.instagramUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></span>`
        : ""}
      ${data.personal?.behanceUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.behanceUrl}" target="_blank">Behance</a></span>`
        : ""}
      ${data.personal?.dribbbleUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></span>`
        : ""}
      ${data.personal?.stackoverflowUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></span>`
        : ""}
      ${data.personal?.mediumUrl
        ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.mediumUrl}" target="_blank">Medium</a></span>`
        : ""}
      ${data.personal?.alternatePhone
        ? `<span class="contact-item" data-section="personal">${icons.phone}${data.personal.alternatePhone}</span>`
        : ""}
      ${data.personal?.fathersName
        ? `<span class="contact-item" data-section="personal">Father's Name: ${data.personal.fathersName}</span>`
        : ""}
      ${data.personal?.dob
        ? `<span class="contact-item" data-section="personal">DOB: ${data.personal.dob}</span>`
        : ""}
      ${data.personal?.gender
        ? `<span class="contact-item" data-section="personal">Gender: ${data.personal.gender}</span>`
        : ""}
      ${data.personal?.maritalStatus
        ? `<span class="contact-item" data-section="personal">Marital Status: ${data.personal.maritalStatus}</span>`
        : ""}
    </div>
  </div>

    <div class="content-wrapper">
      ${data.sectionVisibility?.summary !== false && data.summary
        ? `<div class="section" data-section="summary">
        <div class="section-title" data-section="summary">Professional Summary</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>`
        : ""}

      ${typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
        ? `<div class="section" data-section="careerObjective">
        <div class="section-title" data-section="careerObjective">Career Objective</div>
        <p class="summary-text" data-section="careerObjective">${data.careerObjective}</p>
      </div>`
        : ""}

      ${data.internships && data.internships.length > 0
        ? `<div class="section" data-section="internships">
        <div class="section-title" data-section="internships">Internships</div>
        ${(data.internships || [])
            .map((item, index) => `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-header" data-section="internships" data-index="${index}">
              <div class="entry-title" data-section="internships" data-index="${index}">${item.title || "Internship Title"}</div>
              <div class="entry-date" data-section="internships" data-index="${index}">${item.startDate || ""} - ${item.endDate || ""}</div>
            </div>
            <div class="entry-subtitle" data-section="internships" data-index="${index}">${item.company || "Company"}${item.location ? `, ${item.location}` : ""}</div>
            <div class="entry-content" data-section="internships" data-index="${index}">${item.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
        ? `<div class="section" data-section="experience">
        <div class="section-title" data-section="experience">Work Experience</div>
        ${(data.experience || [])
            .map((exp, index) => `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-header" data-section="experience" data-index="${index}">
              <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || "Job Title"}</div>
              <div class="entry-date" data-section="experience" data-index="${index}">${exp.startDate || ""} - ${exp.endDate || "Present"}</div>
            </div>
            <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || "Company Name"}${exp.location ? `, ${exp.location}` : ""}</div>
            <div class="entry-content" data-section="experience" data-index="${index}">${exp.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
        ? `<div class="section" data-section="education">
        <div class="section-title" data-section="education">Education</div>
        ${(data.education || [])
            .map((edu, index) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-header" data-section="education" data-index="${index}">
              <div class="entry-title" data-section="education" data-index="${index}">
                ${edu.degree || "Degree"}${edu.qualification ? ` (${edu.qualification})` : ""}
              </div>
              <div class="entry-date" data-section="education" data-index="${index}">${edu.graduationDate || ""}</div>
            </div>
            
            ${edu.field
            ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>`
            : ""}
            ${edu.school
            ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>`
            : ""}
            ${edu.location
            ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>`
            : ""}
            
            ${edu.description
            ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description.includes("<ul>") ||
                edu.description.includes("<li>")
                ? edu.description
                : `<p>${edu.description}</p>`}
              </div>
            `
            : ""}
            
            ${edu.achievements && edu.achievements.length > 0
            ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Recognition</h4>
                <ul>
                  ${edu.achievements
                .filter((achievement) => achievement.trim())
                .map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`)
                .join("")}
                </ul>
              </div>
            `
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
        ? `<div class="section" data-section="projects">
        <div class="section-title" data-section="projects">Projects</div>
        ${(data.projects || [])
            .map((project, index) => `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-header" data-section="projects" data-index="${index}">
                <div class="entry-title" data-section="projects" data-index="${index}">${project.name || "Project Name"}</div>
                ${project.startDate || project.endDate
            ? `<div class="entry-date" data-section="projects" data-index="${index}">${project.startDate || ""} ${project.startDate && project.endDate ? "-" : ""} ${project.endDate || ""}</div>`
            : ""}
            </div>
            <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ""}</div>
            <div class="entry-content" data-section="projects" data-index="${index}">${project.description || ""}</div>
            ${project.url
            ? `<div class="entry-content" data-section="projects" data-index="${index}" style="margin-top: 5px;">${icons.link}<a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || project.url}</a></div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.skills !== false && data.skills
        ? `<div class="section" data-section="skills">
        <div class="section-title" data-section="skills">Skills</div>
        <div class="skills-list" data-section="skills">
          ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill, index) => `<div class="skill-tag" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</div>`)
            .join("")}
        </div>
      </div>`
        : ""}

       ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
        ? `<div class="section" data-section="languages">
        <div class="section-title" data-section="languages">Languages</div>
        <div class="skills-list" data-section="languages">
          ${(data.languages || [])
            .map((lang, index) => `<div class="skill-tag" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}</div>`)
            .join("")}
        </div>
      </div>`
        : ""}

      ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
        ? `<div class="section" data-section="hobbies">
        <div class="section-title" data-section="hobbies">Hobbies & Interests</div>
        <div class="skills-list" data-section="hobbies">
          ${(data.hobbies || [])
            .map((hobby, index) => `<div class="skill-tag" data-section="hobbies" data-index="${index}">${hobby}</div>`)
            .join("")}
        </div>
      </div>`
        : ""}

      ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
        ? `<div class="section" data-section="socialLinks">
        <div class="section-title" data-section="socialLinks">Social Links</div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;" data-section="socialLinks">
          ${data.socialLinks
            .map((link, index) => `
            <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText ||
            link.url.replace("https://", "").replace("http://", "")}</a>
          `)
            .join("")}
        </div>
      </div>`
        : ""}

      ${data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
        ? `<div class="section" data-section="certifications">
        <div class="section-title" data-section="certifications">Certifications</div>
        ${(data.certifications || [])
            .map((cert, index) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-header" data-section="certifications" data-index="${index}">
              <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ""}</div>
              <div class="entry-date" data-section="certifications" data-index="${index}">${cert.date || ""}</div>
            </div>
            <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ""}</div>
            ${cert.url
            ? `<div class="entry-content" data-section="certifications" data-index="${index}" style="margin-top: 5px;">${icons.link}<a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.academicProjects && data.academicProjects.length > 0
        ? `<div class="section" data-section="academicProjects">
        <div class="section-title" data-section="academicProjects">Academic Projects</div>
        ${(data.academicProjects || [])
            .map((item, index) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-header" data-section="academicProjects" data-index="${index}">
              <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || "Project Name"}</div>
              <div class="entry-date" data-section="academicProjects" data-index="${index}">${item.duration || ""}</div>
            </div>
            <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${item.institution || ""}</div>
            <div class="entry-content" data-section="academicProjects" data-index="${index}">${item.description || ""}</div>
            ${item.technologies
            ? `<div class="entry-content" data-section="academicProjects" data-index="${index}" style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies}</div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.leadershipPositions && data.leadershipPositions.length > 0
        ? `<div class="section" data-section="leadershipPositions">
        <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
        ${(data.leadershipPositions || [])
            .map((item, index) => `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-header" data-section="leadershipPositions" data-index="${index}">
              <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || "Position"}</div>
              <div class="entry-date" data-section="leadershipPositions" data-index="${index}">${item.startDate || ""} - ${item.endDate || ""}</div>
            </div>
            <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ""}</div>
            <div class="entry-content" data-section="leadershipPositions" data-index="${index}">${item.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.trainingPrograms && data.trainingPrograms.length > 0
        ? `<div class="section" data-section="trainingPrograms">
        <div class="section-title" data-section="trainingPrograms">Training Programs</div>
        ${(data.trainingPrograms || [])
            .map((item, index) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-header" data-section="trainingPrograms" data-index="${index}">
              <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || "Training Program"}</div>
              <div class="entry-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate || ""}</div>
            </div>
            <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}</div>
            <div class="entry-content" data-section="trainingPrograms" data-index="${index}">${item.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.scholarships && data.scholarships.length > 0
        ? `<div class="section" data-section="scholarships">
        <div class="section-title" data-section="scholarships">Scholarships</div>
        ${(data.scholarships || [])
            .map((item, index) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-header" data-section="scholarships" data-index="${index}">
              <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || "Scholarship"}</div>
              <div class="entry-date" data-section="scholarships" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${item.provider || item.organization || ""}${item.amount ? ` | ${item.amount}` : ""}</div>
            <div class="entry-content" data-section="scholarships" data-index="${index}">${item.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.coCurricular && data.coCurricular.length > 0
        ? `<div class="section" data-section="coCurricular">
        <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
        ${(data.coCurricular || [])
            .map((item, index) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-header" data-section="coCurricular" data-index="${index}">
              <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || "Activity"}</div>
              <div class="entry-date" data-section="coCurricular" data-index="${index}">${item.year ||
            (item.startDate
                ? `${item.startDate} - ${item.endDate || ""}`
                : "")}</div>
            </div>
            <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${item.organization || ""}${item.role ? ` | ${item.role}` : ""}</div>
            <div class="entry-content" data-section="coCurricular" data-index="${index}">${item.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.extracurricular && data.extracurricular.length > 0
        ? `<div class="section" data-section="extracurricular">
        <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
        ${(data.extracurricular || [])
            .map((item, index) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-header" data-section="extracurricular" data-index="${index}">
              <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || "Activity"}</div>
              <div class="entry-date" data-section="extracurricular" data-index="${index}">${item.year ||
            (item.startDate
                ? `${item.startDate} - ${item.endDate || ""}`
                : "")}</div>
            </div>
            <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${item.organization || ""}${item.role ? ` | ${item.role}` : ""}</div>
            <div class="entry-content" data-section="extracurricular" data-index="${index}">${item.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.keyAchievements && data.keyAchievements.length > 0
        ? `<div class="section" data-section="keyAchievements">
        <div class="section-title" data-section="keyAchievements">Key Achievements</div>
        <div class="entry-content" data-section="keyAchievements">
          <ul data-section="keyAchievements">
            ${(data.keyAchievements || [])
            .map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`)
            .join("")}
          </ul>
        </div>
      </div>`
        : ""}


      ${(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")).filter((line) => line.trim()).length > 0
        ? `<div class="section" data-section="responsibilities">
        <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
        <div class="entry-content" data-section="responsibilities">
          <ul data-section="responsibilities">
            ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`)
            .join("")}
          </ul>
        </div>
      </div>`
        : ""}

      ${(Array.isArray(data.tools)
        ? data.tools
        : (data.tools || "").split("\n")).filter((line) => line.trim()).length > 0
        ? `<div class="section" data-section="tools">
        <div class="section-title" data-section="tools">Tools & Technologies</div>
        <div class="entry-content" data-section="tools">
          <ul data-section="tools">
            ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`)
            .join("")}
          </ul>
        </div>
      </div>`
        : ""}


      ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible)
            .map((section) => `
      <div class="section" data-section="customSections">
        <div class="section-title" data-section="customSections">${section.heading || "Custom Section"}</div>
        ${section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry) => entry.isVisible)
                .map((entry, entryIndex) => `
          <div class="entry" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-header" data-section="customSections" data-index="${entryIndex}">
              <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
              ${entry.date
                ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>`
                : ""}
            </div>
            ${entry.description
                ? `<div class="entry-content" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>`
                : ""}
          </div>
        `)
                .join("")
            : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
      </div>
      `)
            .join("")
        : ""}
    </div>
  </div>
</body>
</html>`;
}
