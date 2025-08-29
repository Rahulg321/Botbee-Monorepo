"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Eye,
  Settings,
  Palette,
  Code2,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WidgetConfig {
  title: string;
  welcomeMessage: string;
  primaryColor: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: "small" | "medium" | "large";
  theme: "light" | "dark" | "auto";
}

export default function WidgetBuilder() {
  const [config, setConfig] = useState<WidgetConfig>({
    title: "Chat with us",
    welcomeMessage: "Hi! How can we help you today?",
    primaryColor: "#6b7280",
    position: "bottom-right",
    size: "medium",
    theme: "light",
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateConfig = (key: keyof WidgetConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const generateEmbedCode = () => {
    return `<!-- Widget Embed Code -->
<script>
  (function() {
    var widget = document.createElement('div');
    widget.id = 'custom-widget';
    widget.innerHTML = \`
      <div style="
        position: fixed;
        ${config.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
        ${config.position.includes("right") ? "right: 20px;" : "left: 20px;"}
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <button onclick="toggleWidget()" style="
          background: ${config.primaryColor};
          color: white;
          border: none;
          border-radius: 50px;
          padding: ${config.size === "small" ? "12px 16px" : config.size === "large" ? "20px 24px" : "16px 20px"};
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: ${config.size === "small" ? "14px" : config.size === "large" ? "18px" : "16px"};
          font-weight: 600;
        ">
          ${config.title}
        </button>
        <div id="widget-popup" style="
          display: none;
          position: absolute;
          ${config.position.includes("bottom") ? "bottom: 60px;" : "top: 60px;"}
          ${config.position.includes("right") ? "right: 0;" : "left: 0;"}
          width: 300px;
          background: ${config.theme === "dark" ? "#1f2937" : "white"};
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          padding: 20px;
          color: ${config.theme === "dark" ? "white" : "#374151"};
        ">
          <p style="margin: 0; font-size: 16px; line-height: 1.5;">
            ${config.welcomeMessage}
          </p>
        </div>
      </div>
    \`;
    document.body.appendChild(widget);
    
    window.toggleWidget = function() {
      var popup = document.getElementById('widget-popup');
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    };
  })();
</script>`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-xl font-semibold text-foreground">
              Widget Builder
            </h1>
          </div>
          <Button
            onClick={() => setShowPreview(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Eye className="h-4 w-4" />
            Preview Widget
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  Widget Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="appearance" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted">
                    <TabsTrigger
                      value="appearance"
                      className="gap-2 data-[state=active]:bg-background"
                    >
                      <Palette className="h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger
                      value="behavior"
                      className="data-[state=active]:bg-background"
                    >
                      Behavior
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="gap-2 data-[state=active]:bg-background"
                    >
                      <Code2 className="h-4 w-4" />
                      Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground">
                          Widget Title
                        </Label>
                        <Input
                          id="title"
                          value={config.title}
                          onChange={(e) =>
                            updateConfig("title", e.target.value)
                          }
                          placeholder="Chat with us"
                          className="border-input focus:border-ring"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color" className="text-foreground">
                          Primary Color
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="color"
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) =>
                              updateConfig("primaryColor", e.target.value)
                            }
                            className="w-16 h-10 p-1 border-input"
                          />
                          <Input
                            value={config.primaryColor}
                            onChange={(e) =>
                              updateConfig("primaryColor", e.target.value)
                            }
                            placeholder="#6b7280"
                            className="border-input focus:border-ring"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="welcome" className="text-foreground">
                        Welcome Message
                      </Label>
                      <Textarea
                        id="welcome"
                        value={config.welcomeMessage}
                        onChange={(e) =>
                          updateConfig("welcomeMessage", e.target.value)
                        }
                        placeholder="Hi! How can we help you today?"
                        rows={3}
                        className="border-input focus:border-ring"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Position</Label>
                        <Select
                          value={config.position}
                          onValueChange={(value) =>
                            updateConfig("position", value)
                          }
                        >
                          <SelectTrigger className="border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom-right">
                              Bottom Right
                            </SelectItem>
                            <SelectItem value="bottom-left">
                              Bottom Left
                            </SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Size</Label>
                        <Select
                          value={config.size}
                          onValueChange={(value) => updateConfig("size", value)}
                        >
                          <SelectTrigger className="border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Theme</Label>
                        <Select
                          value={config.theme}
                          onValueChange={(value) =>
                            updateConfig("theme", value)
                          }
                        >
                          <SelectTrigger className="border-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-4 mt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Behavior settings coming soon!</p>
                      <p className="text-sm">
                        Configure auto-open, triggers, and more.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground">Embed Code</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateEmbedCode())}
                          className="gap-2 border-input hover:bg-accent hover:text-accent-foreground"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Code
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-lg border border-border">
                        <pre className="text-sm overflow-x-auto text-foreground">
                          <code>{generateEmbedCode()}</code>
                        </pre>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          Copy and paste this code into your website's HTML,
                          just before the closing &lt;/body&gt; tag.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-8 min-h-[300px] relative border border-border">
                  <div className="text-center text-muted-foreground mb-4">
                    <p className="text-sm">Your website preview</p>
                  </div>

                  {/* Mock website content */}
                  <div className="space-y-2 mb-8">
                    <div className="h-4 bg-background rounded w-3/4 border border-border"></div>
                    <div className="h-4 bg-background rounded w-1/2 border border-border"></div>
                    <div className="h-4 bg-background rounded w-2/3 border border-border"></div>
                  </div>

                  {/* Widget Preview */}
                  <div
                    className="absolute"
                    style={{
                      [config.position.includes("bottom") ? "bottom" : "top"]:
                        "20px",
                      [config.position.includes("right") ? "right" : "left"]:
                        "20px",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: config.primaryColor,
                        fontSize:
                          config.size === "small"
                            ? "14px"
                            : config.size === "large"
                              ? "18px"
                              : "16px",
                        padding:
                          config.size === "small"
                            ? "12px 16px"
                            : config.size === "large"
                              ? "20px 24px"
                              : "16px 20px",
                      }}
                      className="rounded-full shadow-lg text-white hover:opacity-90"
                    >
                      {config.title}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Position
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {config.position}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Size</span>
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {config.size}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {config.theme}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Widget Preview
            </DialogTitle>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-8 min-h-[400px] relative border border-border">
            <div className="text-center text-muted-foreground mb-8">
              <h3 className="text-lg font-medium mb-2 text-foreground">
                Your Website
              </h3>
              <p className="text-sm">
                This is how your widget will appear on your site
              </p>
            </div>

            {/* Mock website content */}
            <div className="space-y-4 mb-12">
              <div className="h-6 bg-background rounded w-1/2 border border-border"></div>
              <div className="h-4 bg-background rounded w-3/4 border border-border"></div>
              <div className="h-4 bg-background rounded w-2/3 border border-border"></div>
              <div className="h-4 bg-background rounded w-1/2 border border-border"></div>
              <div className="h-32 bg-background rounded border border-border"></div>
            </div>

            {/* Widget Preview */}
            <div
              className="absolute"
              style={{
                [config.position.includes("bottom") ? "bottom" : "top"]: "20px",
                [config.position.includes("right") ? "right" : "left"]: "20px",
              }}
            >
              <div className="relative">
                <Button
                  style={{
                    backgroundColor: config.primaryColor,
                    fontSize:
                      config.size === "small"
                        ? "14px"
                        : config.size === "large"
                          ? "18px"
                          : "16px",
                    padding:
                      config.size === "small"
                        ? "12px 16px"
                        : config.size === "large"
                          ? "20px 24px"
                          : "16px 20px",
                  }}
                  className="rounded-full shadow-lg text-white hover:opacity-90"
                >
                  {config.title}
                </Button>

                {/* Popup preview */}
                <div
                  className={`absolute w-72 p-4 rounded-lg shadow-xl border ${
                    config.theme === "dark"
                      ? "bg-card text-card-foreground border-border"
                      : "bg-background text-foreground border-border"
                  }`}
                  style={{
                    [config.position.includes("bottom") ? "bottom" : "top"]:
                      "60px",
                    [config.position.includes("right") ? "right" : "left"]: "0",
                  }}
                >
                  <p className="text-sm leading-relaxed">
                    {config.welcomeMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
