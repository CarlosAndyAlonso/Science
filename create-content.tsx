import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentForm from "@/components/content-form";
import ContentPreview from "@/components/content-preview";
import { Link } from "wouter";

export default function CreateContent() {
  const [generatedContent, setGeneratedContent] = useState(null);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">Create Content</h1>
              <p className="text-neutral-600">Generate AI-powered content for your social media platforms</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Creation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Content Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentForm onContentGenerated={setGeneratedContent} />
              </CardContent>
            </Card>

            {/* Generated Content Preview or Recent Content */}
            <div>
              {generatedContent ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-neutral-800 mb-2">{generatedContent.title}</h3>
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm text-neutral-700">
                            {generatedContent.content}
                          </pre>
                        </div>
                      </div>
                      
                      {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-neutral-800 mb-2">Hashtags</h4>
                          <div className="flex flex-wrap gap-2">
                            {generatedContent.hashtags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-neutral-700">Words: </span>
                          <span className="text-neutral-600">{generatedContent.metadata?.wordCount || 0}</span>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-700">Characters: </span>
                          <span className="text-neutral-600">{generatedContent.metadata?.characterCount || 0}</span>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-700">Tone: </span>
                          <span className="text-neutral-600">{generatedContent.metadata?.tone || "Professional"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-700">Audience: </span>
                          <span className="text-neutral-600">{generatedContent.metadata?.targetAudience || "General"}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const blob = new Blob([generatedContent.content], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${generatedContent.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Export Content
                        </Button>
                        <Button onClick={() => setGeneratedContent(null)}>
                          Create New
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ContentPreview limit={5} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}