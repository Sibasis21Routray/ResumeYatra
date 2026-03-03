import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx'
import { v2 as cloudinary } from 'cloudinary'
import config from '../config/api'
import { Readable } from 'stream'

// Helper function to fetch image as buffer
async function fetchImageAsBuffer(imageUrl: string): Promise<Buffer | null> {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return null

    // Handle base64 encoded images
    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.split(',')[1]
      if (base64Data) {
        return Buffer.from(base64Data, 'base64')
      }
      return null
    }

    // Fetch from URL
    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

// Helper function to strip HTML tags from text
function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Convert nbsp to space
    .replace(/&amp;/g, '&') // Convert &amp; to &
    .replace(/</g, '<') // Convert < to <
    .replace(/>/g, '>') // Convert > to >
    .replace(/"/g, '"') // Convert " to "
    .replace(/&#39;/g, "'") // Convert &#39; to '
    .trim()
}

export async function generateDocx(data: any): Promise<{ url: string; public_id: string }> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: await createDocxContent(data)
    }]
  })

  const buffer = await Packer.toBuffer(doc)

  // Validate buffer
  if (!buffer || buffer.length === 0) {
    throw new Error('Generated DOCX buffer is empty')
  }

  console.log('Generated DOCX buffer size:', buffer.length, 'bytes')

  // Upload to Cloudinary
  if (!config.cloudinaryUrl) {
    throw new Error('Cloudinary URL not configured')
  }

  const uploadResult = await new Promise<any>((resolve, reject) => {
    try {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Changed from 'auto' to 'raw' for binary files
          folder: 'resumes/docx',
          public_id: `resume_${Date.now()}`,
          format: 'docx'
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            console.log('Cloudinary upload success:', result.public_id)
            resolve(result)
          }
        }
      )

      // Create readable stream from buffer
      const stream = new Readable()
      stream.push(buffer)
      stream.push(null)
      stream.pipe(upload)
    } catch (streamError) {
      console.error('Stream creation error:', streamError)
      reject(streamError)
    }
  })

  return { url: uploadResult.secure_url || uploadResult.url, public_id: uploadResult.public_id }
}

