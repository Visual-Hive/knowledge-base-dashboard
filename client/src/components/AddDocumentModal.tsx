import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Upload, X, FileText, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

interface KnowledgeBase {
  id: string;
  title: string;
}

interface AddDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentKbId: string;
  knowledgeBases: KnowledgeBase[];
  onDocumentAdded: (document: any) => void;
  editDocument?: any | null;
}

const ACCEPTED_FILE_TYPES = ['.pdf', '.csv', '.mp3', '.mp4', '.wav', '.avi'];
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function AddDocumentModal({
  open,
  onOpenChange,
  currentKbId,
  knowledgeBases,
  onDocumentAdded,
  editDocument,
}: AddDocumentModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedKbs, setSelectedKbs] = useState<string[]>([currentKbId]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setDocumentName('');
    setDescription('');
    setSelectedKbs([currentKbId]);
    setSelectedFile(null);
    setTextContent('');
    setShowPreview(false);
    setActiveTab('upload');
    setErrors({});
  }, [currentKbId]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors({ ...errors, file: `File size must be less than ${MAX_FILE_SIZE_MB}MB` });
      return;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(extension)) {
      setErrors({
        ...errors,
        file: `File type not supported. Accepted types: ${ACCEPTED_FILE_TYPES.join(', ')}`,
      });
      return;
    }

    setSelectedFile(file);
    if (!documentName) {
      setDocumentName(file.name);
    }
    setErrors({ ...errors, file: '' });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const toggleKb = (kbId: string) => {
    setSelectedKbs(prev =>
      prev.includes(kbId)
        ? prev.filter(id => id !== kbId)
        : [...prev, kbId]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!documentName.trim()) {
      newErrors.documentName = 'Document name is required';
    }

    if (activeTab === 'upload' && !selectedFile) {
      newErrors.file = 'Please select a file to upload';
    }

    if (activeTab === 'text' && !textContent.trim()) {
      newErrors.textContent = 'Text content is required';
    }

    if (selectedKbs.length === 0) {
      newErrors.knowledgeBases = 'At least one knowledge base must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    if (selectedKbs.length > 1) {
      setShowConfirmDialog(true);
    } else {
      performUpload();
    }
  };

  const performUpload = async () => {
    setIsUploading(true);
    setShowConfirmDialog(false);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const fileType = activeTab === 'upload'
      ? selectedFile?.name.split('.').pop()?.toUpperCase() || 'FILE'
      : 'Text Content';

    const newDocument = {
      id: Date.now().toString(),
      filename: documentName,
      type: fileType,
      description,
      createdBy: 'current-user@visualhive.com',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      knowledgeBases: selectedKbs,
      textContent: activeTab === 'text' ? textContent : undefined,
    };

    onDocumentAdded(newDocument);

    toast({
      title: 'Document added successfully',
      description: `"${documentName}" has been added to ${selectedKbs.length} knowledge base${selectedKbs.length > 1 ? 's' : ''}.`,
    });

    setIsUploading(false);
    handleOpenChange(false);
  };

  const selectedKbNames = knowledgeBases
    .filter(kb => selectedKbs.includes(kb.id))
    .map(kb => kb.title);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-add-document">
          <DialogHeader>
            <DialogTitle>{editDocument ? 'Edit Document' : 'Add New Document'}</DialogTitle>
            <DialogDescription>
              Upload a file or create a text document to add to your knowledge base.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'text')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" data-testid="tab-upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="text" data-testid="tab-text">
                <FileText className="w-4 h-4 mr-2" />
                Text Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
                  ${errors.file ? 'border-destructive' : ''}
                `}
                data-testid="dropzone"
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        data-testid="button-remove-file"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-input')?.click()}
                      data-testid="button-replace-file"
                    >
                      Replace File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-foreground font-medium mb-1">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Accepted formats: PDF, CSV, MP3, MP4, WAV, AVI
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-input')?.click()}
                      data-testid="button-browse-file"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept={ACCEPTED_FILE_TYPES.join(',')}
                  onChange={handleFileInputChange}
                  className="hidden"
                  data-testid="input-file"
                />
              </div>
              {errors.file && (
                <p className="text-sm text-destructive" data-testid="error-file">
                  {errors.file}
                </p>
              )}
            </TabsContent>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="text-content">Content</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    data-testid="button-toggle-preview"
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
                {showPreview ? (
                  <div
                    className="min-h-[200px] p-4 border border-border rounded-lg bg-card prose prose-sm max-w-none"
                    data-testid="preview-content"
                  >
                    {textContent || <span className="text-muted-foreground">Nothing to preview yet...</span>}
                  </div>
                ) : (
                  <Textarea
                    id="text-content"
                    placeholder="Enter your text content here. This will create a text-only document in the knowledge base. You can use markdown formatting."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={10}
                    className={errors.textContent ? 'border-destructive' : ''}
                    data-testid="input-text-content"
                  />
                )}
                <div className="flex items-center justify-between">
                  {errors.textContent && (
                    <p className="text-sm text-destructive" data-testid="error-text-content">
                      {errors.textContent}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground ml-auto">
                    {textContent.length} characters
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="document-name">
                Document Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="document-name"
                placeholder="e.g., Pricing Guide"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className={errors.documentName ? 'border-destructive' : ''}
                data-testid="input-document-name"
              />
              {errors.documentName && (
                <p className="text-sm text-destructive" data-testid="error-document-name">
                  {errors.documentName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of this document..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Knowledge Bases <span className="text-destructive">*</span>
              </Label>
              <div className="border border-border rounded-lg p-4 space-y-3 max-h-40 overflow-y-auto">
                {knowledgeBases.map((kb) => (
                  <div key={kb.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`kb-${kb.id}`}
                      checked={selectedKbs.includes(kb.id)}
                      onCheckedChange={() => toggleKb(kb.id)}
                      data-testid={`checkbox-kb-${kb.id}`}
                    />
                    <Label
                      htmlFor={`kb-${kb.id}`}
                      className="font-normal cursor-pointer flex-1"
                    >
                      {kb.title}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.knowledgeBases && (
                <p className="text-sm text-destructive" data-testid="error-knowledge-bases">
                  {errors.knowledgeBases}
                </p>
              )}
              {selectedKbs.length > 1 && (
                <p className="text-sm text-muted-foreground" data-testid="warning-multiple-kbs">
                  ⚠️ This document will be visible in {selectedKbs.length} knowledge bases
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => handleOpenChange(false)}
              disabled={isUploading}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading}
              data-testid="button-submit"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Uploading...
                </>
              ) : (
                'Add Document'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent data-testid="dialog-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Multiple Knowledge Bases</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to make this document available in the following knowledge bases:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="list-disc list-inside space-y-1 py-2">
            {selectedKbNames.map((name) => (
              <li key={name} className="text-sm text-foreground">
                {name}
              </li>
            ))}
          </ul>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-confirm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performUpload} data-testid="button-confirm-submit">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
