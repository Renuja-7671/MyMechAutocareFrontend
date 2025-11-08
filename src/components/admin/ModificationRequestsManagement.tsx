import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { Search, CheckCircle, XCircle, Clock, Wrench } from 'lucide-react';

interface ModificationRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleName: string;
  licensePlate: string;
  title: string;
  description: string;
  estimatedCost: number;
  approvedCost?: number;
  status: string;
  createdAt: string;
}

export function ModificationRequestsManagement() {
  const [requests, setRequests] = useState<ModificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ModificationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ModificationRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [approvedCost, setApprovedCost] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, requests]);

  const loadRequests = async () => {
    const response = await adminAPI.getAllModificationRequests();
    if (response.success && response.data) {
      setRequests(response.data);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !newStatus) {
      toast.error('Please select a status');
      return;
    }

    // If approving, validate actual cost
    if (newStatus === 'approved') {
      if (!approvedCost || parseFloat(approvedCost) <= 0) {
        toast.error('Please enter the actual cost for this modification');
        return;
      }
    }

    // Send approved cost if provided (even if not approving)
    const approvedCostValue = approvedCost && parseFloat(approvedCost) > 0 ? parseFloat(approvedCost) : undefined;
    const response = await adminAPI.updateModificationStatus(
      selectedRequest.id, 
      newStatus, 
      approvedCostValue
    );
    
    if (response.success) {
      toast.success('Status updated successfully');
      loadRequests();
      setShowStatusDialog(false);
      setSelectedRequest(null);
      setNewStatus('');
      setApprovedCost('');
    } else {
      toast.error(response.error || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-emerald-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return 'Pending';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Modification Requests</CardTitle>
          <CardDescription>Review and manage customer modification requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No modification requests found
              </div>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                        </div>
                        <CardDescription>
                          <div className="space-y-1">
                            <p><strong>Customer:</strong> {request.customerName} ({request.customerPhone})</p>
                            <p><strong>Vehicle:</strong> {request.vehicleName} - {request.licensePlate}</p>
                            <p><strong>Customer Estimated Budget:</strong> Rs. {request.estimatedCost.toLocaleString()}</p>
                            {request.approvedCost && (
                              <p><strong>Actual Cost (Shop Quote):</strong> <span className="text-green-600 dark:text-green-400">Rs. {request.approvedCost.toLocaleString()}</span></p>
                            )}
                            <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {formatStatus(request.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm mb-1"><strong>Description:</strong></p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {request.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailsDialog(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setNewStatus(request.status || 'pending');
                          // Use approved cost if available, otherwise use estimated cost
                          setApprovedCost(request.approvedCost ? request.approvedCost.toString() : request.estimatedCost.toString());
                          setShowStatusDialog(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modification Request Details</DialogTitle>
            <DialogDescription>
              Complete information for this modification request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="text-sm mt-1">{selectedRequest.customerName}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm mt-1">{selectedRequest.customerPhone}</p>
                </div>
                <div>
                  <Label>Vehicle</Label>
                  <p className="text-sm mt-1">{selectedRequest.vehicleName}</p>
                </div>
                <div>
                  <Label>License Plate</Label>
                  <p className="text-sm mt-1">{selectedRequest.licensePlate}</p>
                </div>
                <div>
                  <Label>Customer Estimated Budget</Label>
                  <p className="text-sm mt-1">Rs. {selectedRequest.estimatedCost.toLocaleString()}</p>
                </div>
                {selectedRequest.approvedCost && (
                  <div>
                    <Label>Actual Cost (Shop Quote)</Label>
                    <p className="text-sm mt-1 text-green-600 dark:text-green-400">
                      Rs. {selectedRequest.approvedCost.toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <Label>Status</Label>
                  <p className="text-sm mt-1">
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {formatStatus(selectedRequest.status)}
                    </Badge>
                  </p>
                </div>
                <div className="col-span-2">
                  <Label>Request Date</Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <Label>Modification Details</Label>
                <p className="text-sm mt-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-md">
                  {selectedRequest.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Change the status for this modification request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Request</Label>
              <p className="text-sm">
                {selectedRequest?.title} - {selectedRequest?.vehicleName}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Customer Estimated Budget</Label>
              <p className="text-sm">
                Rs. {selectedRequest?.estimatedCost.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvedCost">Actual Cost (Shop Quote) {newStatus === 'approved' && '*'}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                <Input
                  id="approvedCost"
                  type="number"
                  placeholder="Enter actual cost"
                  value={approvedCost}
                  onChange={(e) => setApprovedCost(e.target.value)}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500">
                {newStatus === 'approved'
                  ? 'Required when approving - Enter the actual cost quoted by the shop'
                  : 'Optional - Enter the actual cost quoted by the shop (can be set later)'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowStatusDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} className="flex-1">
              {newStatus === 'approved' ? 'Approve' : 'Update Status'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
