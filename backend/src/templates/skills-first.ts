export function buildSkillsFirstTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#000000",
    secondary: "#444444",
    background: "#ffffff",
    accent: "#f3f3f3",
    headingFont: "Arial, sans-serif",
    bodyFont: "Arial, sans-serif",
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = "10pt";
  const headingFontSize = "12pt";
  const nameFontSize = "24pt";

  // Helper function to check if a section has content
  const hasResponsibilitiesContent =
    (Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
    ).filter((line: string) => line.trim()).length > 0;
  const hasToolsContent =
    data.tools &&
    (Array.isArray(data.tools)
      ? data.tools.length > 0
      : (data.tools || "").trim().length > 0);
  const hasExpertiseContent =
    data.keyAchievements && data.keyAchievements.length > 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --bg-color: ${currentTheme.background};
      --accent-color: ${currentTheme.accent};
    }

    body {
      font-family: ${currentTheme.bodyFont};
      color: var(--primary-color);
      line-height: 1.3;
      margin: 0; padding: 0;
      background: white;
    }

    .header {
      background-color: #EAEAEA;
      text-align: center;
      padding: 40px 20px;
      margin-bottom: 20px;
      border-radius: 0 0 40px 40px;
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .title-sub {
      font-size: 14pt;
      color: var(--secondary-color);
    }

    .main-grid {
      display: flex;
      padding: 0 40px 40px 40px;
    }

    .sidebar {
      width: 30%;
      padding-right: 25px;
    }

    .sidebar-box {
      background-color: var(--accent-color);
      padding: 15px;
      margin-bottom: 1px; /* Creates the thin separation seen in image */
    }

    .content-main {
      width: 70%;
      padding-left: 25px;
    }

    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 15px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .contact-item {
      font-size: 9pt;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }

    /* Experience styling with horizontal lines */
    .exp-item { margin-bottom: 20px; }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10pt;
    }
    .line-spacer {
      flex-grow: 1;
      height: 1px;
      background: #ccc;
      margin: 0 10px;
    }
    .role-title {
      font-size: 9pt;
      font-style: italic;
      margin-bottom: 5px;
    }

    /* Skill Bars */
    .skill-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      margin-bottom: 8px;
    }
    .skill-track {
      width: 50px;
      height: 4px;
      background: #ddd;
      position: relative;
    }
    .skill-fill {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 70%;
      background: #555;
    }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(255,255,255,0.7);
      border-left: 3px solid #666;
      border-radius: 2px;
    }

    .education-degree {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .education-field {
      font-weight: 600;
      color: var(--secondary-color);
      margin-bottom: 3px;
      font-size: 8.5pt;
    }

    .education-school {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .education-location {
      color: var(--secondary-color);
      font-style: italic;
      margin-bottom: 5px;
      font-size: 8pt;
    }

    .education-date {
      font-size: 8pt;
      color: #666;
      margin-bottom: 5px;
    }

    .education-description {
      font-size: 8pt;
      color: var(--secondary-color);
      line-height: 1.4;
      margin-top: 6px;
      padding: 6px;
      background: rgba(255,255,255,0.9);
      border-radius: 3px;
      border: 1px solid #e0e0e0;
    }

    .education-description ul {
      margin: 4px 0 4px 15px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 2px 0;
      color: var(--secondary-color);
    }

    .education-description b {
      font-weight: bold;
      color: var(--primary-color);
    }

    .education-achievements {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #d0d0d0;
    }

    .education-achievements h4 {
      font-size: 8pt;
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 4px;
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
      padding-left: 12px;
      margin-bottom: 2px;
      color: var(--secondary-color);
      font-size: 8pt;
    }

    .education-achievements li:before {
      content: "⚡";
      position: absolute;
      left: 0;
      font-size: 7pt;
    }

    p, li { font-size: ${bodyFontSize}; }
    ul { padding-left: 18px; margin-top: 5px; }
  </style>
</head>
<body>
  <div class="header" data-section="personal">
    <div class="name" data-section="personal">${
      data.personal?.name || "YOUR NAME"
    }</div>
    ${
      data.experience?.[0]?.title
        ? `<div class="title-sub">${data.experience[0].title}</div>`
        : ""
    }
  </div>

  <div class="main-grid">
    <div class="sidebar">
      ${
        data.personal?.fathersName ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus
          ? `<div class="sidebar-box" data-section="personal">
        <div class="section-title" style="border:none;">PERSONAL DETAILS</div>
        <div style="font-size: 9pt; color: var(--secondary-color); display: flex; flex-direction: column; gap: 6px;">
          ${
            data.personal?.fathersName
              ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>`
              : ""
          }
          ${
            data.personal?.dob
              ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>`
              : ""
          }
          ${
            data.personal?.gender
              ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>`
              : ""
          }
          ${
            data.personal?.maritalStatus
              ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>`
              : ""
          }
        </div>
      </div>`
          : ""
      }

      <div class="sidebar-box" style="background: none; padding-left: 0;" data-section="personal">
        <div class="contact-item" data-section="personal" data-index="0">📞 ${
          data.personal?.phone || ""
        }</div>
        ${
          data.personal?.alternatePhone
            ? `<div class="contact-item" data-section="personal" data-index="1">📱 ${data.personal.alternatePhone}</div>`
            : ""
        }
        ${
          data.personal?.location ||
          data.personal?.country ||
          data.personal?.pinCode ||
          data.personal?.fullAddress
            ? `<div class="contact-item" data-section="personal" data-index="2">📍 ${[
                data.personal?.location,
                data.personal?.country,
                data.personal?.pinCode,
                data.personal?.fullAddress,
              ]
                .filter(Boolean)
                .join(", ")}</div>`
            : ""
        }
        <div class="contact-item" data-section="personal" data-index="5">✉️ ${
          data.personal?.email || ""
        }</div>
        ${
          data.personal?.linkedinUrl
            ? `<div class="contact-item" data-section="personal" data-index="6">🔗 <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>`
            : ""
        }
        ${
          data.personal?.githubUrl
            ? `<div class="contact-item" data-section="personal" data-index="7">💻 <a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>`
            : ""
        }
        ${
          data.personal?.portfolioUrl
            ? `<div class="contact-item" data-section="personal" data-index="8">🌐 <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>`
            : ""
        }
        ${
          data.personal?.website
            ? `<div class="contact-item" data-section="personal" data-index="9">🌐 <a href="${data.personal.website}" target="_blank">Website</a></div>`
            : ""
        }
      </div>

      ${
        data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
          ? `
      <div class="sidebar-box" data-section="socialLinks">
        <div class="section-title" style="border:none;">SOCIAL LINKS</div>
        ${data.socialLinks
          .map(
            (link: any, index: number) => `
          <div class="contact-item" data-section="socialLinks" data-index="${index}">🔗 <a href="${
              link.url
            }" target="_blank">${
              link.urlText ||
              link.url.replace("https://", "").replace("http://", "")
            }</a></div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
          ? `
      <div class="sidebar-box" data-section="education">
        <div class="section-title" style="border:none;">EDUCATION</div>
        ${data.education
          .map(
            (edu: any, index: number) => `
          <div class="education-entry" data-section="education" data-index="${index}">
            <div class="education-degree" data-section="education" data-index="${index}">
              ${edu.degree || ""}${
              edu.qualification ? ` (${edu.qualification})` : ""
            }
            </div>
            
            ${
              edu.field
                ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>`
                : ""
            }
            ${
              edu.school
                ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>`
                : ""
            }
            ${
              edu.location
                ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>`
                : ""
            }
            <div class="education-date" data-section="education" data-index="${index}">${
              edu.graduationDate || ""
            }</div>
            
            ${
              edu.description
                ? `
              <div class="education-description" data-section="education" data-index="${index}">
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
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Excellence</h4>
                <ul>
                  ${edu.achievements
                    .filter((achievement: string) => achievement.trim())
                    .map(
                      (achievement: string, achIndex: number) =>
                        `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                    )
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

    

      ${
        hasExpertiseContent
          ? `
      <div class="sidebar-box" data-section="expertise">
        <div class="section-title" style="border:none;">EXPERTISE</div>
        ${data.keyAchievements
          .slice(0, 4)
          .map(
            (item: any, index: number) => `
          <div class="skill-row" data-section="keyAchievements" data-index="${index}"><span>${item}</span><div class="skill-track"><div class="skill-fill"></div></div></div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
    </div>

    <div class="content-main">
      ${
        data.summary
          ? `
      <div class="section" data-section="summary">
        <div class="section-title">ABOUT ME</div>
        <p>${data.summary}</p>
      </div>`
          : ""
      }

      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title">CAREER OBJECTIVE</div>
        <p>${data.careerObjective}</p>
      </div>`
          : ""
      }

      ${
        (data.skills && data.skills.length > 0) || (typeof data.skills === "string" && data.skills.trim().length > 0)
          ? `<div class="section" data-section="skills">
        <div class="section-title">SKILLS</div>
        ${
          Array.isArray(data.skills)
            ? `<ul style="columns: 2; column-gap: 30px; list-style: none; padding: 0; margin: 0;">
              ${data.skills
                .map(
                  (skill: any, index: number) => `
                <li style="font-size: 9pt; margin-bottom: 6px; break-inside: avoid;" data-section="skills" data-index="${index}">• ${typeof skill === "string" ? skill : skill}</li>
              `
                )
                .join("")}
            </ul>`
            : `<p style="font-size: 9pt;">${data.skills}</p>`
        }
      </div>`
          : ""
      }

      ${
        data.experience && data.experience.length > 0
          ? `
      <div class="section" data-section="experience">
        <div class="section-title">WORK EXPERIENCE</div>
        ${data.experience
          .map(
            (exp: any, index: number) => `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <span>${exp.company || ""}</span>
              <div class="line-spacer"></div>
              <span>${exp.startDate || ""} - ${exp.endDate || "NOW"}</span>
            </div>
            <div class="role-title">${exp.title || ""}</div>
            <p>${exp.description || ""}</p>
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
    ? `<div class="section" data-section="projects">
        <div class="section-title">PROJECTS</div>
        ${data.projects
          .map(
            (project: any, index: number) => `
          <div style="margin-bottom: 15px;" data-section="projects" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">${
              project.name || ""
            }${project.technologies ? ` | ${project.technologies}` : ""} | ${
              project.startDate || ""
            } - ${project.endDate || "Present"}</div>
            <p style="font-size: 9pt;">${project.description || ""}</p>
            ${
              project.url
                ? `<p style="font-size: 8pt;"><a href="${
                    project.url
                  }" target="_blank">${
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
        data.internships && data.internships.length > 0
          ? `<div class="section" data-section="internships">
        <div class="section-title">INTERNSHIPS</div>
        ${data.internships
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="internships" data-index="${index}">
            <div class="exp-header">
              <span>${item.title || ""}</span>
              <div class="line-spacer"></div>
              <span>${item.startDate || ""} - ${item.endDate || ""}</span>
            </div>
            <div class="role-title">${item.company || ""}${
              item.location ? `, ${item.location}` : ""
            }</div>
            <p>${item.description || ""}</p>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.academicProjects && data.academicProjects.length > 0
          ? `<div class="section" data-section="academicProjects">
        <div class="section-title">ACADEMIC PROJECTS</div>
        ${data.academicProjects
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="academicProjects" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || item.title || ""}</span>
              <div class="line-spacer"></div>
              <span>${item.duration || ""}</span>
            </div>
            <div class="role-title">${item.institution || ""}${
              item.course ? ` | ${item.course}` : ""
            }</div>
            <p>${item.description || ""}</p>
            ${
              item.technologies
                ? `<p style="font-size: 9pt;"><strong>Technologies:</strong> ${
                    Array.isArray(item.technologies)
                      ? item.technologies.join(", ")
                      : item.technologies
                  }</p>`
                : ""
            }
            ${
              item.url
                ? `<p style="font-size: 8pt;"><a href="${item.url}" target="_blank">View Project</a></p>`
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
          ? `<div class="section" data-section="leadershipPositions">
        <div class="section-title">LEADERSHIP & POSITIONS</div>
        ${data.leadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="leadershipPositions" data-index="${index}">
            <div class="exp-header">
              <span>${item.position || item.title || ""}</span>
              <div class="line-spacer"></div>
              <span>${item.startDate || ""} - ${item.endDate || ""}</span>
            </div>
            <div class="role-title">${item.organization || ""}</div>
            <p>${item.description || ""}</p>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.trainingPrograms && data.trainingPrograms.length > 0
          ? `<div class="section" data-section="trainingPrograms">
        <div class="section-title">TRAINING PROGRAMS</div>
        ${data.trainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="trainingPrograms" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || ""}</span>
              <div class="line-spacer"></div>
              <span>${item.completionDate || ""}</span>
            </div>
            <div class="role-title">${
              item.provider || item.organization || ""
            }${item.duration ? ` | ${item.duration}` : ""}</div>
            <p>${item.description || ""}</p>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.scholarships && data.scholarships.length > 0
          ? `<div class="section" data-section="scholarships">
        <div class="section-title">SCHOLARSHIPS</div>
        ${data.scholarships
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="scholarships" data-index="${index}">
            <div class="exp-header">
              <span>${item.name || ""}</span>
              <div class="line-spacer"></div>
              <span>${item.year || ""}</span>
            </div>
            <div class="role-title">${
              item.provider || item.organization || ""
            }${item.amount ? ` | ${item.amount}` : ""}</div>
            <p>${item.description || ""}</p>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.coCurricular && data.coCurricular.length > 0
          ? `<div class="section" data-section="coCurricular">
        <div class="section-title">CO-CURRICULAR ACTIVITIES</div>
        ${data.coCurricular
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="coCurricular" data-index="${index}">
            <div class="exp-header">
              <span>${item.activity || ""}</span>
              <div class="line-spacer"></div>
              <span>${
                item.year ||
                (item.startDate
                  ? `${item.startDate} - ${item.endDate || ""}`
                  : "")
              }</span>
            </div>
            <div class="role-title">${item.organization || ""}${
              item.role ? ` | ${item.role}` : ""
            }</div>
            <p>${item.description || ""}</p>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.extracurricular && data.extracurricular.length > 0
          ? `<div class="section" data-section="extracurricular">
        <div class="section-title">EXTRACURRICULAR ACTIVITIES</div>
        ${data.extracurricular
          .map(
            (item: any, index: number) => `
          <div class="exp-item" data-section="extracurricular" data-index="${index}">
            <div class="exp-header">
              <span>${item.activity || ""}</span>
              <div class="line-spacer"></div>
              <span>${
                item.year ||
                (item.startDate
                  ? `${item.startDate} - ${item.endDate || ""}`
                  : "")
              }</span>
            </div>
            <div class="role-title">${item.organization || ""}${
              item.role ? ` | ${item.role}` : ""
            }</div>
            <p>${item.description || ""}</p>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
          ? `<div class="section" data-section="certifications">
        <div class="section-title">CERTIFICATIONS</div>
        ${data.certifications
          .map(
            (cert: any, index: number) => `
          <div style="margin-bottom: 10px;" data-section="certifications" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${
              cert.name || ""
            }</div>
            <div style="font-size: 8pt;">${cert.issuer || ""} ${
              cert.date ? `| ${cert.date}` : ""
            }</div>
            ${
              cert.url
                ? `<p style="font-size: 8pt;"><a href="${cert.url}" target="_blank">View Certificate</a></p>`
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
        data.awards && data.awards.length > 0
          ? `<div class="section" data-section="awards">
        <div class="section-title">AWARDS</div>
        ${data.awards
          .map(
            (award: any, index: number) => `
          <div class="exp-item" data-section="awards" data-index="${index}">
            <div class="exp-header">
              <span>${award.title || ""}</span>
              <div class="line-spacer"></div>
              <span>${award.issueYear || ""}</span>
            </div>
            <div class="role-title">${award.organization || ""}</div>
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
          ? `<div class="section" data-section="languages">
        <div class="section-title">LANGUAGES</div>
        <p style="font-size: 9pt;">${data.languages
          .map(
            (lang: any) =>
              `${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}`
          )
          .join(", ")}</p>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
          ? `<div class="section" data-section="hobbies">
        <div class="section-title">HOBBIES & INTERESTS</div>
        <p style="font-size: 9pt;">${data.hobbies.join(", ")}</p>
      </div>`
          : ""
      }

      ${
        data.keyAchievements && data.keyAchievements.length > 0
          ? `<div class="section" data-section="keyAchievements">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        <ul>
          ${data.keyAchievements
            .map(
              (achievement: string, index: number) =>
                `<li style="font-size: 9pt;" data-section="keyAchievements" data-index="${index}">${achievement}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        hasResponsibilitiesContent
          ? `<div class="section" data-section="responsibilities">
        <div class="section-title">KEY RESPONSIBILITIES</div>
        <ul>
          ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n")
          )
            .filter((line: string) => line.trim())
            .map(
              (line: string, index: number) =>
                `<li style="font-size: 9pt;" data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        hasToolsContent
          ? `<div class="section" data-section="tools">
        <div class="section-title">TOOLS & TECHNOLOGIES</div>
        <p style="font-size: 9pt;">${
          Array.isArray(data.tools) ? data.tools.join(", ") : data.tools
        }</p>
      </div>`
          : ""
      }

      ${
        data.references
          ? `
     <div class="section" data-section="references">
       <div class="section-title">REFERENCE</div>
       <div style="display: flex; gap: 20px; font-size: 8pt;">
         ${data.references}
       </div>
     </div>`
          : ""
      }

      ${
        data.customSections && data.customSections.length > 0
          ? data.customSections
              .filter(
                (section: any) =>
                  section.isVisible &&
                  section.entries &&
                  section.entries.length > 0 &&
                  section.entries.some((entry: any) => entry.isVisible)
              )
              .map(
                (section: any, sectionIndex: number) => `
     <div class="section" data-section="customSections">
       <div class="section-title">${section.heading || "Custom Section"}</div>
       ${section.entries
         .filter((entry: any) => entry.isVisible)
         .map(
           (entry: any, entryIndex: number) => `
         <div style="margin-bottom: 10px;" data-section="customSections" data-index="${entryIndex}">
           <div style="font-weight: bold; font-size: 10pt;">${
             entry.title || ""
           }${entry.organization ? ` | ${entry.organization}` : ""}${
             entry.date ? ` | ${entry.date}` : ""
           }</div>
           ${
             entry.description
               ? `<p style="font-size: 9pt;">${entry.description}</p>`
               : ""
           }
         </div>
       `
         )
         .join("")}
     </div>
     `
              )
              .join("")
          : ""
      }
    </div>
  </div>
</body>
</html>`;
}
