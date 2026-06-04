export function buildModernSidebarTemplate(data: any, theme?: any): string {
  const {
    personal = {},
    summary = "",
    careerObjective = "",
    experience = [],
    projects = [],
    education = [],
    internships = [],
    trainingPrograms = [],
    academicProjects = [],
    leadershipPositions = [],
    coCurricular = [],
    extracurricular = [],
    skills = "",
    coreCompetencies = "",
    languages = [],
    hobbies = [],
    certifications = [],
    scholarships = [],
    awards = [],
    speakingEngagements = [],
    memberships = [],
    workshops = [],
    clientProjects = [],
    portfolio = [],
    volunteering = [],
    militaryService = [],
    methodologies = [],
    industryExpertise = [],
    references = [],
    teachingExperience = [],
    mentorshipExperience = [],
    researchGrants = [],
    testScores = [],
    publications = [],
    patents = [],
    toolsTechnologies = [],
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  const defaultTheme = {
    primary: "#005F5F",
    secondary: "#555555",
    background: "#ffffff",
    headingFont: "sans-serif",
    bodyFont: "sans-serif",
    textDark: "#222222",
    textMuted: "#555555",
    borderColor: "#005F5F"
  };
  
  const currentTheme = { ...defaultTheme, ...theme };

  const userFontSize = data.fontSize || 14;
  const userFontFamily = data.fontFamily || "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const baseFontSize = userFontSize;

  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some((val: any) => typeof val === "string" && val.trim().length > 0);
      }
      return false;
    });
  };

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
  };

  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(", ");
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    if (!startDate && !endDate && !isCurrent) return "";
    if (startDate && !endDate) return startDate;
    if (!startDate && endDate) return endDate;
    if (isCurrent && endDate === "Present") return `${startDate} – Present`;
    return `${startDate || ""} – ${endDate || ""}`;
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    if (description.includes('<ul>') || description.includes('<li>')) {
      return `<div class="entry-content">${description}</div>`;
    }
    const lines = description.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return '';
    return `
      <div class="entry-content">
        <ul>
          ${lines.map(line => `<li>${line.replace(/^[•\-*]\s*/, '').trim()}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  const parseSkills = (): any[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter(s => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === 'string') {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseCoreCompetencies = (): any[] => {
    if (!coreCompetencies) return [];
    if (Array.isArray(coreCompetencies)) return coreCompetencies.filter(c => c && (typeof c === "string" ? c.trim() : c));
    if (typeof coreCompetencies === 'string') {
      if (coreCompetencies.includes('<ul>')) {
        const matches = coreCompetencies.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return coreCompetencies.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  };

  const skillsArray = parseSkills();
  const coreCompetenciesArray = parseCoreCompetencies();
  const nonEmptyExperience = getNonEmptyArray(experience);
  const nonEmptyEducation = getNonEmptyArray(education);
  const nonEmptyProjects = getNonEmptyArray(projects);
  const nonEmptyInternships = getNonEmptyArray(internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyArray(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyArray(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(extracurricular);
  const nonEmptyLanguages = getNonEmptyArray(languages);
  const nonEmptyCertifications = getNonEmptyArray(certifications);
  const nonEmptyScholarships = getNonEmptyArray(scholarships);
  const nonEmptyAwards = getNonEmptyArray(awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(memberships);
  const nonEmptyWorkshops = getNonEmptyArray(workshops);
  const nonEmptyClientProjects = getNonEmptyArray(clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(portfolio);
  const nonEmptyVolunteering = getNonEmptyArray(volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(militaryService);
  const nonEmptyMethodologies = getNonEmptyArray(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(references);
  const nonEmptyTeachingExperience = getNonEmptyArray(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(researchGrants);
  const nonEmptyTestScores = getNonEmptyArray(testScores);
  const nonEmptyPublications = getNonEmptyArray(publications);
  const nonEmptyPatents = getNonEmptyArray(patents);
  const nonEmptyToolsTechnologies = getNonEmptyArray(toolsTechnologies);
  const nonEmptySocialProfiles = getNonEmptyArray(socialProfiles);
  const nonEmptyHobbies = getNonEmptyArray(hobbies);

  // Get profile image
  const profileImage = personal.image || personal.photo || personal.avatar || "";

  // Format address properly
  const fullAddress = personal.fullAddress || "";
  const locationParts = [personal.location, personal.pinCode].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "";
  const countryStr = personal.country || "";
  const addressString = [fullAddress, locationStr, countryStr].filter(Boolean).join(", ");

  // SVG Icons
  const icons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; margin-right: 10px;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    graduation: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
    wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 8.5 9 7l3-3 1.5 1.5"/><path d="M16 12a4 4 0 0 0-4-4H8.5L4 12.5 7 16l4.5-4.5"/><path d="M4 22l4-4"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    chip: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="15" x2="22" y2="15"/></svg>`,
    language: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14"/><path d="M8 3v5"/><path d="M16 3v5"/><path d="M10 13l2 8 2-8"/><path d="M6 21h12"/><path d="M3 13h4"/><path d="M17 13h4"/></svg>`,
    certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`,
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M8 2h8v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V2z"/></svg>`,
    medal: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8 14v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/><path d="M10 10l2-2 2 2"/></svg>`,
    microphone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    chalkboard: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H4z"/><path d="M9 20l3-4 3 4"/><path d="M12 16v4"/></svg>`,
    flask: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 8v6"/><path d="M14 8v6"/><path d="M6 14h12"/><path d="M12 20a4 4 0 0 1-4-4v-2h8v2a4 4 0 0 1-4 4z"/></svg>`,
    palette: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
    football: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>`,
    handshake: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    heartIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    project: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M9 10.5l3-1.5 3 1.5"/></svg>`,
    bullseye: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    card: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    handHeart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8"/><path d="M12 2v4"/><path d="M6 6l2 2"/><path d="M18 6l-2 2"/><path d="M12 14a2 2 0 0 0 2-2 2 2 0 0 0-2-2 2 2 0 0 0-2 2 2 2 0 0 0 2 2z"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`
  };

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
      --text-dark: ${currentTheme.textDark};
      --text-muted: ${currentTheme.textMuted};
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text-dark);
      line-height: 1.5;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
    }

    .container {
      max-width: 1000px;
      width: 100%;
      margin: 0 auto;
      background: ${currentTheme.background};
      display: flex;
      min-height: 100vh;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .sidebar {
      width: 33%;
      background: var(--primary-color);
      color: white;
      padding: 50px 30px;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      margin-bottom: 20px;
    }
    
    .name {
      font-size: ${Math.round(baseFontSize * 1.8)}px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 8px;
      text-align: left;
    }
    
    .role {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: left;
    }

    .sidebar-divider {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      margin: 20px 0;
    }
    
    .sidebar-section {
      width: 100%;
      margin-bottom: 25px;
    }
    
    .sidebar-title {
      color: white;
      font-size: ${Math.round(baseFontSize * 1.0)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }
    
    .sidebar-content {
      font-size: ${Math.round(baseFontSize * 0.88)}px;
      line-height: 1.5;
    }
    
    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      word-break: break-all;
    }
    
    .contact-icon {
      width: 28px;
      flex-shrink: 0;
      text-align: left;
    }
    
    .contact-value {
      color: rgba(255, 255, 255, 0.88);
      flex: 1;
    }

    .contact-value a {
      color: inherit;
      text-decoration: none;
    }
    
    .contact-value a:hover {
      text-decoration: underline;
    }
    
    .sidebar-list {
      list-style: none;
      padding: 0;
    }
    
    .sidebar-list li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 8px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.88);
    }

    .sidebar-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .main-content {
      width: 67%;
      padding: 50px 40px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--primary-color);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.textDark};
      line-height: 1.6;
    }
    
    .entry {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .entry-title {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.02)}px;
      color: #000000;
    }
    
    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.88)}px;
      color: ${currentTheme.textDark};
      font-weight: 500;
      white-space: nowrap;
    }
    
    .entry-subtitle {
      color: var(--text-muted);
      font-size: ${Math.round(baseFontSize * 0.92)}px;
      margin-bottom: 6px;
    }
    
    .entry-content ul {
      margin-left: 18px;
      list-style-type: disc;
    }

    .entry-content li {
      margin-bottom: 5px;
      color: ${currentTheme.textDark};
      font-size: ${Math.round(baseFontSize * 0.92)}px;
      line-height: 1.5;
    }
    
    .date-badge {
      background-color: var(--primary-color);
      color: white;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: ${Math.round(baseFontSize * 0.82)}px;
      font-weight: 600;
      display: inline-block;
    }
    
    .portfolio-link {
      color: var(--primary-color);
      text-decoration: none;
      word-break: break-all;
    }
    
    .portfolio-link:hover {
      text-decoration: underline;
    }
    
    @media print {
      body { background: white; }
      .container { width: 100%; max-width: 100%; box-shadow: none; margin: 0; }
    }
  </style>
</head>
<body>
<div class="container">
  
  <!-- LEFT SIDEBAR -->
  <div class="sidebar">
    
    <div class="sidebar-header" id="section-sidebar-header" data-section="sidebar-header">
      <div class="name">${personal?.name || "RITIKA SHARMA"}</div>
      <div class="role">${personal?.title || personal?.role || "MARKETING MANAGER"}</div>
    </div>

    <hr class="sidebar-divider" />
    
    <!-- CONTACT -->
    <div class="sidebar-section" id="section-contact" data-section="contact">
      <div class="sidebar-title">CONTACT</div>
      <div class="sidebar-content">
        ${personal?.phone ? `<div class="contact-item"><span class="contact-icon">${icons.phone}</span><span class="contact-value">${personal.phone}</span></div>` : ""}
        ${personal?.alternatePhone ? `<div class="contact-item"><span class="contact-icon">${icons.phone}</span><span class="contact-value">${personal.alternatePhone} (Alt)</span></div>` : ""}
        ${personal?.email ? `<div class="contact-item"><span class="contact-icon">${icons.email}</span><span class="contact-value">${personal.email}</span></div>` : ""}
        ${addressString ? `<div class="contact-item"><span class="contact-icon">${icons.location}</span><span class="contact-value">${addressString}</span></div>` : ""}
        ${personal?.dob ? `<div class="contact-item"><span class="contact-icon">${icons.calendar}</span><span class="contact-value">DOB: ${personal.dob}</span></div>` : ""}
        ${personal?.gender ? `<div class="contact-item"><span class="contact-icon">${icons.user}</span><span class="contact-value">Gender: ${personal.gender}</span></div>` : ""}
        ${personal?.maritalStatus ? `<div class="contact-item"><span class="contact-icon">${icons.heart}</span><span class="contact-value">Marital: ${personal.maritalStatus}</span></div>` : ""}
      </div>
    </div>

    <!-- AVAILABILITY -->
    ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-availability" data-section="availability">
        <div class="sidebar-title">AVAILABILITY</div>
        <div class="sidebar-content">
          ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="contact-item"><span class="contact-icon" style="width: 28px;"></span><span class="contact-value"><strong>Notice:</strong> ${availabilityWorkAuth.availabilityNoticePeriod}</span></div>` : ''}
          ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="contact-item"><span class="contact-icon" style="width: 28px;"></span><span class="contact-value"><strong>Work Auth:</strong> ${availabilityWorkAuth.workAuthorizationStatus}</span></div>` : ''}
          ${availabilityWorkAuth.preferredLocation ? `<div class="contact-item"><span class="contact-icon" style="width: 28px;"></span><span class="contact-value"><strong>Pref Loc:</strong> ${availabilityWorkAuth.preferredLocation}</span></div>` : ''}
        </div>
      </div>
    ` : ""}

    <!-- SKILLS -->
    ${skillsArray.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-skills" data-section="skills">
        <div class="sidebar-title">SKILLS</div>
        <div class="sidebar-content">
          <ul class="sidebar-list">
            ${skillsArray.map((skill, idx) => `<li data-index="${idx}">${skill}</li>`).join("")}
          </ul>
        </div>
      </div>
    ` : ""}

    <!-- CORE COMPETENCIES -->
    ${coreCompetenciesArray.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-coreCompetencies" data-section="coreCompetencies">
        <div class="sidebar-title">CORE COMPETENCIES</div>
        <div class="sidebar-content">
          <ul class="sidebar-list">
            ${coreCompetenciesArray.map((comp, idx) => `<li data-index="${idx}">${comp}</li>`).join("")}
          </ul>
        </div>
      </div>
    ` : ""}

    <!-- TOOLS & TECHNOLOGIES -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-toolsTechnologies" data-section="toolsTechnologies">
        <div class="sidebar-title">TOOLS & TECH</div>
        <div class="sidebar-content">
          <ul class="sidebar-list">
            ${nonEmptyToolsTechnologies.map((tool, idx) => `<li data-index="${idx}">${typeof tool === "string" ? tool : tool.name}${tool.proficiency ? ` (${tool.proficiency})` : ''}</li>`).join("")}
          </ul>
        </div>
      </div>
    ` : ""}

    <!-- LANGUAGES -->
    ${nonEmptyLanguages.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-languages" data-section="languages">
        <div class="sidebar-title">LANGUAGES</div>
        <div class="sidebar-content">
          <ul class="sidebar-list">
            ${nonEmptyLanguages.map((lang, idx) => `<li data-index="${idx}">${typeof lang === "string" ? lang : (lang.language || lang.name)}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>`).join("")}
          </ul>
        </div>
      </div>
    ` : ""}

    <!-- CERTIFICATIONS -->
    ${nonEmptyCertifications.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-certifications" data-section="certifications">
        <div class="sidebar-title">CERTIFICATIONS</div>
        <div class="sidebar-content">
          ${nonEmptyCertifications.map((cert, idx) => `
            <div style="margin-bottom: 12px;" data-index="${idx}">
              <strong>${cert.name || cert.title || ''}</strong><br>
              ${cert.issuer ? `${cert.issuer}<br>` : ''}
              ${cert.date ? `${cert.date}` : ''}
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}

    <!-- HOBBIES -->
    ${nonEmptyHobbies.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-hobbies" data-section="hobbies">
        <div class="sidebar-title">HOBBIES & INTERESTS</div>
        <div class="sidebar-content">
          <ul class="sidebar-list">
            ${nonEmptyHobbies.map((hobby, idx) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join("")}
          </ul>
        </div>
      </div>
    ` : ""}

    <!-- SOCIAL PROFILES -->
    ${nonEmptySocialProfiles.length > 0 ? `
      <hr class="sidebar-divider" />
      <div class="sidebar-section" id="section-socialProfiles" data-section="socialProfiles">
        <div class="sidebar-title">SOCIAL PROFILES</div>
        <div class="sidebar-content">
          ${nonEmptySocialProfiles.map((item, idx) => `
            <div style="margin-bottom: 10px;" data-index="${idx}">
              <strong>${item.platform || item.network || 'Profile'}:</strong><br>
              <a href="${item.url || ''}" style="color: rgba(255,255,255,0.85); word-break: break-all;" target="_blank">${item.url || ''}</a>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  </div>
  
  <!-- MAIN CONTENT -->
  <div class="main-content">
    
    <!-- SUMMARY / OBJECTIVE -->
    ${summary && summary.trim() ? `
      <div class="section" id="section-summary" data-section="summary">
        <div class="section-title">${icons.user} PROFESSIONAL SUMMARY</div>
        <div class="summary-text">${summary}</div>
      </div>
    ` : careerObjective && careerObjective.trim() ? `
      <div class="section" id="section-careerObjective" data-section="careerObjective">
        <div class="section-title">${icons.bullseye} CAREER OBJECTIVE</div>
        <div class="summary-text">${careerObjective}</div>
      </div>
    ` : ""}

    <!-- EXPERIENCE -->
    ${nonEmptyExperience.length > 0 ? `
      <div class="section" id="section-experience" data-section="experience">
        <div class="section-title">${icons.briefcase} EXPERIENCE</div>
        ${nonEmptyExperience.map((exp, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${exp.designation || exp.title || exp.role || exp.jobTitle}</div>
              <div class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
            </div>
            <div class="entry-subtitle">${formatSubtitle([exp.company || exp.organization, exp.location])}</div>
            ${exp.description ? renderDescription(exp.description) : ""}
            ${exp.achievements ? `<div class="entry-content"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- PROJECTS -->
    ${nonEmptyProjects.length > 0 ? `
      <div class="section" id="section-projects" data-section="projects">
        <div class="section-title">${icons.project} PROJECTS</div>
        ${nonEmptyProjects.map((project, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${project.name || project.title}</div>
              ${project.duration ? `<div class="entry-date">${project.duration}</div>` : ""}
            </div>
            ${project.role ? `<div class="entry-subtitle">Role: ${project.role}</div>` : ""}
            ${project.description ? renderDescription(project.description) : ""}
            ${project.technologies ? `<div class="entry-subtitle">Technologies: ${project.technologies}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- EDUCATION -->
    ${nonEmptyEducation.length > 0 ? `
      <div class="section" id="section-education" data-section="education">
        <div class="section-title">${icons.graduation} EDUCATION</div>
        ${nonEmptyEducation.map((edu, idx) => {
          const startDate = edu.startDate || edu.startYear;
          const endDate = edu.endDate || edu.endYear || edu.graduationDate;
          const dateRange = startDate && endDate ? `${startDate} – ${endDate}` : (startDate || endDate || "");
          return `
            <div class="entry" data-index="${idx}">
              <div class="entry-header">
                <div class="entry-title">${edu.degree || edu.course}</div>
                <div class="entry-date">${dateRange}</div>
              </div>
              <div class="entry-subtitle">${formatSubtitle([edu.school || edu.institution || edu.university, edu.location])}</div>
              ${edu.grade ? `<div class="entry-content">${edu.grade}</div>` : ""}
              ${edu.description ? `<div class="entry-content">${edu.description}</div>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    <!-- INTERNSHIPS -->
    ${nonEmptyInternships.length > 0 ? `
      <div class="section" id="section-internships" data-section="internships">
        <div class="section-title">${icons.chalkboard} INTERNSHIPS</div>
        ${nonEmptyInternships.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.title || item.role}</div>
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="entry-subtitle">${item.company || item.organization}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- TRAINING PROGRAMS -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" id="section-trainingPrograms" data-section="trainingPrograms">
        <div class="section-title">${icons.certificate} TRAINING PROGRAMS</div>
        ${nonEmptyTrainingPrograms.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name || item.title}</div>
              ${item.completionDate ? `<span class="date-badge">${item.completionDate}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.provider || item.organization}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- ACADEMIC PROJECTS -->
    ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" id="section-academicProjects" data-section="academicProjects">
        <div class="section-title">${icons.flask} ACADEMIC PROJECTS</div>
        ${nonEmptyAcademicProjects.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name || item.title}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.course])}</div>
            ${item.description ? renderDescription(item.description) : ""}
            ${item.technologies ? `<div class="entry-subtitle">Technologies: ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ""}
            ${item.url ? `<div><a href="${item.url}" class="portfolio-link" target="_blank">${item.url}</a></div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- LEADERSHIP POSITIONS -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" id="section-leadershipPositions" data-section="leadershipPositions">
        <div class="section-title">${icons.users} LEADERSHIP POSITIONS</div>
        ${nonEmptyLeadershipPositions.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.position || item.title}</div>
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="entry-subtitle">${item.organization}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- CO-CURRICULAR -->
    ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" id="section-coCurricular" data-section="coCurricular">
        <div class="section-title">${icons.palette} CO-CURRICULAR ACTIVITIES</div>
        ${nonEmptyCoCurricular.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.activity}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ""}
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- EXTRACURRICULAR -->
    ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" id="section-extracurricular" data-section="extracurricular">
        <div class="section-title">${icons.football} EXTRACURRICULAR ACTIVITIES</div>
        ${nonEmptyExtracurricular.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.activity}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ""}
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- SCHOLARSHIPS -->
    ${nonEmptyScholarships.length > 0 ? `
      <div class="section" id="section-scholarships" data-section="scholarships">
        <div class="section-title">${icons.trophy} SCHOLARSHIPS</div>
        ${nonEmptyScholarships.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.provider || item.organization}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- AWARDS -->
    ${nonEmptyAwards.length > 0 ? `
      <div class="section" id="section-awards" data-section="awards">
        <div class="section-title">${icons.medal} AWARDS & RECOGNITION</div>
        ${nonEmptyAwards.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.title}</div>
              ${item.issueYear || item.year ? `<span class="date-badge">${item.issueYear || item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.organization}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- SPEAKING ENGAGEMENTS -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" id="section-speakingEngagements" data-section="speakingEngagements">
        <div class="section-title">${icons.microphone} SPEAKING ENGAGEMENTS</div>
        ${nonEmptySpeakingEngagements.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.topic}</div>
              ${item.date ? `<span class="date-badge">${item.date}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.eventName}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- MEMBERSHIPS -->
    ${nonEmptyMemberships.length > 0 ? `
      <div class="section" id="section-memberships" data-section="memberships">
        <div class="section-title">${icons.handshake} MEMBERSHIPS</div>
        ${nonEmptyMemberships.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.membershipName || item.name}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.organizationName || item.organization}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- WORKSHOPS -->
    ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" id="section-workshops" data-section="workshops">
        <div class="section-title">${icons.chalkboard} WORKSHOPS</div>
        ${nonEmptyWorkshops.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.programTitle || item.title}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.conductedBy}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- CLIENT PROJECTS -->
    ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" id="section-clientProjects" data-section="clientProjects">
        <div class="section-title">${icons.briefcase} CLIENT PROJECTS</div>
        ${nonEmptyClientProjects.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name}</div>
              ${item.duration ? `<span class="date-badge">${item.duration}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.clientOrganization}${item.role ? ` - ${item.role}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
            ${item.toolsTechnologies ? `<div class="entry-subtitle">Tools: ${item.toolsTechnologies}</div>` : ""}
            ${item.projectUrl ? `<div><a href="${item.projectUrl}" class="portfolio-link" target="_blank">${item.projectUrl}</a></div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- PORTFOLIO -->
    ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" id="section-portfolio" data-section="portfolio">
        <div class="section-title">${icons.folder} PORTFOLIO</div>
        ${nonEmptyPortfolio.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name}</div>
            </div>
            <div class="entry-subtitle">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
            ${item.url ? `<div><a href="${item.url}" class="portfolio-link" target="_blank">${item.url}</a></div>` : ''}
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- VOLUNTEERING -->
    ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" id="section-volunteering" data-section="volunteering">
        <div class="section-title">${icons.handHeart} VOLUNTEERING</div>
        ${nonEmptyVolunteering.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.role}</div>
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="entry-subtitle">${item.organization}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- MILITARY SERVICE -->
    ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" id="section-militaryService" data-section="militaryService">
        <div class="section-title">${icons.shield} MILITARY SERVICE</div>
        ${nonEmptyMilitaryService.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.branch}${item.rank ? ` - ${item.rank}` : ''}</div>
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            ${item.specialization ? `<div class="entry-subtitle">Specialization: ${item.specialization}</div>` : ''}
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- METHODOLOGIES -->
    ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" id="section-methodologies" data-section="methodologies">
        <div class="section-title">${icons.diagram} METHODOLOGIES</div>
        ${nonEmptyMethodologies.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name}</div>
            </div>
            ${item.certification ? `<div class="entry-subtitle">Certification: ${item.certification}</div>` : ''}
            ${item.experienceDuration ? `<div class="entry-subtitle">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- INDUSTRY EXPERTISE -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" id="section-industryExpertise" data-section="industryExpertise">
        <div class="section-title">${icons.building} INDUSTRY EXPERTISE</div>
        ${nonEmptyIndustryExpertise.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.industry}</div>
            </div>
            ${item.domainArea ? `<div class="entry-subtitle">Domain: ${item.domainArea}</div>` : ''}
            ${item.experienceDuration ? `<div class="entry-subtitle">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- TEACHING EXPERIENCE -->
    ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" id="section-teachingExperience" data-section="teachingExperience">
        <div class="section-title">${icons.chalkboard} TEACHING EXPERIENCE</div>
        ${nonEmptyTeachingExperience.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.subjectCourseTaught || item.title}</div>
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="entry-subtitle">${item.institution}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- MENTORSHIP EXPERIENCE -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" id="section-mentorshipExperience" data-section="mentorshipExperience">
        <div class="section-title">${icons.users} MENTORSHIP EXPERIENCE</div>
        ${nonEmptyMentorshipExperience.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.mentorshipArea}</div>
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="entry-subtitle">${item.organizationPlatform}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- RESEARCH GRANTS -->
    ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" id="section-researchGrants" data-section="researchGrants">
        <div class="section-title">${icons.flask} RESEARCH GRANTS</div>
        ${nonEmptyResearchGrants.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.title}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.agency}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- TEST SCORES -->
    ${nonEmptyTestScores.length > 0 ? `
      <div class="section" id="section-testScores" data-section="testScores">
        <div class="section-title">${icons.chart} TEST SCORES</div>
        ${nonEmptyTestScores.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.testName}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">Score: ${item.score}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- PUBLICATIONS -->
    ${nonEmptyPublications.length > 0 ? `
      <div class="section" id="section-publications" data-section="publications">
        <div class="section-title">${icons.book} PUBLICATIONS</div>
        ${nonEmptyPublications.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.title}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.journalPublisher || item.publisher}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
            ${item.urlDoi ? `<div><a href="${item.urlDoi}" class="portfolio-link" target="_blank">${item.urlDoi}</a></div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- PATENTS -->
    ${nonEmptyPatents.length > 0 ? `
      <div class="section" id="section-patents" data-section="patents">
        <div class="section-title">${icons.file} PATENTS</div>
        ${nonEmptyPatents.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.title}</div>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ""}
            </div>
            <div class="entry-subtitle">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
            ${item.status ? `<div class="entry-subtitle">Status: ${item.status}</div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- REFERENCES -->
    ${nonEmptyReferences.length > 0 ? `
      <div class="section" id="section-references" data-section="references">
        <div class="section-title">${icons.card} REFERENCES</div>
        ${nonEmptyReferences.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-header">
              <div class="entry-title">${item.name}</div>
            </div>
            <div class="entry-subtitle">${item.designationRelationship}${item.organization ? ` at ${item.organization}` : ''}</div>
            ${item.contactInformation ? `<div class="entry-subtitle">${item.contactInformation}</div>` : ''}
          </div>
        `).join("")}
      </div>
    ` : ""}

  </div>
</div>
</body>
</html>`;
}