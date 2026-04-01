import { useState } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DeleteWithReasonDialogProps {
  open: boolean;
  itemTitle: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

const DeleteWithReasonDialog = ({ open, itemTitle, onClose, onConfirm, loading }: DeleteWithReasonDialogProps) => {
  const [reason, setReason] = useState('');

  return (
    <AlertDialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{itemTitle}"?</AlertDialogTitle>
          <AlertDialogDescription>This item will be moved to Deleted Posts. Please provide a reason.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-2">
          <Label>Reason for deletion</Label>
          <Textarea
            placeholder="e.g., Duplicate post, inappropriate content..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!reason.trim() || loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => onConfirm(reason.trim())}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWithReasonDialog;
