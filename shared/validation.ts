/**
 * Validation Schemas
 * 
 * Zod schemas for runtime validation of API requests and data.
 * These provide type-safe validation at API boundaries.
 */

import { z } from 'zod';

/**
 * Authentication Validation Schemas
 */
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ['passwordConfirm'],
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ['passwordConfirm'],
});

/**
 * Knowledge Base Validation Schemas
 */
export const createKBSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().default(''),
});

export const updateKBSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
}).refine((data) => data.name !== undefined || data.description !== undefined, {
  message: 'At least one field must be provided',
});

export const addUserToKBSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

/**
 * Document Validation Schemas
 */
export const fileTypeSchema = z.enum(['pdf', 'csv', 'text', 'audio']);

export const uploadDocumentSchema = z.object({
  knowledge_base_id: z.string().min(1, 'Knowledge base ID is required'),
  file: z.instanceof(File, { message: 'File is required' }),
});

export const documentListRequestSchema = z.object({
  knowledge_base_id: z.string().optional(),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
});

/**
 * Search Validation Schemas
 */
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500),
  knowledge_base_id: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  similarity_threshold: z.number().min(0).max(1).default(0.7),
});

export const globalSearchSchema = searchSchema;

export const kbSearchSchema = searchSchema.extend({
  knowledge_base_id: z.string().min(1, 'Knowledge base ID is required'),
});

/**
 * Processing Status Validation
 */
export const processingStatusSchema = z.enum([
  'uploading',
  'processing',
  'chunking',
  'embedding',
  'completed',
  'failed',
]);

/**
 * n8n Webhook Validation Schemas
 */
export const progressUpdateSchema = z.object({
  document_id: z.string().min(1),
  progress: z.number().min(0).max(100),
  status: processingStatusSchema,
  chunks_total: z.number().int().nonnegative().optional(),
  chunks_processed: z.number().int().nonnegative().optional(),
  qdrant_points: z.array(z.string()).optional(),
  error_message: z.string().optional(),
  current_step: z.string().optional(),
});

export const processDocumentSchema = z.object({
  document_id: z.string().min(1),
  knowledge_base_id: z.string().min(1),
  file_data: z.string().min(1),
  file_type: fileTypeSchema,
  metadata: z.object({
    filename: z.string(),
    original_name: z.string(),
    user_id: z.string(),
    file_size: z.number().int().nonnegative(),
  }),
});

export const searchVectorSchema = z.object({
  query: z.string().min(1),
  knowledge_base_id: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  similarity_threshold: z.number().min(0).max(1).default(0.7),
  user_id: z.string().optional(),
});

export const deleteDocumentSchema = z.object({
  document_id: z.string().min(1),
  qdrant_points: z.array(z.string()),
  knowledge_base_id: z.string().min(1),
});

/**
 * User Management Validation Schemas
 */
export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
}).refine((data) => 
  data.username !== undefined || 
  data.email !== undefined || 
  data.avatar !== undefined, {
  message: 'At least one field must be provided',
});

/**
 * Pagination Validation Schema
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(20),
});

/**
 * ID Validation Schema
 */
export const idSchema = z.string().min(1, 'ID is required');

/**
 * Helper function to validate data against a schema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Helper function to format validation errors
 */
export function formatValidationErrors(error: z.ZodError): Array<{
  field: string;
  message: string;
}> {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Express middleware helper for validation
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => {
    const result = validateData(schema, data);
    if (!result.success) {
      throw new Error(JSON.stringify(formatValidationErrors(result.errors)));
    }
    return result.data;
  };
}

/**
 * Type exports for inferred types from schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateKBInput = z.infer<typeof createKBSchema>;
export type UpdateKBInput = z.infer<typeof updateKBSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
export type ProcessDocumentInput = z.infer<typeof processDocumentSchema>;
