import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const placeholders = ["client_name", "invoice_number", "amount", "due_date"];

export default function GeneratePage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Document</h1>
        <p className="text-muted-foreground">
          Fill in the data for 'Invoice Template'.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fill Placeholders</CardTitle>
          <CardDescription>
            Provide values for the placeholders to generate your document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {placeholders.map((placeholder) => (
            <div key={placeholder} className="space-y-2">
              <Label htmlFor={placeholder}>
                {placeholder.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Label>
              <Input id={placeholder} placeholder={`Enter ${placeholder}`} />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Preview</Button>
        <Button>Generate DOCX</Button>
        <Button>Generate PDF</Button>
      </div>
    </div>
  );
}
