import LoadingSpinner from '../LoadingSpinner';

export default function LoadingSpinnerExample() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Small</p>
        <LoadingSpinner size="sm" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Medium</p>
        <LoadingSpinner size="md" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-4">Large</p>
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
}
