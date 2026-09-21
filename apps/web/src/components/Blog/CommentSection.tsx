"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageCircle, Reply, Send, X } from "lucide-react";

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  parentId: number | null;
};

type CommentNode = Comment & { replies: CommentNode[] };

function buildTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<number, CommentNode>();
  comments.forEach((comment) => nodes.set(comment.id, { ...comment, replies: [] }));
  const roots: CommentNode[] = [];
  nodes.forEach((comment) => {
    const parent = comment.parentId ? nodes.get(comment.parentId) : undefined;
    if (parent) parent.replies.push(comment);
    else roots.push(comment);
  });
  return roots;
}

function CommentCard({
  comment,
  depth,
  onReply,
}: {
  comment: CommentNode;
  depth: number;
  onReply: (comment: Comment) => void;
}) {
  return (
    <div className={depth ? "ml-5 border-l border-slate-200 pl-5 md:ml-10 dark:border-white/10" : ""}>
      <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151c24]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#151c24] text-sm font-bold text-white dark:bg-[#f0b45c] dark:text-[#151c24]">
              {comment.author.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-bold text-slate-950 dark:text-white">{comment.author}</p>
              <time className="text-xs text-slate-500">
                {new Date(comment.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
              </time>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onReply(comment)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#a31631] transition hover:bg-rose-50 dark:text-[#ff9aae] dark:hover:bg-white/5"
          >
            <Reply className="size-3.5" /> Reply
          </button>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{comment.content}</p>
      </article>
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const tree = useMemo(() => buildTree(comments), [comments]);

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: Comment[]) => setComments(data))
      .catch(() => setError("Comments could not be loaded."))
      .finally(() => setIsLoading(false));
  }, [postId]);

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, parentId: replyingTo?.id ?? null, author, content }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Comment could not be posted.");
      setComments((current) => [...current, result]);
      setContent("");
      setReplyingTo(null);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Comment could not be posted.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto mt-14 max-w-3xl border-t border-slate-200 pt-10 dark:border-white/10" aria-labelledby="comments-heading">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a31631] dark:text-[#ff9aae]">Join the conversation</p>
          <h2 id="comments-heading" className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white">Comments</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-300">
          <MessageCircle className="size-4" /> {comments.length}
        </span>
      </div>

      <form onSubmit={submitComment} className="mb-9 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151c24]" data-test-id="comment-form">
        {replyingTo && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-2 text-sm text-[#8d1830] dark:bg-white/5 dark:text-[#ff9aae]">
            <span>Replying to <strong>{replyingTo.author}</strong></span>
            <button type="button" onClick={() => setReplyingTo(null)} aria-label="Cancel reply"><X className="size-4" /></button>
          </div>
        )}
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Name
            <input aria-label="Name" value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={60} required className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-[#a31631] focus:ring-2 focus:ring-[#a31631]/10 dark:border-white/10 dark:bg-black/20" placeholder="Your name" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            Comment
            <textarea aria-label="Comment" value={content} onChange={(event) => setContent(event.target.value)} maxLength={2000} required rows={4} className="resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal leading-6 outline-none transition focus:border-[#a31631] focus:ring-2 focus:ring-[#a31631]/10 dark:border-white/10 dark:bg-black/20" placeholder="Share your thoughts…" />
          </label>
        </div>
        {error && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button disabled={isSubmitting} type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#a31631] px-5 text-sm font-bold text-white shadow-lg shadow-rose-900/15 transition hover:bg-[#841229] disabled:opacity-50">
            <Send className="size-4" /> {isSubmitting ? "Posting…" : replyingTo ? "Post reply" : "Post comment"}
          </button>
        </div>
      </form>

      {isLoading ? <p className="text-sm text-slate-500">Loading comments…</p> : tree.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-slate-500 dark:border-white/15">No comments yet. Start the conversation.</div>
      ) : (
        <div className="space-y-4" data-test-id="comment-list">
          {tree.map((comment) => <CommentCard key={comment.id} comment={comment} depth={0} onReply={setReplyingTo} />)}
        </div>
      )}
    </section>
  );
}
