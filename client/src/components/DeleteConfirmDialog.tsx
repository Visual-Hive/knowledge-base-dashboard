import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  itemCount?: number;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  itemName,
  itemCount,
}: DeleteConfirmDialogProps) {
  const [countdown, setCountdown] = useState(3);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      setCountdown(3);
      setIsDeleting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [open, countdown]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    onConfirm();
    setIsDeleting(false);
  };

  const canDelete = countdown === 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-testid="dialog-delete-confirm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {itemName && (
          <div className="py-2">
            <p className="text-sm font-medium text-foreground">
              {itemCount ? `${itemCount} documents selected` : `Document: ${itemName}`}
            </p>
          </div>
        )}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm text-destructive font-medium">
            ⚠️ This action cannot be undone
          </p>
        </div>
        <AlertDialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            data-testid="button-cancel-delete"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            data-testid="button-confirm-delete"
            className={!canDelete ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isDeleting
              ? 'Deleting...'
              : canDelete
              ? 'Confirm Delete'
              : `Confirm Delete (${countdown})`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
