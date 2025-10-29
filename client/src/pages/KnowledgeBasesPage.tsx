import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, BookOpen, FileText, Clock } from 'lucide-react';
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

interface KnowledgeBase {
  id: string;
  title: string;
  description: string;
  articleCount: number;
  lastUpdated: string;
}

export default function KnowledgeBasesPage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: '1',
      title: 'Product Documentation',
      description: 'Comprehensive guides and documentation for all our products',
      articleCount: 42,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      title: 'Internal Processes',
      description: 'Standard operating procedures and internal workflows',
      articleCount: 28,
      lastUpdated: '1 day ago',
    },
    {
      id: '3',
      title: 'Customer Support',
      description: 'FAQs, troubleshooting guides, and support resources',
      articleCount: 67,
      lastUpdated: '3 days ago',
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateKB = () => {
    if (!newTitle.trim()) return;

    const newKB: KnowledgeBase = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      articleCount: 0,
      lastUpdated: 'Just now',
    };

    setKnowledgeBases([newKB, ...knowledgeBases]);
    setNewTitle('');
    setNewDescription('');
    setDialogOpen(false);
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
            <Button data-testid="button-create-kb">
              <Plus className="w-4 h-4 mr-2" />
              Create Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="dialog-create-kb">
            <DialogHeader>
              <DialogTitle>Create Knowledge Base</DialogTitle>
              <DialogDescription>
                Add a new knowledge base to organize your documentation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="kb-title">Title</Label>
                <Input
                  id="kb-title"
                  placeholder="e.g., Product Documentation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  data-testid="input-kb-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kb-description">Description</Label>
                <Textarea
                  id="kb-description"
                  placeholder="Brief description of this knowledge base..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  data-testid="input-kb-description"
                />
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
              <Button onClick={handleCreateKB} data-testid="button-submit">
                Create
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
          <Button onClick={() => setDialogOpen(true)} data-testid="button-create-first">
            <Plus className="w-4 h-4 mr-2" />
            Create Knowledge Base
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeBases.map((kb) => (
            <Card
              key={kb.id}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all"
              data-testid={`card-kb-${kb.id}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{kb.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {kb.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{kb.articleCount} articles</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{kb.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
