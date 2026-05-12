import * as yup from 'yup';

// Validation Schemas
export const personalInfoSchema = yup.object().shape({
  name: yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  location: yup.string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  linkedin: yup.string()
    .url('Please enter a valid LinkedIn URL')
    .optional(),
  linkedinText: yup.string()
    .max(50, 'LinkedIn text must be less than 50 characters')
    .optional(),
  github: yup.string()
    .url('Please enter a valid GitHub URL')
    .optional(),
  githubText: yup.string()
    .max(50, 'GitHub text must be less than 50 characters')
    .optional(),
  image: yup.string()
    .url('Please enter a valid image URL')
    .optional(),
});

export const summarySchema = yup.object().shape({
  summary: yup.string()
    .required('Professional summary is required')
    .min(50, 'Summary must be at least 50 characters')
    .max(500, 'Summary must be less than 500 characters'),
});

export const experienceSchema = yup.array().of(
  yup.object().shape({
    company: yup.string()
      .required('Company name is required')
      .max(100, 'Company name must be less than 100 characters'),
    title: yup.string()
      .required('Job title is required')
      .max(100, 'Job title must be less than 100 characters'),
    startDate: yup.date()
      .required('Start date is required'),
    endDate: yup.date()
      .when('current', {
        is: false,
        then: (schema) => schema
          .required('End date is required')
          .min(yup.ref('startDate'), 'End date must be after start date'),
      }),
    description: yup.string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional(),
    current: yup.boolean(),
  })
).min(1, 'At least one experience entry is required');

export const educationSchema = yup.array().of(
  yup.object().shape({
    school: yup.string()
      .required('School name is required')
      .max(100, 'School name must be less than 100 characters'),
    degree: yup.string()
      .required('Degree is required')
      .max(100, 'Degree must be less than 100 characters'),
    field: yup.string()
      .max(100, 'Field of study must be less than 100 characters')
      .optional(),
    graduationDate: yup.date()
      .required('Graduation date is required'),
  })
);

export const projectsSchema = yup.array().of(
  yup.object().shape({
    name: yup.string()
      .required('Project name is required')
      .max(100, 'Project name must be less than 100 characters'),
    description: yup.string()
      .required('Project description is required')
      .min(20, 'Description must be at least 20 characters')
      .max(500, 'Description must be less than 500 characters'),
    technologies: yup.string()
      .max(200, 'Technologies must be less than 200 characters')
      .optional(),
    url: yup.string()
      .url('Please enter a valid URL')
      .optional(),
    urlText: yup.string()
      .max(50, 'URL text must be less than 50 characters')
      .optional(),
  })
);

export const skillsSchema = yup.array().of(
  yup.string()
    .required('Skill name is required')
    .max(50, 'Skill name must be less than 50 characters')
).min(1, 'At least one skill is required');

// Validation Functions
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export async function validateSection(section: string, data: any): Promise<ValidationResult> {
  try {
    let schema: yup.AnySchema;

    switch (section) {
      case 'personal':
        schema = personalInfoSchema;
        break;
      case 'summary':
        schema = summarySchema;
        break;
      case 'experience':
        schema = experienceSchema;
        break;
      case 'projects':
        schema = projectsSchema;
        break;
      case 'education':
        schema = educationSchema;
        break;
      case 'skills':
        schema = skillsSchema;
        break;
      default:
        return { isValid: true, errors: {} };
    }

    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string> = {};

    if (error.inner) {
      error.inner.forEach((err: any) => {
        const path = err.path || 'general';
        errors[path] = err.message;
      });
    } else {
      errors.general = error.message;
    }

    return { isValid: false, errors };
  }
}

export async function validateResume(data: any): Promise<ValidationResult> {
  const allErrors: Record<string, string> = {};
  let isValid = true;

  const sections = ['personal', 'summary', 'experience', 'projects', 'education', 'skills'];

  for (const section of sections) {
    const sectionData = getSectionData(section, data);
    const result = await validateSection(section, sectionData);

    if (!result.isValid) {
      isValid = false;
      // Prefix section errors with section name
      Object.keys(result.errors).forEach(key => {
        allErrors[`${section}.${key}`] = result.errors[key];
      });
    }
  }

  return { isValid, errors: allErrors };
}

export function getFieldError(errors: Record<string, string>, fieldPath: string): string | null {
  return errors[fieldPath] || null;
}

export function getFieldValidationState(
  errors: Record<string, string>,
  fieldPath: string,
  isTouched: boolean
): 'default' | 'error' | 'success' {
  if (!isTouched) return 'default';
  return errors[fieldPath] ? 'error' : 'success';
}

// Helper function to extract section data from resume data
function getSectionData(section: string, data: any): any {
  switch (section) {
    case 'personal':
      return data.personal || {};
    case 'summary':
      return { summary: data.summary || '' };
    case 'experience':
      return data.experience || [];
    case 'projects':
      return data.projects || [];
    case 'education':
      return data.education || [];
    case 'skills':
      return data.skills || [];
    default:
      return null;
  }
}

// Field-specific validation for real-time feedback
export async function validateField(fieldPath: string, value: any): Promise<string | null> {
  try {
    const [section, field] = fieldPath.split('.');

    let fieldSchema: yup.AnySchema;

    switch (`${section}.${field}`) {
      case 'personal.name':
        fieldSchema = yup.string().required('Name is required').min(2).max(100);
        break;
      case 'personal.email':
        fieldSchema = yup.string().required('Email is required').email('Invalid email');
        break;
      case 'personal.phone':
        fieldSchema = yup.string().matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional();
        break;
      case 'personal.location':
        fieldSchema = yup.string().max(100).optional();
        break;
      case 'personal.linkedin':
        fieldSchema = yup.string().url('Invalid URL').optional();
        break;
      case 'personal.github':
        fieldSchema = yup.string().url('Invalid URL').optional();
        break;
      case 'personal.image':
        fieldSchema = yup.string().url('Invalid URL').optional();
        break;
      case 'summary.summary':
        fieldSchema = yup.string().required('Summary is required').min(50).max(500);
        break;
      default:
        return null;
    }

    await fieldSchema.validate(value);
    return null;
  } catch (error: any) {
    return error.message;
  }
}
