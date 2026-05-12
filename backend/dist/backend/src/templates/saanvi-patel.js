"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSaanviPatelTemplate = buildSaanviPatelTemplate;
function buildSaanviPatelTemplate(data, theme) {
    const { personal = {}, summary = "", experience = [], education = [], skills = [], languages = [], certifications = [], awards = [], } = data;
    const primaryColor = theme?.primaryColor || theme?.primary || "#1a3a52";
    const accentColor = theme?.accentColor || theme?.secondary || "#8b9ca3";
    const textGray = "#4a5568";
    const darkGray = "#333333";
    const bodyFontSize = data.formatting?.bodyFontSize || 10.5;
    const fontFamily = data.formatting?.fontFamily ||
        "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif";
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
           font-family: ${fontFamily};
           background-color: white;
           color: ${darkGray};
           font-size: ${bodyFontSize}pt;
           line-height: 1.6;
           padding: 40px;
         }

        .page-border {
          border: 1px solid #e2e8f0;
          padding: 35px;
          min-height: 11in;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .top-accent {
          height: 40px;
          background-color: #d9e2ec;
          margin: -35px -35px 35px -35px;
          width: calc(100% + 70px);
        }

        .header { margin-bottom: 30px; }

        .name {
          font-size: 28pt;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 2px;
          line-height: 1.3;
          margin-bottom: 8px;
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        .job-title {
           font-size: ${bodyFontSize + 3}pt;
           color: ${accentColor};
           margin-top: 5px;
           line-height: 1.4;
         }

        .section { 
          margin-bottom: 25px; 
          page-break-inside: avoid;
        }

        .section-title {
           font-size: ${bodyFontSize + 1}pt;
           font-weight: 700;
           color: ${primaryColor};
           text-transform: uppercase;
           border-bottom: 2px solid ${accentColor};
           padding-bottom: 6px;
           margin-bottom: 15px;
           display: block;
           line-height: 1.4;
           font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
         }

        .entry { 
          margin-bottom: 18px; 
          page-break-inside: avoid;
        }

        .entry-row {
           display: flex;
           justify-content: space-between;
           font-weight: 700;
           color: ${darkGray};
           flex-wrap: wrap;
           gap: 5px;
           line-height: 1.4;
         }

        .entry-subrow {
           font-style: italic;
           color: ${textGray};
           font-size: ${bodyFontSize - 0.5}pt;
           margin-bottom: 6px;
           line-height: 1.5;
         }

        .description {
           color: ${textGray};
           font-size: ${bodyFontSize - 0.5}pt;
           line-height: 1.7;
           margin-top: 8px;
           word-wrap: break-word;
           overflow-wrap: break-word;
         }

        .contact-info {
           display: flex;
           flex-direction: column;
           gap: 6px;
           font-size: ${bodyFontSize - 1}pt;
           color: ${textGray};
           margin-bottom: 25px;
           line-height: 1.5;
         }

        .contact-item {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .contact-item b {
          color: ${primaryColor};
          min-width: 70px;
          font-weight: 600;
        }

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
           grid-template-columns: 1fr 1fr;
           gap: 8px 30px;
         }

        .skills-list li {
           position: relative;
           padding-left: 18px;
           color: ${textGray};
           font-size: ${bodyFontSize - 0.5}pt;
           margin-bottom: 5px;
           line-height: 1.5;
           word-wrap: break-word;
           overflow-wrap: break-word;
         }

        .skills-list li::before {
          content: "-";
          position: absolute;
          left: 0;
          color: ${accentColor};
          font-weight: bold;
        }

        .entry-row span:first-child {
          flex: 1;
          min-width: 50%;
        }

        .entry-row span:last-child {
          white-space: nowrap;
        }

        .section-header {
           font-size: ${bodyFontSize + 1}pt;
           font-weight: 700;
           color: ${primaryColor};
           text-transform: uppercase;
           border-bottom: 2px solid ${accentColor};
           padding-bottom: 6px;
           margin-bottom: 15px;
           display: block;
           line-height: 1.4;
           font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
         }

        @media print {
          body { 
            padding: 0; 
            font-size: 10pt;
          }
          .page-border { 
            border: none; 
            padding: 20mm;
            min-height: auto;
          }
          .top-accent {
            margin: -20mm -20mm 20mm -20mm;
            width: calc(100% + 40mm);
          }
        }
      </style>
    </head>
    <body>
      <div class="page-border">
        <div class="top-accent"></div>

        <header class="header">
          <h1 class="name">${personal.name || "SAANVI PATEL"}</h1>
        </header>

        <div class="section" data-section="personal">
          <div class="contact-info">
            ${personal.location ||
        personal.country ||
        personal.pinCode ||
        personal.fullAddress
        ? `<div class="contact-item"><b>Address: </b>  ${[
            personal.location,
            personal.country,
            personal.pinCode,
            personal.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</div>`
        : ""}
            ${personal.phone
        ? `<div class="contact-item"><b>Phone:</b> ${personal.phone}</div>`
        : ""}
            ${personal.email
        ? `<div class="contact-item"><b>Email:</b> ${personal.email}</div>`
        : ""}
            ${personal.fathersName && personal.personalInfoDisplay === "inline"
        ? `<div class="contact-item"><b>Father's Name:</b> ${personal.fathersName}</div>`
        : ""}
            ${personal.dob && personal.personalInfoDisplay === "inline"
        ? `<div class="contact-item"><b>Date of Birth:</b> ${personal.dob}</div>`
        : ""}
            ${personal.gender && personal.personalInfoDisplay === "inline"
        ? `<div class="contact-item"><b>Gender:</b> ${personal.gender}</div>`
        : ""}
            ${personal.maritalStatus &&
        personal.personalInfoDisplay === "inline"
        ? `<div class="contact-item"><b>Marital Status:</b> ${personal.maritalStatus}</div>`
        : ""}
            ${personal.nationality && personal.personalInfoDisplay === "inline"
        ? `<div class="contact-item"><b>Nationality:</b> ${personal.nationality}</div>`
        : ""}
            ${personal.linkedinUrl
        ? `<div class="contact-item"><b>LinkedIn:</b> <a href="${personal.linkedinUrl}" target="_blank">${personal.linkedinUrl}</a></div>`
        : ""}
            ${personal.githubUrl
        ? `<div class="contact-item"><b>GitHub:</b> <a href="${personal.githubUrl}" target="_blank">${personal.githubUrl}</a></div>`
        : ""}
            ${personal.portfolioUrl
        ? `<div class="contact-item"><b>Portfolio:</b> <a href="${personal.portfolioUrl}" target="_blank">${personal.portfolioUrl}</a></div>`
        : ""}
          </div>
        </div>

        ${personal.personalInfoDisplay !== "inline" &&
        (personal.fathersName ||
            personal.dob ||
            personal.gender ||
            personal.maritalStatus ||
            personal.nationality)
        ? `
          <div class="section" data-section="personal">
            <h2 class="section-title" data-section="personal">Personal Details</h2>
            <div class="contact-info">
              ${personal.fathersName
            ? `<div class="contact-item"><b>Father's Name:</b> ${personal.fathersName}</div>`
            : ""}
              ${personal.dob
            ? `<div class="contact-item"><b>Date of Birth:</b> ${personal.dob}</div>`
            : ""}
              ${personal.gender
            ? `<div class="contact-item"><b>Gender:</b> ${personal.gender}</div>`
            : ""}
              ${personal.maritalStatus
            ? `<div class="contact-item"><b>Marital Status:</b> ${personal.maritalStatus}</div>`
            : ""}
              ${personal.nationality
            ? `<div class="contact-item"><b>Nationality:</b> ${personal.nationality}</div>`
            : ""}
            </div>
          </div>
        `
        : ""}

        ${summary
        ? `
          <div class="section" data-section="summary">
            <h2 class="section-title" data-section="summary">Professional Summary</h2>
            <p class="description">${summary}</p>
          </div>
        `
        : ""}

        ${experience.length > 0
        ? `
          <div class="section" data-section="experience">
            <h2 class="section-title" data-section="experience">Work History</h2>
            ${experience
            .map((exp, index) => `
              <div class="entry" data-section="experience" data-index="${index}">
                <div class="entry-row">
                  <span>${exp.title}</span>
                  <span>${exp.startDate} - ${exp.endDate || "Present"}</span>
                </div>
                <div class="entry-subrow">${exp.company}${exp.domain ? ` | ${exp.domain}` : ""}${exp.location ? `, ${exp.location}` : ""}</div>
                <div class="description">${exp.description}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${education.length > 0
        ? `
          <div class="section" data-section="education">
            <h2 class="section-title" data-section="education">Education</h2>
            ${education
            .map((edu, index) => `
              <div class="entry" data-section="education" data-index="${index}">
                <div class="entry-row">
                  <span>${edu.degree}${edu.field ? ` in ${edu.field}` : ""}</span>
                  <span>${edu.graduationDate}</span>
                </div>
                <div class="entry-subrow">${edu.school}${edu.location ? `, ${edu.location}` : ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
        ? `
          <div class="section" data-section="careerObjective">
            <h2 class="section-header">Career Objective</h2>
            <div class="description">${data.careerObjective}</div>
          </div>
        `
        : ""}

        ${data.projects && data.projects.length > 0
        ? `
          <div class="section" data-section="projects">
            <h2 class="section-header">Projects</h2>
            ${data.projects
            .map((project, index) => `
              <div class="entry" data-section="projects" data-index="${index}">
                <div class="entry-row">
                  <span>${project.name}</span>
                </div>
                <div class="entry-subrow">${project.technologies
            ? `Technologies: ${project.technologies}`
            : ""}</div>
                <div class="description">${project.description}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.internships && data.internships.length > 0
        ? `
          <div class="section" data-section="internships">
            <h2 class="section-header">Internships</h2>
            ${data.internships
            .map((item, index) => `
              <div class="entry" data-section="internships" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title}</span>
                  <span>${item.startDate || ""} - ${item.endDate || ""}</span>
                </div>
                <div class="entry-subrow">${item.company || ""}${item.location ? `, ${item.location}` : ""}</div>
                <div class="description">${item.description || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.academicProjects && data.academicProjects.length > 0
        ? `
          <div class="section" data-section="academicProjects">
            <h2 class="section-header">Academic Projects</h2>
            ${data.academicProjects
            .map((item, index) => `
              <div class="entry" data-section="academicProjects" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || item.title || ""}</span>
                  <span>${item.duration || ""}</span>
                </div>
                <div class="entry-subrow">${item.institution || ""}${item.course ? ` | ${item.course}` : ""}</div>
                <div class="description">${item.description || ""}</div>
                ${item.technologies && item.technologies.length > 0
            ? `<div class="entry-subrow"><b>Technologies:</b> ${Array.isArray(item.technologies)
                ? item.technologies.join(", ")
                : item.technologies}</div>`
            : ""}
                ${item.url
            ? `<div class="entry-subrow"><b>URL:</b> <a href="${item.url}" target="_blank">${item.url}</a></div>`
            : ""}
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.leadershipPositions && data.leadershipPositions.length > 0
        ? `
          <div class="section" data-section="leadershipPositions">
            <h2 class="section-header">Leadership & Positions</h2>
            ${data.leadershipPositions
            .map((item, index) => `
              <div class="entry" data-section="leadershipPositions" data-index="${index}">
                <div class="entry-row">
                  <span>${item.position || item.title || ""}</span>
                  <span>${item.startDate || ""} - ${item.endDate || ""}</span>
                </div>
                <div class="entry-subrow">${item.organization || ""}</div>
                <div class="description">${item.description || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.trainingPrograms && data.trainingPrograms.length > 0
        ? `
          <div class="section" data-section="trainingPrograms">
            <h2 class="section-header">Training Programs</h2>
            ${data.trainingPrograms
            .map((item, index) => `
              <div class="entry" data-section="trainingPrograms" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name}</span>
                  <span>${item.completionDate || ""}</span>
                </div>
                <div class="entry-subrow">${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}</div>
                <div class="description">${item.description || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.scholarships && data.scholarships.length > 0
        ? `
          <div class="section" data-section="scholships">
            <h2 class="section-header">Scholarships</h2>
            ${data.scholarships
            .map((item, index) => `
              <div class="entry" data-section="scholarships" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name}</span>
                  <span>${item.year || ""}</span>
                </div>
                <div class="entry-subrow">${item.provider || item.organization || ""}${item.amount ? ` | ${item.amount}` : ""}</div>
                <div class="description">${item.description || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.coCurricular && data.coCurricular.length > 0
        ? `
          <div class="section" data-section="coCurricular">
            <h2 class="section-header">Co-curricular Activities</h2>
            ${data.coCurricular
            .map((item, index) => `
              <div class="entry" data-section="coCurricular" data-index="${index}">
                <div class="entry-row">
                  <span>${item.activity}</span>
                  <span>${item.year ||
            (item.startDate
                ? `${item.startDate} - ${item.endDate || ""}`
                : "")}</span>
                </div>
                <div class="entry-subrow">${item.organization || ""}${item.role ? ` | ${item.role}` : ""}</div>
                <div class="description">${item.description || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.extracurricular && data.extracurricular.length > 0
        ? `
          <div class="section" data-section="extracurricular">
            <h2 class="section-header">Extracurricular Activities</h2>
            ${data.extracurricular
            .map((item, index) => `
              <div class="entry" data-section="extracurricular" data-index="${index}">
                <div class="entry-row">
                  <span>${item.activity}</span>
                  <span>${item.year ||
            (item.startDate
                ? `${item.startDate} - ${item.endDate || ""}`
                : "")}</span>
                </div>
                <div class="entry-subrow">${item.organization || ""}${item.role ? ` | ${item.role}` : ""}</div>
                <div class="description">${item.description || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${data.hobbies && data.hobbies.length > 0
        ? `
          <div class="section" data-section="hobbies">
            <h2 class="section-title" data-section="hobbies">Hobbies & Interests</h2>
            <ul class="skills-list">
              ${data.hobbies
            .map((hobby, index) => `<li data-section="hobbies" data-index="${index}">${hobby}</li>`)
            .join("")}
            </ul>
          </div>
        `
        : ""}

        ${typeof skills === "string" && skills.trim().length > 0
        ? `
          <div class="section" data-section="skills">
            <h2 class="section-title" data-section="skills">Skills</h2>
            <div class="skills-list">
              ${skills}
            </div>
          </div>
        `
        : skills && skills.length > 0
            ? `
          <div class="section" data-section="skills">
            <h2 class="section-title" data-section="skills">Skills</h2>
            <ul class="skills-list">
              ${skills
                .map((skill, index) => `<li data-section="skills" data-index="${index}">${skill}</li>`)
                .join("")}
            </ul>
          </div>
        `
            : ""}

        ${certifications.length > 0
        ? `
          <div class="section" data-section="certifications">
            <h2 class="section-title" data-section="certifications">Certifications</h2>
            ${certifications
            .map((cert, index) => `
              <div class="entry" style="margin-bottom: 8px;" data-section="certifications" data-index="${index}">
                <div class="entry-row"><span>${cert.name}</span><span>${cert.date || ""}</span></div>
                <div class="entry-subrow">${cert.issuer || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${awards.length > 0
        ? `
          <div class="section" data-section="awards">
            <h2 class="section-title" data-section="awards">Awards</h2>
            ${awards
            .map((award, index) => `
              <div class="entry" style="margin-bottom: 8px;" data-section="awards" data-index="${index}">
                <div class="entry-row"><span>${award.title}</span><span>${award.issueYear || ""}</span></div>
                <div class="entry-subrow">${award.organization || ""}</div>
              </div>
            `)
            .join("")}
          </div>
        `
        : ""}

        ${languages.length > 0
        ? `
          <div class="section" data-section="languages">
            <h2 class="section-title" data-section="languages">Languages</h2>
            <ul class="skills-list">
              ${languages
            .map((lang, index) => `<li data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}</li>`)
            .join("")}
            </ul>
          </div>
        `
        : ""}
      </div>
    </body>
    </html>
  `;
}