export async function generateDocxBuffer(data: any, theme?: any): Promise<Buffer> {
  console.log('Generating DOCX buffer...')

  const doc = new Document({
    sections: [{
      properties: {},
      children: await createDocxContent(data, theme)
    }]
  })

  const buffer = await Packer.toBuffer(doc)

  // Validate buffer
  if (!buffer) {
    throw new Error('Packer.toBuffer returned null or undefined')
  }

  if (!(buffer instanceof Buffer)) {
    throw new Error(`Packer.toBuffer returned ${typeof buffer} instead of Buffer`)
  }

  if (buffer.length === 0) {
    throw new Error('Packer.toBuffer returned empty buffer')
  }

  console.log('Generated DOCX buffer size:', buffer.length, 'bytes')

  // Basic validation for DOCX file structure
  if (buffer.length < 1024) {
    throw new Error(`Generated DOCX buffer seems too small (${buffer.length} bytes) - may be corrupted`)
  }

  // Check DOCX file signature (ZIP file signature: PK)
  const signature = buffer.slice(0, 4).toString('hex')
  if (!signature.startsWith('504b0304')) {
    console.warn('Warning: Buffer may not be a valid DOCX file. Signature:', signature)
  }

  return buffer
}
// Main function to generate DOCX from template HTML
export async function generateDocxFromTemplate(resumeId: string, template: string, theme?: any, currentData?: any): Promise<Buffer> {
  try {
    console.log('Starting DOCX generation from template for resume:', resumeId)
    
    // Import template service
    const templateService = await import('./template.service')
    // const prisma = await import('../db/prisma').then(m => m.default)

    // Get resume and render HTML using template
    // const resume = await prisma.resume.findUnique({
    //   where: { id: resumeId },
    //   include: { versions: true }
    // })

    // if (!resume) {
    //   throw new Error('Resume not found')
    // }

    // Get the HTML from template
    const html = await templateService.renderResumeHtml(resumeId, template, theme, currentData)
    
    if (!html || html.length < 100) {
      throw new Error('Generated HTML is too short or empty')
    }
    
    console.log('Generated HTML length:', html.length)

    // Convert HTML to DOCX using html2docx with proper CommonJS import
    try {
      console.log('Importing html2docx library...')
      
      // Use require for CommonJS module
      const html2docxModule = require('html2docx') // Imports the object { create: [Function: create] }
      
      // *** FIX APPLIED HERE ***
      // We explicitly access the 'create' function which is the actual DOCX conversion function
      const html2docx = html2docxModule.create 
      // *** END OF FIX ***

      if (!html2docx || typeof html2docx !== 'function') {
        throw new Error(`html2docx is not a function. Resolved Type: ${typeof html2docx}`)
      }

      console.log('Converting HTML to DOCX...')
      
      const buffer = await html2docx(html, {
        orientation: 'portrait',
        margins: {
          top: 1000, // 1 inch in twentieths of a point
          right: 1000,
          bottom: 1000,
          left: 1000
        },
        title: 'Resume',
        creator: 'ResumeYatra'
      })

      // Validate the returned buffer
      if (!buffer) {
        throw new Error('html2docx returned null or undefined buffer')
      }
      
      if (!(buffer instanceof Buffer)) {
        throw new Error(`html2docx returned ${typeof buffer} instead of Buffer`)
      }
      
      if (buffer.length === 0) {
        throw new Error('html2docx returned empty buffer')
      }
      
      console.log('Successfully generated DOCX buffer, size:', buffer.length, 'bytes')
      
      // Additional validation: check if it looks like a valid DOCX file
      if (buffer.length < 1024) { // DOCX files should be larger than 1KB
        throw new Error(`DOCX buffer seems too small (${buffer.length} bytes) - may be corrupted`)
      }
      
      // Check DOCX file signature (PK header)
      const signature = buffer.slice(0, 4).toString('hex')
      if (!signature.startsWith('504b0304')) {
        console.warn('Warning: Buffer may not be a valid DOCX file. Signature:', signature)
      }
      
      return buffer
    } catch (conversionError: any) {
      console.error('html2docx conversion error:', conversionError)
      throw new Error(`Failed to convert HTML to DOCX: ${conversionError.message || conversionError}`)
    }
  } catch (error: any) {
    console.error('Error generating DOCX from template:', error)
    throw new Error(`DOCX generation failed: ${error.message || error}`)
  }
}

