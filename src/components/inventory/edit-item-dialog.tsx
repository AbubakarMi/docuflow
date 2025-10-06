"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer"),
  imageUrl: z.string().optional().or(z.literal('')),
});

type ItemFormValues = z.infer<typeof itemSchema>;

type EditItemDialogProps = {
  item: ItemFormValues;
  onUpdateItem: (item: ItemFormValues) => void;
  onOpenChange: (open: boolean) => void;
};

export function EditItemDialog({ item, onUpdateItem, onOpenChange }: EditItemDialogProps) {
  const [open, setOpen] = useState(true);
  const { toast } = useToast();
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item,
  });

  const [activeTab, setActiveTab] = useState("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(item.imageUrl || null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    form.reset(item);
    setImagePreview(item.imageUrl || null);
  }, [item, form]);
  
  useEffect(() => {
    if (open && activeTab === 'camera') {
      getCameraPermission();
    } else {
      stopCamera();
    }
  }, [open, activeTab]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const getCameraPermission = async () => {
    if (hasCameraPermission) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions in your browser settings.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue("imageUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setImagePreview(dataUrl);
        form.setValue("imageUrl", dataUrl);
        setActiveTab("upload"); // Switch back to upload tab to show preview
      }
    }
  };


  const onSubmit = (data: ItemFormValues) => {
    onUpdateItem(data);
    toast({
      title: "Item Updated",
      description: `${data.name} has been updated.`,
    });
    setOpen(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        stopCamera();
        form.reset();
        onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details for this item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative aspect-video w-full bg-muted rounded-lg border border-dashed flex items-center justify-center overflow-hidden">
                {activeTab === 'upload' && imagePreview && (
                    <Image src={imagePreview} alt="Image preview" layout="fill" className="object-cover" />
                )}
                {activeTab === 'upload' && !imagePreview && (
                    <div className="flex flex-col items-center text-center text-muted-foreground p-4">
                        <Upload className="h-10 w-10 mb-2" />
                        <p className="text-sm font-medium">Upload an image</p>
                        <p className="text-xs">Your item's visual identity</p>
                    </div>
                )}
                {activeTab === 'camera' && (
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                )}
                 <canvas ref={canvasRef} className="hidden"></canvas>
              </div>

              <TabsList className="grid w-full grid-cols-2 mt-4">
                <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" /> Upload</TabsTrigger>
                <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/> Camera</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              </TabsContent>
              <TabsContent value="camera" className="mt-4">
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access to use this feature.
                    </AlertDescription>
                  </Alert>
                )}
               <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Picture
                </Button>
              </TabsContent>
            </Tabs>
            {form.formState.errors.imageUrl && <p className="text-destructive text-xs">{form.formState.errors.imageUrl.message}</p>}

          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...form.register("category")} />
                  {form.formState.errors.category && <p className="text-destructive text-xs">{form.formState.errors.category.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (₦)</Label>
                  <Input id="cost" type="number" {...form.register("cost")} />
                   {form.formState.errors.cost && <p className="text-destructive text-xs">{form.formState.errors.cost.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input id="price" type="number" {...form.register("price")} />
                  {form.formState.errors.price && <p className="text-destructive text-xs">{form.formState.errors.price.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" {...form.register("quantity")} />
                {form.formState.errors.quantity && <p className="text-destructive text-xs">{form.formState.errors.quantity.message}</p>}
              </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
