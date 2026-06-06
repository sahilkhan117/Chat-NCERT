"use client";

import { useState } from "react";
import { ClipboardList, Calendar, CheckCircle, UploadCloud, Clock, Award, Check } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  description: string;
  rubric: string[];
  score: string | null;
  feedback: string | null;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "assign-1",
      title: "Chemical Reactions Lab Report",
      dueDate: "June 10, 2026",
      status: "Pending",
      description:
        "Perform the virtual lab experiment for magnesium ribbon burning in oxygen and reaction of iron nails in copper sulphate. Submit your observations, chemical equations, and conclusions in a single PDF.",
      rubric: [
        "Observation Table (5 pts)",
        "Chemical Equations (5 pts)",
        "Balanced Reactants & Products (5 pts)",
      ],
      score: null,
      feedback: null,
    },
    {
      id: "assign-2",
      title: "Carbon Compounds Structure Drawing",
      dueDate: "June 2, 2026",
      status: "Graded",
      description:
        "Draw the structural formulas for the following organic compounds: ethanol, ethanoic acid, propanone, and hexane. Indicate functional groups clearly.",
      rubric: ["Structural Formulas (10 pts)", "Functional Groups (5 pts)"],
      score: "14/15",
      feedback:
        "Great job! The structure for propanone was slightly mislabeled on double bonds, but other drawings are perfect.",
    },
  ]);

  const [activeUpload, setActiveUpload] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleStartUpload = (assignmentId: string) => {
    setActiveUpload(assignmentId);
    setUploadProgress(0);
    setUploadSuccess(false);

    // Simulate R2 presigned URL upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadSuccess(true);

          // Update assignment status
          setAssignments((prevList) =>
            prevList.map((item) => {
              if (item.id === assignmentId) {
                return { ...item, status: "Submitted" };
              }
              return item;
            }),
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Assignments Portal</h2>
          <p className="text-muted-foreground text-sm mt-1">
            View assigned course activities, download templates, and upload PDF submissions directly
            to the Cloudflare R2 bucket.
          </p>
        </div>
        <div className="bg-teal-light border border-teal-accent/25 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-teal-dark">
          <ClipboardList size={16} className="text-teal-accent" />
          <span>Active Tasks</span>
        </div>
      </div>

      {/* Assignments list */}
      <div className="space-y-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-teal-accent/25 transition-all duration-300"
          >
            {/* Title bar */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span
                  className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    assignment.status === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : assignment.status === "Submitted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {assignment.status}
                </span>
                <h3 className="font-extrabold text-lg mt-2 text-foreground">
                  {assignment.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 bg-slate-gray border border-border px-2.5 py-1 rounded-full">
                <Calendar size={12} className="text-muted-foreground" />
                Due: {assignment.dueDate}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {assignment.description}
            </p>

            {/* Rubrics */}
            <div className="p-4 rounded-xl bg-slate-gray border border-border">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Grading Criteria
              </h4>
              <ul className="text-xs space-y-1 text-foreground font-semibold">
                {assignment.rubric.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Check size={12} className="text-teal-accent shrink-0" /> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action panel (Conditional on Status) */}
            {assignment.status === "Pending" && (
              <div className="pt-2">
                {activeUpload === assignment.id ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Uploading to R2 Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-accent rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    {uploadSuccess && (
                      <p className="text-xs text-green-600 font-bold flex items-center gap-1.5">
                        <CheckCircle size={14} className="text-green-600" />
                        Lab report PDF successfully uploaded and submitted!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <button
                      onClick={() => handleStartUpload(assignment.id)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-teal-accent hover:bg-teal-dark text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                      type="button"
                    >
                      <UploadCloud size={14} /> Drag & Drop Report PDF
                    </button>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Maximum file size 20MB (.pdf)
                    </span>
                  </div>
                )}
              </div>
            )}

            {assignment.status === "Submitted" && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 font-semibold flex items-center gap-2 shadow-sm">
                <Clock size={16} className="text-blue-500" />
                <span>Submitted. Waiting for instructor feedback.</span>
              </div>
            )}

            {assignment.status === "Graded" && (
              <div className="p-4 rounded-xl bg-teal-light/20 border border-teal-accent/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-teal-accent uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={14} className="text-teal-accent" />
                    Graded Score
                  </span>
                  <span className="text-lg font-black text-teal-dark">{assignment.score}</span>
                </div>
                {assignment.feedback && (
                  <div className="text-xs pl-3 border-l border-teal-accent/30 italic text-muted-foreground leading-relaxed">
                    Feedback: "{assignment.feedback}"
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
