"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGengarTemplate = buildGengarTemplate;
function buildGengarTemplate(data, theme) {
    const defaultTheme = {
        primary: "#7c3aed",
        secondary: "#666666",
        background: "#ffffff",
        headingFont: "Arial",
        bodyFont: "Arial",
    };
    const currentTheme = theme || defaultTheme;
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
    const userFontFamily = data.formatting?.fontFamily ||
        data.fontFamily ||
        "Space Grotesk, sans-serif";
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
    const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <!-- Google Fonts disabled for PDF compatibility -->
 <style>
 * { margin: 0; padding: 0; box-sizing: border-box; }

 :root {
   --primary-color: ${currentTheme.primary};
   --secondary-color: ${currentTheme.secondary};
   --background-color: ${currentTheme.background};
   --heading-font: ${currentTheme.headingFont || "Arial"};
   --body-font: ${currentTheme.bodyFont || "Arial"};
 }

 body {
   font-family: ${userFontFamily};
   font-size: ${baseFontSize}px;
   color: var(--primary-color);
   background: var(--background-color);
   line-height: 1.5;
 }

  .container {
    max-width: 900px;
    margin: 24px auto;
    padding: 40px 48px;
    background: #ffffff;
  }


  /* ===== HEADER (FIXED) ===== */
.header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 16px;
  margin-bottom: 28px;


  border-bottom: 1.5px solid var(--primary-color);
}


.photo-placeholder {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
}

.photo-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.header-content {
  flex: 1;
}


