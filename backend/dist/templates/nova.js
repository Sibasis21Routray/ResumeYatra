"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNovaTemplate = buildNovaTemplate;
function buildNovaTemplate(data, theme) {
    const defaultTheme = {
        primary: "#80303d", // Burgundy/Maroon from the image
        secondary: "#a34a56",
        background: "#ffffff",
        headingFont: "Roboto",
        bodyFont: "Roboto",
    };
    const currentTheme = theme || defaultTheme;
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 10;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Poppins  sans-serif";
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 3.5); // Large name
    const subheadingFontSize = Math.round(userFontSize * 1.1);
    // Logic: Switch to 2 columns if skills exceed 6
    const useTwoColumnsForSkills = (Array.isArray(data.skills) ? data.skills : (data.skills || "").split(","))
        .length > 6;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${currentTheme.primary};
      --text: #333333;
      --text-light: #666666;
      --border: #e2e2e2;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.4;
      background: #f0f0f0;
      font-size: ${baseFontSize}px;
      padding: 30px;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #fff;
      position: relative;
      overflow: hidden;
      min-height: 1100px;
    }

    /* Top Shape Header */
    .header-accent {
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      height: 180px;
      background: var(--primary);
      border-bottom-left-radius: 100% 80%;
      z-index: 1;
    }

    .header {
      padding: 60px 50px 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      z-index: 2;
    }

    .name-block {
      max-width: 60%;
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 900;
      color: var(--primary);
      text-transform: uppercase;
      line-height: 0.9;
      margin-bottom: 10px;
    }

    .role-title {
       font-size: ${subheadingFontSize}px;
       letter-spacing: 2px;
       text-transform: uppercase;
       color: var(--text-light);
       font-weight: 500;
    }

    .photo-container {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 6px solid #fff;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      background: #eee;
    }

    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Layout Split */
    .main-grid {
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      padding: 0 50px 50px;
      gap: 40px;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: ${baseFontSize}px;
      font-weight: 900;
      text-transform: uppercase;
      color: #000;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .left-col .section-title {
        border-bottom: 1px solid var(--primary);
        padding-bottom: 5px;
    }

    .right-col {
      border-left: 1px solid var(--primary);
      padding-left: 25px;
    }

    /* Content Styling */
    .entry {
      margin-bottom: 18px;
    }

    .entry-header {
      font-weight: 800;
      font-size: ${baseFontSize}px;
      margin-bottom: 2px;
    }

    .entry-sub {
      color: var(--text-light);
      font-weight: 600;
      font-size: ${baseFontSize - 1}px;
      margin-bottom: 5px;
      display: block;
    }

    .entry-content {
      color: var(--text);
      font-size: ${baseFontSize}px;
      text-align: justify;
    }

    .entry-content ul {
      list-style-type: none;
    }

    .entry-content li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 4px;
    }

    .entry-content li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    /* Sidebar info items */
    .info-item {
      margin-bottom: 12px;
    }

    .info-label {
      display: block;
      font-weight: 800;
      font-size: ${baseFontSize - 2}px;
      text-transform: uppercase;
    }

    .info-value {
      word-break: break-all;
      color: var(--text);
    }

    .skill-list {
        list-style: none;
    }

    .skill-list li {
        margin-bottom: 5px;
        font-weight: 500;
    }

    /* Dynamic Skills Grid Logic */
    .skills-list {
      display: block;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .skills-list ul {
      list-style: none;
      padding: 0;
      margin: 0 0 15px 0;
      display: grid;
      grid-template-columns: ${useTwoColumnsForSkills ? "1fr 1fr" : "1fr"};
      gap: 8px 30px;
    }

    .skills-list li {
      position: relative;
      padding-left: 18px;
      color: var(--text);
      font-size: ${baseFontSize - 0.5}px;
      margin-bottom: 5px;
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .skills-list li::before {
      content: "-";
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
    <div class="header-accent"></div>
    
    <header class="header" data-section="personal">
      <div class="name-block">
        <div class="name">${data.personal?.name?.split(" ").join("<br>") || "YOUR NAME"}</div>
        <div class="role-title">${data.personal?.role || ""}</div>
      </div>
      
      <div class="photo-container">
        ${data.personal?.image
        ? `<img src="${data.personal.image}" alt="Profile">`
        : `<div style="display:flex; height:100%; align-items:center; justify-content:center; background:var(--primary); color:white; font-size:40px;">${data.personal?.name?.charAt(0)}</div>`}
      </div>
    </header>

    <main class="main-grid">
      <div class="left-col">
        
        ${data.sectionVisibility?.summary !== false && data.summary
        ? `
        <div class="section" data-section="summary">
          <div class="section-title">Summary</div>
          <div class="entry-content">${data.summary}</div>
        </div>`
        : ""}

        ${typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
        ? `
        <div class="section" data-section="careerObjective">
          <div class="section-title">Career Objective</div>
          <div class="entry-content">${data.careerObjective}</div>
        </div>`
        : ""}

        ${data.sectionVisibility?.experience !== false &&
        data.experience?.length > 0
        ? `
        <div class="section" data-section="experience">
          <div class="section-title">Experience</div>
          ${data.experience
            .map((exp, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${exp.title || ""}</div>
              <span class="entry-sub">${exp.company || ""}${exp.domain ? ` | ${exp.domain}` : ""}${exp.location ? `, ${exp.location}` : ""} | ${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
              <div class="entry-content">${exp.description || ""}</div>
              ${exp.achievements
            ? `<div class="entry-content" style="margin-top: 8px;"><strong style="color: var(--text);">Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.internships && data.internships.length > 0
        ? `
        <div class="section" data-section="internships">
          <div class="section-title">Internships</div>
          ${data.internships
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.title || ""}</div>
              <span class="entry-sub">${item.company || ""}${item.location ? `, ${item.location}` : ""} | ${item.startDate || ""} - ${item.endDate || ""}</span>
              <div class="entry-content">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.education !== false &&
        data.education?.length > 0
        ? `
        <div class="section" data-section="education">
          <div class="section-title">Education</div>
          ${data.education
            .map((edu, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
              <span class="entry-sub">${edu.school || ""} • ${edu.graduationDate || ""}</span>
              <div class="entry-content">${edu.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.academicProjects && data.academicProjects.length > 0
        ? `
        <div class="section" data-section="academicProjects">
          <div class="section-title">Academic Projects</div>
          ${data.academicProjects
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.name || item.title || ""}</div>
              <span class="entry-sub">${item.duration || ""}${item.institution ? ` | ${item.institution}` : ""}</span>
              <div class="entry-content">${item.description || ""}</div>
              ${item.technologies
            ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies}</div>`
            : ""}
              ${item.url
            ? `<div class="entry-content"><a href="${item.url}" target="_blank" style="color: var(--primary);">${item.url}</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.skills !== false &&
        (Array.isArray(data.skills)
            ? data.skills.length > 0
            : (data.skills || "").trim().length > 0)
        ? `
        <div class="section" data-section="skills">
          <div class="section-title">Skills</div>
          <div class="skills-list">
            <ul>
              ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill, index) => `<li data-section="skills" data-index="${index}">${skill.trim()}</li>`)
            .join("")}
            </ul>
          </div>
        </div>`
        : ""}

        ${data.sectionVisibility?.languages !== false &&
        data.languages?.length > 0
        ? `
        <div class="section" data-section="languages">
          <div class="section-title">Languages</div>
          ${data.languages
            .map((lang, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${lang.language || lang}</div>
              <span class="entry-sub">${lang.level ? `${lang.level}` : ""}${lang.capability ? ` • ${lang.capability}` : ""}</span>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.projects !== false &&
        data.projects?.length > 0
        ? `
        <div class="section" data-section="projects">
          <div class="section-title">Projects</div>
          ${data.projects
            .map((project, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${project.name || ""}</div>
              <span class="entry-sub">${project.technologies
            ? `Technologies: ${project.technologies}`
            : ""} | ${project.startDate || ""} ${project.endDate ? `- ${project.endDate}` : ""}</span>
              <div class="entry-content">${project.description || ""}</div>
              ${project.url
            ? `<div class="entry-content"><a href="${project.url}" target="_blank" style="color: var(--primary);">${project.urlText || "View Project"}</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.certifications !== false &&
        data.certifications?.length > 0
        ? `
        <div class="section" data-section="certifications">
          <div class="section-title">Certifications</div>
          ${data.certifications
            .map((cert, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${cert.name || ""}</div>
              <span class="entry-sub">${cert.issuer || ""} ${cert.date ? `• ${cert.date}` : ""}</span>
              ${cert.description
            ? `<div class="entry-content">${cert.description}</div>`
            : ""}
              ${cert.url
            ? `<div class="entry-content"><a href="${cert.url}" target="_blank" style="color: var(--primary);">View Certificate</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.leadershipPositions && data.leadershipPositions.length > 0
        ? `
        <div class="section" data-section="leadershipPositions">
          <div class="section-title">Leadership & Positions</div>
          ${data.leadershipPositions
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.position || item.title || ""}</div>
              <span class="entry-sub">${item.organization || ""} | ${item.startDate || ""} - ${item.endDate || ""}</span>
              <div class="entry-content">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.trainingPrograms && data.trainingPrograms.length > 0
        ? `
        <div class="section" data-section="trainingPrograms">
          <div class="section-title">Training Programs</div>
          ${data.trainingPrograms
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.name || ""}</div>
              <span class="entry-sub">${item.provider || item.organization || ""}${item.completionDate ? ` • ${item.completionDate}` : ""}${item.duration ? ` | ${item.duration}` : ""}</span>
              <div class="entry-content">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.scholarships && data.scholarships.length > 0
        ? `
        <div class="section" data-section="scholarships">
          <div class="section-title">Scholarships</div>
          ${data.scholarships
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.name || ""}</div>
              <span class="entry-sub">${item.provider || item.organization || ""}${item.year ? ` • ${item.year}` : ""}${item.amount ? ` | ${item.amount}` : ""}</span>
              <div class="entry-content">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.coCurricular && data.coCurricular.length > 0
        ? `
        <div class="section" data-section="coCurricular">
          <div class="section-title">Co-curricular Activities</div>
          ${data.coCurricular
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.activity || ""}</div>
              <span class="entry-sub">${item.organization || ""}${item.role ? ` | ${item.role}` : ""} | ${item.year ||
            (item.startDate
                ? `${item.startDate} - ${item.endDate || ""}`
                : "")}</span>
              <div class="entry-content">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.extracurricular && data.extracurricular.length > 0
        ? `
        <div class="section" data-section="extracurricular">
          <div class="section-title">Extracurricular Activities</div>
          ${data.extracurricular
            .map((item, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${item.activity || ""}</div>
              <span class="entry-sub">${item.organization || ""}${item.role ? ` | ${item.role}` : ""} | ${item.year ||
            (item.startDate
                ? `${item.startDate} - ${item.endDate || ""}`
                : "")}</span>
              <div class="entry-content">${item.description || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.awards !== false && data.awards?.length > 0
        ? `
        <div class="section" data-section="awards">
          <div class="section-title">Awards</div>
          ${data.awards
            .map((award, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">${award.title || ""}</div>
              <span class="entry-sub">${award.organization || ""} ${award.issueYear ? `• ${award.issueYear}` : ""}</span>
              ${award.description
            ? `<div class="entry-content">${award.description}</div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.keyAchievements !== false &&
        data.keyAchievements?.length > 0
        ? `
        <div class="section" data-section="keyAchievements">
          <div class="section-title">Key Achievements</div>
          ${data.keyAchievements
            .map((achievement, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-content">${achievement || ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.responsibilities !== false &&
        data.responsibilities?.length > 0
        ? `
        <div class="section" data-section="responsibilities">
          <div class="section-title">Key Responsibilities</div>
          ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-content">${line.trim()}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.tools !== false && data.tools?.length > 0
        ? `
        <div class="section" data-section="tools">
          <div class="section-title">Tools & Technologies</div>
          <ul class="skill-list">
            ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split(","))
            .map((tool) => `
              <li>${typeof tool === "string" ? tool.trim() : tool}</li>
            `)
            .join("")}
          </ul>
        </div>`
        : ""}

        ${data.references
        ? `
        <div class="section" data-section="references">
          <div class="section-title">References</div>
          <div class="entry-content">${data.references}</div>
        </div>`
        : ""}
      </div>

      <div class="right-col">
        
        <div class="section" data-section="contact">
          <div class="section-title" data-section="contact">Contact</div>
          <div class="info-item" data-section="contact">
            <span class="info-label">Email</span>
            <div class="info-value">${data.personal?.email || ""}</div>
          </div>
          <div class="info-item" data-section="contact">
            <span class="info-label">Phone</span>
            <div class="info-value">${data.personal?.phone || ""}</div>
          </div>
          ${data.personal?.alternatePhone
        ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Alt. Phone</span>
            <div class="info-value">${data.personal.alternatePhone}</div>
          </div>`
        : ""}
          ${data.personal?.location ||
        data.personal?.city ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Address</span>
            <div class="info-value">${[
            data.personal?.location,
            data.personal?.city,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</div>
          </div>`
        : ""}
          ${data.personal?.linkedinUrl
        ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">LinkedIn</span>
            <div class="info-value">/in/${data.personal.linkedinUrl
            .split("/")
            .pop()}</div>
          </div>`
        : ""}
          ${data.personal?.githubUrl
        ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">GitHub</span>
            <div class="info-value"><a href="${data.personal.githubUrl}" target="_blank">${data.personal.githubUrl}</a></div>
          </div>`
        : ""}
          ${data.personal?.portfolioUrl
        ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Portfolio</span>
            <div class="info-value"><a href="${data.personal.portfolioUrl}" target="_blank">${data.personal.portfolioUrl}</a></div>
          </div>`
        : ""}
          ${data.personal?.website
        ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Website</span>
            <div class="info-value"><a href="${data.personal.website}" target="_blank">${data.personal.website}</a></div>
          </div>`
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
            ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Father's Name</span>
            <div class="info-value">${data.personal.fathersName}</div>
          </div>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Date of Birth</span>
            <div class="info-value">${data.personal?.dateOfBirth || data.personal?.dob}</div>
          </div>`
            : ""}
          ${data.personal?.gender
            ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Gender</span>
            <div class="info-value">${data.personal.gender}</div>
          </div>`
            : ""}
          ${data.personal?.maritalStatus
            ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Marital Status</span>
            <div class="info-value">${data.personal.maritalStatus}</div>
          </div>`
            : ""}
          ${data.personal?.nationality
            ? `
          <div class="info-item" data-section="contact">
            <span class="info-label">Nationality</span>
            <div class="info-value">${data.personal.nationality}</div>
          </div>`
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
        <div class="section" data-section="personal">
          <div class="section-title" data-section="personal">Personal Details</div>
          ${data.personal?.fathersName
            ? `
          <div class="info-item" data-section="personal">
            <span class="info-label">Father's Name</span>
            <div class="info-value">${data.personal.fathersName}</div>
          </div>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `
          <div class="info-item" data-section="personal">
            <span class="info-label">Date of Birth</span>
            <div class="info-value">${data.personal?.dateOfBirth || data.personal?.dob}</div>
          </div>`
            : ""}
          ${data.personal?.gender
            ? `
          <div class="info-item" data-section="personal">
            <span class="info-label">Gender</span>
            <div class="info-value">${data.personal.gender}</div>
          </div>`
            : ""}
          ${data.personal?.maritalStatus
            ? `
          <div class="info-item" data-section="personal">
            <span class="info-label">Marital Status</span>
            <div class="info-value">${data.personal.maritalStatus}</div>
          </div>`
            : ""}
          ${data.personal?.nationality
            ? `
          <div class="info-item" data-section="personal">
            <span class="info-label">Nationality</span>
            <div class="info-value">${data.personal.nationality}</div>
          </div>`
            : ""}
          ${data.personal?.passportNo
            ? `
          <div class="info-item" data-section="personal">
            <span class="info-label">Passport No</span>
            <div class="info-value">${data.personal.passportNo}</div>
          </div>`
            : ""}
        </div>`
        : ""}

        ${data.sectionVisibility?.skills !== false &&
        ((typeof data.skills === "string" && data.skills.trim().length > 0) ||
            (data.skills && data.skills.length > 0))
        ? `
        <div class="section" data-section="skills">
          <div class="section-title">Skills</div>
          <div class="skills-list">
            ${typeof data.skills === "string" && data.skills.trim().length > 0
            ? data.skills
            : data.skills && data.skills.length > 0
                ? `<ul class="skills-list">
              ${data.skills
                    .map((skill, index) => `<li data-section="skills" data-index="${index}">${skill}</li>`)
                    .join("")}
            </ul>`
                : ""}
          </div>
        </div>`
        : ""}

        ${data.sectionVisibility?.education !== false &&
        data.education?.length > 0
        ? `
        <div class="section" data-section="education">
          <div class="section-title" data-section="education">Education</div>
          ${data.education
            .map((edu, index) => `
            <div class="entry" data-section="education" data-index="${index}">
              <div class="entry-header" style="font-size: ${baseFontSize - 1}px;" data-section="education" data-field="degree" data-index="${index}">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
              <span class="entry-sub" style="font-size: ${baseFontSize - 2}px;" data-section="education" data-field="school" data-index="${index}">${edu.school || ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""}</span>
              <span class="entry-sub" style="font-size: ${baseFontSize - 2}px;">${edu.graduationDate || ""}</span>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.languages !== false &&
        data.languages?.length > 0
        ? `
        <div class="section" data-section="languages">
          <div class="section-title">Languages</div>
          <ul class="skill-list">
            ${data.languages
            .map((lang) => `
              <li>${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</li>
            `)
            .join("")}
          </ul>
        </div>`
        : ""}

        ${data.sectionVisibility?.hobbies !== false && data.hobbies?.length > 0
        ? `
        <div class="section" data-section="hobbies">
          <div class="section-title">Hobbies</div>
          <ul class="skill-list">
            ${(Array.isArray(data.hobbies)
            ? data.hobbies
            : (data.hobbies || "").split(","))
            .map((hobby) => `
              <li>${typeof hobby === "string" ? hobby.trim() : hobby}</li>
            `)
            .join("")}
          </ul>
        </div>`
        : ""}

        ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks?.length > 0
        ? `
        <div class="section" data-section="socialLinks">
          <div class="section-title">Social Links</div>
          ${data.socialLinks
            .map((link, index) => `
            <div class="info-item" data-index="${index}">
              <span class="info-label">${link.urlText || "Link"}</span>
              <div class="info-value"><a href="${link.url}" target="_blank">${link.url}</a></div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.customSections !== false &&
        data.customSections?.length > 0
        ? `
        ${data.customSections
            .map((section) => `
          ${section.visible !== false
            ? `
          <div class="section" data-section="customSections" data-custom-section-id="${section.id}">
            <div class="section-title">${section.title || ""}</div>
            ${section.entries
                ?.map((entry, index) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">${entry.title || ""}</div>
                <span class="entry-sub">${entry.subtitle || ""}</span>
                <div class="entry-content">${entry.description || ""}</div>
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
    </main>
  </div>
</body>
</html>`;
}
