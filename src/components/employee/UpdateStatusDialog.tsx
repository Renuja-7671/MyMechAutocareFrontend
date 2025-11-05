import { useState, useEffect } from 'react';
import { employeeAPI } from '../../lib/supabase-api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { toast } from 'sonner@2.0.3';
import { Loader2 } from 'lucide-react';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    vehicleName: string;
    serviceType: string;
    status: string;
  };
  onSuccess: () => void;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: UpdateStatusDialogProps) {
  const [formData, setFormData] = useState({
    status: service.status,
    notes: '',
    progress: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userSelectedStatus, setUserSelectedStatus] = useState(false);

  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
  ];

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (value: string) => {
    setUserSelectedStatus(true);
    setFormData(prev => ({ ...prev, status: value }));
    
    // Auto-adjust progress when status is manually changed
    if (value === 'completed') {
      setFormData(prev => ({ ...prev, progress: 100 }));
    } else if (value === 'not_started') {
      setFormData(prev => ({ ...prev, progress: 0 }));
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setFormData(prev => ({ ...prev, progress: newProgress }));
    
    // Only auto-update status if user hasn't explicitly selected a status
    // or if the current status isn't "on_hold" (on_hold is a manual override)
    if (!userSelectedStatus || formData.status !== 'on_hold') {
      if (newProgress === 0) {
        setFormData(prev => ({ ...prev, status: 'not_started' }));
      } else if (newProgress === 100) {
        setFormData(prev => ({ ...prev, status: 'completed' }));
      } else if (newProgress > 0 && newProgress < 100) {
        setFormData(prev => ({ ...prev, status: 'in_progress' }));
      }
    }
  };

  // Reset userSelectedStatus when dialog closes
  useEffect(() => {
    if (!open) {
      setUserSelectedStatus(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.status) {
      toast.error('Please select a status');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await employeeAPI.updateServiceStatus(
        service.id,
        formData.status,
        formData.progress,
        formData.notes || undefined
      );
      
      if (response.success) {
        toast.success('Service status updated successfully!');
        onSuccess();
        onOpenChange(false);
        setFormData({
          status: service.status,
          notes: '',
          progress: 0,
        });
        setUserSelectedStatus(false);
      } else {
        toast.error(response.error || 'Failed to update status');
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
          <DialogTitle>Update Service Status</DialogTitle>
          <DialogDescription>
            Update status for {service.vehicleName} - {service.serviceType}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Service Status *</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.status === 'on_hold' && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Status manually set to "On Hold" - progress will not auto-update status
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progress Percentage: {formData.progress}%</Label>
            <Slider
              id="progress"
              min={0}
              max={100}
              step={5}
              value={[formData.progress]}
              onValueChange={handleProgressChange}
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.status === 'on_hold' 
                ? 'Drag the slider to set progress (status will remain "On Hold")'
                : 'Drag the slider to set progress (status will auto-update based on progress)'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Status Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this status update..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              disabled={isLoading}
              rows={4}
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
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
