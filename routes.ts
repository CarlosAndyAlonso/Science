import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertContentSchema } from "@shared/schema";
import { generateContent, analyzeImage, optimizeContentForPlatform } from "./lib/openai";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Content CRUD operations
  app.get("/api/content", async (req, res) => {
    try {
      const userId = 1; // Mock user ID - in real app would come from authentication
      const content = await storage.getContentByUserId(userId);
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse({
        ...req.body,
        userId: 1, // Mock user ID
      });
      
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
console.error("Error creating content:", error);
      res.status(400).json({ error: "Invalid content data" });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const content = await storage.updateContent(id, updates);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContent(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  // Content generation endpoint
  app.post("/api/content/generate", upload.array('images', 5), async (req, res) => {
    try {
      const { platform, contentType, brief, template } = req.body;
      
      if (!platform || !contentType || !brief) {
        return res.status(400).json({ 
          error: "Missing required fields: platform, contentType, brief" 
        });
      }

      // Process uploaded images
      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const base64 = file.buffer.toString('base64');
          images.push(base64);
        }
      }

      // Generate content using OpenAI
      const generatedContent = await generateContent({
        platform,
        contentType,
        brief,
        images,
        template,
      });

      // Save to storage
      const savedContent = await storage.createContent({
        userId: 1, // Mock user ID
        title: generatedContent.title,
        description: brief,
        platform,
        contentType,
        brief,
        generatedContent: generatedContent.content,
        images: [], // We don't store the actual images, just references
        metadata: generatedContent.metadata,
      });

      res.json({
        id: savedContent.id,
        ...generatedContent,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ 
        error: "Failed to generate content: " + (error as Error).message 
      });
    }
  });

  // Image analysis endpoint
  app.post("/api/images/analyze", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const base64 = req.file.buffer.toString('base64');
      const analysis = await analyzeImage(base64);
      
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ 
        error: "Failed to analyze image: " + (error as Error).message 
      });
    }
  });

  // Content optimization endpoint
  app.post("/api/content/optimize", async (req, res) => {
    try {
      const { content, fromPlatform, toPlatform } = req.body;
      
      if (!content || !fromPlatform || !toPlatform) {
        return res.status(400).json({ 
          error: "Missing required fields: content, fromPlatform, toPlatform" 
        });
      }

      const optimizedContent = await optimizeContentForPlatform(
        content, 
        fromPlatform, 
        toPlatform
      );
      
      res.json({ optimizedContent });
    } catch (error) {
      console.error("Error optimizing content:", error);
      res.status(500).json({ 
        error: "Failed to optimize content: " + (error as Error).message 
      });
    }
  });

  // Templates endpoints
  app.get("/api/templates", async (req, res) => {
    try {
      const platform = req.query.platform as string;
      
      const templates = platform 
        ? await storage.getContentTemplatesByPlatform(platform)
        : await storage.getContentTemplates();
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const userId = 1; // Mock user ID
      const stats = await storage.getContentStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}