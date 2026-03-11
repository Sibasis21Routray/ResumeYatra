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

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .professional-context-item {
      margin-bottom: 8px;
      font-size: 10.5pt;
    }

    .professional-context-label {
      font-weight: bold;
      color: #2C3E50;
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
  <!-- Header with Personal Information -->
  <div class="header" data-section="personal">
    <div class="header-content">
      <div class="name">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "Your Name"
      }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
      <div class="tagline">${
        data.careerObjective ||
        data.summary ||
        "Professional with diverse experience"
      }</div>
      ${
        data.professionalContext?.totalExperience
          ? `<div class="experience-label">Total Experience: ${data.professionalContext.totalExperience}</div>`
          : data.experience && data.experience.length > 0
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
      <!-- Career Objective -->
      ${
        data.careerObjective && data.careerObjective.trim().length > 0
          ? `<div class="section" data-section="careerObjective">
        <div class="section-title">Career Objective</div>
        <div class="section-content">${data.careerObjective}</div>
      </div>`
          : ""
      }

      <!-- Summary -->
      ${
        data.summary && data.summary.trim().length > 0 && !data.careerObjective
          ? `<div class="section" data-section="summary">
        <div class="section-title">Summary</div>
        <div class="section-content">${data.summary}</div>
      </div>`
          : ""
      }

      <!-- Work Experience -->
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
              exp.location ? `, ${exp.location}` : ""
            }</div>
            <div class="company-info">${exp.startDate || ""} - ${
              exp.endDate || (exp.isCurrent ? "Present" : "")
            }</div>
            ${
              exp.description
                ? `<div class="section-content" style="margin-top: 5px;">${exp.description}</div>`
                : ""
            }
            ${
              exp.achievements
                ? `<div style="margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</div>`
                : ""
            }
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
        ${data.internships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.company || ""}</div>
            <div class="company-info">${item.duration || ""}</div>
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

      <!-- Training Programs -->
      ${
        data.trainingPrograms && data.trainingPrograms.length > 0
          ? `<div class="section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${data.trainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || ""}</div>
            <div class="company-info">${item.provider || ""}${
              item.duration ? ` | ${item.duration}` : ""
            }</div>
            <div class="company-info">${item.completionDate || ""}</div>
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

      <!-- Academic Projects -->
      ${
        data.academicProjects && data.academicProjects.length > 0
          ? `<div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${data.academicProjects
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || ""}</div>
            <div class="company-info">${item.course || ""}${
              item.institution ? ` | ${item.institution}` : ""
            }</div>
            <div class="company-info">${item.duration || ""}</div>
            ${
              item.description
                ? `<div class="section-content">${item.description}</div>`
                : ""
            }
            ${
              item.technologies && item.technologies.length > 0
                ? `<div style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies.join(
                    ", "
                  )}</div>`
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

      <!-- Leadership Positions -->
      ${
        data.leadershipPositions && data.leadershipPositions.length > 0
          ? `<div class="section" data-section="leadershipPositions">
        <div class="section-title">Leadership Positions</div>
        ${data.leadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.position || ""}</div>
            <div class="company-info">${item.organization || ""}</div>
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

      <!-- Client Projects -->
      ${
        data.clientProjects && data.clientProjects.length > 0
          ? `<div class="section" data-section="clientProjects">
        <div class="section-title">Client Projects</div>
        ${data.clientProjects
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || ""}</div>
            <div class="company-info">${item.clientOrganization || ""}${
              item.role ? ` | Role: ${item.role}` : ""
            }</div>
            <div class="company-info">${item.duration || ""}</div>
            ${
              item.description
                ? `<div class="section-content">${item.description}</div>`
                : ""
            }
            ${
              item.toolsTechnologies
                ? `<div style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>`
                : ""
            }
            ${
              item.projectUrl
                ? `<div><a href="${item.projectUrl}" target="_blank">View Project</a></div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Portfolio -->
      ${
        data.portfolio && data.portfolio.length > 0
          ? `<div class="section" data-section="portfolio">
        <div class="section-title">Portfolio</div>
        ${data.portfolio
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.name || ""}</div>
            <div class="company-info">${item.type || ""}${
              item.platform ? ` | ${item.platform}` : ""
            }</div>
            ${
              item.description
                ? `<div class="section-content">${item.description}</div>`
                : ""
            }
            ${
              item.url
                ? `<div><a href="${item.url}" target="_blank">View Portfolio</a></div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Volunteering -->
      ${
        data.volunteering && data.volunteering.length > 0
          ? `<div class="section" data-section="volunteering">
        <div class="section-title">Volunteering</div>
        ${data.volunteering
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.role || ""}</div>
            <div class="company-info">${item.organization || ""}${
              item.causeArea ? ` | ${item.causeArea}` : ""
            }</div>
            <div class="company-info">${item.duration || ""}</div>
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

      <!-- Military Service -->
      ${
        data.militaryService && data.militaryService.length > 0
          ? `<div class="section" data-section="militaryService">
        <div class="section-title">Military Service</div>
        ${data.militaryService
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.rank || ""} - ${item.branch || ""}</div>
            <div class="company-info">${item.duration || ""}${
              item.specialization ? ` | ${item.specialization}` : ""
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

      <!-- Teaching Experience -->
      ${
        data.teachingExperience && data.teachingExperience.length > 0
          ? `<div class="section" data-section="teachingExperience">
        <div class="section-title">Teaching Experience</div>
        ${data.teachingExperience
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.institution || ""}${
              item.subjectCourseTaught ? ` | ${item.subjectCourseTaught}` : ""
            }</div>
            <div class="company-info">${item.duration || ""}</div>
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

      <!-- Mentorship Experience -->
      ${
        data.mentorshipExperience && data.mentorshipExperience.length > 0
          ? `<div class="section" data-section="mentorshipExperience">
        <div class="section-title">Mentorship Experience</div>
        ${data.mentorshipExperience
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.mentorshipArea || ""}</div>
            <div class="company-info">${item.organizationPlatform || ""}${
              item.menteeLevel ? ` | ${item.menteeLevel}` : ""
            }</div>
            <div class="company-info">${item.duration || ""}</div>
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

      <!-- Research Grants -->
      ${
        data.researchGrants && data.researchGrants.length > 0
          ? `<div class="section" data-section="researchGrants">
        <div class="section-title">Research Grants</div>
        ${data.researchGrants
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.agency || ""}${
              item.amount ? ` | Amount: ${item.amount}` : ""
            }</div>
            <div class="company-info">${item.year || ""}</div>
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

      <!-- Publications -->
      ${
        data.publications && data.publications.length > 0
          ? `<div class="section" data-section="publications">
        <div class="section-title">Publications</div>
        ${data.publications
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.journalPublisher || ""}${
              item.publicationType ? ` | ${item.publicationType}` : ""
            }</div>
            <div class="company-info">${item.year || ""}${
              item.authors ? ` | Authors: ${item.authors}` : ""
            }</div>
            ${
              item.urlDoi
                ? `<div><a href="${item.urlDoi}" target="_blank">View Publication</a></div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Patents -->
      ${
        data.patents && data.patents.length > 0
          ? `<div class="section" data-section="patents">
        <div class="section-title">Patents</div>
        ${data.patents
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.patentNumber || ""}${
              item.issuingAuthority ? ` | ${item.issuingAuthority}` : ""
            }</div>
            <div class="company-info">${item.year || ""} | Status: ${
              item.status || ""
            }</div>
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
        ${data.coCurricular
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.activity || ""}</div>
            ${
              item.role
                ? `<div class="company-info">Role: ${item.role}</div>`
                : ""
            }
            <div class="company-info">${item.year || ""}</div>
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
        ${data.extracurricular
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.activity || ""}</div>
            ${
              item.role
                ? `<div class="company-info">Role: ${item.role}</div>`
                : ""
            }
            <div class="company-info">${item.year || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Awards -->
      ${
        data.awards && data.awards.length > 0
          ? `<div class="section" data-section="awards">
        <div class="section-title">Awards</div>
        ${data.awards
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.title || ""}</div>
            <div class="company-info">${item.organization || ""} | ${
              item.issueYear || ""
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

      <!-- Speaking Engagements -->
      ${
        data.speakingEngagements && data.speakingEngagements.length > 0
          ? `<div class="section" data-section="speakingEngagements">
        <div class="section-title">Speaking Engagements</div>
        ${data.speakingEngagements
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.topic || ""}</div>
            <div class="company-info">${item.eventName || ""} | ${
              item.date || ""
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

      <!-- Memberships -->
      ${
        data.memberships && data.memberships.length > 0
          ? `<div class="section" data-section="memberships">
        <div class="section-title">Memberships</div>
        ${data.memberships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.membershipName || ""}</div>
            <div class="company-info">${item.organizationName || ""} | ${
              item.year || ""
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

      <!-- Workshops -->
      ${
        data.workshops && data.workshops.length > 0
          ? `<div class="section" data-section="workshops">
        <div class="section-title">Workshops</div>
        ${data.workshops
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="job-title">${item.programTitle || ""}</div>
            <div class="company-info">${item.conductedBy || ""} | ${
              item.year || ""
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
    </div>

    <div class="sidebar">
      <!-- Contact Information -->
      <div class="section" data-section="contact">
        <div class="section-title">Contact</div>
        ${
          data.personal?.phone
            ? `<div class="contact-item">
          <span class="contact-label">Phone</span>
          ${data.personal.phone}
        </div>`
            : ""
        }
        ${
          data.personal?.alternatePhone
            ? `<div class="contact-item">
          <span class="contact-label">Alternate Phone</span>
          ${data.personal.alternatePhone}
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
          data.personal?.fullAddress || data.personal?.location || data.personal?.country || data.personal?.pinCode
            ? `<div class="contact-item">
          <span class="contact-label">Address</span>
          ${[
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>`
            : ""
        }
      </div>

      <!-- Personal Details -->
      ${
        data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus
          ? `<div class="section" data-section="personal">
        <div class="section-title">Personal Details</div>
        ${
          data.personal?.dob
            ? `<div class="contact-item">
          <span class="contact-label">Date of Birth</span>
          ${data.personal.dob}
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
      </div>`
          : ""
      }

      <!-- Professional Context -->
      ${
        data.professionalContext && Object.values(data.professionalContext).some(v => v)
          ? `<div class="section" data-section="professionalContext">
        <div class="section-title">Professional Context</div>
        ${data.professionalContext.totalExperience ? `
          <div class="professional-context-item">
            <span class="professional-context-label">Total Experience:</span> ${data.professionalContext.totalExperience}
          </div>` : ''}
        ${data.professionalContext.teamSize ? `
          <div class="professional-context-item">
            <span class="professional-context-label">Team Size:</span> ${data.professionalContext.teamSize}
          </div>` : ''}
        ${data.professionalContext.industry ? `
          <div class="professional-context-item">
            <span class="professional-context-label">Industry:</span> ${data.professionalContext.industry}
          </div>` : ''}
        ${data.professionalContext.functionalDomain ? `
          <div class="professional-context-item">
            <span class="professional-context-label">Domain:</span> ${data.professionalContext.functionalDomain}
          </div>` : ''}
        ${data.professionalContext.geographicScope ? `
          <div class="professional-context-item">
            <span class="professional-context-label">Geographic Scope:</span> ${data.professionalContext.geographicScope}
          </div>` : ''}
        ${data.professionalContext.revenueResponsibility ? `
          <div class="professional-context-item">
            <span class="professional-context-label">Revenue Responsibility:</span> ${data.professionalContext.revenueResponsibility}
          </div>` : ''}
      </div>`
          : ""
      }

      <!-- Education -->
      ${
        data.education && data.education.length > 0
          ? `<div class="section" data-section="education">
        <div class="section-title">Education</div>
        ${data.education
          .map(
            (edu: any, index: number) => `
          <div class="education-item" data-index="${index}">
            <div class="education-degree">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
            <div class="education-school">${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}</div>
            <div class="education-date">${edu.graduationDate || ""}${edu.grade ? ` | Grade: ${edu.grade}` : ""}</div>
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

      <!-- Skills -->
      ${
        data.skills
          ? `<div class="section" data-section="skills">
        <div class="section-title">Skills</div>
        <ul class="skills-list">
          ${(() => {
            // Parse skills which might be HTML string or array
            let skills = data.skills;
            if (typeof skills === 'string' && skills.includes('<ul>')) {
              // Extract list items from HTML
              const matches = skills.match(/<li>(.*?)<\/li>/g);
              if (matches) {
                return matches.map(m => m.replace(/<\/?li>/g, '')).map(skill => `<li>${skill.trim()}</li>`).join('');
              }
            } else if (typeof skills === 'string') {
              return skills.split(',').map((skill: string) => `<li>${skill.trim()}</li>`).join('');
            } else if (Array.isArray(skills)) {
              return skills.map((skill: string) => `<li>${skill.trim()}</li>`).join('');
            }
            return '';
          })()}
        </ul>
      </div>`
          : ""
      }

      <!-- Tools & Technologies -->
      ${
        data.toolsTechnologies && data.toolsTechnologies.length > 0
          ? `<div class="section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Technologies</div>
        <ul class="skills-list">
          ${data.toolsTechnologies
            .map(
              (item: any) =>
                `<li>${item.name || ""}${item.proficiency ? ` (${item.proficiency})` : ""}${item.experienceDuration ? ` - ${item.experienceDuration}` : ""}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Methodologies -->
      ${
        data.methodologies && data.methodologies.length > 0
          ? `<div class="section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <ul class="skills-list">
          ${data.methodologies
            .map(
              (item: any) =>
                `<li>${item.name || ""}${item.certification ? ` (${item.certification})` : ""}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ""}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Industry Expertise -->
      ${
        data.industryExpertise && data.industryExpertise.length > 0
          ? `<div class="section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <ul class="skills-list">
          ${data.industryExpertise
            .map(
              (item: any) =>
                `<li>${item.industry || ""}${item.domainArea ? ` - ${item.domainArea}` : ""}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ""}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Certifications -->
      ${
        data.certifications && data.certifications.length > 0
          ? `<div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${data.certifications
          .map(
            (cert: any, index: number) => `
          <div class="cert-item" data-index="${index}">
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

      <!-- Languages -->
      ${
        data.languages && data.languages.length > 0
          ? `<div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <ul class="skills-list">
          ${data.languages
            .map(
              (lang: any) =>
                `<li>${lang.language || ""}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Scholarships -->
      ${
        data.scholarships && data.scholarships.length > 0
          ? `<div class="section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${data.scholarships
          .map(
            (item: any, index: number) => `
          <div class="cert-item" data-index="${index}">
            <div class="cert-name">${item.name || ""}</div>
            <div class="cert-issuer">${item.provider || item.organization || ""}</div>
            <div class="cert-date">${item.year || ""}</div>
            ${
              item.description
                ? `<div style="font-size: 10pt; margin-top: 4px;">${item.description}</div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Test Scores -->
      ${
        data.testScores && data.testScores.length > 0
          ? `<div class="section" data-section="testScores">
        <div class="section-title">Test Scores</div>
        ${data.testScores
          .map(
            (item: any, index: number) => `
          <div class="cert-item" data-index="${index}">
            <div class="cert-name">${item.testName || ""}</div>
            <div class="cert-issuer">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
            <div class="cert-date">${item.year || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Availability & Work Authorization -->
      ${
        data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
          ? `<div class="section" data-section="availabilityWorkAuth">
        <div class="section-title">Availability</div>
        ${data.availabilityWorkAuth.availabilityNoticePeriod ? `
          <div class="contact-item">
            <span class="contact-label">Notice Period:</span> ${data.availabilityWorkAuth.availabilityNoticePeriod}
          </div>` : ''}
        ${data.availabilityWorkAuth.workAuthorizationStatus ? `
          <div class="contact-item">
            <span class="contact-label">Work Auth:</span> ${data.availabilityWorkAuth.workAuthorizationStatus}
          </div>` : ''}
        ${data.availabilityWorkAuth.preferredLocation ? `
          <div class="contact-item">
            <span class="contact-label">Preferred Location:</span> ${data.availabilityWorkAuth.preferredLocation}
          </div>` : ''}
      </div>`
          : ""
      }

      <!-- Social Profiles -->
      ${
        data.socialProfiles && data.socialProfiles.length > 0
          ? `<div class="section" data-section="socialProfiles">
        <div class="section-title">Social Profiles</div>
        ${data.socialProfiles
          .map(
            (profile: any) =>
              `<div class="contact-item"><a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a></div>`
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- References -->
      ${
        data.references && data.references.length > 0
          ? `<div class="section" data-section="references">
        <div class="section-title">References</div>
        ${data.references
          .map(
            (ref: any, index: number) => `
          <div class="cert-item" data-index="${index}">
            <div class="cert-name">${ref.name || ""}</div>
            <div class="cert-issuer">${ref.designationRelationship || ""}</div>
            <div class="cert-issuer">${ref.organization || ""}</div>
            ${ref.contactInformation ? `<div class="cert-date">${ref.contactInformation}</div>` : ""}
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
    </div>
  </div>

  <!-- Custom Sections -->
  ${
    data.customSections && data.customSections.length > 0
      ? `<div style="padding: 30px 40px; border-top: 1px solid #e0e0e0;">
    ${data.customSections
      .filter((section: any) => section.isVisible !== false)
      .map(
        (section: any, sectionIndex: number) => `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-title">${section.heading || "Custom Section"}</div>
      ${section.entries && section.entries.length > 0
        ? section.entries
          .filter((entry: any) => entry.isVisible !== false)
          .map(
            (entry: any, entryIndex: number) => `
        <div class="experience-item" data-index="${entryIndex}">
          <div class="job-title">${entry.title || ""}</div>
          <div class="company-info">${entry.organization || ""}${entry.date ? ` | ${entry.date}` : ""}</div>
          ${
            entry.description
              ? `<div class="section-content">${entry.description}</div>`
              : ""
          }
        </div>
      `
          )
          .join("")
        : ""
      }
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
    totalMonths += Math.max(0, months);
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) return `${months} months`;
  if (months === 0) return `${years} years`;
  return `${years} years ${months} months`;
}