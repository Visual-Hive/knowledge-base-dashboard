/**
 * Shared Types and Utilities Index
 * 
 * Central export point for all shared types, schemas, and utilities.
 * Import from '@shared' instead of individual files for consistency.
 */

// Core Types
export type {
  BaseRecord,
  User,
  KnowledgeBase,
  Document,
  ProcessingJob,
  ProcessingStatus,
  FileType,
  DocumentExpanded,
  KnowledgeBaseExpanded,
  CreateKnowledgeBase,
  UpdateKnowledgeBase,
  CreateDocument,
  UpdateDocument,
} from './types';

export {
  isProcessingStatus,
  isFileType,
} from './types';

// API Types
export type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  CreateKBRequest,
  UpdateKBRequest,
  AddUserToKBRequest,
  KBListResponse,
  UploadDocumentRequest,
  DocumentListRequest,
  DocumentListResponse,
  DeleteDocumentRequest,
  SearchRequest,
  SearchResultItem,
  SearchResponse,
  GlobalSearchRequest,
  KBSearchRequest,
  ProcessingProgressResponse,
  ProcessingJobResponse,
  ValidationError,
  ErrorResponse,
  WSMessage,
  WSProgressUpdate,
  WSDocumentComplete,
  WSDocumentFailed,
  FileUploadProgress,
  FileUploadResult,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserResponse,
  KBStatsResponse,
  UserStatsResponse,
} from './api';

export {
  isApiResponse,
  isErrorResponse,
  isSearchResponse,
} from './api';

// n8n Types
export type {
  N8NBasePayload,
  ProcessDocumentPayload,
  ProgressUpdatePayload,
  SearchVectorPayload,
  SearchVectorResponse,
  SearchVectorResult,
  DeleteDocumentPayload,
  DeleteDocumentResponse,
  CleanupOrphanedPayload,
  CleanupOrphanedResponse,
  ParseFilePayload,
  ParseFileResponse,
  ChunkContentPayload,
  ChunkContentResponse,
  EmbedChunksPayload,
  EmbedChunksResponse,
  SearchHybridPayload,
  SearchHybridResponse,
  BatchProcessPayload,
  BatchProcessResponse,
} from './n8n';

export {
  N8N_ENDPOINTS,
  isN8NSuccessResponse,
  isN8NErrorResponse,
} from './n8n';

// Validation Schemas
export {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  createKBSchema,
  updateKBSchema,
  addUserToKBSchema,
  fileTypeSchema,
  uploadDocumentSchema,
  documentListRequestSchema,
  searchSchema,
  globalSearchSchema,
  kbSearchSchema,
  processingStatusSchema,
  progressUpdateSchema,
  processDocumentSchema,
  searchVectorSchema,
  deleteDocumentSchema,
  updateUserSchema,
  paginationSchema,
  idSchema,
  validateData,
  formatValidationErrors,
  createValidator,
} from './validation';

export type {
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  CreateKBInput,
  UpdateKBInput,
  SearchInput,
  ProgressUpdateInput,
  ProcessDocumentInput,
} from './validation';
