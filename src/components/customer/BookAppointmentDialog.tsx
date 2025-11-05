import { useState } from 'react';
import { customerAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Loader2 } from 'lucide-react';

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Array<{ id: string; make: string; model: string; year: number }>;
  onSuccess: () => void;
}

export function BookAppointmentDialog({
  open,
  onOpenChange,
  vehicles,
  onSuccess,
}: BookAppointmentDialogProps) {
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Tire Rotation',
    'Engine Diagnostics',
    'Transmission Service',
    'Air Conditioning Service',
    'Battery Replacement',
    'Wheel Alignment',
    'General Inspection',
    'Other',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.serviceType || !formData.preferredDate || !formData.preferredTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await customerAPI.bookAppointment(formData);
      
      if (response.success) {
        toast.success('Appointment booked successfully!');
        onSuccess();
        onOpenChange(false);
        setFormData({
          vehicleId: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          description: '',
        });
      } else {
        toast.error(response.error || 'Failed to book appointment');
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
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule a service appointment for your vehicle
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Select Vehicle *</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => handleChange('vehicleId', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => handleChange('serviceType', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleChange('preferredDate', e.target.value)}
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.preferredTime}
                onChange={(e) => handleChange('preferredTime', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes</Label>
            <Textarea
              id="description"
              placeholder="Any specific concerns or requirements..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
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
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
