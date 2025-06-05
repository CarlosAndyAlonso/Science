import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PlatformSelector from "./platform-selector";
import FileUpload from "./file-upload";
import ProgressTracker from "./progress-tracker";

const contentFormSchema = z.object({
  platform: z.string().min(1, "Please select a platform"),
  contentType: z.string().min(1, "Please select a content type"),
  brief: z.string().min(10, "Brief must be at least 10 characters"),
  template: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

const contentTypes = {
  youtube: [
    { value: "script", label: "Video Script" },
    { value: "shorts", label: "YouTube Shorts" },
    { value: "tutorial", label: "Tutorial" },
  ],
  instagram: [
    { value: "post", label: "Feed Post" },
    { value: "carousel", label: "Carousel" },
    { value: "story", label: "Story" },
    { value: "reel", label: "Reel" },
  ],
  twitter: [
    { value: "tweet", label: "Single Tweet" },
    { value: "thread", label: "Thread" },
  ],
  facebook: [
  { value: "post", label: "Post" },
    { value: "story", label: "Story" },
  ],
  linkedin: [
    { value: "post", label: "Post" },
    { value: "article", label: "Article" },
  ],
  tiktok: [
    { value: "script", label: "Video Script" },
  ],
};

interface ContentFormProps {
  onContentGenerated?: (content: any) => void;
}

export default function ContentForm({ onContentGenerated }: ContentFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      platform: "",
      contentType: "",
      brief: "",
      template: "",
    },
  });

  const selectedPlatform = form.watch("platform");

  // Fetch templates for selected platform
  const { data: templates } = useQuery({
    queryKey: ["/api/templates", selectedPlatform],
    enabled: !!selectedPlatform,
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: ContentFormData & { images?: File[] }) => {
      const formData = new FormData();
      formData.append("platform", data.platform);
      formData.append("contentType", data.contentType);
      formData.append("brief", data.brief);
      if (data.template) {
        formData.append("template", data.template);
      }
      
      if (data.images) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await fetch("/api/content/generate", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate content");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Content Generated!",
        description: "Your content has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      onContentGenerated?.(data);
      form.reset();
      setFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    setIsGenerating(true);
    try {
      await generateContentMutation.mutateAsync({ ...data, images: files });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {isGenerating && <ProgressTracker />}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PlatformSelector
                    selectedPlatform={field.value}
                    onPlatformChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedPlatform && (
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contentTypes[selectedPlatform as keyof typeof contentTypes]?.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {templates && templates.length > 0 && (
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.map((template: any) => (
                        <SelectItem key={template.id} value={template.template}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="brief"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Brief</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the content you want to create..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FileUpload onFilesChange={setFiles} />

          <Button
            type="submit"
            className="w-full gradient-primary text-white hover:shadow-lg transition-all"
            disabled={generateContentMutation.isPending || isGenerating}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {generateContentMutation.isPending || isGenerating ? "Generating..." : "Generate Content"}
          </Button>
        </form>
      </Form>
    </div>
  );
}