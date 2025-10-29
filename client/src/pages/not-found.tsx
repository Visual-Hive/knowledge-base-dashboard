import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-semibold text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Page not found
        </p>
        <Link href="/">
          <Button data-testid="button-home">
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
