'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface MedicineRowProps {
  index: number;
  data: any;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const MedicineRow = ({ index, data, onChange, onRemove, canRemove }: MedicineRowProps) => (
  <div className="p-4 border rounded-lg space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Medicine #{index + 1}</span>
      {canRemove && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div className="space-y-1">
        <Label>Name *</Label>
        <Input value={data.name} onChange={(e) => onChange(index, 'name', e.target.value)} placeholder="Napa" />
      </div>
      <div className="space-y-1">
        <Label>Strength</Label>
        <Input value={data.strength} onChange={(e) => onChange(index, 'strength', e.target.value)} placeholder="500mg" />
      </div>
      <div className="space-y-1">
        <Label>Dosage *</Label>
        <Input value={data.dosage} onChange={(e) => onChange(index, 'dosage', e.target.value)} placeholder="1+0+1" />
      </div>
      <div className="space-y-1">
        <Label>Frequency *</Label>
        <Input value={data.frequency} onChange={(e) => onChange(index, 'frequency', e.target.value)} placeholder="After meal" />
      </div>
      <div className="space-y-1">
        <Label>Duration *</Label>
        <Input value={data.duration} onChange={(e) => onChange(index, 'duration', e.target.value)} placeholder="7 Days" />
      </div>
      <div className="space-y-1">
        <Label>Instructions</Label>
        <Input value={data.instructions} onChange={(e) => onChange(index, 'instructions', e.target.value)} placeholder="With water" />
      </div>
    </div>
  </div>
);
