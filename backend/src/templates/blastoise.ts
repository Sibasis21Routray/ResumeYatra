export function buildBlastoiseTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#0d3b66",
    secondary: "#7f8c8d",
    background: "#ffffff",
    sidebarBg: "#0d3b66",
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
  };

  const currentTheme = theme || defaultTheme;

  const textColor = "#2c3e50";
  const lightText = "#ffffff";
  const mutedColor = "#7f8c8d";
  const borderColor = "#d5d8dc";
  const backgroundColor = currentTheme.background;
  const sidebarBg = "#0d3b66";

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
  const userFontFamily =
    data.formatting?.fontFamily ||
    data.fontFamily ||
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const baseFontSize = userFontSize;
  const nameFontSize = Math.round(userFontSize * 2.4);
  const headingFontSize = Math.round(userFontSize * 1.3);
  const subHeadingFontSize = Math.round(userFontSize * 1.0);

  const contactItems = [];
  if (data.personal?.email) contactItems.push(data.personal.email);
  if (data.personal?.phone) contactItems.push(data.personal.phone);
  if (data.personal?.alternatePhone)
    contactItems.push(data.personal.alternatePhone);
  if (data.personal?.location) contactItems.push(data.personal.location);
  if (data.personal?.country) contactItems.push(data.personal.country);
  if (data.personal?.pinCode) contactItems.push(data.personal.pinCode);
  if (data.personal?.fullAddress) contactItems.push(data.personal.fullAddress);
  if (data.personal?.linkedinUrl)
    contactItems.push(
      `<a href="${
        data.personal.linkedinUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Linkedin: ${data.personal.linkedinUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.githubUrl)
    contactItems.push(
      `<a href="${
        data.personal.githubUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">GitHub: ${data.personal.githubUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.portfolioUrl)
    contactItems.push(
      `<a href="${
        data.personal.portfolioUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Portfolio: ${data.personal.portfolioUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.website)
    contactItems.push(
      `<a href="${
        data.personal.website
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Website: ${data.personal.website
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.twitterUrl)
    contactItems.push(
      `<a href="${
        data.personal.twitterUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Twitter: ${data.personal.twitterUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.facebookUrl)
    contactItems.push(
      `<a href="${
        data.personal.facebookUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Facebook: ${data.personal.facebookUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.instagramUrl)
    contactItems.push(
      `<a href="${
        data.personal.instagramUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Instagram: ${data.personal.instagramUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.behanceUrl)
    contactItems.push(
      `<a href="${
        data.personal.behanceUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Behance: ${data.personal.behanceUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.dribbbleUrl)
    contactItems.push(
      `<a href="${
        data.personal.dribbbleUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Dribbble: ${data.personal.dribbbleUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.stackoverflowUrl)
    contactItems.push(
      `<a href="${
        data.personal.stackoverflowUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Stack Overflow: ${data.personal.stackoverflowUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.mediumUrl)
    contactItems.push(
      `<a href="${
        data.personal.mediumUrl
      }" target="_blank" style="color: ${textColor}; text-decoration: none;">Medium: ${data.personal.mediumUrl
        .replace("https://", "")
        .replace("http://", "")}</a>`
    );
  if (data.personal?.fathersName)
    contactItems.push(`Father's Name: ${data.personal.fathersName}`);
  if (data.personal?.dob) contactItems.push(`DOB: ${data.personal.dob}`);
  if (data.personal?.gender)
    contactItems.push(`Gender: ${data.personal.gender}`);
  if (data.personal?.maritalStatus)
    contactItems.push(`Marital Status: ${data.personal.maritalStatus}`);
  const contactInfo = contactItems.join(" | ");

  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
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
      color: ${textColor};
      line-height: 1.6;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: ${backgroundColor};
      display: grid;
      grid-template-columns: 3fr 1fr;
      min-height: 100vh;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .left-column {
      padding: 40px 35px;
      background: ${backgroundColor};
    }

    .right-column {
      padding: 40px 35px;
      background: ${sidebarBg};
      color: ${lightText};
    }

    .profile-section {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .profile-photo {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
      overflow: hidden;
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name {
      font-size: ${nameFontSize}px;
      font-weight: 700;
      color: ${lightText};
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .role {
      font-size: ${subHeadingFontSize}px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
      margin-bottom: 15px;
    }

    .contact-section {
      margin-bottom: 28px;
    }

    .section-heading {
      font-size: ${Math.round(baseFontSize * 1.0)}px;
      font-weight: 700;
      color: ${lightText};
      margin-bottom: 15px;
      text-transform: capitalize;
      letter-spacing: 0.5px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 10px;
    }

    .contact-item {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      margin-bottom: 10px;
      line-height: 1.5;
      word-break: break-word;
    }

    .contact-item a {
      color: ${lightText};
      text-decoration: none;
    }

    .contact-item a:hover {
      text-decoration: underline;
    }

    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .skill-item {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      line-height: 1.5;
    }

    .hobbies-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .hobby-item {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      line-height: 1.5;
    }

    .hobbies-list li {
      margin-left: 20px;
    }

    .hobbies-list li::marker {
      color: ${lightText};
    }

    .main-section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: ${headingFontSize}px;
      font-weight: 700;
      color: ${textColor};
      text-transform: capitalize;
      margin-bottom: 15px;
      border-bottom: 2px solid ${currentTheme.primary};
      padding-bottom: 8px;
      letter-spacing: 0.3px;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.7;
      color: ${textColor};
      text-align: left;
    }

    .exp-item {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e8e8e8;
    }

    .exp-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .exp-header {
      margin-bottom: 6px;
    }

    .exp-title {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      color: ${textColor};
      margin-bottom: 2px;
    }

    .exp-company {
      font-size: ${baseFontSize}px;
      color: ${mutedColor};
      font-weight: 500;
      margin-bottom: 2px;
    }

    .exp-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: ${mutedColor};
      font-weight: 400;
    }

    .exp-description {
      font-size: ${baseFontSize}px;
      line-height: 1.6;
      color: ${textColor};
      margin-top: 8px;
    }

    .exp-achievements {
      list-style: none;
      margin-top: 8px;
      padding-left: 0;
    }

    .exp-achievements li {
      position: relative;
      padding-left: 16px;
      margin-bottom: 6px;
      font-size: ${baseFontSize}px;
      line-height: 1.5;
      color: ${textColor};
    }

    .exp-achievements li:last-child {
      margin-bottom: 0;
    }

    .exp-achievements li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: ${currentTheme.primary};
      font-weight: bold;
    }

    .exp-achievements b {
      font-weight: 700;
      color: ${textColor};
    }

    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }

      .left-column {
        order: 2;
      }

      .right-column {
        order: 1;
        border-bottom: 2px solid ${borderColor};
      }
    }

    @media print {
      body {
        background: ${sidebarBg};
      }
      .container {
        box-shadow: none;
        max-width: 100%;
      }
      .left-column, .right-column {
        padding: 30px;
      }
      .right-column {
        color: ${lightText};
        background: ${sidebarBg};
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .section-heading {
        color: ${lightText};
        border-bottom-color: #ddd;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="left-column">
      ${
        data.sectionVisibility?.summary !== false &&
        data.summary &&
        data.summary.trim()
          ? `
      <div class="main-section">
        <div class="section-title">Professional Summary</div>
        <p class="summary-text">${data.summary}</p>
      </div>`
          : ""
      }

      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Career Objective</div>
        <p class="summary-text">${data.careerObjective}</p>
      </div>`
          : ""
      }

      ${
        data.internships && data.internships.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Internships</div>
        ${data.internships
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="internships" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-company">${item.company || ""}${
              item.location ? ` - ${item.location}` : ""
            }</div>
              <div class="exp-date">${item.startDate || ""} - ${
              item.endDate || ""
            }</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        contactInfo
          ? `

      <div class="main-section">
        <div class="section-title">Contact Information</div>
        <p class="summary-text" style="font-size: ${Math.round(
          baseFontSize * 0.95
        )}px;">${contactInfo}</p>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Employment History</div>
        ${data.experience
          .map(
            (e: any, index: number) => `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${e.title || ""}</div>
              <div class="exp-company">${e.company || ""}${
              e.location ? ` - ${e.location}` : ""
            }</div>
              <div class="exp-date">${e.startDate || ""} - ${
              e.endDate || "Present"
            }</div>
            </div>
            ${
              e.description
                ? `<p class="exp-description">${e.description}</p>`
                : ""
            }
            ${
              (Array.isArray(e.achievements)
                ? e.achievements
                : (e.achievements || "").split("\n")
              ).filter(
                (achievement: any) =>
                  achievement &&
                  (typeof achievement === "string"
                    ? achievement.trim()
                    : String(achievement).trim())
              ).length > 0
                ? `
              <ul class="exp-achievements">
                ${(Array.isArray(e.achievements)
                  ? e.achievements
                  : (e.achievements || "").split("\n")
                )
                  .filter(
                    (achievement: any) =>
                      achievement &&
                      (typeof achievement === "string"
                        ? achievement.trim()
                        : String(achievement).trim())
                  )
                  .map(
                    (achievement: any, achIndex: number) => `
                  <li data-section="experience" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>
                `
                  )
                  .join("")}
              </ul>
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

      ${
        data.education && data.education.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Education</div>
        ${data.education
          .filter((e: any) => e && (e.degree || e.school))
          .map(
            (e: any, index: number) => `
          <div class="exp-item" data-section="education" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${e.degree || ""}${
              e.qualification ? ` (${e.qualification})` : ""
            }</div>
              <div class="exp-company">${e.school || ""}${
              e.field ? ` - ${e.field}` : ""
            }${e.location ? `, ${e.location}` : ""}</div>
              <div class="exp-date">${e.graduationDate || ""}</div>
            </div>
            ${
              e.description
                ? `<p class="exp-description">${e.description}</p>`
                : ""
            }
            ${
              e.achievements && e.achievements.length > 0
                ? `
              <ul class="exp-achievements">
                ${e.achievements
                  .filter(
                    (achievement: string) => achievement && achievement.trim()
                  )
                  .map(
                    (achievement: string, achIndex: number) => `
                  <li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>
                `
                  )
                  .join("")}
              </ul>
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

      ${
        data.certifications && data.certifications.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Certifications</div>
        ${data.certifications
          .filter((cert: any) => cert && (cert.name || cert.issuer))
          .map(
            (cert: any, index: number) => `
          <div class="exp-item" data-section="certifications" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${cert.name || ""}</div>
              <div class="exp-company">${cert.issuer || ""}</div>
              <div class="exp-date">${cert.date || ""}</div>
            </div>
            ${
              cert.url
                ? `<p class="exp-description"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.academicProjects && data.academicProjects.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Academic Projects</div>
        ${data.academicProjects
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="academicProjects" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || item.title || ""}</div>
              <div class="exp-company">${item.institution || ""}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
            ${
              item.technologies
                ? `<p class="exp-description"><strong>Technologies:</strong> ${item.technologies}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.leadershipPositions && data.leadershipPositions.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Leadership & Positions</div>
        ${data.leadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="leadershipPositions" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.position || item.title || ""}</div>
              <div class="exp-company">${item.organization || ""}</div>
              <div class="exp-date">${item.startDate || ""} - ${
              item.endDate || ""
            }</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.trainingPrograms && data.trainingPrograms.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Training Programs</div>
        ${data.trainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="trainingPrograms" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-company">${
                item.provider || item.organization || ""
              }${item.duration ? ` | ${item.duration}` : ""}</div>
              <div class="exp-date">${item.completionDate || ""}</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.scholarships && data.scholarships.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Scholarships</div>
        ${data.scholarships
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="scholarships" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-company">${
                item.provider || item.organization || ""
              }${item.amount ? ` | ${item.amount}` : ""}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.coCurricular && data.coCurricular.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Co-curricular Activities</div>
        ${data.coCurricular
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="coCurricular" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.activity || ""}</div>
              <div class="exp-company">${item.organization || ""}${
              item.role ? ` | ${item.role}` : ""
            }</div>
              <div class="exp-date">${
                item.year ||
                (item.startDate
                  ? `${item.startDate} - ${item.endDate || ""}`
                  : "")
              }</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.extracurricular && data.extracurricular.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Extracurricular Activities</div>
        ${data.extracurricular
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="extracurricular" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.activity || ""}</div>
              <div class="exp-company">${item.organization || ""}${
              item.role ? ` | ${item.role}` : ""
            }</div>
              <div class="exp-date">${
                item.year ||
                (item.startDate
                  ? `${item.startDate} - ${item.endDate || ""}`
                  : "")
              }</div>
            </div>
            ${
              item.description
                ? `<p class="exp-description">${item.description}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
          ? `

      <div class="main-section">
        <div class="section-title">Projects</div>
        ${data.projects
          .map(
            (project: any, index: number) => `
          <div class="exp-item" data-section="projects" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${project.name || ""}</div>
              <div class="exp-company">${
                project.description ? project.description : ""
              }</div>
              <div class="exp-date">${project.startDate || ""} - ${
              project.endDate || "Present"
            }</div>
            </div>
            ${
              project.technologies
                ? `<p class="exp-description">Technologies: ${project.technologies}</p>`
                : ""
            }
            ${
              project.achievements && project.achievements.length > 0
                ? `
              <ul class="exp-achievements">
                ${project.achievements
                  .filter(
                    (achievement: string) => achievement && achievement.trim()
                  )
                  .map(
                    (achievement: string, achIndex: number) => `
                  <li data-section="projects" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>
                `
                  )
                  .join("")}
              </ul>
            `
                : ""
            }
            ${
              project.url
                ? `<p class="exp-description"><a href="${
                    project.url
                  }" target="_blank" style="color: ${
                    currentTheme.primary
                  }; text-decoration: underline;">${
                    project.urlText || "View Project"
                  }</a></p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Languages</div>
        <ul class="exp-achievements">
          ${data.languages
            .map(
              (lang: any, index: number) => `
            <li data-section="languages" data-index="${index}">${
                lang.language || lang
              }${lang.level ? ` (${lang.level})` : ""}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.keyAchievements && data.keyAchievements.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Key Achievements</div>
        <ul class="exp-achievements">
          ${data.keyAchievements
            .map(
              (achievement: string, index: number) => `
            <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        hasContent(data.responsibilities)
          ? `
      <div class="main-section">
        <div class="section-title">Key Responsibilities</div>
        <ul class="exp-achievements">
          ${getNonEmptyArray(
            Array.isArray(data.responsibilities)
              ? data.responsibilities
              : (data.responsibilities || "").split("\n")
          )
            .map(
              (line: string, index: number) => `
            <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        hasContent(data.tools)
          ? `
      <div class="main-section">
        <div class="section-title">Tools & Technologies</div>
        <ul class="exp-achievements">
          ${getNonEmptyArray(
            Array.isArray(data.tools)
              ? data.tools
              : (data.tools || "").split("\n")
          )
            .map(
              (line: string, index: number) => `
            <li data-section="tools" data-index="${index}">${line.trim()}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
          ? `
      <div class="main-section">
        <div class="section-title">Social Links</div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
          ${data.socialLinks
            .map(
              (link: any, index: number) => `
            <a href="${link.url}" target="_blank" style="color: ${
                currentTheme.primary
              }; text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${
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

      ${
        data.customSections && data.customSections.length > 0
          ? data.customSections
              .filter((section: any) => section.isVisible)
              .map((section: any) => {
                const heading = section.heading || "Custom Section";
                const lowerHeading = heading.toLowerCase();

                if (lowerHeading.includes("language")) {
                  return `
      <div class="main-section">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, index: number) => `
            <li data-section="customSections" data-index="${index}">${
                      entry.language ||
                      entry.title ||
                      entry.organization ||
                      "Language"
                    }${entry.level ? ` (${entry.level})` : ""}</li>
          `
                  )
                  .join("")
              : '<li style="color: #7f8c8d; font-style: italic;">No languages added</li>'
          }
        </ul>
      </div>`;
                } else if (
                  lowerHeading.includes("hobby") ||
                  lowerHeading.includes("interest")
                ) {
                  return `
      <div class="main-section">
        <div class="section-title">${heading}</div>
        <ul class="hobbies-list">
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, index: number) => `
            <li class="hobby-item" data-section="customSections" data-index="${index}">${
                      entry.title ||
                      entry.organization ||
                      entry.description ||
                      "Hobby"
                    }</li>
          `
                  )
                  .join("")
              : '<li style="color: #7f8c8d; font-style: italic;">No hobbies added</li>'
          }
        </ul>
      </div>`;
                } else if (
                  lowerHeading.includes("achievement") ||
                  lowerHeading.includes("award")
                ) {
                  return `
      <div class="main-section">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, index: number) => `
            <li data-section="customSections" data-index="${index}">${
                      entry.title ||
                      entry.organization ||
                      entry.description ||
                      "Achievement"
                    }</li>
          `
                  )
                  .join("")
              : '<li style="color: #7f8c8d; font-style: italic;">No achievements added</li>'
          }
        </ul>
      </div>`;
                } else if (
                  lowerHeading.includes("responsibility") ||
                  lowerHeading.includes("duty")
                ) {
                  return `
      <div class="main-section">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, index: number) => `
            <li data-section="customSections" data-index="${index}">${
                      entry.title ||
                      entry.organization ||
                      entry.description ||
                      "Responsibility"
                    }</li>
          `
                  )
                  .join("")
              : '<li style="color: #7f8c8d; font-style: italic;">No responsibilities added</li>'
          }
        </ul>
      </div>`;
                } else if (
                  lowerHeading.includes("tool") ||
                  lowerHeading.includes("technology")
                ) {
                  return `
      <div class="main-section">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, index: number) => `
            <li data-section="customSections" data-index="${index}">${
                      entry.title ||
                      entry.organization ||
                      entry.description ||
                      "Tool"
                    }</li>
          `
                  )
                  .join("")
              : '<li style="color: #7f8c8d; font-style: italic;">No tools added</li>'
          }
        </ul>
      </div>`;
                } else {
                  return `
      <div class="main-section">
        <div class="section-title">${heading}</div>
        ${
          section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry: any) => entry.isVisible)
                .map(
                  (entry: any, entryIndex: number) => `
          <div class="exp-item" data-section="customSections" data-index="${entryIndex}">
            <div class="exp-header">
              <div class="exp-title">${entry.title || ""}${
                    entry.title && entry.organization ? " at " : ""
                  }${entry.organization || ""}</div>
              <div class="exp-date">${entry.date || ""}</div>
            </div>
            ${
              entry.description
                ? `<p class="exp-description">${entry.description}</p>`
                : ""
            }
          </div>
        `
                )
                .join("")
            : '<div style="color: #7f8c8d; font-style: italic;">No entries in this section</div>'
        }
      </div>`;
                }
              })
              .join("")
          : ""
      }
    </div>

    <div class="right-column">
      <div class="profile-section">
        <div class="profile-photo" data-section="personal">
          ${
            data.personal?.image
              ? `<img src="${data.personal.image}" alt="Profile" />`
              : ""
          }
        </div>
        <div class="name" data-section="personal">
          ${
            data.personal?.name &&
            data.personal?.name !== "undefined" &&
            data.personal?.name.trim()
              ? data.personal.name
              : "Your Name"
          }
        </div>
        ${
          data.personal?.role && data.personal.role.trim()
            ? `
        <div class="role">${data.personal.role}</div>`
            : ""
        }
      </div>

      ${
        data.personal?.email ||
        data.personal?.phone ||
        data.personal?.alternatePhone ||
        data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress ||
        data.personal?.linkedinUrl ||
        data.personal?.githubUrl ||
        data.personal?.portfolioUrl ||
        data.personal?.website ||
        data.personal?.twitterUrl ||
        data.personal?.facebookUrl ||
        data.personal?.instagramUrl ||
        data.personal?.behanceUrl ||
        data.personal?.dribbbleUrl ||
        data.personal?.stackoverflowUrl ||
        data.personal?.mediumUrl
          ? `
      <div class="contact-section">
        <div class="section-heading">Contact</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${
            data.personal?.email
              ? `<div class="contact-item">${data.personal.email}</div>`
              : ""
          }
          ${
            data.personal?.phone
              ? `<div class="contact-item">${data.personal.phone}</div>`
              : ""
          }
          ${
            data.personal?.alternatePhone
              ? `<div class="contact-item">${data.personal.alternatePhone}</div>`
              : ""
          }
          ${
            data.personal?.location ||
            data.personal?.country ||
            data.personal?.pinCode ||
            data.personal?.fullAddress
              ? `<div class="contact-item">${[
                  data.personal?.location,
                  data.personal?.country,
                  data.personal?.pinCode,
                  data.personal?.fullAddress,
                ]
                  .filter(Boolean)
                  .join(", ")}</div>`
              : ""
          }
          ${
            data.personal?.fathersName
              ? `<div class="contact-item">Father's Name: ${data.personal.fathersName}</div>`
              : ""
          }
          ${
            data.personal?.dob
              ? `<div class="contact-item">DOB: ${data.personal.dob}</div>`
              : ""
          }
          ${
            data.personal?.gender
              ? `<div class="contact-item">Gender: ${data.personal.gender}</div>`
              : ""
          }
          ${
            data.personal?.maritalStatus
              ? `<div class="contact-item">Marital Status: ${data.personal.maritalStatus}</div>`
              : ""
          }
          ${
            data.personal?.linkedinUrl
              ? `<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>`
              : ""
          }
          ${
            data.personal?.githubUrl
              ? `<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>`
              : ""
          }
          ${
            data.personal?.portfolioUrl
              ? `<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>`
              : ""
          }
          ${
            data.personal?.website
              ? `<div class="contact-item"><a href="${data.personal.website}" target="_blank">Website</a></div>`
              : ""
          }
          ${
            data.personal?.twitterUrl
              ? `<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>`
              : ""
          }
          ${
            data.personal?.facebookUrl
              ? `<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>`
              : ""
          }
          ${
            data.personal?.instagramUrl
              ? `<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>`
              : ""
          }
          ${
            data.personal?.behanceUrl
              ? `<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>`
              : ""
          }
          ${
            data.personal?.dribbbleUrl
              ? `<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>`
              : ""
          }
          ${
            data.personal?.stackoverflowUrl
              ? `<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>`
              : ""
          }
          ${
            data.personal?.mediumUrl
              ? `<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>`
              : ""
          }
        </div>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.skills !== false &&
        data.skills &&
        (Array.isArray(data.skills)
          ? data.skills.filter(
              (skill: any) =>
                skill && (typeof skill === "string" ? skill.trim() : skill)
            ).length > 0
          : (data.skills || "")
              .split(",")
              .filter((skill: string) => skill.trim()).length > 0)
          ? `
      <div class="contact-section">
        <div class="section-heading">Skills</div>
        <div class="skills-list">
          ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(",")
          )
            .filter(
              (skill: any) =>
                skill && (typeof skill === "string" ? skill.trim() : skill)
            )
            .map(
              (skill: any, index: number) => `
            <div class="skill-item" data-section="skills" data-index="${index}">${
                typeof skill === "string" ? skill.trim() : skill
              }</div>
          `
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      ${
        data.hobbies && Array.isArray(data.hobbies) && data.hobbies.length > 0
          ? `
      <div class="contact-section">
        <div class="section-heading">Hobbies</div>
        <ul class="hobbies-list" data-section="hobbies">
          ${data.hobbies
            .map(
              (hobby: string, index: number) => `
            <li class="hobby-item" data-index="${index}">${hobby}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
    </div>
  </div>
</body>
</html>`;
}
