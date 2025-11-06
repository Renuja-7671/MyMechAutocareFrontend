import { useState } from 'react';
import { customerAPI } from '../../lib/api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddVehicleDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddVehicleDialogProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exteriorImages, setExteriorImages] = useState<File[]>([]);
  const [interiorImage, setInteriorImage] = useState<File | null>(null);
  const [exteriorPreviews, setExteriorPreviews] = useState<string[]>([]);
  const [interiorPreview, setInteriorPreview] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExteriorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, 2); // Max 2 images
    if (selectedFiles.length + exteriorImages.length > 2) {
      toast.error('You can only upload up to 2 exterior images');
      return;
    }

    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setExteriorImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExteriorPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInteriorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File is too large. Maximum size is 5MB');
      return;
    }

    setInteriorImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setInteriorPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeExteriorImage = (index: number) => {
    setExteriorImages(prev => prev.filter((_, i) => i !== index));
    setExteriorPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeInteriorImage = () => {
    setInteriorImage(null);
    setInteriorPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.year || !formData.licensePlate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await customerAPI.addVehicle({
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        licensePlate: formData.licensePlate,
        vin: formData.vin || undefined,
        exteriorImages,
        interiorImage: interiorImage || undefined,
      });
      
      if (response.success) {
        toast.success('Vehicle added successfully!');
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({
          make: '',
          model: '',
          year: '',
          licensePlate: '',
          vin: '',
        });
        setExteriorImages([]);
        setInteriorImage(null);
        setExteriorPreviews([]);
        setInteriorPreview(null);
      } else {
        toast.error(response.error || 'Failed to add vehicle');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Register a new vehicle to your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make *</Label>
            <Input
              id="make"
              type="text"
              placeholder="e.g., Toyota, Honda, Ford"
              value={formData.make}
              onChange={(e) => handleChange('make', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              type="text"
              placeholder="e.g., Camry, Civic, F-150"
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              placeholder="e.g., 2020"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              disabled={isLoading}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate *</Label>
            <Input
              id="licensePlate"
              type="text"
              placeholder="e.g., ABC123"
              value={formData.licensePlate}
              onChange={(e) => handleChange('licensePlate', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              type="text"
              placeholder="17-character Vehicle Identification Number"
              value={formData.vin}
              onChange={(e) => handleChange('vin', e.target.value)}
              disabled={isLoading}
              maxLength={17}
            />
          </div>

          {/* Exterior Images Upload */}
          <div className="space-y-2">
            <Label htmlFor="exteriorImages">Exterior Images (Up to 2)</Label>
            <div className="space-y-3">
              {exteriorPreviews.length < 2 && (
                <div className="relative">
                  <Input
                    id="exteriorImages"
                    type="file"
                    accept="image/*"
                    onChange={handleExteriorImageChange}
                    disabled={isLoading}
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('exteriorImages')?.click()}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Exterior Images ({exteriorImages.length}/2)
                  </Button>
                </div>
              )}
              {exteriorPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {exteriorPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Exterior ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExteriorImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interior Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="interiorImage">Interior Image (1)</Label>
            <div className="space-y-3">
              {!interiorPreview && (
                <div className="relative">
                  <Input
                    id="interiorImage"
                    type="file"
                    accept="image/*"
                    onChange={handleInteriorImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('interiorImage')?.click()}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Interior Image
                  </Button>
                </div>
              )}
              {interiorPreview && (
                <div className="relative group">
                  <img
                    src={interiorPreview}
                    alt="Interior"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={removeInteriorImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
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
                  Adding...
                </>
              ) : (
                'Add Vehicle'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
