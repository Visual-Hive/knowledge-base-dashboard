/**
 * API Request/Response Types
 * 
 * These types define the structure of API requests and responses
 * for communication between frontend and backend.
 */

import type { User, KnowledgeBase, Document, ProcessingJob } from './types';

/**
 * Generic API Response Wrapper
 * All API endpoints should return this structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated Response
 * For endpoints that return lists of items
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Authentication API Types
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  token: string;
  record: User;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

/**
 * Knowledge Base API Types
 */
export interface CreateKBRequest {
  name: string;
  description: string;
}

export interface UpdateKBRequest {
  name?: string;
  description?: string;
}

export interface AddUserToKBRequest {
  userId: string;
}

export interface KBListResponse {
  knowledgeBases: KnowledgeBase[];
}

/**
 * Document API Types
 */
export interface UploadDocumentRequest {
  knowledge_base_id: string;
  file: File;
}

export interface DocumentListRequest {
  knowledge_base_id?: string;
  page?: number;
  perPage?: number;
  sort?: string;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  perPage: number;
}

export interface DeleteDocumentRequest {
  document_id: string;
}

/**
 * Search API Types
 */
export interface SearchRequest {
  query: string;
  knowledge_base_id?: string;
  limit?: number;
  similarity_threshold?: number;
}

export interface SearchResultItem {
  content: string;              // The actual text chunk
  score: number;                // Similarity score (0-1)
  document_id: string;          // Pocketbase document ID
  knowledge_base_id: string;    // Stable KB ID from Qdrant
  chunk_index: number;          // Which chunk in the document
  qdrant_point_id: string;      // Qdrant point ID
  // Enriched metadata from Pocketbase
  document?: Document;
  knowledge_base?: KnowledgeBase;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total_results: number;
  query: string;
  knowledge_base_id?: string;
}

export interface GlobalSearchRequest extends SearchRequest {
  // Search across all accessible knowledge bases
}

export interface KBSearchRequest extends SearchRequest {
  knowledge_base_id: string;  // Required for KB-specific search
}

/**
 * Progress/Processing API Types
 */
export interface ProcessingProgressResponse {
  document_id: string;
  status: string;
  progress: number;
  current_step: string;
  error_message?: string;
}

export interface ProcessingJobResponse {
  job: ProcessingJob;
}

/**
 * Error Response Types
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: ValidationError[];
  code?: string;
}

/**
 * WebSocket Message Types
 */
export interface WSMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface WSProgressUpdate {
  document_id: string;
  progress: number;
  status: string;
  current_step: string;
}

export interface WSDocumentComplete {
  document_id: string;
  document: Document;
}

export interface WSDocumentFailed {
  document_id: string;
  error_message: string;
}

/**
 * File Upload Types
 */
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResult {
  document: Document;
  upload_url?: string;
}

/**
 * User Management API Types
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface UserResponse {
  user: User;
}

/**
 * Analytics/Stats API Types
 */
export interface KBStatsResponse {
  knowledge_base_id: string;
  total_documents: number;
  total_chunks: number;
  total_size: number;  // bytes
  last_updated: string;
}

export interface UserStatsResponse {
  total_knowledge_bases: number;
  total_documents: number;
  storage_used: number;  // bytes
  recent_searches: number;
}

/**
 * Type Guards for Response Validation
 */
export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as ApiResponse).success === 'boolean'
  );
}

export function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return (
    isApiResponse(obj) &&
    obj.success === false &&
    typeof obj.error === 'string'
  );
}

export function isSearchResponse(obj: unknown): obj is SearchResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'results' in obj &&
    Array.isArray((obj as SearchResponse).results)
  );
}
