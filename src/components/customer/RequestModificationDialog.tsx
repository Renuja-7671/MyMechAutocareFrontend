import { useState } from 'react';
import { customerAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface RequestModificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Array<{ id: string; make: string; model: string; year: number }>;
  onSuccess: () => void;
}

export function RequestModificationDialog({
  open,
  onOpenChange,
  vehicles,
  onSuccess,
}: RequestModificationDialogProps) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    modificationDetails: '',
    estimatedBudget: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.modificationDetails || !formData.estimatedBudget) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await customerAPI.requestModification({
        vehicleId: formData.vehicleId,
        modificationDetails: formData.modificationDetails,
        estimatedBudget: parseFloat(formData.estimatedBudget),
      });
      
      if (response.success) {
        toast.success('Modification request submitted successfully!');
        onSuccess();
        onOpenChange(false);
        setFormData({
          vehicleId: '',
          modificationDetails: '',
          estimatedBudget: '',
        });
      } else {
        toast.error((response as any).error || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Vehicle Modification</DialogTitle>
          <DialogDescription>
            Submit a request for custom vehicle modifications or projects
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Select Vehicle *</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value:string) => handleChange('vehicleId', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Modification Details *</Label>
            <Textarea
              id="details"
              placeholder="Describe the modifications you would like (e.g., performance upgrade, body kit, custom paint, etc.)"
              value={formData.modificationDetails}
              onChange={(e) => handleChange('modificationDetails', e.target.value)}
              disabled={isLoading}
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Estimated Budget (Rs.) *</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter your estimated budget"
              value={formData.estimatedBudget}
              onChange={(e) => handleChange('estimatedBudget', e.target.value)}
              disabled={isLoading}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
