import React from "react";
import useToast from "../hooks/useToast";

export default function DemoToastButton() {
  const showToast = useToast();

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex gap-2">
        <button
          onClick={() => showToast("This is a success toast", "success")}
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          Success
        </button>
        <button
          onClick={() => showToast("This is an error toast", "error")}
          className="px-3 py-2 bg-red-600 text-white rounded"
        >
          Error
        </button>
        <button
          onClick={() => showToast("This is a warning", "warning")}
          className="px-3 py-2 bg-yellow-500 text-black rounded"
        >
          Warning
        </button>
        <button
          onClick={() => showToast("Some info for you", "info")}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Info
        </button>
      </div>
    </div>
  );
}