async function createDocxContent(data: any, theme?: any): Promise<any[]> {
  const children: any[] = []

  // Set default theme if not provided
  const defaultTheme = {
    primary: '#2c3e50',
    secondary: '#64748b',
    background: '#ffffff'
  }
  const currentTheme = theme || defaultTheme

  // Extract hex color (remove # if present)
  const getPrimaryColor = () => {
    const color = currentTheme.primary || '#2c3e50'
    return color.startsWith('#') ? color.substring(1) : color
  }

  const primaryColor = getPrimaryColor()

  // Personal Info
  if (data.personal && data.personal.name) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: stripHtml(String(data.personal.name)), bold: true, size: 32, color: primaryColor })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    )
  }

  const contactInfo: TextRun[] = []
  if (data.personal && data.personal.email) {
    contactInfo.push(new TextRun({ text: stripHtml(String(data.personal.email)) }))
  }
  if (data.personal && data.personal.phone) {
    contactInfo.push(new TextRun({ text: ` | ${stripHtml(String(data.personal.phone))}` }))
  }
  if (data.personal && data.personal.location) {
    contactInfo.push(new TextRun({ text: ` | ${stripHtml(String(data.personal.location))}` }))
  }

  if (contactInfo.length > 0) {
    children.push(
      new Paragraph({
        children: contactInfo,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    )
  }

  // Add photo if available
  if (data.personal && data.personal.image && typeof data.personal.image === 'string') {
    try {
      console.log('Processing image for DOCX...')
      const imageBuffer = await fetchImageAsBuffer(data.personal.image)


      if (imageBuffer && imageBuffer.length > 0) {
        // Validate image buffer
        if (imageBuffer.length < 100) {
          console.warn('Image buffer too small, skipping:', imageBuffer.length, 'bytes')
        } else {
          // Basic image format validation
          const imageSignature = imageBuffer.slice(0, 4).toString('hex')
          const validImageSignatures = [
            '89504e47', // PNG
            'ffd8ffe0', // JPEG
            'ffd8ffe1', // JPEG
            'ffd8ffe2', // JPEG
            'ffd8ffe3', // JPEG
            'ffd8ffe8', // JPEG
            '47494638'  // GIF
          ]

          if (!validImageSignatures.some(sig => imageSignature.startsWith(sig))) {
            console.warn('Unknown image format, signature:', imageSignature)
            // Continue anyway as it might still work
          }

          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 100,
                    height: 100,
                  },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            })
          )
          console.log('Successfully embedded image in DOCX, size:', imageBuffer.length, 'bytes, signature:', imageSignature)
        }
      } else {
        console.log('Image buffer is empty or null')
      }
    } catch (error) {
      console.error('Error processing photo for DOCX:', error)
      // Continue without image if there's an error
    }
  }

  // Summary
  if (data.summary && typeof data.summary === 'string') {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Professional Summary', bold: true, size: 24, color: primaryColor })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: stripHtml(String(data.summary)), size: 22 })],
        spacing: { after: 400 }
      })
    )
  }

  // Experience
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Experience', bold: true, size: 24, color: primaryColor })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      })
    )

    data.experience.forEach((exp: any) => {
      if (!exp || typeof exp !== 'object') return

      const titleLine = `${stripHtml(exp.title || '')} at ${stripHtml(exp.company || '')}`
      const dateLine = `${stripHtml(exp.startDate || '')} - ${stripHtml(exp.endDate || 'Present')}`

      children.push(
        new Paragraph({
          children: [new TextRun({ text: titleLine.trim() || 'Experience Entry', bold: true, size: 22 })],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [new TextRun({ text: dateLine.trim(), italics: true, size: 20 })],
          spacing: { after: 200 }
        })
      )

      if (exp.description && typeof exp.description === 'string') {
        // Strip HTML and split by bullet points or newlines
        const cleanedDescription = stripHtml(exp.description)
        const bullets = cleanedDescription.split(/\n|•|-/).filter((line: string) => line && line.trim())
        bullets.forEach((bullet: string) => {
          if (bullet.trim()) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: `• ${bullet.trim()}`, size: 22 })],
                spacing: { after: 100 }
              })
            )
          }
        })
      }

      children.push(new Paragraph({ children: [], spacing: { after: 200 } }))
    })
  }

  // Education
  if (Array.isArray(data.education) && data.education.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Education', bold: true, size: 24, color: primaryColor })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      })
    )

    data.education.forEach((edu: any) => {
      if (!edu || typeof edu !== 'object') return

      const degreeLine = `${stripHtml(edu.degree || '')} ${edu.field ? `in ${stripHtml(edu.field)}` : ''}`.trim()
      const schoolLine = `${stripHtml(edu.school || '')} ${edu.graduationDate ? `, ${stripHtml(edu.graduationDate)}` : ''}`.trim()

      if (degreeLine) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: degreeLine, bold: true, size: 22 })],
            spacing: { after: 100 }
          })
        )
      }

      if (schoolLine) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: schoolLine, size: 22 })],
            spacing: { after: 300 }
          })
        )
      }
    })
  }

  // Projects
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Projects', bold: true, size: 24, color: primaryColor })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      })
    )

    data.projects.forEach((project: any) => {
      if (!project || typeof project !== 'object') return

      if (project.name) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(String(project.name)), bold: true, size: 22 })],
            spacing: { after: 100 }
          })
        )
      }

      if (project.technologies && typeof project.technologies === 'string') {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Technologies: ${stripHtml(String(project.technologies))}`, italics: true, size: 20 })],
            spacing: { after: 100 }
          })
        )
      }

      if (project.description && typeof project.description === 'string') {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(String(project.description)), size: 22 })],
            spacing: { after: 100 }
          })
        )
      }

      if (project.url && typeof project.url === 'string') {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(String(project.url)), size: 22 })],
            spacing: { after: 300 }
          })
        )
      }
    })
  }

  // Skills
  if (Array.isArray(data.skills) && data.skills.length > 0) {
    const skillsText = data.skills
      .filter((skill: any) => skill && typeof skill === 'string')
      .map((skill: any) => stripHtml(String(skill)))
      .join(', ')

    if (skillsText) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'Skills', bold: true, size: 24, color: primaryColor })],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: skillsText, size: 22 })],
          spacing: { after: 400 }
        })
      )
    }
  }

  // Certifications
  if (Array.isArray(data.certifications) && data.certifications.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Certifications', bold: true, size: 24, color: primaryColor })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      })
    )

    data.certifications.forEach((cert: any) => {
      if (!cert || typeof cert !== 'object') return

      const certLine = `${stripHtml(cert.name || '')} ${cert.issuer ? `- ${stripHtml(cert.issuer)}` : ''} ${cert.date ? `(${stripHtml(cert.date)})` : ''}`.trim()
      if (certLine) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: certLine, size: 22 })],
            spacing: { after: 200 }
          })
        )
      }
    })
  }

  // Languages
  if (Array.isArray(data.languages) && data.languages.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Languages', bold: true, size: 24, color: primaryColor })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      })
    )

    data.languages.forEach((lang: any) => {
      if (!lang || typeof lang !== 'object') return

      const langLine = `${stripHtml(lang.language || '')} ${lang.proficiency ? `- ${stripHtml(lang.proficiency)}` : ''}`.trim()
      if (langLine) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: langLine, size: 22 })],
            spacing: { after: 200 }
          })
        )
      }
    })
  }


  // Custom Sections
  if (Array.isArray(data.customSections) && data.customSections.length > 0) {
    data.customSections.forEach((section: any) => {
      if (!section || typeof section !== 'object' || !section.isVisible) return

      // Section heading
      if (section.heading && typeof section.heading === 'string' && section.heading.trim()) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: stripHtml(section.heading.trim()), bold: true, size: 24, color: primaryColor })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 }
          })
        )
      }

      // Section entries
      if (Array.isArray(section.entries)) {
        section.entries.forEach((entry: any) => {
          if (!entry || typeof entry !== 'object' || !entry.isVisible) return

          // Entry title and organization
          const titleLine = []
          if (entry.title && typeof entry.title === 'string' && entry.title.trim()) {
            titleLine.push(new TextRun({ text: stripHtml(entry.title.trim()), bold: true, size: 22 }))
          }
          if (entry.organization && typeof entry.organization === 'string' && entry.organization.trim()) {
            if (titleLine.length > 0) {
              titleLine.push(new TextRun({ text: ' at ', size: 22 }))
            }
            titleLine.push(new TextRun({ text: stripHtml(entry.organization.trim()), size: 22 }))
          }

          if (titleLine.length > 0) {
            children.push(
              new Paragraph({
                children: titleLine,
                spacing: { after: 100 }
              })
            )
          }

          // Entry date/duration
          if (entry.date && typeof entry.date === 'string' && entry.date.trim()) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: stripHtml(entry.date.trim()), italics: true, size: 20 })],
                spacing: { after: 200 }
              })
            )
          }

          // Entry description
          if (entry.description && typeof entry.description === 'string' && entry.description.trim()) {
            // Strip HTML and split by bullet points or newlines
            const cleanedDescription = stripHtml(entry.description)
            const bullets = cleanedDescription.split(/\n|•|-/).filter((line: string) => line && line.trim())
            
            if (bullets.length === 1) {
              // Single line description
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: bullets[0].trim(), size: 22 })],
                  spacing: { after: 200 }
                })
              )
            } else {
              // Multiple lines or bullet points
              bullets.forEach((bullet: string) => {
                if (bullet.trim()) {
                  children.push(
                    new Paragraph({
                      children: [new TextRun({ text: `• ${bullet.trim()}`, size: 22 })],
                      spacing: { after: 100 }
                    })
                  )
                }
              })
              children.push(new Paragraph({ children: [], spacing: { after: 200 } }))
            }
          }
        })
      }
    })
  }

  return children
}