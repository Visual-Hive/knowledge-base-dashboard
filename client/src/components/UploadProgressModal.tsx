import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface UploadProgressModalProps {
  open: boolean;
  progress: number;
  filename: string;
}

export default function UploadProgressModal({ open, progress, filename }: UploadProgressModalProps) {
  const isComplete = progress >= 100;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        data-testid="dialog-upload-progress"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6 py-6">
          {isComplete ? (
            <CheckCircle2 className="w-16 h-16 text-green-500" data-testid="icon-upload-complete" />
          ) : (
            <Loader2 className="w-16 h-16 text-primary animate-spin" data-testid="icon-uploading" />
          )}
          
          <div className="w-full space-y-3">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                {isComplete ? 'Upload Complete!' : 'Uploading File...'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 truncate px-4" data-testid="text-filename">
                {filename}
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress value={progress} className="w-full" data-testid="progress-upload" />
              <p className="text-xs text-muted-foreground text-center" data-testid="text-progress-percent">
                {Math.round(progress)}%
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
