import { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicles';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface VehicleImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: {
    id: number;
    make: string;
    model: string;
    year: number;
    exterior_image_1?: string | null;
    exterior_image_2?: string | null;
    interior_image?: string | null;
  };
}

export function VehicleImagesDialog({
  open,
  onOpenChange,
  vehicle,
}: VehicleImagesDialogProps) {
  const [exteriorImage1Url, setExteriorImage1Url] = useState<string | null>(null);
  const [exteriorImage2Url, setExteriorImage2Url] = useState<string | null>(null);
  const [interiorImageUrl, setInteriorImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open, vehicle]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const imageData = await vehicleService.getVehicleImages(vehicle.id);
      console.log('Loaded image data:', imageData);

      // Backend returns { exteriorImages: [...], interiorImage: '...' }
      if (imageData.exteriorImages && imageData.exteriorImages.length > 0) {
        setExteriorImage1Url(imageData.exteriorImages[0]);
        if (imageData.exteriorImages.length > 1) {
          setExteriorImage2Url(imageData.exteriorImages[1]);
        }
      }else {
        setExteriorImage1Url(null);
        setExteriorImage2Url(null);
      }
      if (imageData.interiorImage) {
        setInteriorImageUrl(imageData.interiorImage);
      } else {
        setInteriorImageUrl(null);
      }
    } catch (error) {
      console.error('Error loading vehicle images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasImages = exteriorImage1Url || exteriorImage2Url || interiorImageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {vehicle.year} {vehicle.make} {vehicle.model} - Images
          </DialogTitle>
          <DialogDescription>
            View vehicle exterior and interior photos
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12" >
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : !hasImages ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-4" />
            <p>No images available for this vehicle</p>
          </div>
        ) : (
          <Tabs defaultValue="exterior" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exterior" disabled={!exteriorImage1Url && !exteriorImage2Url}>
                Exterior ({[exteriorImage1Url, exteriorImage2Url].filter(Boolean).length})
              </TabsTrigger>
              <TabsTrigger value="interior" disabled={!interiorImageUrl}>
                Interior ({interiorImageUrl ? 1 : 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exterior" className="space-y-4 mt-4">
              {!exteriorImage1Url && !exteriorImage1Url? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p>No exterior images available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exteriorImage1Url && (
                    <div className="space-y-2">
                      <p className="text-sm">Exterior View 1</p>
                      <img
                        src={exteriorImage1Url}
                        alt="Exterior View 1"
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  {exteriorImage2Url && (
                    <div className="space-y-2">
                      <p className="text-sm">Exterior View 2</p>
                      <img
                        src={exteriorImage2Url}
                        alt="Exterior View 2"
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="interior" className="mt-4">
              {!interiorImageUrl ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p>No interior image available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">Interior View</p>
                  <img
                    src={interiorImageUrl || ''}
                    alt="Interior View"
                    className="w-full h-96 object-cover rounded-lg border"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
