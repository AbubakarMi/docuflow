import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, PlusCircle, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const templates = [
  {
    id: "1",
    name: "Invoice Template",
    placeholders: ["client_name", "invoice_number", "amount", "due_date"],
    type: "docx",
  },
  {
    id: "2",
    name: "Consulting Agreement",
    placeholders: ["client_name", "consultant_name", "start_date", "end_date", "rate"],
    type: "pdf",
  },
  {
    id: "3",
    name: "Offer Letter",
    placeholders: ["candidate_name", "position_title", "salary", "start_date"],
    type: "docx",
  },
];

export default function TemplatesPage() {
  const isEmpty = templates.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Manage your document templates.
          </p>
        </div>
        <Link href="/templates/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Template
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-24">
          <div className="flex flex-col items-center gap-2 text-center">
            <Image 
              src="https://picsum.photos/seed/docuflow-empty-template/400/300"
              width={400}
              height={300}
              alt="Empty state"
              className="mb-4 rounded-lg"
              data-ai-hint="document paper"
            />
            <h3 className="text-2xl font-bold tracking-tight">
              No templates yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Get started by uploading your first document template.
            </p>
            <Link href="/templates/new" className="mt-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Upload Template
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Generate</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>
                  {template.placeholders.length} placeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.placeholders.slice(0, 4).map((p) => (
                    <Badge key={p} variant="secondary">
                      {`{{${p}}}`}
                    </Badge>
                  ))}
                  {template.placeholders.length > 4 && (
                    <Badge variant="outline">
                      +{template.placeholders.length - 4} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/generate?templateId=${template.id}`} className="w-full">
                  <Button className="w-full">Generate Document</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
