import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Upload,
  Search,
  FileText,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Document {
  id: string;
  filename: string;
  type: string;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
}

type SortField = 'filename' | 'type' | 'createdBy' | 'createdDate' | 'lastUpdated';
type SortDirection = 'asc' | 'desc' | null;

const mockKnowledgeBases = {
  '1': { title: 'Sales Information', documentCount: 23 },
  '2': { title: 'N8N Workflows', documentCount: 15 },
  '3': { title: 'Investor Relations', documentCount: 8 },
};

export default function DocumentsPage() {
  const [, params] = useRoute('/kb/:id/documents');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const kbId = params?.id || '1';
  const kb = mockKnowledgeBases[kbId as keyof typeof mockKnowledgeBases] || mockKnowledgeBases['1'];

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      filename: 'pricing-guide.pdf',
      type: 'PDF',
      createdBy: 'admin@visualhive.com',
      createdDate: '2024-10-15',
      lastUpdated: '2024-10-20',
    },
    {
      id: '2',
      filename: 'product-overview.csv',
      type: 'CSV',
      createdBy: 'sales@visualhive.com',
      createdDate: '2024-10-10',
      lastUpdated: '2024-10-25',
    },
    {
      id: '3',
      filename: 'company-intro',
      type: 'Text Content',
      createdBy: 'marketing@visualhive.com',
      createdDate: '2024-09-28',
      lastUpdated: '2024-10-22',
    },
    {
      id: '4',
      filename: 'sales-playbook.pdf',
      type: 'PDF',
      createdBy: 'admin@visualhive.com',
      createdDate: '2024-10-05',
      lastUpdated: '2024-10-18',
    },
    {
      id: '5',
      filename: 'customer-data.csv',
      type: 'CSV',
      createdBy: 'sales@visualhive.com',
      createdDate: '2024-09-20',
      lastUpdated: '2024-10-12',
    },
    {
      id: '6',
      filename: 'faq-content',
      type: 'Text Content',
      createdBy: 'marketing@visualhive.com',
      createdDate: '2024-10-01',
      lastUpdated: '2024-10-26',
    },
  ]);

  const [filenameSearch, setFilenameSearch] = useState('');
  const [contentSearch, setContentSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editFilename, setEditFilename] = useState('');
  const itemsPerPage = 10;

  const handleFilenameSearch = (value: string) => {
    setFilenameSearch(value);
    if (value) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleContentSearch = (value: string) => {
    setContentSearch(value);
    if (value) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedDocuments = () => {
    let filtered = [...documents];

    if (filenameSearch) {
      filtered = filtered.filter(doc =>
        doc.filename.toLowerCase().includes(filenameSearch.toLowerCase())
      );
    }

    if (!sortField || !sortDirection) return filtered;

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });
  };

  const sortedDocuments = getSortedDocuments();
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 ml-1 text-primary" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-4 h-4 ml-1 text-primary" />;
    }
    return null;
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setEditFilename(doc.filename);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedDocument && editFilename.trim()) {
      setDocuments(documents.map(doc =>
        doc.id === selectedDocument.id
          ? { ...doc, filename: editFilename, lastUpdated: new Date().toISOString().split('T')[0] }
          : doc
      ));
      toast({
        title: 'Document updated',
        description: 'The document has been updated successfully.',
      });
      setEditDialogOpen(false);
    }
  };

  const handleDeleteDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
      toast({
        title: 'Document deleted',
        description: 'The document has been removed successfully.',
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleUpload = () => {
    toast({
      title: 'Upload document',
      description: 'File upload functionality will be implemented here.',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Bases
        </Button>

        <div className="flex items-start justify-between mb-6 pb-6 border-b border-border flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{kb.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {documents.length} documents • Last updated 2 hours ago
            </p>
          </div>
          <Button onClick={handleUpload} data-testid="button-upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by filename"
              value={filenameSearch}
              onChange={(e) => handleFilenameSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-filename"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search document content"
              value={contentSearch}
              onChange={(e) => handleContentSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-content"
            />
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : paginatedDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            {filenameSearch || contentSearch
              ? 'Try adjusting your search terms or upload a new document.'
              : 'Upload your first document to get started with this knowledge base.'}
          </p>
          <Button onClick={handleUpload} data-testid="button-upload-empty">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      ) : (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('filename')}
                      className="flex items-center font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded"
                      data-testid="sort-filename"
                    >
                      Filename
                      <SortIcon field="filename" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded"
                      data-testid="sort-type"
                    >
                      Type
                      <SortIcon field="type" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('createdBy')}
                      className="flex items-center font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded"
                      data-testid="sort-createdby"
                    >
                      Created by
                      <SortIcon field="createdBy" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('createdDate')}
                      className="flex items-center font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded"
                      data-testid="sort-createddate"
                    >
                      Created date
                      <SortIcon field="createdDate" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('lastUpdated')}
                      className="flex items-center font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded"
                      data-testid="sort-lastupdated"
                    >
                      Last updated
                      <SortIcon field="lastUpdated" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((doc) => (
                  <TableRow key={doc.id} data-testid={`row-document-${doc.id}`}>
                    <TableCell>
                      <button
                        onClick={() => handleEditDocument(doc)}
                        className="text-primary hover:underline font-medium"
                        data-testid={`link-document-${doc.id}`}
                      >
                        {doc.filename}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{doc.type}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.createdBy}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.createdDate}</TableCell>
                    <TableCell className="text-muted-foreground">{doc.lastUpdated}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDocument(doc)}
                          data-testid={`button-edit-${doc.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc)}
                          data-testid={`button-delete-${doc.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedDocuments.length)} of{' '}
                {sortedDocuments.length} documents
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  data-testid="button-prev-page"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent data-testid="dialog-edit-document">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update the document filename and metadata.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-filename">Filename</Label>
              <Input
                id="edit-filename"
                value={editFilename}
                onChange={(e) => setEditFilename(e.target.value)}
                data-testid="input-edit-filename"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setEditDialogOpen(false)}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} data-testid="button-save-edit">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent data-testid="dialog-delete-document">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedDocument?.filename}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteDialogOpen(false)}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              data-testid="button-confirm-delete"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
