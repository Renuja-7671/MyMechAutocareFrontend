import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Calendar, Clock, IndianRupee, Wrench, User, Package, FileText } from 'lucide-react';
import { customerAPI } from '../../lib/supabase-api';
import { formatStatusText } from '../../lib/types';
import { toast } from 'sonner@2.0.3';

interface ServiceHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleName: string;
}

interface ServiceHistoryItem {
  id: string;
  serviceType: string;
  status: string;
  startDate: string;
  completionDate?: string;
  totalCost?: number;
  description?: string;
  employeeName?: string;
  totalHours?: number;
  parts?: Array<{
    name: string;
    quantity: number;
    cost: number;
  }>;
}

export function ViewServiceHistoryDialog({ 
  open, 
  onOpenChange, 
  vehicleId, 
  vehicleName 
}: ServiceHistoryDialogProps) {
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && vehicleId) {
      loadServiceHistory();
    }
  }, [open, vehicleId]);

  const loadServiceHistory = async () => {
    setIsLoading(true);
    try {
      const response = await customerAPI.getVehicleServiceHistory(vehicleId);
      
      if (response.success) {
        setServiceHistory(response.data || []);
      } else {
        toast.error(response.error || 'Failed to load service history');
      }
    } catch (error) {
      toast.error('An error occurred while loading service history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'not_started':
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'on_hold':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Service History</DialogTitle>
          <DialogDescription>
            Complete service history for {vehicleName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : serviceHistory.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No service history found for this vehicle</p>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceHistory.map((service, index) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          {service.serviceType}
                        </CardTitle>
                        <CardDescription>Service #{serviceHistory.length - index}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {formatStatusText(service.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Service Description */}
                    {service.description && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p className="text-sm">{service.description}</p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Timeline Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="text-sm">
                            {new Date(service.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {service.completionDate && (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Completion Date</p>
                            <p className="text-sm">
                              {new Date(service.completionDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Employee and Hours */}
                    <div className="grid grid-cols-2 gap-4">
                      {service.employeeName && (
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Technician</p>
                            <p className="text-sm">{service.employeeName}</p>
                          </div>
                        </div>
                      )}
                      
                      {service.totalHours !== undefined && (
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Hours</p>
                            <p className="text-sm">{service.totalHours.toFixed(2)} hrs</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Parts Used */}
                    {service.parts && service.parts.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Package className="h-4 w-4 text-gray-500" />
                            <p className="text-sm">Parts Used</p>
                          </div>
                          <div className="space-y-2">
                            {service.parts.map((part, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm pl-6">
                                <div>
                                  <span>{part.name}</span>
                                  <span className="text-muted-foreground ml-2">x{part.quantity}</span>
                                </div>
                                <span className="text-muted-foreground">{formatCurrency(part.cost)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Total Cost */}
                    {service.totalCost !== undefined && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-5 w-5 text-gray-500" />
                            <span>Total Cost</span>
                          </div>
                          <span className="text-lg">{formatCurrency(service.totalCost)}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
