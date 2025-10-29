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
  X,
  Clock,
  Download,
  ExternalLink,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import AddDocumentModal from '@/components/AddDocumentModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import HighlightText from '@/components/HighlightText';

interface Document {
  id: string;
  filename: string;
  type: string;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  description?: string;
  knowledgeBases?: string[];
  textContent?: string;
}

type SortField = 'filename' | 'type' | 'createdBy' | 'createdDate' | 'lastUpdated';
type SortDirection = 'asc' | 'desc' | null;

const mockKnowledgeBases = [
  { id: '1', title: 'Sales Information', documentCount: 23 },
  { id: '2', title: 'N8N Workflows', documentCount: 15 },
  { id: '3', title: 'Investor Relations', documentCount: 8 },
];

export default function DocumentsPage() {
  const [, params] = useRoute('/kb/:id/documents');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const kbId = params?.id || '1';
  const kb = mockKnowledgeBases.find(k => k.id === kbId) || mockKnowledgeBases[0];

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
  const [isContentSearching, setIsContentSearching] = useState(false);
  const [showContentResults, setShowContentResults] = useState(false);
  const [contentSearchResults, setContentSearchResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [showSaveSearchDialog, setShowSaveSearchDialog] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const itemsPerPage = 10;

  const handleFilenameSearch = (value: string) => {
    setFilenameSearch(value);
    setCurrentPage(1);
    setShowContentResults(false);
  };

  const clearFilenameSearch = () => {
    setFilenameSearch('');
    setCurrentPage(1);
  };

  const handleContentSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentSearch.trim()) {
      toast({
        title: 'Search query required',
        description: 'Please enter a search term to find content.',
        variant: 'destructive',
      });
      return;
    }

    // Add to search history
    if (!searchHistory.includes(contentSearch)) {
      setSearchHistory([contentSearch, ...searchHistory.slice(0, 4)]);
    }

    setIsContentSearching(true);

    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock search results with snippets
    const mockResults = [
      {
        id: '1',
        filename: 'pricing-guide.pdf',
        type: 'PDF',
        relevance: 95,
        snippet: `Our ${contentSearch} strategy focuses on competitive pricing and value delivery. The comprehensive ${contentSearch} framework ensures market alignment...`,
        createdDate: '2024-10-20',
      },
      {
        id: '3',
        filename: 'sales-deck.pdf',
        type: 'PDF',
        relevance: 87,
        snippet: `Key points about ${contentSearch}: implementation timeline, cost structure, and expected ROI. The ${contentSearch} initiative will drive growth...`,
        createdDate: '2024-10-22',
      },
      {
        id: '5',
        filename: 'product-roadmap.csv',
        type: 'CSV',
        relevance: 72,
        snippet: `Q1 priorities include ${contentSearch} enhancements, feature releases, and market expansion. ${contentSearch} metrics will be tracked monthly...`,
        createdDate: '2024-09-15',
      },
    ];

    setContentSearchResults(mockResults);
    setShowContentResults(true);
    setIsContentSearching(false);
  };

  const backToAllDocuments = () => {
    setShowContentResults(false);
    setContentSearch('');
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

  // Fuzzy search scoring function
  const fuzzyMatch = (text: string, search: string): number => {
    const textLower = text.toLowerCase();
    const searchLower = search.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === searchLower) return 100;
    
    // Contains exact substring gets high score
    if (textLower.includes(searchLower)) return 90;
    
    // Check if all search characters appear in order
    let searchIndex = 0;
    let lastMatchIndex = -1;
    let consecutiveMatches = 0;
    
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        if (i === lastMatchIndex + 1) {
          consecutiveMatches++;
        }
        lastMatchIndex = i;
        searchIndex++;
      }
    }
    
    // If all search characters were found
    if (searchIndex === searchLower.length) {
      // Score based on consecutive matches and position
      const positionScore = 100 - lastMatchIndex;
      const consecutiveScore = (consecutiveMatches / searchLower.length) * 30;
      return Math.min(positionScore + consecutiveScore, 85);
    }
    
    // Check word boundaries
    const words = textLower.split(/[\s-_.]/).filter(w => w.length > 0);
    for (const word of words) {
      if (word.startsWith(searchLower)) return 70;
      if (word.includes(searchLower)) return 60;
    }
    
    return 0;
  };

  const getSortedDocuments = () => {
    let filtered = [...documents];

    // Filename search with fuzzy matching
    if (filenameSearch) {
      const scoredDocs = filtered
        .map(doc => ({
          doc,
          score: fuzzyMatch(doc.filename, filenameSearch),
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
      
      filtered = scoredDocs.map(item => item.doc);
    }

    // File type filter
    if (selectedFileType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedFileType);
    }

    // Created by filter
    if (selectedCreatedBy !== 'all') {
      filtered = filtered.filter(doc => doc.createdBy === selectedCreatedBy);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(doc => doc.createdDate >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(doc => doc.createdDate <= dateRange.end);
    }

    // If we have a filename search, documents are already sorted by relevance
    if (filenameSearch && (!sortField || !sortDirection)) return filtered;

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

  const fileTypes = ['all', ...Array.from(new Set(documents.map(d => d.type)))];
  const createdByList = ['all', ...Array.from(new Set(documents.map(d => d.createdBy)))];

  const clearAllFilters = () => {
    setSelectedFileType('all');
    setSelectedCreatedBy('all');
    setDateRange({ start: '', end: '' });
    setFilenameSearch('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedFileType !== 'all' || selectedCreatedBy !== 'all' || 
                          dateRange.start || dateRange.end || filenameSearch;

  const saveCurrentSearch = () => {
    if (!newSearchName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for this search.',
        variant: 'destructive',
      });
      return;
    }

    const searchCriteria = {
      id: Date.now().toString(),
      name: newSearchName,
      filenameSearch,
      selectedFileType,
      selectedCreatedBy,
      dateRange,
      createdAt: new Date().toISOString(),
    };

    setSavedSearches([...savedSearches, searchCriteria]);
    setNewSearchName('');
    setShowSaveSearchDialog(false);
    
    toast({
      title: 'Search saved',
      description: `"${newSearchName}" has been saved successfully.`,
    });
  };

  const loadSavedSearch = (search: any) => {
    setFilenameSearch(search.filenameSearch);
    setSelectedFileType(search.selectedFileType);
    setSelectedCreatedBy(search.selectedCreatedBy);
    setDateRange(search.dateRange);
    setShowSavedSearches(false);
    
    toast({
      title: 'Search loaded',
      description: `Loaded search criteria for "${search.name}".`,
    });
  };

  const deleteSavedSearch = (searchId: string) => {
    setSavedSearches(savedSearches.filter(s => s.id !== searchId));
    toast({
      title: 'Search deleted',
      description: 'The saved search has been removed.',
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
    setEditingDocument(doc);
    setAddDocumentOpen(true);
  };

  const handleDeleteDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setSelectedDocuments(new Set());
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    setSelectedDocument(null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
      toast({
        title: 'Document deleted',
        description: 'The document has been removed successfully.',
      });
    } else if (selectedDocuments.size > 0) {
      setDocuments(documents.filter(doc => !selectedDocuments.has(doc.id)));
      toast({
        title: 'Documents deleted',
        description: `${selectedDocuments.size} documents have been removed successfully.`,
      });
      setSelectedDocuments(new Set());
    }
    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const toggleDocumentSelection = (docId: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const toggleAllDocuments = () => {
    if (selectedDocuments.size === paginatedDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(paginatedDocuments.map(doc => doc.id)));
    }
  };

  const handleUpload = () => {
    setAddDocumentOpen(true);
  };

  const handleDocumentAdded = (newDocument: any) => {
    setDocuments([newDocument, ...documents]);
    setEditingDocument(null);
  };

  const handleDocumentUpdated = (updatedDocument: any) => {
    setDocuments(documents.map(doc =>
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
    setEditingDocument(null);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setEditingDocument(null);
    }
    setAddDocumentOpen(open);
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
              className="pl-10 pr-10"
              data-testid="input-search-filename"
            />
            {filenameSearch && (
              <button
                onClick={clearFilenameSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                data-testid="button-clear-filename-search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <form onSubmit={handleContentSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search document content (press Enter)"
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
              className="pl-10 pr-10"
              data-testid="input-search-content"
            />
            {searchHistory.length > 0 && showSearchHistory && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                <p className="text-xs text-muted-foreground px-3 py-2 border-b border-border">Recent searches</p>
                {searchHistory.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setContentSearch(term);
                      setShowSearchHistory(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover-elevate active-elevate-2"
                    data-testid={`search-history-${i}`}
                  >
                    <Clock className="w-3 h-3 inline mr-2 text-muted-foreground" />
                    {term}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={selectedFileType} onValueChange={setSelectedFileType}>
            <SelectTrigger className="w-40" data-testid="select-file-type">
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type} data-testid={`filetype-${type}`}>
                  {type === 'all' ? 'All types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCreatedBy} onValueChange={setSelectedCreatedBy}>
            <SelectTrigger className="w-56" data-testid="select-created-by">
              <SelectValue placeholder="Created by" />
            </SelectTrigger>
            <SelectContent>
              {createdByList.map(user => (
                <SelectItem key={user} value={user} data-testid={`createdby-${user}`}>
                  {user === 'all' ? 'All users' : user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-40"
            placeholder="Start date"
            data-testid="input-date-start"
          />

          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-40"
            placeholder="End date"
            data-testid="input-date-end"
          />

          {hasActiveFilters && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                data-testid="button-clear-filters"
              >
                <X className="w-4 h-4 mr-2" />
                Clear filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveSearchDialog(true)}
                data-testid="button-save-search"
              >
                <Download className="w-4 h-4 mr-2" />
                Save Search
              </Button>
            </>
          )}

          {savedSearches.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                data-testid="button-show-saved-searches"
              >
                <Clock className="w-4 h-4 mr-2" />
                Saved Searches ({savedSearches.length})
              </Button>
              {showSavedSearches && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-card border border-border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {savedSearches.map((search) => (
                      <div
                        key={search.id}
                        className="flex items-center justify-between p-3 hover-elevate active-elevate-2 rounded-lg mb-1"
                        data-testid={`saved-search-${search.id}`}
                      >
                        <button
                          onClick={() => loadSavedSearch(search)}
                          className="flex-1 text-left"
                        >
                          <p className="text-sm font-medium text-foreground">{search.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(search.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                        <button
                          onClick={() => deleteSavedSearch(search.id)}
                          className="ml-2 p-1 text-muted-foreground hover:text-destructive"
                          data-testid={`delete-saved-search-${search.id}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        {(filenameSearch || hasActiveFilters) && !showContentResults && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {sortedDocuments.length} result{sortedDocuments.length !== 1 ? 's' : ''} found
              {filenameSearch && ` for "${filenameSearch}"`}
            </p>
          </div>
        )}
      </div>

      {/* Content Search Loading Modal */}
      <Dialog open={isContentSearching} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" data-testid="dialog-searching">
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <p className="text-lg font-medium text-foreground mt-4">Searching documents...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Analyzing content for "{contentSearch}"
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content Search Results View */}
      {showContentResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Search Results for "{contentSearch}"
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Found {contentSearchResults.length} matching documents
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const csv = `Filename,Type,Relevance,Created Date\n${contentSearchResults
                    .map(r => `"${r.filename}",${r.type},${r.relevance}%,${r.createdDate}`)
                    .join('\n')}`;
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `search-results-${contentSearch}.csv`;
                  a.click();
                }}
                data-testid="button-export-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="ghost"
                onClick={backToAllDocuments}
                data-testid="button-back-to-documents"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Documents
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {contentSearchResults.map((result) => (
              <Card key={result.id} className="p-6 hover-elevate" data-testid={`search-result-${result.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {result.filename}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary">
                        {result.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-600 dark:text-green-400">
                        {result.relevance}% match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created on {result.createdDate}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const doc = documents.find(d => d.id === result.id);
                      if (doc) handleEditDocument(doc);
                    }}
                    data-testid={`button-open-${result.id}`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </div>
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-foreground leading-relaxed">
                    <HighlightText text={result.snippet} highlight={contentSearch} />
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : isSearching ? (
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
          {selectedDocuments.size > 0 && (
            <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 border border-border rounded-lg">
              <p className="text-sm font-medium text-foreground">
                {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                data-testid="button-bulk-delete"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.size === paginatedDocuments.length && paginatedDocuments.length > 0}
                      onChange={toggleAllDocuments}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
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
                      <input
                        type="checkbox"
                        checked={selectedDocuments.has(doc.id)}
                        onChange={() => toggleDocumentSelection(doc.id)}
                        className="w-4 h-4 rounded border-border cursor-pointer"
                        data-testid={`checkbox-${doc.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditDocument(doc)}
                        className="text-primary hover:underline font-medium"
                        data-testid={`link-document-${doc.id}`}
                      >
                        <HighlightText text={doc.filename} highlight={filenameSearch} />
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

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={selectedDocument ? 'Delete Document' : 'Delete Documents'}
        description={
          selectedDocument
            ? `Are you sure you want to delete "${selectedDocument.filename}"?`
            : `Are you sure you want to delete ${selectedDocuments.size} selected documents?`
        }
        itemName={selectedDocument?.filename}
        itemCount={!selectedDocument ? selectedDocuments.size : undefined}
      />

      <AddDocumentModal
        open={addDocumentOpen}
        onOpenChange={handleModalClose}
        currentKbId={kbId}
        knowledgeBases={mockKnowledgeBases}
        onDocumentAdded={handleDocumentAdded}
        onDocumentUpdated={handleDocumentUpdated}
        editDocument={editingDocument}
      />

      {/* Save Search Dialog */}
      <Dialog open={showSaveSearchDialog} onOpenChange={setShowSaveSearchDialog}>
        <DialogContent data-testid="dialog-save-search">
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
            <DialogDescription>
              Save your current search criteria for quick access later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                placeholder="e.g., Recent PDF documents"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                data-testid="input-search-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Current Criteria</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                {filenameSearch && <p>• Filename: "{filenameSearch}"</p>}
                {selectedFileType !== 'all' && <p>• File type: {selectedFileType}</p>}
                {selectedCreatedBy !== 'all' && <p>• Created by: {selectedCreatedBy}</p>}
                {dateRange.start && <p>• From: {dateRange.start}</p>}
                {dateRange.end && <p>• To: {dateRange.end}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setShowSaveSearchDialog(false);
                setNewSearchName('');
              }}
              data-testid="button-cancel-save-search"
            >
              Cancel
            </Button>
            <Button onClick={saveCurrentSearch} data-testid="button-confirm-save-search">
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
