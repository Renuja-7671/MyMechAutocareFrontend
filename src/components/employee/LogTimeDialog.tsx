import { useState } from 'react';
import { employeeAPI } from '../../lib/supabase-api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Loader2 } from 'lucide-react';

interface LogTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    vehicleName: string;
    serviceType: string;
  };
  onSuccess: () => void;
}

export function LogTimeDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: LogTimeDialogProps) {
  const [formData, setFormData] = useState({
    hours: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hours || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const hours = parseFloat(formData.hours);
    if (isNaN(hours) || hours <= 0) {
      toast.error('Please enter a valid number of hours');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await employeeAPI.logTime({
        serviceId: service.id,
        hours,
        description: formData.description,
        date: formData.date,
      });
      
      if (response.success) {
        toast.success('Time logged successfully!');
        onSuccess();
        onOpenChange(false);
        setFormData({
          hours: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        toast.error(response.error || 'Failed to log time');
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
          <DialogTitle>Log Work Time</DialogTitle>
          <DialogDescription>
            Log hours worked on {service.vehicleName} - {service.serviceType}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Worked *</Label>
            <Input
              id="hours"
              type="number"
              placeholder="Enter hours (e.g., 2.5)"
              value={formData.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
              disabled={isLoading}
              min="0"
              step="0.25"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Work Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the work performed..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
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
                  Logging...
                </>
              ) : (
                'Log Time'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
