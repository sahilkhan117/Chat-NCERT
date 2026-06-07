"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Flame,
  MessageCircle,
  Reply,
  Compass,
  Calculator,
  FlaskConical,
  Lightbulb,
  Globe,
  Rocket,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  TrendingUp,
  BookOpen,
} from "lucide-react";

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

interface Reaction {
  icon: any;
  label: string;
  count: number;
  active: boolean;
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
  reactions: Reaction[];
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
      authorAvatar: "https://lh3.googleusercontent.com/aida/AP1WRLtGFWpM3qnckvyDYHmH4zHhhaWXY13dh-Pu-39C1cWSrQFIAVIpmAO0-jntomVUB1bBYwxzaO3bDB03mcCDGRAYRhm59XJATc9I90pwODYC01tqVJz0EMQa2oaTLoMPFZnsh1VHpQ7H6Kc3H-83FjiCBaGYpnGwBfXrSe5ywgTYxVHoEP3CT3ZQDCb3d79oE39es3QRZO38nU69Bsa4HxTGVjrepGb83oFgoEnBxS98zq7JFeFUYpBhQt2z",
      authorBadge: "Top Contributor",
      category: "Physics",
      timeAgo: "2 hours ago",
      title: "Help understanding Faraday's Law direction?",
      content:
        "I get the formula ε = -dΦ/dt, but I always mess up Lenz's Law when trying to figure out the actual direction of the induced current in a loop. Does anyone have a trick to remember it easily?",
      reactions: [
        { icon: Rocket, label: "rocket", count: 12, active: false },
        { icon: Lightbulb, label: "lightbulb", count: 5, active: false },
      ],
      comments: [
        {
          id: "c-1",
          authorName: "Nisha Patel",
          authorAvatar: "https://lh3.googleusercontent.com/aida/AP1WRLu6ZLrriL6oxJFqFvnuTWRIjHculacaedPAHaBDdZvSQyl2ww6XS6SldarMufENschYO-d-JLHvkqfZZvoYe1n11X886DAfrXjBJLjScRPH-KHDoaI57gYP7NxvLsiBvIgbeRb_RnpmgvCwEi_YGCBvEqdx7uZokOYAr2f1KHBvBTmEOKdv6yli-x8kq9X4AHoI7YtN5tCkL4mA3pB9IaZTQP2vLZ6FKERVCQbtAumHOxEHPDRh3zd47Xop",
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
      reactions: [
        { icon: Flame, label: "fire", count: 45, active: false },
      ],
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
      authorAvatar: "https://lh3.googleusercontent.com/aida/AP1WRLt5ebnnCRad9z-v6QVXXzOOBqFJM0naXp_sGBeKDv7yJqteq62ilqjz_HjPfJdWrrHxhTS-s7FZobbly1b6TfGS5GVcWEdBpdf9j066L5adtkBKKVjCWWloC0MybHELNtMtB2OOTqZDfwja4kMltjWeiyIN9nNPAuxrLuHPMVXXSyfDKvQDbHrxdiXStFr90eElqvwEIQqCx5Bhv8GTKCu10Hu7n7PIPYQi6te67wIr9YUK9fvOIosQhvyZ",
      authorBadge: "Student",
      category: activeCategory === "All Discussions" ? "General" : activeCategory,
      timeAgo: "Just now",
      title: postTitle.trim(),
      content: postContent.trim(),
      reactions: [
        { icon: Rocket, label: "rocket", count: 0, active: false },
        { icon: Lightbulb, label: "lightbulb", count: 0, active: false },
      ],
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostTitle("");
    setPostContent("");
    setIsCreatorFocused(false);
  };

  const handleReactionClick = (postId: string, label: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: post.reactions.map((reaction) => {
              if (reaction.label === label) {
                const nextActive = !reaction.active;
                return {
                  ...reaction,
                  count: nextActive ? reaction.count + 1 : reaction.count - 1,
                  active: nextActive,
                };
              }
              return reaction;
            }),
          };
        }
        return post;
      }),
    );
  };

  const handleCreateComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: "Arjun Sharma",
      authorAvatar: "https://lh3.googleusercontent.com/aida/AP1WRLt5ebnnCRad9z-v6QVXXzOOBqFJM0naXp_sGBeKDv7yJqteq62ilqjz_HjPfJdWrrHxhTS-s7FZobbly1b6TfGS5GVcWEdBpdf9j066L5adtkBKKVjCWWloC0MybHELNtMtB2OOTqZDfwja4kMltjWeiyIN9nNPAuxrLuHPMVXXSyfDKvQDbHrxdiXStFr90eElqvwEIQqCx5Bhv8GTKCu10Hu7n7PIPYQi6te67wIr9YUK9fvOIosQhvyZ",
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

    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header section */}
      <header className="pb-4 border-b border-neutral-500/30">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Community Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Share study cards, clear doubt pools, and interact with fellow NCERT scholars.
        </p>
      </header>

      {/* 3 Columns Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Categories Sidebar */}
        <aside className="w-full lg:w-[200px] shrink-0 sticky top-20 hidden md:flex flex-col gap-4">
          <h2 className="text-foreground text-sm font-extrabold uppercase tracking-wider px-2">
            Categories
          </h2>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-card shadow-sm border border-neutral-500/30 text-teal-accent font-semibold"
                      : "hover:bg-slate-gray/60 text-muted-foreground hover:text-foreground"
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
          
          {/* Post Creator Container */}
          <div
            className={`bg-card rounded-2xl border border-neutral-500/30 p-4 transition-all duration-300 relative ${
              isCreatorFocused ? "shadow-md ring-1 ring-teal-accent/25" : "shadow-sm"
            }`}
          >
            <div className="flex gap-3 items-start">
              <div
                className="size-9 rounded-full bg-cover bg-center border border-neutral-500/30 shrink-0 mt-0.5"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida/AP1WRLt5ebnnCRad9z-v6QVXXzOOBqFJM0naXp_sGBeKDv7yJqteq62ilqjz_HjPfJdWrrHxhTS-s7FZobbly1b6TfGS5GVcWEdBpdf9j066L5adtkBKKVjCWWloC0MybHELNtMtB2OOTqZDfwja4kMltjWeiyIN9nNPAuxrLuHPMVXXSyfDKvQDbHrxdiXStFr90eElqvwEIQqCx5Bhv8GTKCu10Hu7n7PIPYQi6te67wIr9YUK9fvOIosQhvyZ")`,
                }}
              ></div>
              <div className="flex-grow flex flex-col">
                {isCreatorFocused && (
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Discussion Topic Title..."
                    className="w-full bg-transparent border-b border-neutral-500/30 pb-2 mb-2 text-sm font-bold text-foreground focus:outline-none focus:border-teal-accent placeholder:text-muted-foreground/60"
                  />
                )}
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  onFocus={() => setIsCreatorFocused(true)}
                  placeholder="Ask a question or share a study tip..."
                  className={`w-full bg-transparent border-none text-xs text-foreground focus:outline-none focus:ring-0 resize-none transition-all duration-300 placeholder:text-muted-foreground/60 ${
                    isCreatorFocused ? "h-24" : "h-9"
                  }`}
                />
                
                {/* Expended Actions Bar */}
                {isCreatorFocused && (
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-500/30 mt-2 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="p-2 text-muted-foreground hover:text-teal-accent hover:bg-teal-light/20 rounded-lg transition-colors flex items-center justify-center"
                        title="Add Image"
                      >
                        <ImageIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-muted-foreground hover:text-teal-accent hover:bg-teal-light/20 rounded-lg transition-colors flex items-center justify-center"
                        title="Add Link"
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-muted-foreground hover:text-teal-accent hover:bg-teal-light/20 rounded-lg transition-colors flex items-center justify-center"
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
                        className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground hover:bg-slate-gray rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!postTitle.trim() || !postContent.trim()}
                        className="bg-teal-accent hover:bg-teal-dark text-white font-bold text-[10px] px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
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
          <div className="space-y-4">
            {posts
              .filter((post) => activeCategory === "All Discussions" || post.category === activeCategory)
              .map((post) => (
                <article
                  key={post.id}
                  className="bg-card rounded-2xl border border-neutral-500/30 p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {post.isSystem ? (
                        <div className="size-9 rounded-xl bg-teal-light/20 border border-teal-accent/15 flex items-center justify-center text-teal-accent shrink-0">
                          <BookOpen size={16} />
                        </div>
                      ) : (
                        <div
                          className="size-9 rounded-full bg-cover bg-center border border-neutral-500/30 shrink-0"
                          style={{ backgroundImage: `url("${post.authorAvatar}")` }}
                        ></div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground text-xs leading-none">
                            {post.authorName}
                          </h3>
                          {post.authorBadge && (
                            <span
                              className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                post.authorBadge === "System"
                                  ? "bg-ink text-white"
                                  : "bg-teal-light text-teal-accent"
                              }`}
                            >
                              {post.authorBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {post.timeAgo} in{" "}
                          <span className="text-teal-accent hover:underline cursor-pointer">
                            {post.category}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="pl-0 sm:pl-12">
                    <h4 className="font-extrabold text-sm text-foreground mb-1 leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Embedded Primary Action Button */}
                    {post.actionButton && (
                      <button
                        onClick={post.actionButton.onClick}
                        className="mb-4 bg-slate-gray text-teal-accent hover:bg-teal-accent hover:text-white font-bold text-xs px-4 py-2 rounded-lg border border-teal-accent/15 transition-all flex items-center gap-1.5"
                      >
                        <Rocket size={14} />
                        {post.actionButton.text}
                      </button>
                    )}

                    {/* Interaction Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.reactions.map((react) => {
                        const ReactIcon = react.icon;
                        return (
                          <button
                            key={react.label}
                            onClick={() => handleReactionClick(post.id, react.label)}
                            className={`group flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                              react.active
                                ? "bg-teal-light/30 border-teal-accent text-teal-dark scale-105"
                                : "bg-slate-gray border-transparent text-muted-foreground hover:bg-teal-light/10 hover:text-teal-accent"
                            }`}
                          >
                            <ReactIcon
                              size={14}
                              className={`group-hover:scale-110 transition-transform ${
                                react.active && react.label === "fire"
                                  ? "text-saffron fill-saffron"
                                  : react.active
                                  ? "text-teal-accent"
                                  : ""
                              }`}
                            />
                            <span>{react.count}</span>
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() =>
                          setExpandedPostComments((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ml-auto"
                      >
                        <MessageCircle size={14} />
                        <span>{post.comments.length} Replies</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Comments Panel */}
                  {expandedPostComments[post.id] && (
                    <div className="mt-4 pt-4 border-t border-neutral-500/30 space-y-4">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="flex gap-3 items-start pl-0 sm:pl-12">
                          <div
                            className="size-7 rounded-full bg-cover bg-center border border-neutral-500/30 shrink-0 mt-0.5"
                            style={{ backgroundImage: `url("${comm.authorAvatar}")` }}
                          ></div>
                          <div className="flex-1 bg-slate-gray/30 rounded-xl p-3 border border-neutral-500/30/50 text-xs">
                            <div className="flex justify-between items-center mb-1 font-bold">
                              <span className="text-foreground">{comm.authorName}</span>
                              <span className="text-[9px] text-muted-foreground font-medium">
                                {comm.createdAt}
                              </span>
                            </div>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Comment Input Box */}
                      <div className="flex gap-2 pl-0 sm:pl-12">
                        <input
                          type="text"
                          value={commentTexts[post.id] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="flex-grow px-3 py-2 rounded-xl border border-neutral-500/30 bg-slate-gray focus:outline-none focus:ring-1 focus:ring-teal-accent text-xs text-foreground"
                        />
                        <button
                          onClick={() => handleCreateComment(post.id)}
                          className="px-4 py-2 bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                        >
                          Reply <Reply size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
          </div>

        </section>

        {/* Right Column: Trending Sidebar */}
        <aside className="w-full lg:w-[220px] shrink-0 sticky top-20 hidden xl:flex flex-col gap-4">
          <div className="bg-card rounded-2xl border border-neutral-500/30 p-5 shadow-sm">
            <h2 className="text-foreground text-xs font-extrabold uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-accent" /> Trending Topics
            </h2>
            <ul className="space-y-3.5">
              <li>
                <span className="text-xs font-bold text-foreground hover:text-teal-accent cursor-pointer transition-colors block">
                  #CBSE2026
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  1.2k posts this week
                </span>
              </li>
              <li>
                <span className="text-xs font-bold text-foreground hover:text-teal-accent cursor-pointer transition-colors block">
                  #CalculusTricks
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  854 posts
                </span>
              </li>
              <li>
                <span className="text-xs font-bold text-foreground hover:text-teal-accent cursor-pointer transition-colors block">
                  #FaradaysLaw
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Trending in Physics
                </span>
              </li>
            </ul>
            
            <hr className="border-border my-4" />
            
            <h2 className="text-foreground text-xs font-extrabold uppercase tracking-wider mb-4">
              Active Groups
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 cursor-pointer hover:bg-slate-gray/30 p-1 rounded-lg transition-all">
                <div className="size-8 rounded-lg bg-teal-light/20 border border-teal-accent/15 flex items-center justify-center text-teal-accent shrink-0">
                  <BookOpen size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Class 12 Boards
                  </span>
                  <span className="text-[9px] text-muted-foreground font-semibold">
                    23 online
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-3 cursor-pointer hover:bg-slate-gray/30 p-1 rounded-lg transition-all">
                <div className="size-8 rounded-lg bg-saffron-light/20 border border-saffron/15 flex items-center justify-center text-saffron-dark shrink-0">
                  <Compass size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground leading-tight">
                    Organic Chem
                  </span>
                  <span className="text-[9px] text-muted-foreground font-semibold">
                    12 online
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