.name {
  font-size: ${Math.round(baseFontSize * 2.3)}px;
  font-weight: 800;
  color: #05356a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}


.contact {
  display: block;
  font-size: ${Math.round(baseFontSize * 0.95)}px;
  color: #374151;
  line-height: 1.6;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 4px;
}

.contact-row:last-child {
  margin-bottom: 0;
}

.contact-item {
  display: flex;
  align-items: center;
}



.contact a {
  color: var(--primary-color);
  text-decoration: none;
}


  /* ===== CONTENT ===== */
  .content-wrapper {
    padding: 0;
  }

  .section {
    margin-bottom: 26px;
  }



.section-title {
    font-size: ${Math.round(baseFontSize * 1)}px;
    font-weight: 800;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
    padding-bottom: 4px;
    border-bottom: 2px solid var(--primary-color);
  }

  /* ===== ENTRIES ===== */
  .entry {
    margin-bottom: 18px;
  }

  .entry-header {
    display: block;
    margin-bottom: 4px;
  }


  .entry-title {
    font-weight: 700;
    font-size: ${Math.round(baseFontSize * 1.05)}px;
    color: var(--primary-color);
  }

  .entry-date {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
    color: #6b7280;
    margin-top: 2px;
  }

  .entry-subtitle {
    font-size: ${Math.round(baseFontSize * 0.95)}px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }

  .entry-content {
    font-size: ${baseFontSize}px;
    color: #374151;
  }

  .entry-content ul {
    margin-left: 18px;
  }

  .entry-content li {
    margin-bottom: 4px;
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
    color: #374151;
    margin-bottom: 4px;
  }

  .education-location {
    color: #6b7280;
    font-style: italic;
    margin-bottom: 6px;
  }

  .education-description {
    font-size: ${baseFontSize}px;
    color: #374151;
    line-height: 1.6;
    margin-top: 10px;
    padding: 12px;
    background: #f8fafc;
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
  }

  .education-description ul {
    margin: 8px 0 8px 18px;
    padding: 0;
    list-style-type: disc;
  }

  .education-description li {
    margin: 4px 0;
    color: #374151;
  }

  .education-description b {
    font-weight: 700;
    color: var(--primary-color);
  }

  .education-achievements {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #e5e7eb;
  }

  .education-achievements h4 {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .education-achievements ul {
    margin: 0;
    padding-left: 0;
    list-style: none;
  }

  .education-achievements li {
    position: relative;
    padding-left: 18px;
    margin-bottom: 6px;
    color: #374151;
    font-size: ${baseFontSize}px;
  }

  .education-achievements li:before {
    content: "▸";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* ===== SUMMARY ===== */
  .summary-text {
    font-size: ${baseFontSize}px;
    color: #374151;
  }

  /* ===== SKILLS ===== */
  .skills {
    display: block;
  }

  .skill-badge {
    display: inline-block;
    margin: 4px 8px 4px 0;
    padding: 0;
    border: none;
    background: none;
    font-size: ${baseFontSize}px;
    color: #374151;
  }

  /* ===== PRINT ===== */
  @media print {
    .container {
      margin: 0;
      padding: 32px;
    }
  }
</style>

</head>
<body>
  <div class="container">



    <div class="header" data-section="personal">

      <div class="photo-placeholder" data-section="personal">
        ${data.personal?.image
        ? `<img src="${data.personal.image}" alt="Profile Photo">`
        : "Photo"}
      </div>
      <div class="header-content" data-section="personal">
        <div class="name">${data.personal?.name && data.personal?.name !== "undefined"
        ? data.personal.name
        : "Your Name"}</div>
        ${data.personal?.role
        ? `<div style="font-size: 18px; margin-bottom: 15px; font-weight: 600;">${data.personal.role}</div>`
        : ""}

        <div class="contact">

          <!-- Row 1: Contact Numbers -->
          <div class="contact-row" data-section="contact">
            ${data.personal?.email
        ? `<div class="contact-item" data-section="contact">${data.personal.email}</div>`
        : ""}
            ${data.personal?.phone
        ? `<div class="contact-item" data-section="contact">${data.personal.phone}</div>`
        : ""}
            ${data.personal?.alternatePhone
        ? `<div class="contact-item" data-section="contact">${data.personal.alternatePhone}</div>`
        : ""}
          </div>
          
          <!-- Row 2: Location -->
          <div class="contact-row" data-section="contact">
            ${data.personal?.location ||
        data.personal?.pinCode ||
        data.personal?.country ||
        data.personal?.fullAddress
        ? `<div class="contact-item" data-section="contact">${[
            data.personal?.location,
            data.personal?.pinCode,
            data.personal?.country,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</div>`
        : ""}
          </div>
          
          <!-- Row 3: Social Links -->
          <div class="contact-row" data-section="contact">
            ${data.personal?.linkedinUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>`
        : ""}
            ${data.personal?.githubUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>`
        : ""}
            ${data.personal?.portfolioUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>`
        : ""}
            ${data.personal?.website
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.website}" target="_blank">Website</a></div>`
        : ""}
            ${data.personal?.twitterUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>`
        : ""}
            ${data.personal?.facebookUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>`
        : ""}
            ${data.personal?.instagramUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>`
        : ""}
            ${data.personal?.behanceUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>`
        : ""}
            ${data.personal?.dribbbleUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>`
        : ""}
            ${data.personal?.stackoverflowUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>`
        : ""}
            ${data.personal?.mediumUrl
        ? `<div class="contact-item" data-section="contact"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>`
        : ""}
          </div>

          <!-- Row 4: Personal Details -->
          ${data.personal?.personalInfoDisplay === "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
        ? `
          <div class="contact-row" data-section="contact">
            ${data.personal?.fathersName
            ? `<div class="contact-item" data-section="contact">Father's Name: ${data.personal.fathersName}</div>`
            : ""}
            ${data.personal?.dob
            ? `<div class="contact-item" data-section="contact">DOB: ${data.personal.dob}</div>`
            : ""}
            ${data.personal?.gender
            ? `<div class="contact-item" data-section="contact">Gender: ${data.personal.gender}</div>`
            : ""}
            ${data.personal?.maritalStatus
            ? `<div class="contact-item" data-section="contact">Marital Status: ${data.personal.maritalStatus}</div>`
            : ""}
            ${data.personal?.nationality
            ? `<div class="contact-item" data-section="contact">Nationality: ${data.personal.nationality}</div>`
            : ""}
          </div>
          `
        : ""}
        </div>
      </div>
    </div>

    ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
        ? `
    <div class="section">
      <div class="section-title">Personal Details</div>
      <div class="contact" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; font-size: ${baseFontSize}px;">
        ${data.personal?.fathersName
            ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>`
            : ""}
        ${data.personal?.dob
            ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>`
            : ""}
        ${data.personal?.gender
            ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>`
            : ""}
        ${data.personal?.maritalStatus
            ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>`
            : ""}
        ${data.personal?.nationality
            ? `<div><strong>Nationality:</strong> ${data.personal.nationality}</div>`
            : ""}
      </div>
    </div>
    `
        : ""}

    <div class="content-wrapper">

      ${data.sectionVisibility?.summary !== false && data.summary
        ? `<div class="section" data-section="summary">
        <div class="section-title" data-section="summary">About Me</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>`
        : ""}


      ${data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
        ? `<div class="section" data-section="experience">
        <div class="section-title" data-section="experience">Experience</div>
        ${(data.experience || [])
            .map((exp, index) => `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-header" data-section="experience" data-index="${index}">
              <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ""}</div>
              <div class="entry-date" data-section="experience" data-index="${index}">${exp.startDate || ""} - ${exp.endDate || "Present"}</div>
            </div>
            <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
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
                ${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ""}
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
                <h4>Academic Achievements</h4>
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
            <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ""}</div>
            ${project.startDate || project.endDate
            ? `<div class="entry-date" data-section="projects" data-index="${index}" style="margin-bottom: 5px;">${project.startDate || ""} ${project.startDate && project.endDate
                ? `- ${project.endDate}`
                : project.endDate
                    ? `- ${project.endDate}`
                    : ""}</div>`
            : ""}
            <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ""}</div>
            <div class="entry-content" data-section="projects" data-index="${index}">${project.description || ""}</div>
            ${project.url
            ? `<div class="entry-content" data-section="projects" data-index="${index}" style="margin-top: 12px;"><a href="${project.url}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">${project.urlText || "View Project →"}</a></div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}


      ${data.sectionVisibility?.skills !== false && data.skills
        ? `<div class="section" data-section="skills">
        <div class="section-title" data-section="skills">Skills</div>
        <div class="skills" data-section="skills">
          ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill, index) => `
            <div class="skill-badge" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</div>
          `)
            .join("")}
        </div>
      </div>`
        : ""}


      ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
        ? `<div class="section" data-section="languages">
        <div class="section-title" data-section="languages">Languages</div>
        <div class="skills" data-section="languages">
          ${(data.languages || [])
            .map((lang, index) => `
            <div class="skill-badge" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}</div>
          `)
            .join("")}
        </div>
      </div>`
        : ""}


      ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
        ? `<div class="section" data-section="hobbies">
        <div class="section-title" data-section="hobbies">Hobbies & Interests</div>
        <div class="skills" data-section="hobbies">
          ${(data.hobbies || [])
            .map((hobby, index) => `
            <div class="skill-badge" data-section="hobbies" data-index="${index}">${hobby}</div>
          `)
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
            <a href="${link.url}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText ||
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
            ? `<div class="entry-content" data-section="certifications" data-index="${index}" style="margin-top: 12px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">View Certificate →</a></div>`
            : ""}
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


      <!-- Custom Sections -->
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

                ${entry.title || entry.organization
                ? `<div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>`
                : ""}
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
            : '<div style="color: #6b7280; font-style: italic;">No entries in this section</div>'}
        </div>
      `)
            .join("")
        : ""}
    </div>
  </div>
</body>
</html>`;
}
