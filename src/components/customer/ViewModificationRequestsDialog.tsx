import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Wrench, Calendar, IndianRupee, AlertCircle, Trash2, FileText } from 'lucide-react';
import { customerAPI } from '../../lib/api';
import { toast } from 'sonner';
import { formatStatusText } from '../../lib/types';

interface ModificationRequest {
  id: string;
  vehicleName: string;
  description: string;
  estimatedCost: number;
  approvedCost?: number | null;
  status: string;
  createdAt: string;
}

interface ViewModificationRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestDeleted?: () => void;
}

export function ViewModificationRequestsDialog({ 
  open, 
  onOpenChange,
  onRequestDeleted 
}: ViewModificationRequestsDialogProps) {
  const [requests, setRequests] = useState<ModificationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ModificationRequest | null>(null);

  useEffect(() => {
    if (open) {
      loadRequests();
    }
  }, [open]);

  const loadRequests = async () => {
    setLoading(true);
    const result = await customerAPI.getMyModificationRequests();
    
    if (result.success) {
      setRequests(result.data || []);
    } else {
      toast.error('Failed to load modification requests');
    }
    setLoading(false);
  };

  const handleDeleteClick = (request: ModificationRequest) => {
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRequest) return;

    const result = await customerAPI.deleteModificationRequest(selectedRequest.id);
    
    if (result.success) {
      toast.success('Modification request deleted successfully');
      setRequests(requests.filter(r => r.id !== selectedRequest.id));
      setDeleteDialogOpen(false);
      setSelectedRequest(null);
      onRequestDeleted?.();
    } else {
      toast.error(result.error || 'Failed to delete request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const canDelete = (request: ModificationRequest) => {
    // Can delete if approved and has approved cost (admin has given budget)
    return request.status.toLowerCase() === 'pending' && request.approvedCost == null && request.approvedCost == undefined;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              My Modification Requests
            </DialogTitle>
            <DialogDescription>
              View and manage your vehicle modification requests
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading requests...
              </div>
            ) : requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No modification requests found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create a modification request to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{request.vehicleName}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(request.status)}>
                            {formatStatusText(request.status)}
                          </Badge>
                          {canDelete(request) && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Deletable
                            </Badge>
                          )}
                        </div>
                      </div>
                      {canDelete(request) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(request)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        Description
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {request.description}
                      </p>
                    </div>

                    {/* Cost Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          Your Estimated Budget
                        </div>
                        <p className="text-lg pl-6">
                          Rs. {request.estimatedCost.toLocaleString()}
                        </p>
                      </div>

                      {request.approvedCost !== null && request.approvedCost !== undefined && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <IndianRupee className="h-4 w-4 text-green-600" />
                            Admin Approved Budget
                          </div>
                          <p className="text-lg text-green-600 dark:text-green-400 pl-6">
                            Rs. {request.approvedCost.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Request Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Requested on {new Date(request.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    {/* Info Message */}
                    {canDelete(request) && (
                      <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-orange-800 dark:text-orange-200">
                            <p className="font-medium">Ready for your decision</p>
                            <p className="text-orange-700 dark:text-orange-300 mt-1">
                              The admin has approved your request with a budget of Rs. {request.approvedCost?.toLocaleString()}.
                              You can delete this request if you don't wish to proceed with the approved budget.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status.toLowerCase() === 'pending' && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Your request is pending review by the admin. You'll be notified once it's reviewed.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Modification Request?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete this modification request for{' '}
                <span className="font-semibold">{selectedRequest?.vehicleName}</span>?
              </p>
              {selectedRequest?.approvedCost && (
                <p className="text-orange-600 dark:text-orange-400 font-medium">
                  The admin has approved this request with a budget of Rs. {selectedRequest.approvedCost.toLocaleString()}.
                  Deleting means you're declining to proceed with this modification.
                </p>
              )}
              <p className="text-sm">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
