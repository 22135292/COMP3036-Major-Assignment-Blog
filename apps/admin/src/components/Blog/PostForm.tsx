"use client";

import TiptapEditor from "./TiptapEditor";
import { marked } from "marked";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, PostSchemaType } from "@/utils/form/post.form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { updatePost, createPost } from "@/actions/posts";
import { getCloudinarySignature } from "@/actions/upload";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CREATE_DRAFT_KEY = "full-stack-blog:create-post-draft";

type PostFormProps = {
  defaultValues?: Partial<PostSchemaType> & {
    urlId?: string;
  };
  mode: "create" | "edit";
};

export function PostForm({ defaultValues, mode }: PostFormProps) {
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [savedDraft, setSavedDraft] = useState<PostSchemaType | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<"markdown" | "richtext">(
    "markdown",
  );

  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<{
    start: number;
    end: number;
  } | null>(null);

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      category: defaultValues?.category || "",
      description: defaultValues?.description || "",
      content: defaultValues?.content || "",
      imageUrl: defaultValues?.imageUrl || "",
      tags: defaultValues?.tags || "",
    },
  });

  const imageUrl = form.watch("imageUrl");
  const content = form.watch("content");

  useEffect(() => {
    if (mode !== "create") {
      setDraftReady(true);
      return;
    }

    try {
      const storedDraft = window.localStorage.getItem(CREATE_DRAFT_KEY);

      if (storedDraft) {
        setSavedDraft(JSON.parse(storedDraft) as PostSchemaType);
      }
    } catch {
      window.localStorage.removeItem(CREATE_DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "create" || !draftReady) {
      return;
    }

    const subscription = form.watch((values) => {
      const draft = values as PostSchemaType;

      const hasContent = Object.values(draft).some(
        (value) => typeof value === "string" && value.trim().length > 0,
      );

      if (!hasContent) {
        return;
      }

      window.localStorage.setItem(
        CREATE_DRAFT_KEY,
        JSON.stringify(draft),
      );

      setDraftSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [draftReady, form, mode]);

  const restoreDraft = () => {
    if (!savedDraft) {
      return;
    }

    form.reset(savedDraft);
    setSavedDraft(null);
    toast.success("Draft restored");
  };

  const discardDraft = () => {
    window.localStorage.removeItem(CREATE_DRAFT_KEY);
    setSavedDraft(null);
    setDraftSavedAt(null);
    toast.success("Saved draft removed");
  };

  useEffect(() => {
    if (editorMode === "markdown" && showPreview && content) {
      const parseContent = async () => {
        const html = await marked.parse(content);
        setPreviewHtml(html);
      };

      void parseContent();
    }
  }, [showPreview, content, editorMode]);

  const handlePreviewToggle = () => {
    if (!showPreview) {
      if (textareaRef.current) {
        cursorPositionRef.current = {
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd,
        };
      }

      setShowPreview(true);
      return;
    }

    setShowPreview(false);

    window.setTimeout(() => {
      if (textareaRef.current && cursorPositionRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          cursorPositionRef.current.start,
          cursorPositionRef.current.end,
        );
      }
    }, 0);
  };

  const onSubmit = async (data: PostSchemaType) => {
    const result =
      mode === "edit" && defaultValues?.urlId
        ? await updatePost(defaultValues.urlId, data)
        : await createPost(data);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      mode === "create"
        ? "Post created successfully"
        : "Post updated successfully",
    );

    if (!result.success) {
      return;
    }

    if (mode === "create") {
      window.localStorage.removeItem(CREATE_DRAFT_KEY);
    }

    if (
      mode === "create" ||
      (result.urlId && result.urlId !== defaultValues?.urlId)
    ) {
      router.push(`/post/${result.urlId}`);
      return;
    }

    router.refresh();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("The image must be smaller than 10 MB");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      let publicId = defaultValues?.urlId;

      if (!publicId && mode === "create") {
        const title = form.getValues("title");

        if (title) {
          publicId = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
      }

      const {
        timestamp,
        signature,
        apiKey,
        cloudName,
        folder,
      } = await getCloudinarySignature(publicId);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      if (publicId) {
        formData.append("public_id", publicId);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error?.message || "Upload failed",
        );
      }

      const data = await response.json();

      form.setValue("imageUrl", data.secure_url, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-5xl rounded-[1.75rem] border-slate-200 bg-white shadow-xl shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100 px-6 py-6 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a31631]">
          Content studio
        </p>

        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {mode === "create" ? "Create Post" : "Update Post"}
        </h1>
      </CardHeader>

      <CardContent className="px-6 py-7 md:px-8">
        {mode === "create" && savedDraft && (
          <div
            data-test-id="draft-recovery"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-slate-950">
                Unsaved draft found
              </p>

              <p className="text-sm text-slate-600">
                Restore your locally saved work or remove it.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={discardDraft}
              >
                Discard
              </Button>

              <Button
                type="button"
                onClick={restoreDraft}
              >
                Restore draft
              </Button>
            </div>
          </div>
        )}

        {mode === "create" && draftSavedAt && !savedDraft && (
          <p
            data-test-id="draft-status"
            className="mb-4 text-right text-xs font-medium text-emerald-700"
          >
            Draft saved locally at {draftSavedAt}
          </p>
        )}

        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mb-4 text-red-500">
            Please fix the errors before saving
          </div>
        )}

        <form
          id="post-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">
                    Title
                  </FieldLabel>

                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category">
                    Category
                  </FieldLabel>

                  <Input
                    {...field}
                    id="category"
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    Description
                  </FieldLabel>

                  <textarea
                    {...field}
                    id="description"
                    className={cn(
                      "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      fieldState.invalid && "border-red-500",
                    )}
                    aria-invalid={fieldState.invalid}
                  />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="mb-2 flex items-center justify-between">
                    <FieldLabel htmlFor="content">
                      Content
                    </FieldLabel>

                    <div className="bg-muted flex h-8 items-center rounded-md p-1">
                      <button
                        type="button"
                        onClick={() => setEditorMode("markdown")}
                        className={cn(
                          "rounded-sm px-3 py-1 text-xs transition-all",
                          editorMode === "markdown"
                            ? "bg-background text-foreground shadow-sm"
                            : "hover:text-foreground text-muted-foreground",
                        )}
                      >
                        Markdown
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditorMode("richtext")}
                        className={cn(
                          "rounded-sm px-3 py-1 text-xs transition-all",
                          editorMode === "richtext"
                            ? "bg-background text-foreground shadow-sm"
                            : "hover:text-foreground text-muted-foreground",
                        )}
                      >
                        Rich Text
                      </button>
                    </div>
                  </div>

                  {editorMode === "markdown" ? (
                    <>
                      {showPreview ? (
                        <div
                          data-test-id="content-preview"
                          className="prose prose-sm min-h-[150px] w-full max-w-none rounded-md border p-3"
                          dangerouslySetInnerHTML={{
                            __html: previewHtml,
                          }}
                        />
                      ) : (
                        <textarea
                          {...field}
                          ref={(element) => {
                            field.ref(element);
                            textareaRef.current = element;
                          }}
                          id="content"
                          data-test-id="content"
                          className={cn(
                            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[200px] w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            fieldState.invalid && "border-red-500",
                          )}
                          aria-invalid={fieldState.invalid}
                        />
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handlePreviewToggle}
                      >
                        {showPreview
                          ? "Close Preview"
                          : "Preview"}
                      </Button>
                    </>
                  ) : (
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      className={cn(
                        fieldState.invalid && "border-red-500",
                      )}
                    />
                  )}

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="imageUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="image-url">
                    Cover image
                  </FieldLabel>

                  <p className="text-sm text-slate-500">
                    Paste a direct image URL, or choose an image
                    from your computer.
                  </p>

                  <div className="mb-2 flex flex-col gap-3 sm:flex-row">
                    <Input
                      {...field}
                      id="image-url"
                      data-test-id="image-url"
                      aria-invalid={fieldState.invalid}
                      placeholder="https://example.com/photo.jpg"
                    />

                    <div className="relative">
                      <Input
                        type="file"
                        className="w-full sm:w-[220px]"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />

                      {isUploading && (
                        <div className="bg-background/50 absolute inset-0 flex items-center justify-center text-xs">
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>

                  {imageUrl && !fieldState.invalid && (
                    <div className="mt-2">
                      <img
                        data-test-id="image-preview"
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-40 rounded object-cover"
                      />
                    </div>
                  )}

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">
                    Tags
                  </FieldLabel>

                  <Input
                    {...field}
                    id="tags"
                    aria-invalid={fieldState.invalid}
                    placeholder="tag1, tag2"
                  />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-end border-t border-slate-100 px-6 py-5 md:px-8">
        <Button
          type="submit"
          form="post-form"
          disabled={
            isUploading ||
            form.formState.isSubmitting
          }
          className="min-w-32 rounded-xl bg-[#a31631] hover:bg-[#841229]"
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}