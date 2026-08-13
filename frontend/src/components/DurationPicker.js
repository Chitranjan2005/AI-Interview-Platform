"use client";

import { useState } from "react";
import { Clock, X } from "lucide-react";

export default function DurationPicker({ sheetName, onConfirm, onClose }) {
    const [minutes, setMinutes] = useState(45);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-900" />
                        <h2 className="text-lg font-bold text-gray-900">Set your time</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">{sheetName}</p>

                <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">{minutes}</span>
                    <span className="text-sm text-gray-500 ml-1">min</span>
                </div>

                <input
                    type="range"
                    min={30}
                    max={90}
                    step={5}
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-full accent-gray-900"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 mb-6">
                    <span>30 min</span>
                    <span>90 min</span>
                </div>

                <button
                    onClick={() => onConfirm(minutes)}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Start practice
                </button>
            </div>
        </div>
    );
}