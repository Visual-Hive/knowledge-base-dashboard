/**
 * n8n Webhook Payload Types
 * 
 * These types define the structure of payloads sent to and received from
 * n8n webhooks for document processing and vector search operations.
 */

import type { FileType, ProcessingStatus } from './types';

/**
 * Base n8n Webhook Payload
 * All payloads to n8n should include these fields
 */
export interface N8NBasePayload {
  document_id: string;          // Pocketbase document ID
  knowledge_base_id: string;    // Stable KB ID for Qdrant filtering
  user_token?: string;          // Optional user token for authenticated operations
}

/**
 * Process Document Payload (Frontend/Backend → n8n)
 * Sent when initiating document processing workflow
 */
export interface ProcessDocumentPayload extends N8NBasePayload {
  operation: 'process';
  file_data: string;            // Base64 encoded file data or file URL
  file_type: FileType;
  metadata: {
    filename: string;
    original_name: string;
    user_id: string;
    file_size: number;
  };
}

/**
 * Progress Update Payload (n8n → Our API)
 * Sent by n8n to update processing progress
 * Endpoint: POST /api/progress/update
 */
export interface ProgressUpdatePayload {
  document_id: string;
  progress: number;             // 0-100
  status: ProcessingStatus;
  chunks_total?: number;
  chunks_processed?: number;
  qdrant_points?: string[];     // Array of created Qdrant point IDs
  error_message?: string;
  current_step?: string;        // Human-readable current step
}

/**
 * Vector Search Payload (Frontend/Backend → n8n)
 * Sent to perform vector search in Qdrant
 */
export interface SearchVectorPayload {
  query: string;
  knowledge_base_id?: string;   // Optional: filter by specific KB
  limit?: number;               // Default: 20
  similarity_threshold?: number; // Default: 0.7 (0-1)
  user_id?: string;             // For permission filtering
}

/**
 * Vector Search Response (n8n → Frontend/Backend)
 * Returned from n8n vector search
 */
export interface SearchVectorResponse {
  results: SearchVectorResult[];
  total_results: number;
  query: string;
  knowledge_base_id?: string;
}

export interface SearchVectorResult {
  content: string;              // The matched text chunk
  score: number;                // Similarity score (0-1)
  document_id: string;          // Pocketbase document ID
  knowledge_base_id: string;    // Stable KB ID
  chunk_index: number;          // Position in document
  qdrant_point_id: string;      // Qdrant point ID
  metadata?: Record<string, unknown>; // Additional metadata from Qdrant
}

/**
 * Delete Document Payload (Backend → n8n)
 * Sent to clean up Qdrant points when document is deleted
 */
export interface DeleteDocumentPayload {
  document_id: string;
  qdrant_points: string[];      // Array of point IDs to delete
  knowledge_base_id: string;
}

/**
 * Delete Document Response (n8n → Backend)
 */
export interface DeleteDocumentResponse {
  success: boolean;
  deleted_points: string[];
  failed_points?: string[];
  error_message?: string;
}

/**
 * Cleanup Orphaned Data Payload (Backend → n8n)
 * Sent to remove orphaned Qdrant points (points without PB records)
 */
export interface CleanupOrphanedPayload {
  knowledge_base_id?: string;   // Optional: cleanup specific KB only
  document_ids?: string[];      // Valid document IDs to keep
}

/**
 * Cleanup Orphaned Response (n8n → Backend)
 */
export interface CleanupOrphanedResponse {
  success: boolean;
  cleaned_points: number;
  error_message?: string;
}

/**
 * Parse File Payload (Backend → n8n)
 * Sent to parse uploaded file without full processing
 */
export interface ParseFilePayload {
  document_id: string;
  file_data: string;
  file_type: FileType;
}

/**
 * Parse File Response (n8n → Backend)
 */
export interface ParseFileResponse {
  success: boolean;
  content: string;              // Extracted text content
  metadata?: {
    pages?: number;
    words?: number;
    language?: string;
  };
  error_message?: string;
}

/**
 * Chunk Content Payload (Backend → n8n)
 * Sent to chunk parsed content
 */
export interface ChunkContentPayload {
  document_id: string;
  content: string;
  chunk_size?: number;          // Default: 512
  chunk_overlap?: number;       // Default: 50
}

/**
 * Chunk Content Response (n8n → Backend)
 */
export interface ChunkContentResponse {
  success: boolean;
  chunks: string[];
  total_chunks: number;
  error_message?: string;
}

/**
 * Embed Chunks Payload (Backend → n8n)
 * Sent to create embeddings and store in Qdrant
 */
export interface EmbedChunksPayload {
  document_id: string;
  knowledge_base_id: string;
  chunks: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Embed Chunks Response (n8n → Backend)
 */
export interface EmbedChunksResponse {
  success: boolean;
  qdrant_points: string[];      // Created point IDs
  total_embedded: number;
  error_message?: string;
}

/**
 * Hybrid Search Payload (Frontend/Backend → n8n)
 * Sent to perform hybrid vector + keyword search
 */
export interface SearchHybridPayload extends SearchVectorPayload {
  keyword_weight?: number;      // 0-1, weight for keyword search
  vector_weight?: number;       // 0-1, weight for vector search
}

/**
 * Hybrid Search Response (n8n → Frontend/Backend)
 * Same structure as vector search but with hybrid scoring
 */
export interface SearchHybridResponse extends SearchVectorResponse {
  keyword_results: number;
  vector_results: number;
}

/**
 * Batch Processing Payload (Backend → n8n)
 * Process multiple documents at once
 */
export interface BatchProcessPayload {
  documents: Array<{
    document_id: string;
    file_data: string;
    file_type: FileType;
    knowledge_base_id: string;
  }>;
}

/**
 * Batch Processing Response (n8n → Backend)
 */
export interface BatchProcessResponse {
  success: boolean;
  processed: string[];          // Successfully processed document IDs
  failed: Array<{
    document_id: string;
    error: string;
  }>;
}

/**
 * n8n Webhook Endpoints Configuration
 * Base URL: https://n8n-sandbox.visualhive.co/webhook/
 */
export const N8N_ENDPOINTS = {
  // Document Processing
  PARSE_FILE: '/parse-file',
  CHUNK_CONTENT: '/chunk-content',
  EMBED_CHUNKS: '/embed-chunks',
  PROCESS_DOCUMENT: '/process-document',
  
  // Search Operations
  SEARCH_VECTOR: '/search-vector',
  SEARCH_HYBRID: '/search-hybrid',
  
  // Cleanup Operations
  DELETE_DOCUMENT: '/delete-document',
  CLEANUP_ORPHANED: '/cleanup-orphaned',
  
  // Batch Operations
  BATCH_PROCESS: '/batch-process',
} as const;

/**
 * Type guard for n8n responses
 */
export function isN8NSuccessResponse(
  obj: unknown
): obj is { success: true } & Record<string, unknown> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    obj.success === true
  );
}

export function isN8NErrorResponse(
  obj: unknown
): obj is { success: false; error_message: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    obj.success === false &&
    'error_message' in obj
  );
}
