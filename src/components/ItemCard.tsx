import { MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ItemCardProps {
  item: any;
  onClaim?: () => void;
  onDelete?: () => void;
}

const ItemCard = ({ item, onClaim, onDelete }: ItemCardProps) => {
  return (
    <motion.div
      className="bg-card rounded-2xl border border-border/50 overflow-hidden hover-lift"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            item.type === 'lost' ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'
          }`}>
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-muted px-2 py-1 rounded-lg text-muted-foreground">{item.category}</span>
          <span className={`text-xs px-2 py-1 rounded-lg ${
            item.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-accent/20 text-accent-foreground'
          }`}>{item.status}</span>
        </div>
        <div className="mt-4 flex gap-2">
          {onClaim && item.status === 'active' && (
            <Button size="sm" onClick={onClaim} className="gradient-primary text-primary-foreground">Claim Item</Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
