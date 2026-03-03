import { Resume, SectionStyles } from '../../types/resume';

interface ResumePreviewProps {
  resume: Resume;
  onSectionClick: (section: string) => void;
  selectedSection: string;
}

export default function ResumePreview({
  resume,
  onSectionClick,
  selectedSection
}: ResumePreviewProps) {
  const getStyleObject = (styles?: SectionStyles): React.CSSProperties => {
    if (!styles) return {};
    return {
      fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
      fontFamily: styles.fontFamily || undefined,
      color: styles.color || undefined,
      backgroundColor: styles.backgroundColor || undefined,
      textAlign: styles.textAlign || undefined,
      fontWeight: styles.fontWeight || undefined,
      fontStyle: styles.fontStyle || undefined,
      textDecoration: styles.textDecoration || undefined,
      lineHeight: styles.lineHeight || undefined,
      marginTop: styles.marginTop ? `${styles.marginTop}px` : undefined,
      marginBottom: styles.marginBottom ? `${styles.marginBottom}px` : undefined,
      paddingTop: styles.paddingTop ? `${styles.paddingTop}px` : undefined,
      paddingBottom: styles.paddingBottom ? `${styles.paddingBottom}px` : undefined,
    };
  };

  const getSectionClasses = (section: string) => {
    // Remove the blue selected overlay — always use hover state only
    return `cursor-pointer transition-all p-4 rounded hover:bg-gray-50`;
  };

  const globalStyles = getStyleObject(resume.styles.global);
  const titleStyles = getStyleObject(resume.styles.sectionTitles);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-8" style={globalStyles}>
        <div
          className={getSectionClasses('personalInfo')}
          onClick={() => onSectionClick('personalInfo')}
          style={getStyleObject(resume.styles.personalInfo)}
        >
          <h1 className="text-3xl font-bold mb-2">
            {resume.personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="text-sm space-y-1">
            {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
            {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
            {resume.personalInfo.address && <p>{resume.personalInfo.address}</p>}
          </div>
          {resume.personalInfo.summary && (
            <p className="mt-4 text-gray-700">{resume.personalInfo.summary}</p>
          )}
        </div>

        {resume.experience.length > 0 && (
          <div
            className={getSectionClasses('experience')}
            onClick={() => onSectionClick('experience')}
            style={getStyleObject(resume.styles.experience)}
          >
            <h2 className="text-2xl font-bold mb-4" style={titleStyles}>
              Experience
            </h2>
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="text-lg font-semibold">{exp.position}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="mt-2 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {resume.education.length > 0 && (
          <div
            className={getSectionClasses('education')}
            onClick={() => onSectionClick('education')}
            style={getStyleObject(resume.styles.education)}
          >
            <h2 className="text-2xl font-bold mb-4" style={titleStyles}>
              Education
            </h2>
            {resume.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-gray-700 font-medium">{edu.institution}</p>
                <p className="text-sm text-gray-600">
                  {edu.field} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        {resume.skills.length > 0 && (
          <div
            className={getSectionClasses('skills')}
            onClick={() => onSectionClick('skills')}
            style={getStyleObject(resume.styles.skills)}
          >
            <h2 className="text-2xl font-bold mb-4" style={titleStyles}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {skill.name} {skill.level && `(${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
