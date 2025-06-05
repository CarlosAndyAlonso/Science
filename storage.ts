import { 
  users, 
  content, 
  contentTemplates,
  type User, 
  type InsertUser,
  type Content,
  type InsertContent,
  type ContentTemplate,
  type InsertContentTemplate
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Content methods
  getContent(id: number): Promise<Content | undefined>;
  getContentByUserId(userId: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;

  // Template methods
  getContentTemplates(): Promise<ContentTemplate[]>;
  getContentTemplatesByPlatform(platform: string): Promise<ContentTemplate[]>;
  createContentTemplate(template: InsertContentTemplate): Promise<ContentTemplate>;

  // Analytics methods
  getContentStats(userId: number): Promise<{
    totalContent: number;
    aiGenerated: number;
    platforms: number;
    byPlatform: Record<string, number>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private content: Map<number, Content>;
  private contentTemplates: Map<number, ContentTemplate>;
  private currentUserId: number;
  private currentContentId: number;
  private currentTemplateId: number;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.contentTemplates = new Map();
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.currentTemplateId = 1;

    // Initialize with default templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const defaultTemplates: InsertContentTemplate[] = [
      {
        name: "YouTube Tutorial",
        platform: "youtube",
        contentType: "script",
        template: "# {title}\n\n## Introduction\n{intro}\n\n## Main Content\n{content}\n\n## Conclusion\n{conclusion}\n\n## Call to Action\n{cta}",
        description: "Step-by-step tutorial format for YouTube videos"
      },
      {
        name: "Instagram Carousel",
        platform: "instagram",
        contentType: "carousel",
        template: "Slide 1: {hook}\nSlide 2: {point1}\nSlide 3: {point2}\nSlide 4: {point3}\nSlide 5: {cta}",
        description: "Multi-slide visual story for Instagram"
      },
      {
        name: "Twitter Thread",
        platform: "twitter",
        contentType: "thread",
        template: "1/ {hook}\n\n2/ {point1}\n\n3/ {point2}\n\n4/ {point3}\n\n5/ {conclusion}",
        description: "Multi-tweet storytelling format"
      },
      {
        name: "Facebook Post",
        platform: "facebook",
        contentType: "post",
        template: "{hook}\n\n{content}\n\n{cta}\n\n{hashtags}",
        description: "Engaging Facebook post format"
      },
      {
        name: "LinkedIn Article",
        platform: "linkedin",
        contentType: "article",
        template: "# {title}\n\n{intro}\n\n## Key Points\n{points}\n\n## Conclusion\n{conclusion}",
        description: "Professional LinkedIn article format"
      },
      {
        name: "TikTok Script",
        platform: "tiktok",
        contentType: "script",
        template: "Hook (0-3s): {hook}\nContent (3-15s): {content}\nCTA (15-30s): {cta}",
        description: "Short-form video script for TikTok"
      }
    ];

    defaultTemplates.forEach(template => {
      this.createContentTemplate(template);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getContentByUserId(userId: number): Promise<Content[]> {
    return Array.from(this.content.values())
      .filter(content => content.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.currentContentId++;
    const newContent: Content = {
      ...insertContent,
      id,
      createdAt: new Date(),
    };
    this.content.set(id, newContent);
    return newContent;
  }

  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const existing = this.content.get(id);
    if (!existing) return undefined;

    const updated: Content = { ...existing, ...updates };
    this.content.set(id, updated);
    return updated;
  }
async deleteContent(id: number): Promise<boolean> {
    return this.content.delete(id);
  }

  async getContentTemplates(): Promise<ContentTemplate[]> {
    return Array.from(this.contentTemplates.values());
  }

  async getContentTemplatesByPlatform(platform: string): Promise<ContentTemplate[]> {
    return Array.from(this.contentTemplates.values())
      .filter(template => template.platform === platform);
  }

  async createContentTemplate(insertTemplate: InsertContentTemplate): Promise<ContentTemplate> {
    const id = this.currentTemplateId++;
    const template: ContentTemplate = { ...insertTemplate, id };
    this.contentTemplates.set(id, template);
    return template;
  }

  async getContentStats(userId: number): Promise<{
    totalContent: number;
    aiGenerated: number;
    platforms: number;
    byPlatform: Record<string, number>;
  }> {
    const userContent = await this.getContentByUserId(userId);
    const platformCounts: Record<string, number> = {};
    
    userContent.forEach(content => {
      platformCounts[content.platform] = (platformCounts[content.platform] || 0) + 1;
    });

    return {
      totalContent: userContent.length,
      aiGenerated: userContent.length, // All content is AI generated
      platforms: Object.keys(platformCounts).length,
      byPlatform: platformCounts,
    };
  }
}

export const storage = new MemStorage();