export function buildSeniorIndividualContributorTemplate(
  data: any,
  theme?: any
): string {
  const defaultTheme = {
    primary: "#2C3E50",
    secondary: "#34495E",
    background: "#ffffff",
    headerBg: "#2C3E50",
    headingFont: "Arial, sans-serif",
    bodyFont: "Arial, sans-serif",
  };
  const currentTheme = theme || defaultTheme;

  const bodyFontSize = "11pt";
  const headingFontSize = "13pt";
  const nameFontSize = "24pt";

  const sortedExperience = data.experience
    ? [...data.experience].sort(
        (a: any, b: any) =>
          new Date(b.startDate || "1900-01-01").getTime() -
          new Date(a.startDate || "1900-01-01").getTime()
      )
    : [];

  const headerBg = currentTheme.headerBg || defaultTheme.headerBg;
  const headerTextColor =
    headerBg.toLowerCase() === "#ffffff" ? "#000000" : "white";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${currentTheme.bodyFont};
      color: #333;
      line-height: 1.5;
      background: #f5f5f5;
    }

    .page {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .header {
      background: ${headerBg};
      color: ${headerTextColor};
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content {
      flex: 1;
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .tagline {
      font-size: 12pt;
      line-height: 1.6;
      opacity: 0.95;
    }

    .photo-placeholder {
      width: 140px;
      height: 140px;
      background: white;
      border-radius: 4px;
      margin-left: 20px;
      flex-shrink: 0;
    }

    .experience-label {
      margin-top: 15px;
      font-weight: bold;
      font-size: 11pt;
    }

    .content-wrapper {
      display: flex;
    }

    .main-content {
      flex: 0 0 65%;
      padding: 30px 40px;
      border-right: 1px solid #e0e0e0;
    }

    .sidebar {
      flex: 0 0 35%;
      padding: 30px 30px;
      background: #fafafa;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #2C3E50;
    }

    .sidebar .section-title {
      font-size: 12pt;
      border-bottom: 2px solid #2C3E50;
      padding-bottom: 5px;
      margin-bottom: 12px;
    }

    .section-content {
      font-size: ${bodyFontSize};
      line-height: 1.6;
    }

    .experience-item {
      margin-bottom: 20px;
    }

    .job-title {
      font-weight: bold;
      font-size: 11.5pt;
      margin-bottom: 4px;
      color: #2C3E50;
    }

    .company-info {
      font-size: 10.5pt;
      color: #555;
      font-style: italic;
      margin-bottom: 8px;
    }

    .experience-item ul {
      margin-left: 18px;
      margin-top: 6px;
    }

    .experience-item li {
      font-size: ${bodyFontSize};
      margin-bottom: 4px;
      line-height: 1.5;
    }

    .contact-item {
      margin-bottom: 10px;
      font-size: 10.5pt;
      line-height: 1.5;
    }

    .contact-label {
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
      color: #2C3E50;
    }

    .skills-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .skills-list li {
      padding: 5px 0;
      padding-left: 15px;
      position: relative;
      font-size: 10.5pt;
    }

    .skills-list li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #2C3E50;
      font-weight: bold;
    }

    .education-item, .cert-item, .training-item {
      margin-bottom: 15px;
    }

    .education-degree, .cert-name, .training-name {
      font-weight: bold;
      font-size: 10.5pt;
      margin-bottom: 3px;
      color: #2C3E50;
    }

    .education-school, .cert-issuer, .training-org {
      font-size: 10pt;
      color: #555;
      margin-bottom: 2px;
    }

    .education-date, .cert-date, .training-date {
      font-size: 10pt;
      color: #777;
    }

    a {
      color: #2C3E50;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media print {
      body {
        background: white;
      }
      .page {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="header" data-section="personal">
    <div class="header-content">
      <div class="name">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "Your Name"
      }</div>
      <div class="tagline">${
        data.summary ||
        "Deliver informed health care decisions, generate business, manages claims & services and other administrative functions."
      }</div>
      ${
        data.experience && data.experience.length > 0
          ? `<div class="experience-label">Total Experience: ${calculateTotalExperience(
              data.experience
            )}</div>`
          : ""
      }
    </div>
    ${
      data.personal?.image
        ? `<img src="${data.personal.image}" alt="${
            data.personal?.name && data.personal?.name !== "undefined"
              ? data.personal.name
              : "Profile Photo"
          }" style="width: 140px; height: 140px; object-fit: cover; border-radius: 4px; margin-left: 20px; flex-shrink: 0;">`
        : '<div class="photo-placeholder"></div>'
    }
  </div>

  <div class="content-wrapper">
    <div class="main-content">

      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `<div class="section" data-section="careerObjective">
        <div class="section-title">Career Objective</div>
        <div class="section-content">${data.careerObjective}</div>
      </div>`
          : ""
      }

      ${
        sortedExperience.length > 0
          ? `<div class="section" data-section="experience">
        <div class="section-title">Work Experience</div>
        ${sortedExperience
          .map(
            (exp: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${exp.title || ""}</div>
            <div class="company-info">${exp.company || ""}${
              exp.company && (exp.startDate || exp.endDate) ? ", " : ""
            }${exp.location || ""}</div>
            <div class="company-info">${exp.startDate || ""} - ${
              exp.endDate || "Present"
            }</div>
            ${
              exp.description
                ? `<ul>${exp.description
                    .split("\n")
                    .filter((line: string) => line.trim())
                    .map((line: string) => `<li>${line.trim()}</li>`)
                    .join("")}</ul>`
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
        <div class="section-title">Internships</div>
        ${data.internships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.company || ""}${
              item.location ? `, ${item.location}` : ""
            }</div>
            <div class="company-info">${item.startDate || ""} - ${
              item.endDate || ""
            }</div>
            ${
              item.description
                ? `<div class="section-content">${item.description}</div>`
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
        data.keyAchievements && data.keyAchievements.length > 0
          ? `<div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <ul class="experience-item">
          ${data.keyAchievements
            .map(
              (achievement: string, index: number) =>
                `<li data-index="${index}">${achievement}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.responsibilities
          ? `<div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <ul class="experience-item">
          ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n")
          )
            .filter((line: string) => line.trim())
            .map(
              (line: string, index: number) =>
                `<li data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
          ? `<div class="section" data-section="projects">
        <div class="section-title">Projects</div>
        ${data.projects
          .map(
            (project: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${project.name || ""}</div>
            <div class="company-info">${project.technologies || ""} | ${
              project.startDate || ""
            } - ${project.endDate || "Present"}</div>
            <div class="section-content">${project.description || ""}</div>
            ${
              project.url
                ? `<div><a href="${project.url}" target="_blank">${
                    project.urlText || "View Project"
                  }</a></div>`
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
          ? `<div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${data.academicProjects
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || item.title || ""}</div>
            <div class="company-info">${item.institution || ""}${
              item.duration ? ` | ${item.duration}` : ""
            }</div>
            <div class="section-content">${item.description || ""}</div>
            ${
              item.technologies
                ? `<div class="company-info" style="margin-top: 4px;"><strong>Technologies:</strong> ${item.technologies}</div>`
                : ""
            }
            ${
              item.url
                ? `<div><a href="${item.url}" target="_blank">View Project</a></div>`
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
        <div class="section-title">Leadership & Positions</div>
        ${data.leadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.position || item.title || ""}</div>
            <div class="company-info">${item.organization || ""}</div>
            <div class="company-info">${item.startDate || ""} - ${
              item.endDate || ""
            }</div>
            <div class="section-content">${item.description || ""}</div>
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
        <div class="section-title">Training Programs</div>
        ${data.trainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || ""}</div>
            <div class="company-info">${item.provider || item.organization || ""}</div>
            <div class="company-info">${item.completionDate || ""}${
              item.duration ? ` | ${item.duration}` : ""
            }</div>
            <div class="section-content">${item.description || ""}</div>
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
        <div class="section-title">Scholarships</div>
        ${data.scholarships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || ""}</div>
            <div class="company-info">${item.provider || item.organization || ""}</div>
            <div class="company-info">${item.year || ""}${
              item.amount ? ` | ${item.amount}` : ""
            }</div>
            <div class="section-content">${item.description || ""}</div>
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
        <div class="section-title">Co-curricular Activities</div>
        ${data.coCurricular
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.activity || ""}</div>
            <div class="company-info">${item.organization || ""}</div>
            <div class="company-info">${
              item.year ||
              (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")
            }</div>
            ${
              item.role
                ? `<div class="company-info"><strong>Role:</strong> ${item.role}</div>`
                : ""
            }
            <div class="section-content">${item.description || ""}</div>
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
        <div class="section-title">Extracurricular Activities</div>
        ${data.extracurricular
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.activity || ""}</div>
            <div class="company-info">${item.organization || ""}</div>
            <div class="company-info">${
              item.year ||
              (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")
            }</div>
            ${
              item.role
                ? `<div class="company-info"><strong>Role:</strong> ${item.role}</div>`
                : ""
            }
            <div class="section-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
    </div>

    <div class="sidebar">
      <div class="section" data-section="contact">
        <div class="section-title">Contact</div>
        ${
          data.personal?.phone
            ? `<div class="contact-item">
          <span class="contact-label">Phone</span>
          ${data.personal.phone}${
                data.personal?.alternatePhone
                  ? ` / ${data.personal.alternatePhone}`
                  : ""
              }
        </div>`
            : ""
        }
        ${
          data.personal?.email
            ? `<div class="contact-item">
          <span class="contact-label">E-mail</span>
          <a href="mailto:${data.personal.email}">${data.personal.email}</a>
        </div>`
            : ""
        }
        ${
          data.personal?.location ||
          data.personal?.country ||
          data.personal?.pinCode ||
          data.personal?.fullAddress
            ? `<div class="contact-item">
          ${[
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>`
            : ""
        }
        ${
          data.personal?.linkedinUrl
            ? `<div class="contact-item">
          <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn Profile</a>
        </div>`
            : ""
        }
        ${
          data.personal?.githubUrl
            ? `<div class="contact-item">
          <a href="${data.personal.githubUrl}" target="_blank">GitHub Profile</a>
        </div>`
            : ""
        }
      ${
        data.personal?.portfolioUrl
          ? `<div class="contact-item">
          <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a>
        </div>`
          : ""
      }
        ${
          data.personal?.personalInfoDisplay === "inline" &&
          (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
            ? `
        ${
          data.personal?.fathersName
            ? `<div class="contact-item">
          <span class="contact-label">Father's Name</span>
          ${data.personal.fathersName}
        </div>`
            : ""
        }
        ${
          data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-item">
          <span class="contact-label">Date of Birth</span>
          ${data.personal?.dateOfBirth || data.personal?.dob}
        </div>`
            : ""
        }
        ${
          data.personal?.gender
            ? `<div class="contact-item">
          <span class="contact-label">Gender</span>
          ${data.personal.gender}
        </div>`
            : ""
        }
        ${
          data.personal?.maritalStatus
            ? `<div class="contact-item">
          <span class="contact-label">Marital Status</span>
          ${data.personal.maritalStatus}
        </div>`
            : ""
        }
        ${
          data.personal?.nationality
            ? `<div class="contact-item">
          <span class="contact-label">Nationality</span>
          ${data.personal.nationality}
        </div>`
            : ""
        }
        `
            : ""
        }
      </div>

      ${
        data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
          data.personal?.dateOfBirth ||
          data.personal?.dob ||
          data.personal?.gender ||
          data.personal?.maritalStatus ||
          data.personal?.nationality ||
          data.personal?.passportNo)
          ? `<div class="section" data-section="personal">
        <div class="section-title">Personal Details</div>
        ${
          data.personal?.fathersName
            ? `<div class="contact-item">
          <span class="contact-label">Father's Name</span>
          ${data.personal.fathersName}
        </div>`
            : ""
        }
        ${
          data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-item">
          <span class="contact-label">Date of Birth</span>
          ${data.personal?.dateOfBirth || data.personal?.dob}
        </div>`
            : ""
        }
        ${
          data.personal?.gender
            ? `<div class="contact-item">
          <span class="contact-label">Gender</span>
          ${data.personal.gender}
        </div>`
            : ""
        }
        ${
          data.personal?.maritalStatus
            ? `<div class="contact-item">
          <span class="contact-label">Marital Status</span>
          ${data.personal.maritalStatus}
        </div>`
            : ""
        }
        ${
          data.personal?.nationality
            ? `<div class="contact-item">
          <span class="contact-label">Nationality</span>
          ${data.personal.nationality}
        </div>`
            : ""
        }
        ${
          data.personal?.passportNo
            ? `<div class="contact-item">
          <span class="contact-label">Passport No</span>
          ${data.personal.passportNo}
        </div>`
            : ""
        }
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.skills !== false && data.skills
          ? `<div class="section" data-section="skills">

        <div class="section-title">Skills</div>
        <ul class="skills-list">
          ${(Array.isArray(data.skills) ? data.skills : data.skills.split(","))
            .slice(0, 20)
            .map((skill: string) => `<li>${skill.trim()}</li>`)
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.tools
          ? `<div class="section" data-section="tools">
        <div class="section-title">Tools & Technologies</div>
        <ul class="skills-list">
          ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n")
          )
            .filter((line: string) => line.trim())
            .map(
              (line: string, index: number) =>
                `<li data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
          ? `<div class="section" data-section="education">
        <div class="section-title">Training</div>
        ${data.education
          .map(
            (edu: any, index: number) => `
          <div class="training-item" data-index="${index}">
            <div class="training-name">${edu.degree || ""}${
              edu.qualification ? ` (${edu.qualification})` : ""
            }</div>
            ${
              edu.school
                ? `<div class="training-org">${edu.school}${
                    edu.location ? `, ${edu.location}` : ""
                  }</div>`
                : ""
            }
            ${
              edu.graduationDate
                ? `<div class="training-date">${edu.graduationDate}</div>`
                : ""
            }
            ${
              edu.field
                ? `<div class="education-school">${edu.field}</div>`
                : ""
            }
            ${
              edu.description
                ? `<div style="font-size: 10pt; margin-top: 4px;">${edu.description}</div>`
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
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
          ? `<div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${data.certifications
          .map(
            (cert: any, index: number) => `
          <div class="cert-item" data-section="certifications" data-index="${index}">
            <div class="cert-name">${cert.name || ""}</div>
            <div class="cert-issuer">${cert.issuer || ""}</div>
            ${cert.date ? `<div class="cert-date">${cert.date}</div>` : ""}
            ${
              cert.url
                ? `<div style="margin-top: 4px;"><a href="${cert.url}" target="_blank">View Certificate</a></div>`
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
          ? `<div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <ul class="skills-list">
          ${data.languages
            .map(
              (lang: any) =>
                `<li>${lang.language || lang}${
                  lang.level ? ` (${lang.level})` : ""
                }</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
          ? `<div class="section" data-section="hobbies">
        <div class="section-title">Hobbies</div>
        <ul class="skills-list">
          ${data.hobbies.map((hobby: string) => `<li>${hobby}</li>`).join("")}
        </ul>
      </div>`
          : ""
      }

      ${
        data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
          ? `<div class="section" data-section="socialLinks">
        <div class="section-title">Social Links</div>
        ${data.socialLinks
          .map(
            (link: any) =>
              `<div class="contact-item"><a href="${
                link.url
              }" target="_blank">${
                link.urlText ||
                link.url.replace("https://", "").replace("http://", "")
              }</a></div>`
          )
          .join("")}
      </div>`
          : ""
      }
    </div>
  </div>

  ${
    data.customSections && data.customSections.length > 0
      ? `<div style="padding: 30px 40px; border-top: 1px solid #e0e0e0;">
    ${data.customSections
      .filter((section: any) => section.isVisible)
      .map(
        (section: any, sectionIndex: number) => `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-title">${section.heading}</div>
      ${section.entries
        .filter((entry: any) => entry.isVisible)
        .map(
          (entry: any, entryIndex: number) => `
        <div class="experience-item" data-index="${entryIndex}">
          <div class="job-title">${entry.title || ""}</div>
          <div class="company-info">${entry.organization || ""}${
            entry.date ? ` | ${entry.date}` : ""
          }</div>
          ${
            entry.description
              ? `<div class="section-content">${entry.description}</div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
    `
      )
      .join("")}
  </div>`
      : ""
  }
</div>
</body>
</html>`;
}

function calculateTotalExperience(experience: any[]): string {
  if (!experience || experience.length === 0) return "0 years";

  let totalMonths = 0;

  experience.forEach((exp) => {
    const start = new Date(exp.startDate || "1900-01-01");
    const end =
      exp.endDate && exp.endDate.toLowerCase() !== "present"
        ? new Date(exp.endDate)
        : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    totalMonths += months;
  });

  const years = Math.floor(totalMonths / 12);
  return `${years}+ years`;
}
