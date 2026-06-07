"use client";

import { useState } from "react";
import {
  MessageCircle,
  Plus,
  Compass,
  Calculator,
  FlaskConical,
  Lightbulb,
  Globe,
  TrendingUp,
  BookOpen,
  Heart,
  Send,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  Share2,
  Image as ImageIcon,
  Link as LinkIcon,
  Code
} from "lucide-react";

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  category: string;
  timeAgo: string;
  title: string;
  content: string;
  likesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
  isSystem?: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      authorName: "Aisha Sharma",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      authorBadge: "Top Scholar",
      category: "Physics",
      timeAgo: "2 hours ago",
      title: "Help understanding Faraday's Law direction?",
      content:
        "I get the formula ε = -dΦ/dt, but I always mess up Lenz's Law when trying to figure out the actual direction of the induced current in a loop. Does anyone have a trick to remember it easily?",
      likesCount: 24,
      isLiked: false,
      isBookmarked: false,
      comments: [
        {
          id: "c-1",
          authorName: "Nisha Patel",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
          content:
            "A simple way is to think: 'Nature hates changes in flux'. If the flux is increasing, the loop will create its own magnetic field opposing the increase. If flux is decreasing, it will try to sustain it!",
          createdAt: "1 hour ago",
        },
      ],
    },
    {
      id: "post-2",
      authorName: "Official NCERT Guide",
      authorAvatar: "",
      authorBadge: "System",
      category: "Announcements",
      timeAgo: "5 hours ago",
      isSystem: true,
      title: "New Quizzes Added for Chemistry Chapter 4",
      content:
        "We've just dropped 5 new bite-sized quizzes covering Chemical Bonding and Molecular Structure. Test your knowledge and keep that study streak burning! 🔥",
      likesCount: 89,
      isLiked: true,
      isBookmarked: true,
      comments: [],
      actionButton: {
        text: "Take Quiz Now",
        onClick: () => {
          window.location.href = "/dashboard/quizzes";
        },
      },
    },
  ]);

  const [activeCategory, setActiveCategory] = useState("All Discussions");
  const [isCreatorFocused, setIsCreatorFocused] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({});
  const [expandedPostComments, setExpandedPostComments] = useState<{ [postId: string]: boolean }>({});

  const categories = [
    { name: "All Discussions", icon: Globe },
    { name: "Physics", icon: Compass },
    { name: "Math", icon: Calculator },
    { name: "Chemistry", icon: FlaskConical },
    { name: "Study Tips", icon: Lightbulb },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: "Arjun Sharma",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      authorBadge: "Student",
      category: activeCategory === "All Discussions" ? "General" : activeCategory,
      timeAgo: "Just now",
      title: postTitle.trim(),
      content: postContent.trim(),
      likesCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostTitle("");
    setPostContent("");
    setIsCreatorFocused(false);
  };

  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          return {
            ...post,
            isLiked: nextLiked,
            likesCount: nextLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleBookmarkToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked,
          };
        }
        return post;
      })
    );
  };

  const handleCreateComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: "Arjun Sharma",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
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
      })
    );

    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header section with Glassmorphic subtitle */}
      <header className="pb-4 border-b border-neutral-500/40">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <span>Community Hub</span>
          <Sparkles className="text-saffron size-5 animate-pulse" />
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Share study cards, clear doubt pools, and interact with fellow NCERT scholars.
        </p>
      </header>

      {/* 3 Columns Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Categories Sidebar (Glassmorphic) */}
        <aside className="w-full lg:w-[220px] shrink-0 sticky top-20 hidden md:flex flex-col gap-4">
          <h2 className="text-foreground/90 text-xs font-bold uppercase tracking-widest px-3">
            Categories
          </h2>
          <nav className="flex flex-col gap-1.5 p-2 bg-card/35 backdrop-blur-md border border-neutral-500/30 rounded-2xl">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 ${
                    isActive
                      ? "bg-teal-accent text-white shadow-lg shadow-teal-accent/25 font-semibold"
                      : "hover:bg-slate-gray/50 text-muted-foreground hover:text-foreground"
                  }`}
                  type="button"
                >
                  <IconComp size={16} />
                  <span className="text-xs">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Center Column: Feed */}
        <section className="flex-1 w-full max-w-[620px] space-y-6">
          
          {/* Post Creator Container (Premium Glassmorphism) */}
          <div
            className={`bg-card/45 backdrop-blur-md rounded-2xl border border-neutral-500/30 p-4 transition-all duration-300 relative ${
              isCreatorFocused ? "shadow-xl border-teal-accent/40 ring-1 ring-teal-accent/15" : "shadow-sm"
            }`}
          >
            <div className="flex gap-3 items-start">
              <div className="p-[2px] bg-gradient-to-tr from-saffron to-teal-accent rounded-full shrink-0">
                <div className="bg-background p-[1.5px] rounded-full">
                  <div
                    className="size-8 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80")`,
                    }}
                  />
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                {isCreatorFocused && (
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="What is your discussion topic?"
                    className="w-full bg-transparent border-b border-neutral-500/30 pb-2 mb-2 text-sm font-bold text-foreground focus:outline-none focus:border-teal-accent placeholder:text-muted-foreground/50"
                  />
                )}
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onFocus={() => setIsCreatorFocused(true)}
                  placeholder="Share a study tip or ask a question..."
                  className={`w-full bg-transparent border-none text-xs text-foreground focus:outline-none focus:ring-0 resize-none transition-all duration-300 placeholder:text-muted-foreground/50 ${
                    isCreatorFocused ? "h-24" : "h-9"
                  }`}
                />
                
                {/* Expanded Actions Bar */}
                {isCreatorFocused && (
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-500/30 mt-2 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="p-2 text-muted-foreground hover:text-teal-accent hover:bg-teal-accent/10 rounded-lg transition-colors flex items-center justify-center"
                        title="Add Image"
                      >
                        <ImageIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-muted-foreground hover:text-teal-accent hover:bg-teal-accent/10 rounded-lg transition-colors flex items-center justify-center"
                        title="Add Link"
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-muted-foreground hover:text-teal-accent hover:bg-teal-accent/10 rounded-lg transition-colors flex items-center justify-center"
                        title="Add Code"
                      >
                        <Code size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatorFocused(false);
                          setPostTitle("");
                          setPostContent("");
                        }}
                        className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground hover:bg-slate-gray/50 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!postTitle.trim() || !postContent.trim()}
                        className="bg-teal-accent hover:bg-teal-dark text-white font-bold text-[10px] px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        Post <Plus size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Feed List */}
          <div className="space-y-6">
            {posts
              .filter((post) => activeCategory === "All Discussions" || post.category === activeCategory)
              .map((post) => (
                <article
                  key={post.id}
                  className="bg-card/45 backdrop-blur-md rounded-2xl border border-neutral-500/30 shadow-lg hover:shadow-xl hover: border-neutral-500/60 transition-all duration-300 overflow-hidden"
                >
                  {/* Post Header (Instagram-style) */}
                  <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-500/20">
                    <div className="flex items-center gap-2.5">
                      {post.isSystem ? (
                        <div className="p-[2.5px] bg-gradient-to-tr from-teal-accent to-accent-bright rounded-full">
                          <div className="bg-background p-[1.5px] rounded-full">
                            <div className="size-8 rounded-full bg-teal-accent/10 flex items-center justify-center text-teal-accent">
                              <BookOpen size={15} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-[2.5px] bg-gradient-to-tr from-[#f97316] via-[#ec4899] to-[#8b5cf6] rounded-full">
                          <div className="bg-background p-[1.5px] rounded-full">
                            <img
                              src={post.authorAvatar}
                              alt={post.authorName}
                              className="size-8 rounded-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-foreground text-xs leading-none">
                            {post.authorName}
                          </h3>
                          {post.authorBadge && (
                            <span
                              className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
                                post.authorBadge === "System"
                                  ? "bg-ink text-white"
                                  : "bg-teal-light text-teal-accent"
                              }`}
                            >
                              {post.authorBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground mt-0.5">
                          {post.timeAgo} • <span className="text-teal-accent font-semibold">{post.category}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-slate-gray/30 transition-colors"
                      type="button"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 space-y-3">
                    <h4 className="font-extrabold text-sm text-foreground leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed font-light">
                      {post.content}
                    </p>

                    {/* Embedded Primary Action Button */}
                    {post.actionButton && (
                      <button
                        onClick={post.actionButton.onClick}
                        className="bg-teal-accent/10 text-teal-accent hover:bg-teal-accent hover:text-white font-bold text-[10px] px-4 py-2 rounded-xl border border-teal-accent/20 transition-all flex items-center gap-1.5 mt-2"
                      >
                        <Sparkles size={12} />
                        {post.actionButton.text}
                      </button>
                    )}
                  </div>

                  {/* Instagram-style Social Actions Row */}
                  <div className="px-4 py-2 flex items-center justify-between border-t border-neutral-500/10">
                    <div className="flex items-center gap-4">
                      {/* Heart (Like) */}
                      <button
                        onClick={() => handleLikeToggle(post.id)}
                        className="text-muted-foreground hover:text-red-500 hover:scale-110 active:scale-95 transition-all flex items-center gap-1"
                        type="button"
                        aria-label="Like"
                      >
                        <Heart
                          size={18}
                          className={`${
                            post.isLiked ? "text-red-500 fill-red-500" : ""
                          }`}
                        />
                      </button>

                      {/* Comment (Bubble) */}
                      <button
                        onClick={() =>
                          setExpandedPostComments((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        className="text-muted-foreground hover:text-teal-accent hover:scale-110 transition-all flex items-center gap-1"
                        type="button"
                        aria-label="Comment"
                      >
                        <MessageCircle size={18} />
                      </button>

                      {/* Send (Share) */}
                      <button
                        className="text-muted-foreground hover:text-accent-bright hover:scale-110 transition-all"
                        type="button"
                        aria-label="Share"
                        onClick={() => alert("Link copied to clipboard! (Simulation)")}
                      >
                        <Send size={18} />
                      </button>
                    </div>

                    {/* Bookmark (Save) */}
                    <button
                      onClick={() => handleBookmarkToggle(post.id)}
                      className="text-muted-foreground hover:text-saffron hover:scale-110 transition-all"
                      type="button"
                      aria-label="Save"
                    >
                      <Bookmark
                        size={18}
                        className={`${
                          post.isBookmarked ? "text-saffron fill-saffron" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Likes Count & View Comments */}
                  <div className="px-4 pb-3 pt-1 text-xs space-y-1">
                    <div className="font-extrabold text-foreground flex items-center gap-1">
                      <span>Liked by</span>
                      <span className="text-teal-accent">Sahil Khan</span>
                      <span>and</span>
                      <span className="underline cursor-pointer">{post.likesCount} others</span>
                    </div>

                    {post.comments.length > 0 && !expandedPostComments[post.id] && (
                      <button
                        onClick={() =>
                          setExpandedPostComments((prev) => ({
                            ...prev,
                            [post.id]: true,
                          }))
                        }
                        className="text-muted-foreground text-[10px] font-semibold hover:underline block pt-1"
                      >
                        View all {post.comments.length} replies
                      </button>
                    )}
                  </div>

                  {/* Expanded Comments Panel (Instagram nested layout) */}
                  {expandedPostComments[post.id] && (
                    <div className="bg-slate-gray/10 border-t border-neutral-500/20 px-4 py-4 space-y-4">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="flex gap-2.5 items-start">
                          <img
                            src={comm.authorAvatar}
                            alt={comm.authorName}
                            className="size-7 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-500/30"
                          />
                          <div className="flex-grow bg-card/30 rounded-2xl p-3 border border-neutral-500/20 text-xs">
                            <div className="flex justify-between items-center mb-1 font-bold">
                              <span className="text-foreground">{comm.authorName}</span>
                              <span className="text-[9px] text-muted-foreground font-light">
                                {comm.createdAt}
                              </span>
                            </div>
                            <p className="text-muted-foreground font-light leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Inline Reply Input Box */}
                      <div className="flex gap-2 items-center pt-2">
                        <input
                          type="text"
                          value={commentTexts[post.id] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Add a reply..."
                          className="flex-grow px-3 py-2 rounded-xl border border-neutral-500/35 bg-card/25 focus:outline-none focus:ring-1 focus:ring-teal-accent text-xs text-foreground placeholder:text-muted-foreground/50"
                        />
                        <button
                          onClick={() => handleCreateComment(post.id)}
                          className="px-4 py-2 bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs rounded-xl transition-all"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
          </div>

        </section>

        {/* Right Column: Trending Sidebar (Glassmorphic) */}
        <aside className="w-full lg:w-[240px] shrink-0 sticky top-20 hidden xl:flex flex-col gap-4">
          <div className="bg-card/45 backdrop-blur-md rounded-2xl border border-neutral-500/30 p-5 shadow-lg">
            <h2 className="text-foreground text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-teal-accent" /> Trending Topics
            </h2>
            <ul className="space-y-3.5">
              <li>
                <span className="text-xs font-bold text-foreground hover:text-teal-accent cursor-pointer transition-colors block">
                  #CBSE2026
                </span>
                <span className="text-[10px] text-muted-foreground">
                  1.2k posts this week
                </span>
              </li>
              <li>
                <span className="text-xs font-bold text-foreground hover:text-teal-accent cursor-pointer transition-colors block">
                  #CalculusTricks
                </span>
                <span className="text-[10px] text-muted-foreground">
                  854 posts
                </span>
              </li>
              <li>
                <span className="text-xs font-bold text-foreground hover:text-teal-accent cursor-pointer transition-colors block">
                  #FaradaysLaw
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold text-teal-accent/80">
                  Trending in Physics
                </span>
              </li>
            </ul>
            
            <hr className=" border-neutral-500/30 my-4" />
            
            <h2 className="text-foreground text-xs font-bold uppercase tracking-widest mb-4">
              Active Channels
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 cursor-pointer hover:bg-slate-gray/30 p-1.5 rounded-xl transition-all duration-300">
                <div className="size-8 rounded-lg bg-teal-light/25 border border-teal-accent/20 flex items-center justify-center text-teal-accent shrink-0">
                  <BookOpen size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Class 12 Boards
                  </span>
                  <span className="text-[9px] text-muted-foreground font-light mt-0.5">
                    23 scholars active
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:bg-slate-gray/30 p-1.5 rounded-xl transition-all duration-300">
                <div className="size-8 rounded-lg bg-saffron-light/25 border border-saffron/20 flex items-center justify-center text-saffron-dark shrink-0">
                  <Compass size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Organic Chem
                  </span>
                  <span className="text-[9px] text-muted-foreground font-light mt-0.5">
                    12 scholars active
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}
