"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCosmosTemplate = buildCosmosTemplate;
function buildCosmosTemplate(data, theme) {
    const defaultTheme = {
        primary: "#0e6d7d", // Professional Teal
        secondary: "#f4f4f5",
        background: "#ffffff",
        headingFont: "Arial, sans-serif",
        bodyFont: "Arial, sans-serif",
    };
    const currentTheme = theme || defaultTheme;
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 10;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Arial, sans-serif";
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.8);
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
      --text: #1a1a1a;
      --text-light: #52525b;
      --border: #e4e4e7;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.5;
      background: #e5e7eb;
      font-size: ${baseFontSize}px;
      padding: 40px 0;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #fff;
      min-height: 1100px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    /* Teal accent bar at the very top */
    .top-accent {
      height: 20px;
      background: var(--primary);
      width: 100%;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      flex-grow: 1;
    }

    /* Left Column Content */
    .left-col {
      padding: 45px 40px;
      border-right: 1px solid #f3f4f6;
    }

    /* Right Column Sidebar */
    .right-col {
      padding: 45px 30px;
      background: #fff;
    }

    /* Photo Section - Placed in Right Column */
    .photo-wrapper {
      width: 100%;
      margin-bottom: 35px;
    }

    .profile-img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      display: block;
      filter: grayscale(20%);
    }

    .profile-photo-placeholder {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: linear-gradient(135deg, var(--primary) 0%, #f3f4f6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text);
      font-size: ${Math.round(baseFontSize * 4)}px;
      font-weight: 700;
      border-radius: 8px;
    }

    .name-heading {
      font-size: ${headingFontSize}px;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 35px;
      color: #000;
      letter-spacing: -0.5px;
    }

    .section-box {
      margin-bottom: 30px;
    }

    .section-label {
      font-size: ${baseFontSize}px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text);
      border-bottom: 2px solid var(--border);
      padding-bottom: 4px;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
    }

    .entry-item {
      margin-bottom: 20px;
    }

    .entry-bold {
      font-weight: 700;
      color: #000;
    }

    .entry-sub {
      color: var(--text-light);
      font-size: ${baseFontSize - 1}px;
      margin-bottom: 6px;
    }

    .description-text {
      color: var(--text);
      font-size: ${baseFontSize}px;
    }

    .description-text ul {
      margin-top: 5px;
      padding-left: 15px;
    }

    /* Sidebar specific styling */
    .contact-row {
      margin-bottom: 15px;
      font-size: ${baseFontSize - 1}px;
    }

    .contact-label {
      font-weight: 700;
      display: block;
      color: #000;
      margin-bottom: 2px;
    }

    .skill-item {
      display: block;
      margin-bottom: 6px;
      padding-left: 12px;
      position: relative;
    }

    .skill-item::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }

    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-accent"></div>
    
    <div class="main-layout">
      <div class="left-col">
        <div class="name-heading" data-section="personal">
          ${data.personal?.name || "Your Name"}
        </div>

        ${data.sectionVisibility?.summary !== false && data.summary
        ? `
        <div class="section-box" data-section="summary">
          <div class="section-label">Summary</div>
          <div class="description-text">${data.summary}</div>
        </div>`
        : ""}

        ${typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
        ? `
        <div class="section-box" data-section="careerObjective">
          <div class="section-label">Career Objective</div>
          <div class="description-text">${data.careerObjective}</div>
        </div>`
        : ""}

        ${data.sectionVisibility?.experience !== false &&
        data.experience?.length > 0
        ? `
        <div class="section-box" data-section="experience">
          <div class="section-label">Experience</div>
          ${data.experience
            .map((exp, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${exp.title || ""} | ${exp.company || ""}${exp.domain ? ` | ${exp.domain}` : ""}</div>
              <div class="entry-sub">${exp.startDate || ""} - ${exp.endDate || "Present"}${exp.location ? ` | ${exp.location}` : ""}</div>
              <div class="description-text">${exp.description || ""}</div>
              ${exp.achievements
            ? `<div class="description-text" style="margin-top: 8px;"><strong style="color: var(--text);">Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.internships && data.internships.length > 0
        ? `
        <div class="section-box" data-section="internships">
          <div class="section-label">Internships</div>
          ${data.internships
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.title || ""} | ${item.company || ""}</div>
              <div class="entry-sub">${item.startDate || ""} - ${item.endDate || ""}${item.location ? ` | ${item.location}` : ""}</div>
              <div class="description-text">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.projects !== false &&
        data.projects?.length > 0
        ? `
        <div class="section-box" data-section="projects">
          <div class="section-label">Projects</div>
          ${data.projects
            .map((project, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${project.name || ""}</div>
              <div class="entry-sub">${project.technologies
            ? `Technologies: ${project.technologies}`
            : ""} | ${project.startDate || ""} ${project.endDate ? `- ${project.endDate}` : ""}</div>
              <div class="description-text">${project.description || ""}</div>
              ${project.url
            ? `<div class="description-text"><a href="${project.url}" style="color: var(--primary);">${project.urlText || "View Project"}</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.education !== false &&
        data.education?.length > 0
        ? `
        <div class="section-box" data-section="education">
          <div class="section-label">Education</div>
          ${data.education
            .map((edu, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
              <div class="entry-sub">${edu.school || ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""} | ${edu.graduationDate || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.academicProjects && data.academicProjects.length > 0
        ? `
        <div class="section-box" data-section="academicProjects">
          <div class="section-label">Academic Projects</div>
          ${data.academicProjects
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.name || item.title || ""}</div>
              <div class="entry-sub">${item.duration || ""}${item.institution ? ` | ${item.institution}` : ""}</div>
              <div class="description-text">${item.description || ""}</div>
              ${item.technologies
            ? `<div class="description-text"><strong>Technologies:</strong> ${item.technologies}</div>`
            : ""}
              ${item.url
            ? `<div class="description-text"><a href="${item.url}" style="color: var(--primary);">${item.url}</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.certifications !== false &&
        data.certifications?.length > 0
        ? `
        <div class="section-box" data-section="certifications">
          <div class="section-label">Certifications</div>
          ${data.certifications
            .map((cert, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${cert.name || ""}</div>
              <div class="entry-sub">${cert.issuer || ""} ${cert.date ? `• ${cert.date}` : ""}</div>
              ${cert.description
            ? `<div class="description-text">${cert.description}</div>`
            : ""}
              ${cert.url
            ? `<div class="description-text"><a href="${cert.url}" target="_blank" style="color: var(--primary);">View Certificate</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.leadershipPositions && data.leadershipPositions.length > 0
        ? `
        <div class="section-box" data-section="leadershipPositions">
          <div class="section-label">Leadership & Positions</div>
          ${data.leadershipPositions
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.position || item.title || ""}</div>
              <div class="entry-sub">${item.organization || ""} | ${item.startDate || ""} - ${item.endDate || ""}</div>
              <div class="description-text">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.trainingPrograms && data.trainingPrograms.length > 0
        ? `
        <div class="section-box" data-section="trainingPrograms">
          <div class="section-label">Training Programs</div>
          ${data.trainingPrograms
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.name || ""}</div>
              <div class="entry-sub">${item.provider || item.organization || ""}${item.completionDate ? ` • ${item.completionDate}` : ""}${item.duration ? ` | ${item.duration}` : ""}</div>
              <div class="description-text">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.scholarships && data.scholarships.length > 0
        ? `
        <div class="section-box" data-section="scholarships">
          <div class="section-label">Scholarships</div>
          ${data.scholarships
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.name || ""}</div>
              <div class="entry-sub">${item.provider || item.organization || ""}${item.year ? ` • ${item.year}` : ""}${item.amount ? ` | ${item.amount}` : ""}</div>
              <div class="description-text">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.coCurricular && data.coCurricular.length > 0
        ? `
        <div class="section-box" data-section="coCurricular">
          <div class="section-label">Co-curricular Activities</div>
          ${data.coCurricular
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.activity || ""}</div>
              <div class="entry-sub">${item.organization || ""}${item.role ? ` | ${item.role}` : ""} | ${item.year ||
            (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")}</div>
              <div class="description-text">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.extracurricular && data.extracurricular.length > 0
        ? `
        <div class="section-box" data-section="extracurricular">
          <div class="section-label">Extracurricular Activities</div>
          ${data.extracurricular
            .map((item, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${item.activity || ""}</div>
              <div class="entry-sub">${item.organization || ""}${item.role ? ` | ${item.role}` : ""} | ${item.year ||
            (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")}</div>
              <div class="description-text">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.awards !== false && data.awards?.length > 0
        ? `
        <div class="section-box" data-section="awards">
          <div class="section-label">Awards</div>
          ${data.awards
            .map((award, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold">${award.title || ""}</div>
              <div class="entry-sub">${award.organization || ""} ${award.issueYear ? `• ${award.issueYear}` : ""}</div>
              ${award.description
            ? `<div class="description-text">${award.description}</div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.keyAchievements !== false &&
        data.keyAchievements?.length > 0
        ? `
        <div class="section-box" data-section="keyAchievements">
          <div class="section-label">Key Achievements</div>
          ${data.keyAchievements
            .map((achievement, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="description-text">${achievement || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.responsibilities !== false &&
        data.responsibilities?.length > 0
        ? `
        <div class="section-box" data-section="responsibilities">
          <div class="section-label">Responsibilities</div>
          ${data.responsibilities
            .map((responsibility, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="description-text">${responsibility || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.tools !== false && data.tools?.length > 0
        ? `
        <div class="section-box" data-section="tools">
          <div class="section-label">Tools & Technologies</div>
          <div class="skills-container">
            ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split(","))
            .map((tool) => `
              <span class="skill-item">${typeof tool === "string" ? tool.trim() : tool}</span>
            `)
            .join("")}
          </div>
        </div>`
        : ""}

        ${data.sectionVisibility?.customSections !== false &&
        data.customSections?.length > 0
        ? `
        ${data.customSections
            .map((section) => `
          ${section.visible !== false
            ? `
          <div class="section-box" data-section="customSections" data-custom-section-id="${section.id}">
            <div class="section-label">${section.title || ""}</div>
            ${section.entries
                ?.map((entry, index) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-bold">${entry.title || ""}</div>
                <div class="entry-sub">${entry.subtitle || ""}</div>
                <div class="description-text">${entry.description || ""}</div>
              </div>
            `)
                .join("") || ""}
          </div>`
            : ""}
        `)
            .join("")}
        `
        : ""}
      </div>

      <div class="right-col">
        <div class="photo-wrapper">
          ${data.personal?.image
        ? `
            <img src="${data.personal.image}" class="profile-img" alt="Profile Photo">
          `
        : `
            <div class="profile-photo-placeholder">
              ${data.personal?.name
            ? data.personal.name.charAt(0).toUpperCase()
            : "?"}
            </div>
          `}
        </div>

        <div class="section-box" data-section="contact">
          <div class="section-label" data-section="contact">Contact</div>
          ${data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.city ||
        data.personal?.fullAddress
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">Address</span>${[
            data.personal?.location,
            data.personal?.city,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</div>`
        : ""}
          ${data.personal?.phone
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">Phone</span>${data.personal.phone}</div>`
        : ""}
          ${data.personal?.alternatePhone
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">Alt. Phone</span>${data.personal.alternatePhone}</div>`
        : ""}
          ${data.personal?.email
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">Email</span>${data.personal.email}</div>`
        : ""}
          ${data.personal?.linkedinUrl
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">LinkedIn</span><a href="${data.personal.linkedinUrl}" style="text-decoration:none; color:inherit;">Profile Link</a></div>`
        : ""}
          ${data.personal?.githubUrl
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">GitHub</span><a href="${data.personal.githubUrl}" style="text-decoration:none; color:inherit;">Profile Link</a></div>`
        : ""}
          ${data.personal?.portfolioUrl
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">Portfolio</span><a href="${data.personal.portfolioUrl}" style="text-decoration:none; color:inherit;">Website</a></div>`
        : ""}
          ${data.personal?.website
        ? `<div class="contact-row" data-section="contact"><span class="contact-label">Website</span><a href="${data.personal.website}" style="text-decoration:none; color:inherit;">Website</a></div>`
        : ""}
          ${data.personal?.personalInfoDisplay === "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
        ? `
          ${data.personal?.fathersName
            ? `<div class="contact-row" data-section="contact"><span class="contact-label">Father's Name</span>${data.personal.fathersName}</div>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-row" data-section="contact"><span class="contact-label">Date of Birth</span>${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
          ${data.personal?.gender
            ? `<div class="contact-row" data-section="contact"><span class="contact-label">Gender</span>${data.personal.gender}</div>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<div class="contact-row" data-section="contact"><span class="contact-label">Marital Status</span>${data.personal.maritalStatus}</div>`
            : ""}
          ${data.personal?.nationality
            ? `<div class="contact-row" data-section="contact"><span class="contact-label">Nationality</span>${data.personal.nationality}</div>`
            : ""}
          `
        : ""}
        </div>

        ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `
        <div class="section-box" data-section="personal">
          <div class="section-label" data-section="personal">Personal Details</div>
          ${data.personal?.fathersName
            ? `<div class="contact-row" data-section="personal"><span class="contact-label">Father's Name</span>${data.personal.fathersName}</div>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-row" data-section="personal"><span class="contact-label">Date of Birth</span>${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
          ${data.personal?.gender
            ? `<div class="contact-row" data-section="personal"><span class="contact-label">Gender</span>${data.personal.gender}</div>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<div class="contact-row" data-section="personal"><span class="contact-label">Marital Status</span>${data.personal.maritalStatus}</div>`
            : ""}
          ${data.personal?.nationality
            ? `<div class="contact-row" data-section="personal"><span class="contact-label">Nationality</span>${data.personal.nationality}</div>`
            : ""}
          ${data.personal?.passportNo
            ? `<div class="contact-row" data-section="personal"><span class="contact-label">Passport No</span>${data.personal.passportNo}</div>`
            : ""}
        </div>`
        : ""}

        ${data.sectionVisibility?.skills !== false && data.skills
        ? `
        <div class="section-box" data-section="skills">
          <div class="section-label">Skills</div>
          <div class="skills-container">
            ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill) => `
              <span class="skill-item">${typeof skill === "string" ? skill.trim() : skill}</span>
            `)
            .join("")}
          </div>
        </div>`
        : ""}

        ${data.sectionVisibility?.education !== false &&
        data.education?.length > 0
        ? `
        <div class="section-box" data-section="education">
          <div class="section-label" data-section="education">Education</div>
          ${data.education
            .map((edu, index) => `
            <div class="entry-item" data-section="education" data-index="${index}">
              <div class="entry-bold" style="font-size: ${baseFontSize}px;" data-section="education" data-field="degree" data-index="${index}">${edu.degree || ""}</div>
              <div class="entry-sub" data-section="education" data-field="school" data-index="${index}">${edu.school || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.languages !== false &&
        data.languages?.length > 0
        ? `
        <div class="section-box" data-section="languages">
          <div class="section-label">Languages</div>
          ${data.languages
            .map((lang, index) => `
            <div class="entry-item" data-index="${index}">
              <div class="entry-bold" style="font-size: ${baseFontSize}px;">${lang.language || lang}</div>
              <div class="entry-sub">${lang.level || ""}${lang.capability ? ` - ${lang.capability}` : ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.hobbies !== false && data.hobbies?.length > 0
        ? `
        <div class="section-box" data-section="hobbies">
          <div class="section-label">Hobbies</div>
          <div class="skills-container">
            ${(Array.isArray(data.hobbies)
            ? data.hobbies
            : (data.hobbies || "").split(","))
            .map((hobby) => `
              <span class="skill-item">${typeof hobby === "string" ? hobby.trim() : hobby}</span>
            `)
            .join("")}
          </div>
        </div>`
        : ""}

        ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks?.length > 0
        ? `
        <div class="section-box" data-section="socialLinks">
          <div class="section-label">Social Links</div>
          ${data.socialLinks
            .map((link, index) => `
            <div class="contact-row" data-index="${index}">
              <span class="contact-label">${link.urlText || "Link"}</span>
              <a href="${link.url}" style="text-decoration:none; color:inherit;">${link.url}</a>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.references
        ? `
        <div class="section-box" data-section="references">
          <div class="section-label">References</div>
          <div class="description-text">${data.references}</div>
        </div>`
        : ""}
      </div>
    </div>
  </div>
</body>
</html>`;
}
