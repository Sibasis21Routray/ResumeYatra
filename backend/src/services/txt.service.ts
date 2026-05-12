export async function generateTxt(data: any): Promise<string> {
  // Ensure data is an object
  if (!data || typeof data !== 'object') {
    return ''
  }

  // Helper function to strip HTML tags
  const stripHtml = (html: string): string => {
    if (!html || typeof html !== 'string') return ''
    return html
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ') // Convert nbsp to space
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
  }

  let txt = ''

  // Personal Info
  if (data.personal && typeof data.personal === 'object') {
    if (data.personal.name) txt += `${stripHtml(String(data.personal.name))}\n`
    if (data.personal.email) txt += `${stripHtml(String(data.personal.email))}\n`
    if (data.personal.phone) txt += `${stripHtml(String(data.personal.phone))}\n`
    if (data.personal.location) txt += `${stripHtml(String(data.personal.location))}\n`
    if (data.personal.linkedin) txt += `${stripHtml(String(data.personal.linkedin))}\n`
    if (data.personal.github) txt += `${stripHtml(String(data.personal.github))}\n`
  }
  txt += '\n'

  // Summary
  if (data.summary && typeof data.summary === 'string') {
    txt += 'PROFESSIONAL SUMMARY\n'
    txt += `${stripHtml(String(data.summary))}\n\n`
  }

  // Experience
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    txt += 'EXPERIENCE\n'
    data.experience.forEach((exp: any) => {
      if (!exp || typeof exp !== 'object') return
      txt += `${stripHtml(exp.title || '')} at ${stripHtml(exp.company || '')}\n`
      txt += `${stripHtml(exp.startDate || '')} - ${stripHtml(exp.endDate || 'Present')}\n`
      if (exp.description && typeof exp.description === 'string') {
        txt += `${stripHtml(String(exp.description))}\n`
      }
      txt += '\n'
    })
  }

  // Education
  if (Array.isArray(data.education) && data.education.length > 0) {
    txt += 'EDUCATION\n'
    data.education.forEach((edu: any) => {
      if (!edu || typeof edu !== 'object') return
      const degree = edu.degree ? stripHtml(String(edu.degree)) : ''
      const field = edu.field ? stripHtml(String(edu.field)) : ''
      const school = edu.school ? stripHtml(String(edu.school)) : ''
      const gradDate = edu.graduationDate ? stripHtml(String(edu.graduationDate)) : ''
      
      if (degree || field) {
        txt += `${degree} ${field}`.trim() + '\n'
      }
      if (school || gradDate) {
        txt += `${school} ${gradDate}`.trim() + '\n'
      }
      txt += '\n'
    })
  }

  // Projects
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    txt += 'PROJECTS\n'
    data.projects.forEach((project: any) => {
      if (!project || typeof project !== 'object') return
      if (project.name) txt += `${stripHtml(String(project.name))}\n`
      if (project.technologies) txt += `Technologies: ${stripHtml(String(project.technologies))}\n`
      if (project.description) txt += `${stripHtml(String(project.description))}\n`
      if (project.url) txt += `${stripHtml(String(project.url))}\n`
      txt += '\n'
    })
  }

  // Skills
  if (Array.isArray(data.skills) && data.skills.length > 0) {
    const validSkills = data.skills
      .filter((skill: any) => skill && typeof skill === 'string')
      .map((skill: any) => stripHtml(String(skill)))
    if (validSkills.length > 0) {
      txt += 'SKILLS\n'
      txt += validSkills.join(', ') + '\n\n'
    }
  }

  // Certifications
  if (Array.isArray(data.certifications) && data.certifications.length > 0) {
    txt += 'CERTIFICATIONS\n'
    data.certifications.forEach((cert: any) => {
      if (!cert || typeof cert !== 'object') return
      const name = cert.name ? stripHtml(String(cert.name)) : ''
      const issuer = cert.issuer ? stripHtml(String(cert.issuer)) : ''
      const date = cert.date ? stripHtml(String(cert.date)) : ''
      const certLine = `${name} ${issuer ? `- ${issuer}` : ''} ${date ? `(${date})` : ''}`.trim()
      if (certLine) txt += `${certLine}\n`
    })
    txt += '\n'
  }

  // Languages
  if (Array.isArray(data.languages) && data.languages.length > 0) {
    txt += 'LANGUAGES\n'
    data.languages.forEach((lang: any) => {
      if (!lang || typeof lang !== 'object') return
      const language = lang.language ? stripHtml(String(lang.language)) : ''
      const proficiency = lang.proficiency ? stripHtml(String(lang.proficiency)) : ''
      const langLine = `${language} ${proficiency ? `- ${proficiency}` : ''}`.trim()
      if (langLine) txt += `${langLine}\n`
    })
    txt += '\n'
  }


  // Custom Sections
  if (Array.isArray(data.customSections) && data.customSections.length > 0) {
    data.customSections.forEach((section: any) => {
      if (!section || typeof section !== 'object' || !section.isVisible) return

      // Section heading
      if (section.heading && typeof section.heading === 'string' && section.heading.trim()) {
        txt += `${stripHtml(section.heading.trim()).toUpperCase()}\n`
      }

      // Section entries
      if (Array.isArray(section.entries)) {
        section.entries.forEach((entry: any) => {

          if (!entry || typeof entry !== 'object' || !entry.isVisible) return

          // Entry title and organization
          const titleParts = []
          if (entry.title && typeof entry.title === 'string' && entry.title.trim()) {
            titleParts.push(stripHtml(entry.title.trim()))
          }
          if (entry.organization && typeof entry.organization === 'string' && entry.organization.trim()) {
            titleParts.push(`at ${stripHtml(entry.organization.trim())}`)
          }
          
          if (titleParts.length > 0) {
            txt += `${titleParts.join(' ')}\n`
          }

          // Entry date/duration
          if (entry.date && typeof entry.date === 'string' && entry.date.trim()) {
            txt += `${stripHtml(entry.date.trim())}\n`
          }

          // Entry description
          if (entry.description && typeof entry.description === 'string' && entry.description.trim()) {
            const cleanedDescription = stripHtml(entry.description)
            const bullets = cleanedDescription.split(/\n|•|-/).filter((line: string) => line && line.trim())
            
            bullets.forEach((bullet: string) => {
              if (bullet.trim()) {
                txt += `• ${bullet.trim()}\n`
              }
            })
          }
          
          txt += '\n' // Add spacing between entries
        })
      }
      
      txt += '\n' // Add extra spacing between sections
    })
  }

  return txt.trim()
}