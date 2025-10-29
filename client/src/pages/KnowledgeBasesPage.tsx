import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Plus, BookOpen, FileText, Clock, Edit, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBase {
  id: string;
  title: string;
  description: string;
  documentCount: number;
  lastUpdated: string;
}

export default function KnowledgeBasesPage() {
  const { toast } = useToast();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: '1',
      title: 'Sales Information',
      description: 'Product pricing and sales materials',
      documentCount: 23,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      title: 'N8N Workflows',
      description: 'Custom nodes and automation guides',
      documentCount: 15,
      lastUpdated: '1 day ago',
    },
    {
      id: '3',
      title: 'Investor Relations',
      description: 'Company information for potential investors',
      documentCount: 8,
      lastUpdated: '3 days ago',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  const openCreateDialog = () => {
    setEditingKB(null);
    setTitle('');
    setDescription('');
    setTitleError('');
    setDialogOpen(true);
  };

  const openEditDialog = (kb: KnowledgeBase) => {
    setEditingKB(kb);
    setTitle(kb.title);
    setDescription(kb.description);
    setTitleError('');
    setDialogOpen(true);
  };

  const handleTitleChange = (value: string) => {
    if (value.length > 50) {
      setTitleError('Name must be 50 characters or less');
    } else {
      setTitleError('');
    }
    setTitle(value.slice(0, 50));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value.slice(0, 200));
  };

  const handleSaveKB = () => {
    if (!title.trim()) {
      setTitleError('Name is required');
      return;
    }

    if (editingKB) {
      setKnowledgeBases(knowledgeBases.map(kb => 
        kb.id === editingKB.id 
          ? { ...kb, title, description, lastUpdated: 'Just now' }
          : kb
      ));
      toast({
        title: 'Knowledge base updated',
        description: 'Your changes have been saved successfully.',
      });
    } else {
      const newKB: KnowledgeBase = {
        id: Date.now().toString(),
        title,
        description,
        documentCount: 0,
        lastUpdated: 'Just now',
      };
      setKnowledgeBases([newKB, ...knowledgeBases]);
      toast({
        title: 'Knowledge base created',
        description: 'Your new knowledge base has been created successfully.',
      });
    }

    setTitle('');
    setDescription('');
    setTitleError('');
    setDialogOpen(false);
  };

  const handleViewDocuments = (kb: KnowledgeBase) => {
    console.log('View documents for:', kb.title);
    toast({
      title: 'Opening documents',
      description: `Loading documents for "${kb.title}"...`,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Knowledge Bases</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize and manage your documentation
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-create-kb">
              <Plus className="w-4 h-4 mr-2" />
              New Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-create-kb">
            <DialogHeader>
              <DialogTitle>
                {editingKB ? 'Edit Knowledge Base' : 'Create Knowledge Base'}
              </DialogTitle>
              <DialogDescription>
                {editingKB 
                  ? 'Update the details of your knowledge base.'
                  : 'Add a new knowledge base to organize your documentation.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="kb-title">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="kb-title"
                  placeholder="e.g., Sales Information"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  data-testid="input-kb-title"
                  className={titleError ? 'border-destructive' : ''}
                />
                <div className="flex items-center justify-between">
                  {titleError && (
                    <p className="text-xs text-destructive" data-testid="error-kb-title">
                      {titleError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {title.length}/50
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-description">Description</Label>
                <Textarea
                  id="kb-description"
                  placeholder="Brief description of this knowledge base..."
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  rows={3}
                  data-testid="input-kb-description"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/200
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveKB} data-testid="button-submit">
                {editingKB ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {knowledgeBases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No knowledge bases yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            Create your first knowledge base to start organizing your documentation and articles.
          </p>
          <Button onClick={openCreateDialog} data-testid="button-create-first">
            <Plus className="w-4 h-4 mr-2" />
            New Knowledge Base
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeBases.map((kb) => (
            <Card
              key={kb.id}
              className="transition-all"
              data-testid={`card-kb-${kb.id}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg truncate">{kb.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <p className="text-sm text-muted-foreground min-h-[2.5rem]">
                  {kb.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{kb.documentCount} documents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{kb.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-4 border-t border-card-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(kb)}
                  data-testid={`button-edit-${kb.id}`}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewDocuments(kb)}
                  data-testid={`button-view-${kb.id}`}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
