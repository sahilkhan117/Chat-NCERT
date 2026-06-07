"use client";

import { useState } from "react";
import {
  Settings,
  Cpu,
  Palette,
  CloudUpload,
  Trash2,
  Check,
  RotateCcw,
  Sliders,
  ChevronDown,
} from "lucide-react";

export default function SettingsPage() {
  // State for Ollama Configuration
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:11434");
  const [selectedModel, setSelectedModel] = useState("llama3:8b");
  const [contextLimit, setContextLimit] = useState(4096);
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an expert NCERT tutor. Your goal is to explain concepts clearly to Indian high school students. Always cite the relevant chapters and page numbers from the NCERT textbook. Be encouraging and use simple analogies."
  );

  // State for Global Branding Configuration
  const [primaryColor, setPrimaryColor] = useState("#008080");
  const [accentColor, setAccentColor] = useState("#FF9933");
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("current_mascot_owl.svg");
  const [logoSize, setLogoSize] = useState("124 KB");

  // Status message state
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "success">("idle");

  const handleDeployChanges = () => {
    setDeployStatus("deploying");
    setTimeout(() => {
      setDeployStatus("success");
      setTimeout(() => setDeployStatus("idle"), 3000);
    }, 1500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedLogo(file);
      setLogoPreview(file.name);
      setLogoSize(`${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleRemoveLogo = () => {
    setUploadedLogo(null);
    setLogoPreview("");
    setLogoSize("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Header section */}
      <header className="pb-4 border-b border-neutral-500/30 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Settings Portal
          </h1>
          <p className="text-teal-accent text-xs font-bold uppercase tracking-wider mt-1.5">
            Technical Configuration & Branding
          </p>
        </div>
      </header>

      {/* Ollama Configuration Section */}
      <section className="bg-card rounded-2xl border border-neutral-500/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-500/30 pb-4">
          <Cpu className="text-teal-accent w-6 h-6 shrink-0" />
          <h2 className="text-lg font-extrabold text-foreground leading-tight">
            Ollama Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* API Endpoint */}
          <div>
            <label htmlFor="api-endpoint" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              API Endpoint URL
            </label>
            <input
              type="url"
              id="api-endpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="e.g., http://localhost:11434"
              className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-neutral-500/30 bg-slate-gray focus:outline-none focus:ring-1 focus:ring-teal-accent text-foreground transition-all"
            />
            <p className="mt-1.5 text-[10px] text-muted-foreground font-medium">
              The base URL where your local or tunneled Ollama instance is running.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label htmlFor="model-select" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Model Selection
            </label>
            <div className="relative">
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-neutral-500/30 bg-slate-gray focus:outline-none focus:ring-1 focus:ring-teal-accent text-foreground appearance-none cursor-pointer transition-all"
              >
                <option value="llama3:8b">Llama 3 (8B)</option>
                <option value="mistral:7b">Mistral (7B)</option>
                <option value="gemma:7b">Gemma (7B)</option>
                <option value="custom">Custom Model...</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Context Limit & Temperature Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="context-limit" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Context Window Size
              </label>
              <input
                type="number"
                id="context-limit"
                value={contextLimit}
                onChange={(e) => setContextLimit(Number(e.target.value))}
                className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-neutral-500/30 bg-slate-gray focus:outline-none focus:ring-1 focus:ring-teal-accent text-foreground transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="temperature" className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Temperature (Creativity)
                </label>
                <span className="text-[10px] font-bold text-teal-accent bg-teal-light dark:bg-teal-light/10 px-2 py-0.5 rounded-md">
                  {temperature}
                </span>
              </div>
              <div className="flex items-center gap-4 py-1.5">
                <input
                  type="range"
                  id="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-gray rounded-full appearance-none cursor-pointer accent-teal-accent"
                />
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label htmlFor="system-prompt" className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Default System Prompt
            </label>
            <textarea
              id="system-prompt"
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full text-xs font-semibold p-4 rounded-xl border border-neutral-500/30 bg-slate-gray focus:outline-none focus:ring-1 focus:ring-teal-accent text-foreground font-mono resize-y leading-relaxed transition-all"
            />
            <p className="mt-1.5 text-[10px] text-muted-foreground font-medium">
              This prompt grounds the AI's persona, citation format, and RAG guidelines globally.
            </p>
          </div>
        </div>
      </section>

      {/* Global Branding Section */}
      <section className="bg-card rounded-2xl border border-neutral-500/30 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-500/30 pb-4">
          <Palette className="text-saffron w-6 h-6 shrink-0" />
          <h2 className="text-lg font-extrabold text-foreground leading-tight">
            Global Branding
          </h2>
        </div>

        <div className="space-y-6">
          {/* Color pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Primary Color */}
            <div className="p-4 border border-neutral-500/30 rounded-xl bg-slate-gray/30">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                Primary Brand Color (Teal)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-16 p-1 rounded-lg border border-neutral-500/30 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  readOnly
                  value={primaryColor.toUpperCase()}
                  className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border border-neutral-500/30 bg-slate-gray text-foreground focus:outline-none"
                />
              </div>
              <p className="mt-2 text-[9px] text-muted-foreground font-semibold">
                Used for primary buttons, active tabs, and primary citations.
              </p>
            </div>

            {/* Accent Color */}
            <div className="p-4 border border-neutral-500/30 rounded-xl bg-slate-gray/30">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                Accent Color (Saffron)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-16 p-1 rounded-lg border border-neutral-500/30 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  readOnly
                  value={accentColor.toUpperCase()}
                  className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border border-neutral-500/30 bg-slate-gray text-foreground focus:outline-none"
                />
              </div>
              <p className="mt-2 text-[9px] text-muted-foreground font-semibold">
                Used for streak fire indicators, gamification stars, and tags.
              </p>
            </div>

          </div>

          {/* App Logo & Mascot */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              App Logo & Mascot
            </label>
            
            {/* Drag & drop upload area */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-500/30 rounded-2xl p-6 hover:bg-slate-gray/40 hover:border-teal-accent/50 cursor-pointer transition-all group">
              <CloudUpload className="text-muted-foreground group-hover:text-teal-accent w-10 h-10 transition-colors" />
              <p className="text-xs font-bold text-foreground mt-3">
                Click to upload a new mascot file
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                PNG, JPG, or SVG up to 5MB
              </p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>

            {/* Logo details & preview */}
            {logoPreview && (
              <div className="flex items-center gap-4 p-4 border border-neutral-500/30 rounded-xl bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-12 h-12 rounded-xl bg-slate-gray border border-neutral-500/30 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-teal-accent/20 to-saffron/20" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-foreground">{logoPreview}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">{logoSize}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-full transition-colors flex items-center justify-center"
                  title="Remove logo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Sticky Bottom Deployment Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/90 backdrop-blur-md border-t border-neutral-500/30 flex items-center justify-center px-6 z-40 shadow-lg">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <div className="text-xs">
            {deployStatus === "deploying" && (
              <p className="text-teal-accent font-bold animate-pulse">
                🔄 Deploying changes to Cloudflare edge...
              </p>
            )}
            {deployStatus === "success" && (
              <p className="text-saffron font-bold flex items-center gap-1.5">
                <Check size={14} className="text-saffron" />
                ✨ Configuration deployed successfully!
              </p>
            )}
            {deployStatus === "idle" && (
              <p className="text-muted-foreground font-semibold">
                Unsaved modifications detected.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setApiEndpoint("http://localhost:11434");
                setSelectedModel("llama3:8b");
                setContextLimit(4096);
                setTemperature(0.7);
                setPrimaryColor("#008080");
                setAccentColor("#FF9933");
                handleRemoveLogo();
              }}
              className="px-5 py-2.5 rounded-xl border border-neutral-500/30 bg-slate-gray hover:bg-muted font-bold text-xs text-foreground transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              type="button"
              onClick={handleDeployChanges}
              disabled={deployStatus === "deploying"}
              className="px-6 py-2.5 rounded-xl bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
            >
              <span>Deploy Changes</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
