"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, ScanLine, Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestItemDetailsFromImage } from "@/ai/flows/suggest-item-details-from-image";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer"),
  imageUrl: z.string().optional().or(z.literal('')),
});

type ItemFormValues = z.infer<typeof itemSchema>;

type AddItemDialogProps = {
  children: React.ReactNode;
  onAddItem: (item: ItemFormValues) => void;
};

export function AddItemDialog({ children, onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category: "",
      cost: 0,
      price: 0,
      quantity: 1,
      imageUrl: "",
    },
  });

  const [activeTab, setActiveTab] = useState("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (open && (activeTab === 'camera' || activeTab === 'scan')) {
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
    if (hasCameraPermission === true) return;
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

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg");
      }
    }
    return null;
  }

  const handleCapture = () => {
    const dataUrl = captureFrame();
    if (dataUrl) {
      setImagePreview(dataUrl);
      form.setValue("imageUrl", dataUrl);
      setActiveTab("upload"); // Switch back to upload tab to show preview
    }
  };

  const handleScan = async () => {
    const dataUrl = captureFrame();
    if (dataUrl) {
      setImagePreview(dataUrl);
      form.setValue("imageUrl", dataUrl);
      setIsScanning(true);
      try {
        const result = await suggestItemDetailsFromImage({ imageDataUri: dataUrl });
        if (result.itemName) form.setValue("name", result.itemName);
        if (result.category) form.setValue("category", result.category);
        toast({
          title: "Scan Successful",
          description: "Item name and category have been populated."
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Could not identify the item. Please try again."
        });
      } finally {
        setIsScanning(false);
        setActiveTab("upload");
      }
    }
  };


  const onSubmit = (data: ItemFormValues) => {
    onAddItem(data);
    toast({
      title: "Item Added",
      description: `${data.name} has been added to your inventory.`,
    });
    form.reset();
    setImagePreview(null);
    setOpen(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        stopCamera();
        form.reset();
        setImagePreview(null);
        setHasCameraPermission(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add a new product or service to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative aspect-video w-full bg-muted rounded-lg border border-dashed flex items-center justify-center overflow-hidden">
                {imagePreview && (activeTab === 'upload' || activeTab === 'scan') && (
                    <Image src={imagePreview} alt="Image preview" layout="fill" className="object-cover" />
                )}
                {!imagePreview && activeTab === 'upload' && (
                    <div className="flex flex-col items-center text-center text-muted-foreground p-4">
                        <Upload className="h-10 w-10 mb-2" />
                        <p className="text-sm font-medium">Upload an image</p>
                        <p className="text-xs">Your item's visual identity</p>
                    </div>
                )}
                {(activeTab === 'camera' || activeTab === 'scan') && !imagePreview && (
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                )}
                 <canvas ref={canvasRef} className="hidden"></canvas>
              </div>

              <TabsList className="grid w-full grid-cols-3 mt-4">
                <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" /> Upload</TabsTrigger>
                <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4"/> Camera</TabsTrigger>
                <TabsTrigger value="scan"><ScanLine className="mr-2 h-4 w-4" /> Scan</TabsTrigger>
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
              <TabsContent value="scan" className="mt-4">
                {hasCameraPermission === false && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                        Please allow camera access to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
                <Button type="button" onClick={handleScan} disabled={!hasCameraPermission || isScanning} className="w-full">
                    {isScanning ? (
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ScanLine className="mr-2 h-4 w-4" />
                    )}
                    {isScanning ? "Scanning..." : "Scan Item"}
                </Button>
              </TabsContent>
            </Tabs>
            {form.formState.errors.imageUrl && <p className="text-destructive text-xs">{form.formState.errors.imageUrl.message}</p>}

          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...form.register("name")} placeholder="e.g., Jollof Rice" />
                  {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...form.register("category")} placeholder="e.g., Food" />
                  {form.formState.errors.category && <p className="text-destructive text-xs">{form.formState.errors.category.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (₦)</Label>
                  <Input id="cost" type="number" {...form.register("cost")} placeholder="e.g., 500" />
                   {form.formState.errors.cost && <p className="text-destructive text-xs">{form.formState.errors.cost.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input id="price" type="number" {...form.register("price")} placeholder="e.g., 1500" />
                  {form.formState.errors.price && <p className="text-destructive text-xs">{form.formState.errors.price.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" {...form.register("quantity")} placeholder="e.g., 50"/>
                {form.formState.errors.quantity && <p className="text-destructive text-xs">{form.formState.errors.quantity.message}</p>}
              </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">Add Item to Inventory</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
