"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScanLine, Sparkles, Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestItemDetailsFromImage } from "@/ai/flows/suggest-item-details-from-image";
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Mock inventory data - in a real app, this would come from a database
const mockInventory = [
    { id: '1', name: 'Jollof Rice', category: 'Food', cost: 500, price: 1500, quantity: 50, imageUrl: 'https://picsum.photos/seed/jollof/200/200' },
    { id: '2', name: 'Coca-Cola', category: 'Drinks', cost: 100, price: 250, quantity: 100, imageUrl: 'https://picsum.photos/seed/coke/200/200' },
    { id: '3', name: 'Beef Samosa', category: 'Snacks', cost: 150, price: 400, quantity: 200, imageUrl: 'https://picsum.photos/seed/samosa/200/200' },
    { id: '4', name: 'Bottle of Water', category: 'Drinks', cost: 50, price: 150, quantity: 150, imageUrl: 'https://picsum.photos/seed/water/200/200' },
    { id: '5', name: 'Fried Rice', category: 'Food', cost: 500, price: 1500, quantity: 40, imageUrl: 'https://picsum.photos/seed/friedrice/200/200' },
];

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export default function ScanAndSellPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        getCameraPermission();
        return () => stopCamera();
    }, []);

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
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            setHasCameraPermission(false);
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

    const handleScan = async () => {
        const dataUrl = captureFrame();
        if (dataUrl) {
            setIsScanning(true);
            try {
                const result = await suggestItemDetailsFromImage({ imageDataUri: dataUrl });
                
                // Fuzzy search for item in mock inventory
                const itemNameLower = result.itemName.toLowerCase();
                const foundItem = mockInventory.find(invItem => 
                    invItem.name.toLowerCase().includes(itemNameLower) || 
                    itemNameLower.includes(invItem.name.toLowerCase())
                );

                if (foundItem) {
                    addToCart(foundItem);
                    toast({
                        title: "Item Added",
                        description: `${foundItem.name} added to cart.`,
                    });
                } else {
                     toast({
                        variant: "destructive",
                        title: "Item Not Found",
                        description: `Could not find "${result.itemName}" in inventory.`,
                    });
                }

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Scan Failed",
                    description: "Could not identify the item. Please try again.",
                });
            } finally {
                setIsScanning(false);
            }
        }
    };

    const addToCart = (item: typeof mockInventory[0]) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (itemId: string, amount: number) => {
        setCart(prevCart => {
            return prevCart.map(item =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(0, item.quantity + amount) }
                    : item
            ).filter(item => item.quantity > 0);
        });
    };

    const removeItem = (itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;

    const handleGenerateInvoice = () => {
      const params = new URLSearchParams();
      params.set('items', JSON.stringify(cart.map(item => ({ description: item.name, quantity: item.quantity, price: item.price }))));
      router.push(`/generate?${params.toString()}`);
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Scan & Sell</h1>
                <p className="text-muted-foreground">
                    Scan items to add them to the cart and generate an invoice.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Scanner</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video w-full bg-muted rounded-lg border border-dashed flex items-center justify-center overflow-hidden">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                        {hasCameraPermission === false && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Camera Access Denied</AlertTitle>
                                <AlertDescription>
                                Please enable camera permissions in your browser settings to use the scanner.
                                </AlertDescription>
                            </Alert>
                        )}
                        <Button
                            onClick={handleScan}
                            disabled={!hasCameraPermission || isScanning}
                            className="w-full mt-4"
                            size="lg"
                        >
                            {isScanning ? (
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ScanLine className="mr-2 h-4 w-4" />
                            )}
                            {isScanning ? "Scanning..." : "Scan Item"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Sale</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                        {cart.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-center">
                                <p className="text-muted-foreground">Scan an item to begin.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto -mx-6 px-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-center w-[120px]">Qty</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="w-[40px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3 w-3"/></Button>
                                                        <span>{item.quantity}</span>
                                                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3 w-3"/></Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.price * item.quantity, 'NGN')}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        
                        <div className="mt-auto pt-4 space-y-2 border-t">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(subtotal, 'NGN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax (10%)</span>
                                <span className="font-medium">{formatCurrency(tax, 'NGN')}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(total, 'NGN')}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={cart.length === 0} onClick={handleGenerateInvoice}>
                            Generate Invoice
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}