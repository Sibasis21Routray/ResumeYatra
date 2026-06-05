export function buildPhotoModernProTemplate(data: any, theme?: any): string {
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
    professionalContext = {},
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  const defaultTheme = {
    primary: "#0A2540", // Dark Navy Sidebar background color
    secondary: "#1A365D", // Navy theme accents
    background: "#ffffff",
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
  };

  const currentTheme = theme || defaultTheme;
  const sidebarBg = currentTheme.sidebarBg || defaultTheme.primary;
  const primaryAccent = currentTheme.secondary || defaultTheme.secondary;

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 10.5;
  const baseFontSize = userFontSize;
  const nameFontSize = Math.round(userFontSize * 2.2);

  const hasNonEmptyItems = (arr: any[]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
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

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" – ");
  };

  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(", ");
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    if (description.includes('<ul>') || description.includes('<li>')) {
      return description;
    }
    const lines = description.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    return `
      <ul class="exp-achievements">
        ${lines.map(line => `<li>${line.replace(/^[•\-*]\s*/, '').trim()}</li>`).join('')}
      </ul>
    `;
  };

  const parseSkills = (): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === 'string') {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseCoreCompetencies = (): string[] => {
    if (!coreCompetencies) return [];
    if (Array.isArray(coreCompetencies)) return coreCompetencies.filter((c: any) => c && (typeof c === "string" ? c.trim() : c));
    if (typeof coreCompetencies === 'string') {
      if (coreCompetencies.includes('<ul>')) {
        const matches = coreCompetencies.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return coreCompetencies.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
    return [];
  };

  const skillsList = parseSkills();
  const coreCompetenciesList = parseCoreCompetencies();
  
  const sortedExperience = [...experience].sort(
    (a: any, b: any) =>
      new Date(b.startDate || "1900-01-01").getTime() -
      new Date(a.startDate || "1900-01-01").getTime()
  );

  const certificationsList = getNonEmptyArray(certifications);
  const nonEmptyEducation = getNonEmptyArray(education);
  const nonEmptyProjects = getNonEmptyArray(projects);
  const nonEmptyInternships = getNonEmptyArray(internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyArray(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyArray(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(extracurricular);
  const nonEmptyLanguages = getNonEmptyArray(languages);
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

  // SVG Icons (replacing Font Awesome)
  const svgIcons = {
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    briefcase: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    graduation: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    language: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14"/><path d="M8 3v5"/><path d="M16 3v5"/><path d="M10 13l2 8 2-8"/><path d="M6 21h12"/><path d="M3 13h4"/><path d="M17 13h4"/></svg>`,
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M8 2h8v4c0 2.21-1.79 4-4 4s-4-1.79-4-4V2z"/></svg>`,
    medal: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8 14v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5"/><path d="M10 10l2-2 2 2"/></svg>`,
    microphone: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
    users: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    chalkboard: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H4z"/><path d="M9 20l3-4 3 4"/><path d="M12 16v4"/></svg>`,
    flask: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8"/><path d="M10 8v6"/><path d="M14 8v6"/><path d="M6 14h12"/><path d="M12 20a4 4 0 0 1-4-4v-2h8v2a4 4 0 0 1-4 4z"/></svg>`,
    palette: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg>`,
    football: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>`,
    handshake: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    chart: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12"/><path d="M9 10.5l3-1.5 3 1.5"/></svg>`,
    bullseye: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    card: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`,
    wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 8.5 9 7l3-3 1.5 1.5"/><path d="M16 12a4 4 0 0 0-4-4H8.5L4 12.5 7 16l4.5-4.5"/><path d="M4 22l4-4"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    chip: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="15" x2="4" y2="15"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="15" x2="22" y2="15"/></svg>`,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    building: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
  };

  // Default avatar SVG
  const defaultAvatarSvg = `<svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="65" r="63" fill="${sidebarBg}" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
    <circle cx="65" cy="50" r="18" fill="white" opacity="0.9"/>
    <path d="M65 75 C45 75 30 90 30 110 L100 110 C100 90 85 75 65 75Z" fill="white" opacity="0.9"/>
  </svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
      color: #333333;
      line-height: 1.5;
      background: #f5f5f5;
      font-size: ${baseFontSize}pt;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
      background: #ffffff;
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: 100vh;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
    }

    /* Left Sidebar Styling */
    .left-column {
      background: ${sidebarBg};
      color: #ffffff;
      padding: 30px 20px;
    }

    .profile-section {
      text-align: center;
      margin-bottom: 25px;
    }

    .profile-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      margin: 0 auto;
      border: 3px solid rgba(255, 255, 255, 0.2);
      overflow: hidden;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-photo svg {
      width: 100%;
      height: 100%;
    }

    .sidebar-section {
      margin-top: 25px;
      margin-bottom: 10px;
    }

    .sidebar-heading {
      font-size: 11pt;
      font-weight: 700;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.3);
      padding-bottom: 5px;
      margin-bottom: 12px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      font-size: 8.5pt;
      margin-bottom: 12px;
      color: rgba(255, 255, 255, 0.9);
      word-break: break-all;
    }

    .contact-item svg {
      width: 14px;
      height: 14px;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .contact-item a {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
    }

    .sidebar-list {
      list-style: none;
      padding-left: 0;
    }

    .sidebar-list-item {
      font-size: 9pt;
      margin-bottom: 10px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.9);
    }

    .sidebar-list-item .title-bold {
      font-weight: 700;
      display: block;
      color: #ffffff;
    }

    .sidebar-list-item .subtitle-light {
      font-size: 8.5pt;
      display: block;
      color: rgba(255, 255, 255, 0.75);
    }

    .sidebar-bullet-list {
      list-style: none;
      padding-left: 0;
    }

    .sidebar-bullet-list li {
      font-size: 9pt;
      position: relative;
      padding-left: 14px;
      margin-bottom: 6px;
      color: rgba(255, 255, 255, 0.9);
    }

    .sidebar-bullet-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.7);
    }

    /* Right Side Main Content Column Styling */
    .right-column {
      padding: 40px 35px;
      background: #ffffff;
    }

    .header-identity {
      margin-bottom: 30px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 15px;
    }

    .name {
      font-size: ${nameFontSize}pt;
      font-weight: 800;
      color: ${primaryAccent};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.1;
      margin-bottom: 4px;
    }

    .role {
      font-size: 12pt;
      color: #444444;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .main-section {
      margin-bottom: 25px;
    }

    .section-title-container {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .section-icon-bubble {
      background: ${primaryAccent};
      color: #ffffff;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-icon-bubble svg {
      width: 12px;
      height: 12px;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: ${primaryAccent};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .summary-text {
      font-size: 9.5pt;
      line-height: 1.5;
      color: #444444;
      text-align: justify;
    }

    .timeline-container {
      position: relative;
      padding-left: 20px;
      margin-top: 10px;
    }

    .timeline-track {
      position: absolute;
      left: 4px;
      top: 5px;
      bottom: 5px;
      width: 1px;
      background: #cbd5e1;
    }

    .exp-item {
      position: relative;
      margin-bottom: 22px;
    }

    .exp-item:last-child {
      margin-bottom: 0;
    }

    .timeline-marker {
      position: absolute;
      left: -20px;
      top: 4px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: ${primaryAccent};
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1px ${primaryAccent};
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }

    .exp-title {
      font-weight: 700;
      font-size: 10pt;
      color: #111111;
    }

    .exp-company {
      font-size: 9.5pt;
      color: #444444;
      font-weight: 500;
      margin-bottom: 6px;
    }

    .exp-date {
      font-size: 9pt;
      color: #111111;
      font-weight: 500;
      white-space: nowrap;
    }

    .exp-achievements {
      list-style: none;
      padding-left: 0;
      margin-top: 5px;
    }

    .exp-achievements li {
      position: relative;
      padding-left: 12px;
      margin-bottom: 4px;
      font-size: 9pt;
      line-height: 1.4;
      color: #444444;
      text-align: justify;
    }

    .exp-achievements li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #444444;
    }

    @media print {
      body { background: #ffffff; }
      .container { box-shadow: none; max-width: 100%; grid-template-columns: 240px 1fr; }
      .left-column { background: ${sidebarBg} !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- LEFT SIDEBAR -->
    <div class="left-column"  ">
      <div class="profile-section" id="section-profile" data-section="profile">
        <div class="profile-photo" id="section-profile-photo" data-section="profile-photo">
          ${personal?.image || personal?.photo ? 
            `<img src="${personal.image || personal.photo}" alt="Profile">` : 
            defaultAvatarSvg
          }
        </div>
      </div>

      <!-- CONTACT INFO -->
      <div class="sidebar-section" id="section-contact" data-section="contact">
        <div class="sidebar-heading">Contact</div>
        
        ${personal?.phone ? `
        <div class="contact-item">
          ${svgIcons.phone}
          <span>${personal.phone}</span>
        </div>` : ""}

        ${personal?.alternatePhone ? `
        <div class="contact-item">
          ${svgIcons.phone}
          <span>${personal.alternatePhone} (Alt)</span>
        </div>` : ""}

        ${personal?.email ? `
        <div class="contact-item">
          ${svgIcons.email}
          <span><a href="mailto:${personal.email}">${personal.email}</a></span>
        </div>` : ""}

        ${(() => {
          const addressParts = [personal.fullAddress, personal.location, personal.country, personal.pinCode].filter(Boolean);
          return addressParts.length > 0 ? `
          <div class="contact-item">
            ${svgIcons.location}
            <span>${addressParts.join(", ")}</span>
          </div>` : "";
        })()}

        ${personal?.linkedinUrl ? `
        <div class="contact-item">
          ${svgIcons.linkedin}
          <span><a href="${personal.linkedinUrl}" target="_blank">${personal.linkedinUrl.replace(/https?:\/\/(www\.)?/, "")}</a></span>
        </div>` : ""}
        
        ${personal?.dob ? `
        <div class="contact-item">
          ${svgIcons.calendar}
          <span>DOB: ${personal.dob}</span>
        </div>` : ""}
        
        ${personal?.gender ? `
        <div class="contact-item">
          ${svgIcons.user}
          <span>${personal.gender}</span>
        </div>` : ""}
        
        ${personal?.maritalStatus ? `
        <div class="contact-item">
          ${svgIcons.heart}
          <span>${personal.maritalStatus}</span>
        </div>` : ""}
      </div>

      <!-- AVAILABILITY & WORK AUTH -->
      ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <div class="sidebar-section" id="section-availability" data-section="availability">
        <div class="sidebar-heading">Availability</div>
        <ul class="sidebar-bullet-list">
          ${availabilityWorkAuth.availabilityNoticePeriod ? `<li>Notice: ${availabilityWorkAuth.availabilityNoticePeriod}</li>` : ''}
          ${availabilityWorkAuth.workAuthorizationStatus ? `<li>Work Auth: ${availabilityWorkAuth.workAuthorizationStatus}</li>` : ''}
          ${availabilityWorkAuth.preferredLocation ? `<li>Preferred: ${availabilityWorkAuth.preferredLocation}</li>` : ''}
        </ul>
      </div>` : ""}

      <!-- PROFESSIONAL CONTEXT -->
      ${professionalContext && hasObjectValues(professionalContext) ? `
      <div class="sidebar-section" id="section-professionalContext" data-section="professionalContext">
        <div class="sidebar-heading">Professional Context</div>
        <ul class="sidebar-bullet-list">
          ${professionalContext.totalExperience ? `<li>Experience: ${professionalContext.totalExperience} years</li>` : ''}
          ${professionalContext.industry ? `<li>Industry: ${professionalContext.industry}</li>` : ''}
          ${professionalContext.functionalDomain ? `<li>Domain: ${professionalContext.functionalDomain}</li>` : ''}
        </ul>
      </div>` : ""}

      <!-- SKILLS -->
      ${skillsList.length > 0 ? `
      <div class="sidebar-section" id="section-skills" data-section="skills">
        <div class="sidebar-heading">Skills</div>
        <ul class="sidebar-bullet-list">
          ${skillsList.map((skill: string, idx: number) => `<li data-index="${idx}">${skill}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- CORE COMPETENCIES -->
      ${coreCompetenciesList.length > 0 ? `
      <div class="sidebar-section" id="section-coreCompetencies" data-section="coreCompetencies">
        <div class="sidebar-heading">Core Competencies</div>
        <ul class="sidebar-bullet-list">
          ${coreCompetenciesList.map((comp: string, idx: number) => `<li data-index="${idx}">${comp}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- TOOLS & TECHNOLOGIES -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="sidebar-section" id="section-toolsTechnologies" data-section="toolsTechnologies">
        <div class="sidebar-heading">Tools & Technologies</div>
        <ul class="sidebar-bullet-list">
          ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `<li data-index="${idx}">${typeof item === "string" ? item : item.name}${item.proficiency ? ` (${item.proficiency})` : ''}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- LANGUAGES -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="sidebar-section" id="section-languages" data-section="languages">
        <div class="sidebar-heading">Languages</div>
        <ul class="sidebar-bullet-list">
          ${nonEmptyLanguages.map((lang: any, idx: number) => `<li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- EDUCATION -->
      ${nonEmptyEducation.length > 0 ? `
      <div class="sidebar-section" id="section-education" data-section="education">
        <div class="sidebar-heading">Education</div>
        <ul class="sidebar-list">
          ${nonEmptyEducation.map((edu: any, idx: number) => `
            <li class="sidebar-list-item" data-index="${idx}">
              <span class="title-bold">${edu.degree || ""}${edu.field ? ` - ${edu.field}` : ""}</span>
              <span class="subtitle-light">${edu.school || ""}</span>
              <span class="subtitle-light">${edu.graduationDate || formatDateRange(edu.startDate || edu.startYear, edu.endDate || edu.endYear)}</span>
              ${edu.grade ? `<span class="subtitle-light">${edu.grade}</span>` : ""}
            </li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- CERTIFICATIONS -->
      ${certificationsList.length > 0 ? `
      <div class="sidebar-section" id="section-certifications" data-section="certifications">
        <div class="sidebar-heading">Certifications</div>
        <ul class="sidebar-bullet-list">
          ${certificationsList.map((cert: any, idx: number) => `
            <li data-index="${idx}">${typeof cert === 'string' ? cert : (cert.name || cert.title || "")}${cert.issuer ? ` – ${cert.issuer}` : ""}${cert.date ? ` (${cert.date})` : ""}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- HOBBIES -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="sidebar-section" id="section-hobbies" data-section="hobbies">
        <div class="sidebar-heading">Hobbies & Interests</div>
        <ul class="sidebar-bullet-list">
          ${nonEmptyHobbies.map((hobby: any, idx: number) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- SOCIAL PROFILES -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="sidebar-section" id="section-socialProfiles" data-section="socialProfiles">
        <div class="sidebar-heading">Social Profiles</div>
        <ul class="sidebar-bullet-list">
          ${nonEmptySocialProfiles.map((profile: any, idx: number) => `
            <li data-index="${idx}"><a href="${profile.url}" target="_blank" style="color: rgba(255,255,255,0.9);">${profile.platform || profile.network || 'Profile'}</a></li>
          `).join("")}
        </ul>
      </div>` : ""}
    </div>

    <!-- MAIN RIGHT CONTENT COLUMN -->
    <div class="right-column" >
      <div class="header-identity" id="section-header" data-section="header">
        <div class="name">${personal?.name || "Your Name "}</div>
        <div class="role">${personal?.role || personal?.title }</div>
      </div>

      <!-- PROFESSIONAL SUMMARY -->
      ${summary && summary.trim() ? `
      <div class="main-section" id="section-summary" data-section="summary">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.user}</span>
          <span class="section-title">Professional Summary</span>
        </div>
        <p class="summary-text">${summary}</p>
      </div>` : ""}

      <!-- CAREER OBJECTIVE -->
      ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
      <div class="main-section" id="section-careerObjective" data-section="careerObjective">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.bullseye}</span>
          <span class="section-title">Career Objective</span>
        </div>
        <p class="summary-text">${careerObjective}</p>
      </div>` : ""}

      <!-- WORK EXPERIENCE -->
      ${sortedExperience.length > 0 ? `
      <div class="main-section" id="section-experience" data-section="experience">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.briefcase}</span>
          <span class="section-title">Experience</span>
        </div>
        
        <div class="timeline-container">
          <div class="timeline-track"></div>
          
          ${sortedExperience.map((e: any, idx: number) => {
            const dateRange = formatDateRange(e.startDate, e.endDate, e.isCurrent);
            const bullets = e.description ? e.description.split('\n').filter((b: string) => b.trim()) : [];
            
            return `
            <div class="exp-item" data-index="${idx}">
              <div class="timeline-marker"></div>
              <div class="exp-header">
                <div class="exp-title">${e.title || ""}</div>
                <div class="exp-date">${dateRange}</div>
              </div>
              <div class="exp-company">${e.company || ""}${e.location ? `, ${e.location}` : ""}</div>
              ${bullets.length > 0 ? `
                <ul class="exp-achievements">
                  ${bullets.map((bullet: string, bidx: number) => `<li data-index="${idx}-${bidx}">${bullet.replace(/^[•\-\*]\s*/, '')}</li>`).join("")}
                </ul>
              ` : e.description ? `<p class="summary-text" style="font-size: 9pt;">${e.description}</p>` : ""}
              ${e.achievements ? `<p class="summary-text" style="font-size: 9pt; margin-top: 5px;"><strong>Achievements:</strong> ${e.achievements}</p>` : ""}
            </div>
          `}).join("")}
        </div>
      </div>` : ""}

      <!-- PROJECTS -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="main-section" id="section-projects" data-section="projects">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.folder}</span>
          <span class="section-title">Projects</span>
        </div>
        ${nonEmptyProjects.map((project: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${project.name || project.title || ''}</div>
              ${project.duration ? `<div class="exp-date">${project.duration}</div>` : ""}
            </div>
            ${project.role ? `<div class="exp-company">Role: ${project.role}</div>` : ""}
            ${project.description ? renderDescription(project.description) : ""}
            ${project.technologies ? `<p class="summary-text" style="font-size: 9pt; margin-top: 5px;"><strong>Technologies:</strong> ${project.technologies}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- INTERNSHIPS -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="main-section" id="section-internships" data-section="internships">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.chalkboard}</span>
          <span class="section-title">Internships</span>
        </div>
        ${nonEmptyInternships.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.title || item.role || ''}</div>
              <div class="exp-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="exp-company">${item.company || item.organization || ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- TRAINING PROGRAMS -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="main-section" id="section-trainingPrograms" data-section="trainingPrograms">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.certificate}</span>
          <span class="section-title">Training Programs</span>
        </div>
        ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.name || item.title || ''}</div>
              ${item.completionDate ? `<div class="exp-date">${item.completionDate}</div>` : ""}
            </div>
            <div class="exp-company">${item.provider || item.organization || ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- ACADEMIC PROJECTS -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="main-section" id="section-academicProjects" data-section="academicProjects">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.flask}</span>
          <span class="section-title">Academic Projects</span>
        </div>
        ${nonEmptyAcademicProjects.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.name || item.title || ''}</div>
              ${item.duration ? `<div class="exp-date">${item.duration}</div>` : ""}
            </div>
            <div class="exp-company">${item.institution || ''}${item.course ? ` - ${item.course}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
            ${item.technologies ? `<p class="summary-text" style="font-size: 9pt; margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ""}
            ${item.url ? `<p class="summary-text" style="font-size: 9pt;"><a href="${item.url}" target="_blank" style="color: ${primaryAccent};">${item.url}</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- LEADERSHIP POSITIONS -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="main-section" id="section-leadershipPositions" data-section="leadershipPositions">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.users}</span>
          <span class="section-title">Leadership Positions</span>
        </div>
        ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.position || item.title || ''}</div>
              <div class="exp-date">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="exp-company">${item.organization || ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- CO-CURRICULAR -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="main-section" id="section-coCurricular" data-section="coCurricular">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.palette}</span>
          <span class="section-title">Co-curricular Activities</span>
        </div>
        ${nonEmptyCoCurricular.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.activity || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            ${item.role ? `<div class="exp-company">Role: ${item.role}</div>` : ""}
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- EXTRACURRICULAR -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="main-section" id="section-extracurricular" data-section="extracurricular">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.football}</span>
          <span class="section-title">Extracurricular Activities</span>
        </div>
        ${nonEmptyExtracurricular.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.activity || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            ${item.role ? `<div class="exp-company">Role: ${item.role}</div>` : ""}
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- SCHOLARSHIPS -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="main-section" id="section-scholarships" data-section="scholarships">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.trophy}</span>
          <span class="section-title">Scholarships</span>
        </div>
        ${nonEmptyScholarships.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.provider || item.organization || ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- AWARDS -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="main-section" id="section-awards" data-section="awards">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.medal}</span>
          <span class="section-title">Awards & Recognition</span>
        </div>
        ${nonEmptyAwards.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ''}</div>
              ${item.issueYear || item.year ? `<div class="exp-date">${item.issueYear || item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.organization || ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- SPEAKING ENGAGEMENTS -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="main-section" id="section-speakingEngagements" data-section="speakingEngagements">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.microphone}</span>
          <span class="section-title">Speaking Engagements</span>
        </div>
        ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.topic || ''}</div>
              ${item.date ? `<div class="exp-date">${item.date}</div>` : ""}
            </div>
            <div class="exp-company">${item.eventName || ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- MEMBERSHIPS -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="main-section" id="section-memberships" data-section="memberships">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.handshake}</span>
          <span class="section-title">Memberships</span>
        </div>
        ${nonEmptyMemberships.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.membershipName || item.name || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.organizationName || item.organization || ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- WORKSHOPS -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="main-section" id="section-workshops" data-section="workshops">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.chalkboard}</span>
          <span class="section-title">Workshops</span>
        </div>
        ${nonEmptyWorkshops.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.programTitle || item.title || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.conductedBy || ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- CLIENT PROJECTS -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="main-section" id="section-clientProjects" data-section="clientProjects">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.briefcase}</span>
          <span class="section-title">Client Projects</span>
        </div>
        ${nonEmptyClientProjects.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ''}</div>
              ${item.duration ? `<div class="exp-date">${item.duration}</div>` : ""}
            </div>
            <div class="exp-company">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
            ${item.toolsTechnologies ? `<p class="summary-text" style="font-size: 9pt; margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ""}
            ${item.projectUrl ? `<p class="summary-text" style="font-size: 9pt;"><a href="${item.projectUrl}" target="_blank" style="color: ${primaryAccent};">${item.projectUrl}</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- PORTFOLIO -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="main-section" id="section-portfolio" data-section="portfolio">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.folder}</span>
          <span class="section-title">Portfolio</span>
        </div>
        ${nonEmptyPortfolio.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ''}</div>
            </div>
            <div class="exp-company">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
            ${item.url ? `<p class="summary-text" style="font-size: 9pt;"><a href="${item.url}" target="_blank" style="color: ${primaryAccent};">${item.url}</a></p>` : ''}
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- VOLUNTEERING -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="main-section" id="section-volunteering" data-section="volunteering">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.handshake}</span>
          <span class="section-title">Volunteering</span>
        </div>
        ${nonEmptyVolunteering.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.role || ''}</div>
              <div class="exp-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="exp-company">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- MILITARY SERVICE -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="main-section" id="section-militaryService" data-section="militaryService">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.shield}</span>
          <span class="section-title">Military Service</span>
        </div>
        ${nonEmptyMilitaryService.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</div>
              <div class="exp-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            ${item.specialization ? `<div class="exp-company">Specialization: ${item.specialization}</div>` : ''}
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- METHODOLOGIES -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="main-section" id="section-methodologies" data-section="methodologies">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.diagram}</span>
          <span class="section-title">Methodologies</span>
        </div>
        <ul class="sidebar-bullet-list" style="color: #444444;">
          ${nonEmptyMethodologies.map((item: any, idx: number) => `<li data-index="${idx}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- INDUSTRY EXPERTISE -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="main-section" id="section-industryExpertise" data-section="industryExpertise">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.building}</span>
          <span class="section-title">Industry Expertise</span>
        </div>
        <ul class="sidebar-bullet-list" style="color: #444444;">
          ${nonEmptyIndustryExpertise.map((item: any, idx: number) => `<li data-index="${idx}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}</li>`).join("")}
        </ul>
      </div>` : ""}

      <!-- TEACHING EXPERIENCE -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="main-section" id="section-teachingExperience" data-section="teachingExperience">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.chalkboard}</span>
          <span class="section-title">Teaching Experience</span>
        </div>
        ${nonEmptyTeachingExperience.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.subjectCourseTaught || item.title || ''}</div>
              <div class="exp-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="exp-company">${item.institution || ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- MENTORSHIP EXPERIENCE -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="main-section" id="section-mentorshipExperience" data-section="mentorshipExperience">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.users}</span>
          <span class="section-title">Mentorship Experience</span>
        </div>
        ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.mentorshipArea || ''}</div>
              <div class="exp-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="exp-company">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- RESEARCH GRANTS -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="main-section" id="section-researchGrants" data-section="researchGrants">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.flask}</span>
          <span class="section-title">Research Grants</span>
        </div>
        ${nonEmptyResearchGrants.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
            ${item.description ? `<p class="summary-text" style="font-size: 9pt;">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- TEST SCORES -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="main-section" id="section-testScores" data-section="testScores">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.chart}</span>
          <span class="section-title">Test Scores</span>
        </div>
        ${nonEmptyTestScores.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.testName || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- PUBLICATIONS -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="main-section" id="section-publications" data-section="publications">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.book}</span>
          <span class="section-title">Publications</span>
        </div>
        ${nonEmptyPublications.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
            ${item.urlDoi ? `<p class="summary-text" style="font-size: 9pt;"><a href="${item.urlDoi}" target="_blank" style="color: ${primaryAccent};">${item.urlDoi}</a></p>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- PATENTS -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="main-section" id="section-patents" data-section="patents">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.file}</span>
          <span class="section-title">Patents</span>
        </div>
        ${nonEmptyPatents.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ''}</div>
              ${item.year ? `<div class="exp-date">${item.year}</div>` : ""}
            </div>
            <div class="exp-company">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
            ${item.status ? `<p class="summary-text" style="font-size: 9pt; margin-top: 5px;"><strong>Status:</strong> ${item.status}</p>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- REFERENCES -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="main-section" id="section-references" data-section="references">
        <div class="section-title-container">
          <span class="section-icon-bubble">${svgIcons.card}</span>
          <span class="section-title">References</span>
        </div>
        ${nonEmptyReferences.map((item: any, idx: number) => `
          <div class="exp-item" style="margin-bottom: 15px;" data-index="${idx}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ''}</div>
            </div>
            <div class="exp-company">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
            ${item.contactInformation ? `<p class="summary-text" style="font-size: 9pt;">${item.contactInformation}</p>` : ''}
          </div>
        `).join("")}
      </div>` : ""}
      
    </div>
  </div>
</body>
</html>`;
}