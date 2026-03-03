export function buildMinimalTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#2563eb",
    secondary: "#64748b",
    background: "#ffffff",
    headingFont: "Inter",
    bodyFont: "Inter",
  };

  const currentTheme = theme || defaultTheme;
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11; // Default 11px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Arial, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.5); // 2.5x base size
  const subheadingFontSize = Math.round(userFontSize * 1.2); // 1.2x base size

  // Typography mappings
  const fontSizeMap = {
    small: { base: "10px", heading: "28px", subheading: "13px" },
    medium: { base: "11px", heading: "30px", subheading: "14px" },
    large: { base: "12px", heading: "34px", subheading: "15px" },
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

  const currentFontSize =
    fontSizeMap[typography.fontSize as keyof typeof fontSizeMap] ||
    fontSizeMap.medium;
  const currentAlignment =
    alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight =
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --text-color: #1e293b;
      --text-light: #64748b;
      --border-color: #e2e8f0;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text-color);
      line-height: 1.6;
      font-size: ${baseFontSize}px;
      background: #f8fafc;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: var(--background-color);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    /* Header */
    .header {
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .name {
      font-size: ${Math.round(baseFontSize * 2.7)}px;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 8px;
      line-height: 1.2;
    }
    
    .name .surname {
      color: #ffffff;
      display: block;
      background: var(--primary-color);
      padding: 2px 8px;
      margin-top: 4px;
      width: fit-content;
    }

    .role {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 400;
      color: var(--text-light);
      margin-bottom: 15px;
    }
    
    .contact {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: var(--text-light);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      line-height: 1.5;
    }
    
    .contact span {
      position: relative;
    }
    
    .contact span:not(:last-child)::after {
      content: "•";
      margin-left: 12px;
      color: var(--border-color);
    }
    
    /* Sections */
    .section {
      margin-bottom: 28px;
    }
    
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.15)}px;
      font-weight: 700;
      color: var(--text-color);
      text-transform: uppercase;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-color);
      letter-spacing: 0.5px;
    }
    
    /* Entries */
    .entry {
      margin-bottom: 18px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .entry:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
      gap: 15px;
    }
    
    .entry-title {
      font-weight: 600;
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      color: var(--text-color);
      flex: 1;
    }
    
    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--text-light);
      white-space: nowrap;
      font-style: italic;
    }
    
    .entry-subtitle {
      font-size: ${baseFontSize}px;
      color: var(--text-light);
      margin-bottom: 8px;
      font-style: italic;
    }
    
    .entry-content {
      font-size: ${baseFontSize}px;
      color: var(--text-color);
      line-height: 1.7;
    }

    .entry-content ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .entry-content li {
      margin: 5px 0;
      padding: 0;
      color: var(--text-color);
    }

    .entry-content b {
      font-weight: 700;
      color: var(--text-color);
    }

    /* Enhanced Education Styles */
    .education-school {
      font-size: ${baseFontSize}px;
      color: var(--text-light);
      font-weight: 500;
      margin-bottom: 4px;
      font-style: italic;
    }

    .education-field {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: var(--text-light);
      margin-bottom: 4px;
    }

    .education-location {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--text-light);
      margin-bottom: 6px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: var(--text-color);
      line-height: 1.7;
      margin-top: 8px;
      padding: 4px 0;
    }

    .education-achievements {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid var(--border-color);
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 5px;
      color: var(--text-color);
      font-size: ${baseFontSize}px;
      line-height: 1.6;
    }

    .education-achievements li:before {
      content: "•";
      color: var(--primary-color);
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    /* Skills */
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .skill-badge {
      background: #f1f5f9;
      color: var(--text-color);
      padding: 6px 12px;
      border-radius: 4px;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      font-weight: 500;
      border: 1px solid var(--border-color);
    }
    
    /* Links */
    a {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Print styles */
    @media print {
      body {
        background: white;
      }
      .container { 
        padding: 20px; 
        max-width: none;
        box-shadow: none;
      }
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .container {
        padding: 25px 20px;
      }
      
      .contact {
        flex-direction: column;
        gap: 8px;
      }
      
      .contact span:not(:last-child)::after {
        display: none;
      }
      
      .entry-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
      
      .entry-date {
        white-space: normal;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header" data-section="personal">
      <div class="name">
        ${(() => {
          const fullName =
            data.personal?.name && data.personal?.name !== "undefined"
              ? data.personal.name
              : "Your Name";
          const nameParts = fullName.trim().split(" ");
          if (nameParts.length > 1) {
            const surname = nameParts[nameParts.length - 1];
            const firstAndMiddle = nameParts.slice(0, -1).join(" ");
            return `${firstAndMiddle}<span class="surname">${surname}</span>`;
          }
          return fullName;
        })()}
      </div>
      ${
        data.personal?.role
          ? `<div class="role">${data.personal.role}</div>`
          : ""
      }

      <div class="contact">
        ${
          data.personal?.email
            ? `<span data-section="personal" data-index="0">${data.personal.email}</span>`
            : ""
        }
        ${
          data.personal?.phone
            ? `<span data-section="personal" data-index="1">${data.personal.phone}</span>`
            : ""
        }
        ${
          data.personal?.alternatePhone
            ? `<span data-section="personal" data-index="2">${data.personal.alternatePhone} (Alt)</span>`
            : ""
        }
        ${
          data.personal?.location
            ? `<span data-section="personal" data-index="3">${
                data.personal.location
              }${data.personal?.country ? ", " + data.personal.country : ""}${
                data.personal?.pinCode ? ", " + data.personal.pinCode : ""
              }${
                data.personal?.fullAddress
                  ? ", " + data.personal.fullAddress
                  : ""
              }</span>`
            : ""
        }
        ${
          data.personal?.personalInfoDisplay === "inline"
            ? `
        ${
          data.personal?.fathersName
            ? `<span data-section="personal" data-index="4">Father: ${data.personal.fathersName}</span>`
            : ""
        }
        ${
          data.personal?.dob
            ? `<span data-section="personal" data-index="5">DOB: ${data.personal.dob}</span>`
            : ""
        }
        ${
          data.personal?.gender
            ? `<span data-section="personal" data-index="6">Gender: ${data.personal.gender}</span>`
            : ""
        }
        ${
          data.personal?.maritalStatus
            ? `<span data-section="personal" data-index="7">Marital Status: ${data.personal.maritalStatus}</span>`
            : ""
        }
        ${
          data.personal?.nationality
            ? `<span data-section="personal" data-index="8">Nationality: ${data.personal.nationality}</span>`
            : ""
        }
        `
            : ""
        }
        ${
          data.personal?.linkedinUrl
            ? `<span data-section="personal" data-index="9"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>`
            : ""
        }
        ${
          data.personal?.githubUrl
            ? `<span data-section="personal" data-index="10"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>`
            : ""
        }
        ${
          data.personal?.portfolioUrl
            ? `<span data-section="personal" data-index="11"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>`
            : ""
        }
        ${
          data.personal?.website
            ? `<span data-section="personal" data-index="12"><a href="${data.personal.website}" target="_blank">Website</a></span>`
            : ""
        }
      </div>
    </div>

    ${
      data.personal?.personalInfoDisplay !== "inline" &&
      (data.personal?.fathersName ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo)
        ? `
    <div class="section" data-section="personal">
      <div class="section-title">Personal Details</div>
      <div class="entry-content">
        <ul>
          ${
            data.personal?.fathersName
              ? `<li><strong>Father's Name:</strong> ${data.personal.fathersName}</li>`
              : ""
          }
          ${
            data.personal?.dob
              ? `<li><strong>Date of Birth:</strong> ${data.personal.dob}</li>`
              : ""
          }
          ${
            data.personal?.gender
              ? `<li><strong>Gender:</strong> ${data.personal.gender}</li>`
              : ""
          }
          ${
            data.personal?.maritalStatus
              ? `<li><strong>Marital Status:</strong> ${data.personal.maritalStatus}</li>`
              : ""
          }
          ${
            data.personal?.nationality
              ? `<li><strong>Nationality:</strong> ${data.personal.nationality}</li>`
              : ""
          }
          ${
            data.personal?.passportNo
              ? `<li><strong>Passport No:</strong> ${data.personal.passportNo}</li>`
              : ""
          }
        </ul>
      </div>
    </div>
    `
        : ""
    }

    <!-- Summary -->

    ${
      data.sectionVisibility?.summary !== false && data.summary
        ? `<div class="section" data-section="summary">
      <div class="section-title">Summary</div>
      <p class="entry-content">${data.summary}</p>
    </div>`
        : ""
    }

    <!-- Career Objective -->
    ${
      typeof data.careerObjective === "string" &&
      data.careerObjective.trim().length > 0
        ? `<div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <p class="entry-content">${data.careerObjective}</p>
    </div>`
        : ""
    }

    <!-- Experience -->
    ${
      data.sectionVisibility?.experience !== false &&
      data.experience &&
      data.experience.length > 0
        ? `<div class="section" data-section="experience">
      <div class="section-title">Experience</div>
      ${(data.experience || [])
        .map(
          (exp: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${exp.title || ""}</div>
            <div class="entry-date">${exp.startDate || ""} - ${
            exp.endDate || "Present"
          }</div>
          </div>
          <div class="entry-subtitle">${exp.company || ""}${
            exp.location ? `, ${exp.location}` : ""
          }</div>
          <div class="entry-content">${exp.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Internships -->
    ${
      data.internships && data.internships.length > 0
        ? `<div class="section" data-section="internships">
      <div class="section-title">Internships</div>
      ${(data.internships || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.startDate || ""} - ${
            item.endDate || ""
          }</div>
          </div>
          <div class="entry-subtitle">${item.company || ""}${
            item.location ? `, ${item.location}` : ""
          }</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Education -->
    ${
      data.sectionVisibility?.education !== false &&
      data.education &&
      data.education.length > 0
        ? `<div class="section" data-section="education">
      <div class="section-title">Education</div>
      ${(data.education || [])
        .map(
          (edu: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">
              ${edu.degree || ""}${
            edu.qualification ? ` (${edu.qualification})` : ""
          }
            </div>
            <div class="entry-date">${edu.graduationDate || ""}</div>
          </div>
          ${
            edu.school
              ? `<div class="education-school">${edu.school}</div>`
              : ""
          }
          ${edu.field ? `<div class="education-field">${edu.field}</div>` : ""}
          ${
            edu.location
              ? `<div class="education-location">${edu.location}</div>`
              : ""
          }
          
          ${
            edu.description
              ? `
            <div class="education-description">
              ${
                edu.description.includes("<ul>") ||
                edu.description.includes("<li>")
                  ? edu.description
                  : `<p>${edu.description}</p>`
              }
            </div>
          `
              : ""
          }
          
          ${
            edu.achievements && edu.achievements.length > 0
              ? `
            <div class="education-achievements">
              <h4>Achievements & Highlights</h4>
              <ul>
                ${edu.achievements
                  .filter((achievement: string) => achievement.trim())
                  .map((achievement: string) => `<li>${achievement}</li>`)
                  .join("")}
              </ul>
            </div>
          `
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Projects -->
    ${
      data.sectionVisibility?.projects !== false &&
      data.projects &&
      data.projects.length > 0
        ? `<div class="section" data-section="projects">
      <div class="section-title">Projects</div>
      ${(data.projects || [])
        .map(
          (project: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${project.name || ""}</div>
            ${
              project.startDate || project.endDate
                ? `<div class="entry-date">${project.startDate || ""} ${
                    project.startDate && project.endDate
                      ? `- ${project.endDate}`
                      : project.endDate
                      ? `- ${project.endDate}`
                      : ""
                  }</div>`
                : ""
            }
          </div>
          ${
            project.technologies
              ? `<div class="entry-subtitle">${project.technologies}</div>`
              : ""
          }
          <div class="entry-content">${project.description || ""}</div>
          ${
            project.url
              ? `<div class="entry-content" style="margin-top: 6px;">
            <a href="${project.url}" target="_blank">${
                  project.urlText || project.url
                }</a>
          </div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Skills -->
    ${
      data.sectionVisibility?.skills !== false && data.skills
        ? `<div class="section" data-section="skills">
      <div class="section-title">Skills</div>
      <div class="skills">
        ${(Array.isArray(data.skills)
          ? data.skills
          : (data.skills || "").split(",")
        )
          .map(
            (skill: any, index: number) => `
          <div class="skill-badge" data-section="skills" data-index="${index}">${
              typeof skill === "string" ? skill.trim() : skill
            }</div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Languages -->
    ${
      data.sectionVisibility?.languages !== false &&
      data.languages &&
      data.languages.length > 0
        ? `<div class="section" data-section="languages">
      <div class="section-title">Languages</div>
      <div class="skills">
        ${(data.languages || [])
          .map(
            (lang: any, index: number) => `
          <div class="skill-badge" data-section="languages" data-index="${index}">${
              lang.language || lang
            }${lang.level ? ` (${lang.level})` : ""}</div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Hobbies -->
    ${
      data.sectionVisibility?.hobbies !== false &&
      data.hobbies &&
      data.hobbies.length > 0
        ? `<div class="section" data-section="hobbies">
      <div class="section-title">Hobbies & Interests</div>
      <div class="skills">
        ${(data.hobbies || [])
          .map(
            (hobby: any, index: number) => `
          <div class="skill-badge" data-section="hobbies" data-index="${index}">${hobby}</div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Social Links -->
    ${
      data.sectionVisibility?.socialLinks !== false &&
      data.socialLinks &&
      data.socialLinks.length > 0
        ? `<div class="section" data-section="socialLinks">
      <div class="section-title">Social Links</div>
      <div style="display: flex; flex-wrap: wrap; gap: 15px;">
        ${data.socialLinks
          .map(
            (link: any, index: number) => `
          <a href="${
            link.url
          }" target="_blank" data-section="socialLinks" data-index="${index}">${
              link.urlText ||
              link.url.replace("https://", "").replace("http://", "")
            }</a>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Certifications -->
    ${
      data.sectionVisibility?.certifications !== false &&
      data.certifications &&
      data.certifications.length > 0
        ? `<div class="section" data-section="certifications">
      <div class="section-title">Certifications</div>
      ${(data.certifications || [])
        .map(
          (cert: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${cert.name || ""}</div>
            <div class="entry-date">${cert.date || ""}</div>
          </div>
          <div class="entry-subtitle">${cert.issuer || ""}</div>
          ${
            cert.url
              ? `<div class="entry-content" style="margin-top: 6px;">
            <a href="${cert.url}" target="_blank">View Certificate</a>
          </div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Academic Projects -->
    ${
      data.academicProjects && data.academicProjects.length > 0
        ? `<div class="section" data-section="academicProjects">
      <div class="section-title">Academic Projects</div>
      ${(data.academicProjects || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || item.title || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          ${
            item.institution
              ? `<div class="entry-subtitle">${item.institution}</div>`
              : ""
          }
          <div class="entry-content">${item.description || ""}</div>
          ${
            item.technologies
              ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies}</div>`
              : ""
          }
          ${
            item.url
              ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank">View Project</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Leadership & Positions -->
    ${
      data.leadershipPositions && data.leadershipPositions.length > 0
        ? `<div class="section" data-section="leadershipPositions">
      <div class="section-title">Leadership & Positions</div>
      ${(data.leadershipPositions || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.position || item.title || ""}</div>
            <div class="entry-date">${item.startDate || ""} - ${
            item.endDate || ""
          }</div>
          </div>
          <div class="entry-subtitle">${item.organization || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Training Programs -->
    ${
      data.trainingPrograms && data.trainingPrograms.length > 0
        ? `<div class="section" data-section="trainingPrograms">
      <div class="section-title">Training Programs</div>
      ${(data.trainingPrograms || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-date">${item.completionDate || ""}</div>
          </div>
          <div class="entry-subtitle">${item.provider || item.organization || ""}${
            item.duration ? ` • ${item.duration}` : ""
          }</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Scholarships -->
    ${
      data.scholarships && data.scholarships.length > 0
        ? `<div class="section" data-section="scholarships">
      <div class="section-title">Scholarships</div>
      ${(data.scholarships || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${item.provider || item.organization || ""}${
            item.amount ? ` • ${item.amount}` : ""
          }</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Co-curricular Activities -->
    ${
      data.coCurricular && data.coCurricular.length > 0
        ? `<div class="section" data-section="coCurricular">
      <div class="section-title">Co-curricular Activities</div>
      ${(data.coCurricular || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-date">${
              item.year ||
              (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")
            }</div>
          </div>
          <div class="entry-subtitle">${item.organization || ""}${
            item.role ? ` • ${item.role}` : ""
          }</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Extracurricular Activities -->
    ${
      data.extracurricular && data.extracurricular.length > 0
        ? `<div class="section" data-section="extracurricular">
      <div class="section-title">Extracurricular Activities</div>
      ${(data.extracurricular || [])
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-date">${
              item.year ||
              (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")
            }</div>
          </div>
          <div class="entry-subtitle">${item.organization || ""}${
            item.role ? ` • ${item.role}` : ""
          }</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Key Achievements -->
    ${
      data.keyAchievements && data.keyAchievements.length > 0
        ? `<div class="section" data-section="keyAchievements">
      <div class="section-title">Key Achievements</div>
      <div class="entry-content">
        <ul>
          ${(data.keyAchievements || [])
            .map(
              (achievement: string, index: number) =>
                `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>`
        : ""
    }

    <!-- Key Responsibilities -->
    ${
      data.responsibilities && data.responsibilities.length > 0
        ? `<div class="section" data-section="responsibilities">
      <div class="section-title">Key Responsibilities</div>
      <div class="entry-content">
        <ul>
          ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n")
          )
            .filter((line: string) => line.trim())
            .map(
              (line: string, index: number) =>
                `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>`
        : ""
    }

    <!-- Tools & Technologies -->
    ${
      data.tools && data.tools.length > 0
        ? `<div class="section" data-section="tools">
      <div class="section-title">Tools & Technologies</div>
      <div class="entry-content">
        <ul>
          ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n")
          )
            .filter((line: string) => line.trim())
            .map(
              (line: string, index: number) =>
                `<li data-section="tools" data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>`
        : ""
    }

    <!-- Custom Sections -->
    ${
      data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section: any) => section.isVisible)
            .map(
              (section: any) => `
    <div class="section" data-section="customSections">
      <div class="section-title">${section.heading || "Custom Section"}</div>
      ${
        section.entries && section.entries.length > 0
          ? section.entries
              .filter((entry: any) => entry.isVisible)
              .map(
                (entry: any, entryIndex: number) => `
        <div class="entry" data-index="${entryIndex}">
          <div class="entry-header">
            <div class="entry-title">${entry.title || ""}${
                  entry.title && entry.organization ? " at " : ""
                }${entry.organization || ""}</div>
            ${entry.date ? `<div class="entry-date">${entry.date}</div>` : ""}
          </div>
          ${
            entry.description
              ? `<div class="entry-content">${entry.description}</div>`
              : ""
          }
        </div>
      `
              )
              .join("")
          : '<div style="color: var(--text-light); font-style: italic;">No entries in this section</div>'
      }
    </div>
    `
            )
            .join("")
        : ""
    }
  </div>
</body>
</html>`;
}

// Keep the old function for backward compatibility but redirect to new one
export function buildModernTemplate(data: any, theme?: any): string {
  return buildMinimalTemplate(data, theme);
}
