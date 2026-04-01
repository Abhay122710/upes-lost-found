import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface ClaimModalProps {
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ClaimModal = ({ item, onClose, onSuccess }: ClaimModalProps) => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let proofUrl: string | null = null;
    if (proofImage) {
      const fileExt = proofImage.name.split('.').pop();
      const filePath = `claims/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('item-images').upload(filePath, proofImage);
      if (!uploadError) {
        const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
        proofUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from('claims').insert({
      item_id: item.id,
      user_id: user.id,
      description,
      proof_image_url: proofUrl,
    });

    if (error) {
      toast.error('Failed to submit claim');
    } else {
      toast.success('Claim submitted! Awaiting admin verification.');
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Claim: {item.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Describe your ownership</Label>
            <Textarea placeholder="How can you prove this item is yours?" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Upload proof image</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => document.getElementById('proof-image')?.click()}>
              {preview ? (
                <img src={preview} alt="Proof" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <div className="py-6">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Upload proof of ownership</p>
                </div>
              )}
              <input id="proof-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimModal;
