import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, FileText, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  knowledgeBase: string;
  type: 'article' | 'section';
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Getting Started with the Platform',
      snippet: 'This guide will help you get started with our platform. Learn about the key features and how to set up your first project...',
      knowledgeBase: 'Product Documentation',
      type: 'article',
    },
    {
      id: '2',
      title: 'Troubleshooting Common Issues',
      snippet: 'Find solutions to the most common issues our users encounter. This includes login problems, configuration errors, and...',
      knowledgeBase: 'Customer Support',
      type: 'article',
    },
    {
      id: '3',
      title: 'Employee Onboarding Process',
      snippet: 'Complete guide for onboarding new employees. Covers documentation, access setup, training schedule, and first week...',
      knowledgeBase: 'Internal Processes',
      type: 'section',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setResults(mockResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles, documentation, and more..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      {searchQuery && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Try adjusting your search terms or browse knowledge bases directly.
          </p>
        </div>
      )}

      {!searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Search knowledge bases</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Enter a search query to find articles, documentation, and resources across all knowledge bases.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} results for "{searchQuery}"
          </p>
          {results.map((result) => (
            <Card
              key={result.id}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all"
              data-testid={`card-result-${result.id}`}
            >
              <CardContent className="p-6 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{result.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {result.snippet}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>{result.knowledgeBase}</span>
                    </div>
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
