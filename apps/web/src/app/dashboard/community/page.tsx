"use client";

import { useState } from "react";
import { MessageSquare, Plus, Flame, MessageCircle, Reply } from "lucide-react";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  authorName: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  hasLiked: boolean;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      authorName: "Sahil Khan",
      title: "How does the displacement reaction work in Class 10 Ch 1?",
      content:
        "Hey everyone! I was studying displacement reactions (e.g. Iron nails in Copper Sulphate solution). Why does the copper get deposited, and is it a redox reaction as well?",
      likes: 12,
      comments: [
        {
          id: "c-1",
          authorName: "Nisha Sharma",
          content:
            "Yes! Iron is more reactive than copper, so it displaces copper from copper sulphate solution. It is also a redox reaction because Fe is oxidized and Cu is reduced.",
          createdAt: "2 hours ago",
        },
      ],
      hasLiked: false,
    },
    {
      id: "post-2",
      authorName: "Amit Patel",
      title: "Class 10 Carbon Compounds Notes shared!",
      content:
        "Just uploaded a summary sheet of functional groups (alcohol, aldehyde, ketone, carboxylic acid). Hope this helps for the upcoming assignments!",
      likes: 24,
      comments: [],
      hasLiked: true,
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: "Sahil Khan",
      title: newTitle.trim(),
      content: newContent.trim(),
      likes: 0,
      comments: [],
      hasLiked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewTitle("");
    setNewContent("");
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      }),
    );
  };

  const handleCreateComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: "Sahil Khan",
      content: text.trim(),
      createdAt: "Just now",
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      }),
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Community Study Hub</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Share doubts, collaborate on NCERT lessons, and practice together in real-time.
        </p>
      </div>

      {/* New Post Card Form */}
      <form
        onSubmit={handleCreatePost}
        className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4"
      >
        <h3 className="font-extrabold text-sm text-teal-accent uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={16} /> Ask a Question / Post Notes
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter discussion title (e.g. Acid Base Ch 2 pH value doubt)"
            className="w-full px-4 py-3 rounded-xl border border-border bg-slate-gray focus:outline-none focus:ring-2 focus:ring-teal-accent text-sm text-foreground"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Describe your query or share summaries with your study group..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-slate-gray focus:outline-none focus:ring-2 focus:ring-teal-accent text-sm resize-none text-foreground"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newTitle.trim() || !newContent.trim()}
            className="px-5 py-2.5 bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs rounded-xl disabled:bg-muted disabled:text-muted-foreground transition-all duration-200 flex items-center gap-1.5"
          >
            Post Topic <Plus size={14} />
          </button>
        </div>
      </form>

      {/* Social Feed List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="p-6 rounded-2xl bg-card border border-border shadow-sm">
            {/* Author details */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron text-foreground font-bold flex items-center justify-center">
                {post.authorName[0]}
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight text-foreground">
                  {post.authorName}
                </h4>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Member • Class 10 Student
                </span>
              </div>
            </div>

            {/* Post Title & Content */}
            <div className="mt-4">
              <h3 className="text-lg font-extrabold text-foreground">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Interactive action buttons */}
            <div className="mt-6 pt-4 border-t border-border flex items-center gap-6 text-xs font-bold text-muted-foreground">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.hasLiked ? "text-saffron" : "hover:text-saffron"
                }`}
                type="button"
              >
                <Flame size={16} />
                <span>
                  {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                </span>
              </button>

              <button
                onClick={() =>
                  setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                }
                className="flex items-center gap-1.5 hover:text-teal-accent transition-colors"
                type="button"
              >
                <MessageCircle size={16} />
                <span>{post.comments.length} Comments</span>
              </button>
            </div>

            {/* Expanded comments section */}
            {expandedComments[post.id] && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Existing comments list */}
                {post.comments.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-foreground">{comment.authorName}</span>
                          <span className="text-[9px] text-muted-foreground">
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment creator form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    placeholder="Write a comment..."
                    className="flex-grow px-3 py-2 rounded-lg border border-border bg-slate-gray focus:outline-none focus:ring-1 focus:ring-teal-accent text-xs text-foreground"
                  />
                  <button
                    onClick={() => handleCreateComment(post.id)}
                    className="px-4 py-2 bg-teal-accent text-white font-bold text-xs rounded-lg hover:bg-teal-dark transition-colors flex items-center gap-1"
                    type="button"
                  >
                    Reply <Reply size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
