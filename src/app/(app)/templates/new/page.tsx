"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { suggestPlaceholderNames } from "@/ai/flows/ai-suggest-placeholder-names";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload } from "lucide-react";

export default function NewTemplatePage() {
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [suggestedPlaceholders, setSuggestedPlaceholders] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const handleSuggestPlaceholders = async () => {
    if (!templateContent) {
      toast({
        variant: "destructive",
        title: "Content is empty",
        description: "Please paste your template content first.",
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestPlaceholderNames({ templateText: templateContent });
      setSuggestedPlaceholders(result.suggestedPlaceholders);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get suggestions. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleUpload = () => {
    toast({
      title: "Upload Successful",
      description: "Template has been uploaded (simulation).",
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Template</h1>
        <p className="text-muted-foreground">
          Upload a new document template and define its placeholders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g. Monthly Invoice"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-file">Template File</Label>
                <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg">
                    <Upload className="h-8 w-8 text-muted-foreground"/>
                    <div className="flex-1">
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">DOCX or PDF, up to 10MB</p>
                    </div>
                     <Button variant="outline">Browse</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
              <CardDescription>
                Paste your template content here to get AI placeholder suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your document text here... e.g. Hello {{client_name}}, this is your invoice for {{amount}}."
                className="min-h-[200px]"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
              <CardDescription>
                Let AI suggest placeholders for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSuggestPlaceholders} disabled={isSuggesting} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {isSuggesting ? "Analyzing..." : "Suggest Placeholders"}
              </Button>
              {suggestedPlaceholders.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Suggested Placeholders:</Label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPlaceholders.map((p) => (
                      <Badge key={p} variant="secondary">
                        {`{{${p}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="lg" onClick={handleUpload}>Save Template</Button>
      </div>
    </div>
  );
}
