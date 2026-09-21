"use client";

import {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLikeState, likePost, unlikePost } from "@/actions/likes";
import { toast } from "sonner";
type LikeUIState = {
  liked: boolean;
  likes: number;
};

type Props = {
  postId: number;
  initialLikes: number;
};

export function LikeControls({ postId, initialLikes }: Props) {
  // “server-truth” state
  const [state, setState] = useState<LikeUIState>({
    liked: false,
    likes: initialLikes,
  });

  // optimistic state derived from “state”
  const [optimistic, setOptimistic] = useOptimistic(
    state,
    (current, next: Partial<LikeUIState>) => ({ ...current, ...next }),
  );

  // avoid double-click spam while request in-flight (optional but recommended)
  const inFlight = useRef(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const data = await fetchLikeState(postId);
      if (!mounted || !data) return;

      setState({ liked: data.liked, likes: data.likes });
    })();

    return () => {
      mounted = false;
    };
  }, [postId]);

  const onToggle = async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    const prev = optimistic; // snapshot for rollback
    const nextLiked = !optimistic.liked;

    // optimistic update immediately
    setOptimistic({
      liked: nextLiked,
      likes: optimistic.likes + (nextLiked ? 1 : -1),
    });

    try {
      const res = nextLiked ? await likePost(postId) : await unlikePost(postId);

      if (!res) {
        // rollback
        setOptimistic(prev);
        toast.error("Something went wrong", {
          description: "Could not update your like. Please try again.",
        });
        return;
      }
      else {
        toast.success(nextLiked ? "You liked this post" : "You unliked this post");
      }

      // commit server truth
      setState({ liked: nextLiked, likes: res.likes });
    } catch (e) {
      // rollback
      setOptimistic(prev);
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => onToggle())}
      className="flex items-center gap-2"
      aria-pressed={optimistic.liked}
      data-test-id="like-button"
    >
      <HeartIcon
        className={cn(
          "mr-1 inline-block size-5 text-red-500 transition-colors duration-200",
          optimistic.liked && "fill-red-500",
        )}
      />
      <span>{optimistic.likes} likes</span>
    </button>
  );
}
