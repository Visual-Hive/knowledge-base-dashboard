# Project Guidelines for Knowledge Base Management System

## Project Architecture Overview

This is a Knowledge Base Management System migrating from PostgreSQL to a Pocketbase + Qdrant + n8n architecture.

**Core Architecture:**
- **Pocketbase**: User auth, metadata storage, permissions (https://pocketbase.visualhive.co/)
- **Qdrant**: Vector search and document storage (accessed via n8n)
- **n8n**: File processing, chunking, embedding (https://n8n-sandbox.visualhive.co/webhook/)
- **Express API**: Orchestration and webhook callbacks
- **React Frontend**: User interface with real-time updates

## Critical Architecture Principles

### Data Flow Rules
1. **NO direct Qdrant access** - All Qdrant operations go through n8n webhooks
2. **NO n8n to Pocketbase** - n8n calls our API endpoints for updates
3. **Pocketbase is source of truth** for metadata and permissions
4. **Qdrant is primary for search** - search Qdrant first, verify with Pocketbase
5. **n8n processes files only** - parsing, chunking, embedding, storage

### Permission Model
- **Knowledge Bases** have `users` array field (multiple users can access)
- **Documents** inherit permissions from parent KB (NO separate user field)
- **User access check**: User ID must be in KB's users array
- **Always filter search results** by user's accessible KBs

### File Processing Workflow
```
1. User uploads → Create PB record → Send to n8n
2. n8n processes → Calls our API with progress
3. API updates PB → WebSocket broadcasts to frontend
4. Frontend shows real-time progress
```

## Code Standards & Patterns

### TypeScript Requirements
- **Always use strict TypeScript** - no `any` types unless absolutely necessary
- **Define interfaces** for all API requests/responses
- **Use Zod schemas** for validation where needed
- **Import types explicitly** with `import type { }`

### Error Handling Pattern
```typescript
// Always use this error handling pattern
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  };
}
```

### API Response Pattern
```typescript
// Consistent API response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Pocketbase Integration
- **Always check user authentication** before operations
- **Use Pocketbase SDK** for all database operations
- **Handle Pocketbase auth errors** gracefully
- **Filter results by user permissions** before returning

### n8n Webhook Integration
```typescript
// Standard n8n webhook call pattern
const n8nResponse = await fetch(`${N8N_BASE_URL}/webhook/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    document_id: pbDocumentId,
    knowledge_base_id: kbId,
    // Always include context for n8n
  })
});
```

## File Organization

### Backend Structure
```
server/
├── auth.ts              # Pocketbase authentication
├── pocketbaseService.ts  # PB connection and utilities
├── knowledgeBaseService.ts # KB CRUD operations
├── documentService.ts    # Document management
├── searchService.ts      # Qdrant-primary search
├── progressService.ts    # Real-time progress tracking
└── routes.ts            # Express route definitions
```

### Frontend Structure
```
client/src/
├── contexts/AuthContext.tsx     # User authentication state
├── hooks/useWebSocket.ts        # Real-time updates
├── hooks/useProgress.ts         # Progress tracking
├── components/auth/             # Login/register components
├── pages/                       # Page components
└── lib/api.ts                  # API client with auth
```

### Shared Types
```
shared/
├── types.ts             # Pocketbase collection types
├── api.ts              # API request/response types
└── constants.ts        # Shared constants
```

## Security Practices

### Authentication
- **Always validate JWT tokens** on protected routes
- **Include Authorization header** in all authenticated API calls
- **Handle token expiration** gracefully with refresh
- **Never log authentication tokens**

### Sensitive Data
- **Never commit .env files**
- **Use environment variables** for all external URLs and secrets
- **Validate all user inputs** before processing
- **Filter sensitive data** from logs and responses

### n8n Security
- **No API keys in n8n payloads** - use document IDs and let our API handle auth
- **Always validate n8n callbacks** - check document ownership before updates
- **Timeout n8n requests** to prevent hanging operations

## Database Schema Rules

### Pocketbase Collections
- **knowledge_bases**: Has `users` array for access control
- **documents**: Only has `knowledge_base` relation (inherits permissions)
- **processing_jobs**: For real-time progress tracking
- **Use consistent naming** (snake_case for fields, camelCase in TypeScript)

### Qdrant Integration
- **Store stable KB IDs** in Qdrant metadata for filtering
- **Keep qdrant_points array** in document records for cleanup
- **Handle orphaned data** gracefully in search results

## Testing Standards

### API Testing
- **Test authentication flows** (login, token validation, refresh)
- **Test permission filtering** (user can only access their KBs)
- **Test file upload workflow** (upload → process → progress → completion)
- **Test search functionality** (global vs KB-specific search)

### Error Scenarios
- **Test network failures** to n8n webhooks
- **Test Pocketbase connection issues**
- **Test file processing errors**
- **Test permission denied scenarios**

## Environment Configuration

### Required Environment Variables
```env
POCKETBASE_URL=https://pocketbase.visualhive.co/
N8N_WEBHOOK_BASE_URL=https://n8n-sandbox.visualhive.co/webhook/
PORT=5000
NODE_ENV=development
```

### Development Setup
- **Use tsx for TypeScript execution** in development
- **Hot reload enabled** for both frontend and backend
- **Real-time WebSocket connections** for progress updates
- **CORS properly configured** for development

## Common Patterns

### Real-time Progress Updates
```typescript
// When n8n calls our progress endpoint
app.post('/api/progress/update', async (req, res) => {
  const { document_id, progress, status, qdrant_points } = req.body;
  
  // Update document in Pocketbase
  await pb.collection('documents').update(document_id, {
    progress_percentage: progress,
    processing_status: status,
    qdrant_points: qdrant_points
  });
  
  // Broadcast via WebSocket
  wss.broadcast(`document:${document_id}`, { progress, status });
  
  res.json({ success: true });
});
```

### Permission Checking
```typescript
// Always check KB access before operations
const checkKBAccess = async (userId: string, kbId: string) => {
  const kb = await pb.collection('knowledge_bases').getOne(kbId);
  return kb.users.includes(userId);
};
```

### Search Result Filtering
```typescript
// Filter Qdrant results by accessible KBs
const filterSearchResults = async (userId: string, qdrantResults: any[]) => {
  const userKBs = await getUserAccessibleKBs(userId);
  return qdrantResults.filter(result => 
    userKBs.includes(result.knowledge_base_id)
  );
};
```

## Performance Considerations

- **Implement pagination** for document lists and search results
- **Cache user's accessible KBs** to avoid repeated queries
- **Use WebSocket connections efficiently** (connect on demand, cleanup on unmount)
- **Batch Pocketbase queries** when possible
- **Handle large file uploads** with progress indicators

## Documentation Requirements

- **Update API documentation** for all new endpoints
- **Document n8n webhook contracts** (request/response formats)
- **Maintain environment variable documentation**
- **Keep deployment instructions updated**

## Migration Notes

- **Remove all PostgreSQL dependencies** (drizzle-orm, pg, etc.)
- **Replace Drizzle schema** with Pocketbase types
- **Update existing routes** to use Pocketbase instead of SQL
- **Test migration thoroughly** before deployment

Remember: This is a migration project, so always verify that removed PostgreSQL functionality is properly replaced with Pocketbase equivalents.
