import { useState, useEffect } from 'react';
import { customerAPI } from '../../lib/api';
import { appointmentService } from '../../services/appointments';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Loader2, Clock, AlertCircle } from 'lucide-react';

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Array<{ id: string; make: string; model: string; year: number }>;
  onSuccess: () => void;
}

interface TimeSlot {
  hour: number;
  time: string;
  display: string;
}

interface AvailableSlotsData {
  date: string;
  dayOfWeek: string;
  businessHours: string;
  availableSlots: TimeSlot[];
  totalSlots: number;
  bookedSlots: number;
  message?: string;
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
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsInfo, setSlotsInfo] = useState<AvailableSlotsData | null>(null);

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

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.preferredDate) {
      fetchAvailableSlots(formData.preferredDate);
    } else {
      setAvailableSlots([]);
      setSlotsInfo(null);
    }
  }, [formData.preferredDate]);

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const data = await appointmentService.getAvailableTimeSlots(date);
      setSlotsInfo(data);
      setAvailableSlots(data.availableSlots || []);

      // Clear selected time if it's no longer available
      if (formData.preferredTime && data.availableSlots) {
        const isStillAvailable = data.availableSlots.some(
          (slot: TimeSlot) => slot.time === formData.preferredTime
        );
        if (!isStillAvailable) {
          setFormData(prev => ({ ...prev, preferredTime: '' }));
        }
      }

      // Show message if Sunday or no slots available
      if (data.message) {
        toast.info(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch available time slots');
      setAvailableSlots([]);
      setSlotsInfo(null);
    } finally {
      setLoadingSlots(false);
    }
  };

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
        setAvailableSlots([]);
        setSlotsInfo(null);
      } else {
        toast.error((response as any).error || 'Failed to book appointment');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const isSunday = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDay() === 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value:string) => handleChange('serviceType', value)}
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
            {formData.preferredDate && (
              <p className="text-sm text-muted-foreground">
                {getDayName(formData.preferredDate)}
                {isSunday(formData.preferredDate) && (
                  <span className="text-destructive ml-1">(Closed on Sundays)</span>
                )}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Available Time Slots *</Label>
            {loadingSlots ? (
              <div className="flex items-center justify-center py-4 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading available slots...</span>
              </div>
            ) : !formData.preferredDate ? (
              <div className="flex items-center gap-2 py-4 px-3 border rounded-md bg-muted/50">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Select a date first</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="flex items-center gap-2 py-4 px-3 border rounded-md bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">
                  {slotsInfo?.message || 'No available time slots for this date'}
                </span>
              </div>
            ) : (
              <>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value:string) => handleChange('preferredTime', value)}
                  disabled={isLoading || availableSlots.length === 0}
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select an available time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.time} value={slot.time}>
                        {slot.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {slotsInfo && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Business Hours: {slotsInfo.businessHours}</p>
                    <p>
                      {availableSlots.length} of {slotsInfo.totalSlots} slots available
                    </p>
                  </div>
                )}
              </>
            )}
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
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || availableSlots.length === 0 || !formData.preferredTime}
            >
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
