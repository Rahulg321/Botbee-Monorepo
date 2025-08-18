"use client";

import { AiCharacterCategory } from "@repo/db/schema";
import { User } from "next-auth";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateCharacterInput,
  createCharacterSchema,
} from "@/lib/schemas/create-character-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createCharacter } from "@/lib/actions/create-character";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";

const CreateCharacterForm = ({
  userId,
  characterCategories,
}: {
  userId: string;
  characterCategories: AiCharacterCategory[];
}) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      name: "",
      description: "",
      fullDescription: "",
      personality: "",
      systemPrompt: "",
      behaviorAndTone: "",
      conversationTone: "",
      brandGuidelines: "",
      customGreeting: "",
      prompts: [],
      categoryId: "",
      status: "draft",
    },
  });

  const [newPrompt, setNewPrompt] = React.useState("");

  const addPrompt = () => {
    if (newPrompt.trim() && newPrompt.length <= 1000) {
      const currentPrompts = form.getValues("prompts") || [];
      form.setValue("prompts", [...currentPrompts, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  const removePrompt = (index: number) => {
    const currentPrompts = form.getValues("prompts") || [];
    form.setValue(
      "prompts",
      currentPrompts.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (values: CreateCharacterInput) => {
    startTransition(async () => {
      try {
        const response = await createCharacter(values, userId);

        if (response.success) {
          toast.success(`Character created successfully`, {
            description: "You can now use this character in your bot",
            action: {
              label: "View Character",
              onClick: () => {
                router.push(`/characters/${response.insertedCharacter?.id}`);
              },
            },
          });
          form.reset();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error creating character:", error);
      }
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Character</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter character name..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your character a memorable name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {characterCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a category for your character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Fields */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your character..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A concise overview of your character (max 1000 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of your character..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comprehensive description including background, appearance,
                    etc. (max 5000 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personality and Behavior */}
            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the character's personality traits..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Key personality characteristics and traits (max 2000
                    characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="behaviorAndTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Behavior and Tone</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How does your character behave and communicate?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Behavioral patterns and communication style (max 2000
                    characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="conversationTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversation Tone</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What tone does your character use in conversations?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The overall tone and style of conversation (max 1000
                    characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* System Prompt */}
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the system prompt that defines your character..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The core instruction that defines how your character behaves
                    (max 10000 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand Guidelines */}
            <FormField
              control={form.control}
              name="brandGuidelines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Guidelines</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any brand-specific guidelines or restrictions..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brand voice, restrictions, or guidelines (max 3000
                    characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Greeting */}
            <FormField
              control={form.control}
              name="customGreeting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Greeting</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How should your character greet users?"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Personalized greeting message (max 500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prompts */}
            <FormField
              control={form.control}
              name="prompts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example Prompts</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add an example prompt..."
                          value={newPrompt}
                          onChange={(e) => setNewPrompt(e.target.value)}
                          maxLength={1000}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={addPrompt}
                          disabled={!newPrompt.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {(field.value || []).length > 0 && (
                        <div className="space-y-2">
                          {(field.value || []).map((prompt, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-muted rounded-md"
                            >
                              <span className="flex-1 text-sm">{prompt}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                className="cursor-pointer"
                                size="sm"
                                onClick={() => removePrompt(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add example prompts to help define your character's
                    responses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the current status of your character
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Character"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateCharacterForm;
