import * as fs from 'fs'
import * as path from 'path'
import * as templateService from '../services/template.service'
import { generatePdfBuffer } from '../services/pdf.service'
import * as https from 'https'

async function run() {
  try {
    console.log('Rendering sample HTML for "professional" template')
    const url = await templateService.renderTemplateSample('professional')
    console.log('HTML URL:', url)

    // Fetch HTML from Cloudinary
    const html = await new Promise<string>((resolve, reject) => {
      https.get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => data += chunk)
        res.on('end', () => resolve(data))
      }).on('error', reject)
    })
    console.log('HTML length:', html.length)

    console.log('Generating PDF buffer...')
    const pdfBuffer = await generatePdfBuffer(html)
    console.log('PDF buffer length:', pdfBuffer.length)
    console.log('PDF signature (ascii):', pdfBuffer.subarray(0,4).toString('ascii'))
    console.log('PDF first 20 bytes (hex):', pdfBuffer.subarray(0,20).toString('hex'))

    const cwd = process.cwd();
    const outPath = path.join(cwd.endsWith('backend') ? cwd : path.join(cwd, 'backend'), 'temp', 'resumeyatra_test.pdf')
    fs.writeFileSync(outPath, pdfBuffer)
    console.log('Wrote PDF to', outPath)
  } catch (err:any) {
    console.error('Test PDF generation failed:', err)
    process.exitCode = 1
  }
}

run()
