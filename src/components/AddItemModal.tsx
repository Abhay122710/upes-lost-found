import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { itemService } from '@/services/itemService';
import { storageService } from '@/services/storageService';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  type: 'lost' | 'found';
  onSuccess: () => void;
}

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'ID Cards', 'Keys', 'Bags', 'Others'];
const LOCATIONS = ['Library', 'Hostel', 'Cafeteria', 'Main Building', 'Sports Complex', 'Parking', 'Lab', 'Auditorium'];

const AddItemModal = ({ open, onClose, type, onSuccess }: AddItemModalProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !category || !location) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);

    try {
      let imageUrl: string | null = null;
      if (image) {
        imageUrl = await storageService.uploadItemImage(user.id, image);
      }

      await itemService.createItem({
        user_id: user.id,
        title,
        description,
        category,
        location,
        date,
        type,
        image_url: imageUrl,
      });

      toast.success(`${type === 'lost' ? 'Lost' : 'Found'} item reported!`);
      onSuccess();
      onClose();
      setTitle(''); setDescription(''); setCategory(''); setLocation(''); setDate(''); setImage(null); setPreview(null);
    } catch {
      toast.error('Failed to add item');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report {type === 'lost' ? 'Lost' : 'Found'} Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="e.g., Blue Backpack" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the item..." value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => document.getElementById('item-image')?.click()}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <div className="py-6">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
              )}
              <input id="item-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
