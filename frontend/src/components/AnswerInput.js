"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileText, Code2 } from "lucide-react";

const LANGUAGES = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
];

export default function AnswerInput({ value, onChange }) {
    const [mode, setMode] = useState("notepad"); // "notepad" | "compiler"
    const [language, setLanguage] = useState("javascript");

    return (
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setMode("notepad")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            mode === "notepad" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" /> Notepad
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("compiler")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            mode === "compiler" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        <Code2 className="w-3.5 h-3.5" /> Code editor
                    </button>
                </div>

                {mode === "compiler" && (
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                    >
                        {LANGUAGES.map((l) => (
                            <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                    </select>
                )}
            </div>

            {mode === "notepad" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Write your approach, pseudocode, or explanation here…"
                    rows={10}
                    required
                    className="w-full p-4 text-sm font-mono focus:outline-none resize-none"
                />
            ) : (
                <Editor
                    height="280px"
                    language={language}
                    value={value}
                    onChange={(val) => onChange(val || "")}
                    theme="vs"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        scrollBeyondLastLine: false,
                        padding: { top: 12 },
                    }}
                />
            )}
        </div>
    );
}