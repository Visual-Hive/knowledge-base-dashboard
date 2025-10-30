# Type System Migration Guide

## Overview

The PostgreSQL Drizzle schema has been completely replaced with a comprehensive TypeScript type system for Pocketbase collections, API contracts, and n8n webhook integration.

## What Changed

### ❌ Removed
- `shared/schema.ts` - Old Drizzle-based PostgreSQL schema
- `InsertUser` type - Replaced with `RegisterRequest`
- Drizzle ORM type inference

### ✅ Added
- `shared/types.ts` - Pocketbase collection types
- `shared/api.ts` - API request/response types
- `shared/n8n.ts` - n8n webhook payload types
- `shared/validation.ts` - Zod validation schemas
- `shared/index.ts` - Central export point

## File Structure

```
shared/
├── index.ts         # Central export (use this for imports)
├── types.ts         # Core Pocketbase types
├── api.ts          # API request/response types
├── n8n.ts          # n8n webhook types
└── validation.ts   # Zod validation schemas
```

## Import Guide

### Recommended: Use Central Export

```typescript
// ✅ Good - Import from central index
import { 
  User, 
  KnowledgeBase, 
  Document,
  ApiResponse,
  SearchRequest,
  ProcessDocumentPayload 
} from '@shared';
```

### Alternative: Direct Imports

```typescript
// ⚠️ OK but less maintainable
import type { User } from '@shared/types';
import type { ApiResponse } from '@shared/api';
```

## Type Categories

### 1. Core Types (`shared/types.ts`)

**Pocketbase Collections:**
- `User` - Built-in Pocketbase users
- `KnowledgeBase` - KB with multi-user access
- `Document` - Files in knowledge bases
- `ProcessingJob` - Real-time progress tracking

**Enums:**
- `ProcessingStatus` - Document processing states
- `FileType` - Supported file types

**Helper Types:**
- `BaseRecord` - Common Pocketbase fields
- `DocumentExpanded` - With relations expanded
- `CreateDocument`, `UpdateDocument` - For mutations

### 2. API Types (`shared/api.ts`)

**Generic Wrappers:**
- `ApiResponse<T>` - Standard API response format
- `PaginatedResponse<T>` - For paginated lists

**Authentication:**
- `LoginRequest`, `RegisterRequest`
- `AuthResponse`, `RefreshTokenRequest`

**Knowledge Bases:**
- `CreateKBRequest`, `UpdateKBRequest`
- `KBListResponse`

**Documents:**
- `UploadDocumentRequest`, `DocumentListRequest`
- `DocumentListResponse`, `DeleteDocumentRequest`

**Search:**
- `SearchRequest`, `SearchResultItem`
- `SearchResponse`, `GlobalSearchRequest`, `KBSearchRequest`

**WebSocket:**
- `WSMessage<T>`, `WSProgressUpdate`
- `WSDocumentComplete`, `WSDocumentFailed`

### 3. n8n Types (`shared/n8n.ts`)

**Document Processing:**
- `ProcessDocumentPayload` - Send to n8n
- `ProgressUpdatePayload` - Receive from n8n
- `ParseFilePayload`, `ChunkContentPayload`, `EmbedChunksPayload`

**Search:**
- `SearchVectorPayload`, `SearchVectorResponse`
- `SearchHybridPayload`, `SearchHybridResponse`

**Cleanup:**
- `DeleteDocumentPayload`, `DeleteDocumentResponse`
- `CleanupOrphanedPayload`, `CleanupOrphanedResponse`

**Constants:**
- `N8N_ENDPOINTS` - Webhook endpoint paths

### 4. Validation (`shared/validation.ts`)

**Zod Schemas:**
- `loginSchema`, `registerSchema`
- `createKBSchema`, `updateKBSchema`
- `uploadDocumentSchema`, `searchSchema`
- `progressUpdateSchema`, `processDocumentSchema`

**Utilities:**
- `validateData<T>()` - Validate against schema
- `formatValidationErrors()` - Format Zod errors
- `createValidator<T>()` - Create validation middleware

**Inferred Types:**
- `LoginInput`, `RegisterInput`
- `CreateKBInput`, `UpdateKBInput`
- `SearchInput`, etc.

## Migration Examples

### Before (PostgreSQL Schema)

```typescript
// Old way with Drizzle
import { type User, type InsertUser } from "@shared/schema";

async function createUser(data: InsertUser): Promise<User> {
  // ...
}
```

### After (Pocketbase Types)

```typescript
// New way with Pocketbase types
import { type User, type RegisterRequest } from '@shared';

async function createUser(data: RegisterRequest): Promise<User> {
  // User now includes created/updated timestamps
  // and verified status from Pocketbase
}
```

## Common Patterns

### API Endpoint Response

```typescript
import { ApiResponse, Document } from '@shared';

app.post('/api/documents/upload', async (req, res) => {
  try {
    const document = await uploadDocument(req.body);
    const response: ApiResponse<Document> = {
      success: true,
      data: document,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
});
```

### n8n Webhook Call

```typescript
import { ProcessDocumentPayload, N8N_ENDPOINTS } from '@shared';

async function processDocument(docId: string, file: Buffer) {
  const payload: ProcessDocumentPayload = {
    document_id: docId,
    knowledge_base_id: kbId,
    operation: 'process',
    file_data: file.toString('base64'),
    file_type: 'pdf',
    metadata: {
      filename: 'doc.pdf',
      original_name: 'document.pdf',
      user_id: userId,
      file_size: file.length,
    },
  };

  const response = await fetch(
    `${N8N_BASE_URL}${N8N_ENDPOINTS.PROCESS_DOCUMENT}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}
```

### Validation with Zod

```typescript
import { searchSchema, formatValidationErrors } from '@shared';

app.post('/api/search', async (req, res) => {
  const result = searchSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formatValidationErrors(result.error),
    });
  }
  
  // Use validated data
  const searchParams = result.data;
  // ...
});
```

### Type Guards

```typescript
import { isProcessingStatus, isApiResponse } from '@shared';

if (isProcessingStatus(status)) {
  // TypeScript knows status is ProcessingStatus
}

if (isApiResponse<Document>(response)) {
  // TypeScript knows response has success, data?, error?
}
```

## Type Safety Benefits

✅ **Full type coverage** - All Pocketbase collections typed  
✅ **API contracts** - Clear request/response types  
✅ **n8n integration** - Well-defined webhook payloads  
✅ **Runtime validation** - Zod schemas for boundary checks  
✅ **Type guards** - Safe type narrowing  
✅ **Autocomplete** - Better developer experience  
✅ **Refactoring safety** - Catch breaking changes at compile time

## Next Steps

1. **Update Backend Services** - Replace any remaining PostgreSQL code
2. **Update Frontend Components** - Use new types in React components
3. **Add Pocketbase Service** - Create `pocketbaseService.ts` with these types
4. **Implement n8n Integration** - Use n8n types for webhook calls
5. **Add Validation** - Use Zod schemas at API boundaries

## Notes

- All types are **co-located** in `shared/` for frontend/backend sharing
- Types match **Pocketbase collection schemas** exactly
- **n8n endpoints** are documented with request/response types
- **Validation schemas** can be extended as needed
- The old `storage.ts` is marked as deprecated but still functional for testing

## Support

For questions or issues with the type system:
1. Check type definitions in `shared/types.ts`
2. Review usage examples in this document
3. Refer to Pocketbase documentation for collection schemas
