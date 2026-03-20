"use client";

import React, { useState } from "react";

type FileRecord = { id: string; filename: string; display_name: string; content: string; required_role?: string; };

export default function DocumentViewer({ files, role = "user", questionId = "q3" }: { files: FileRecord[], role?: string, questionId?: string }) {
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);

  return (
    <>
      <div className="border-t-2 border-b-2 border-black mb-6">
        <div className="grid grid-cols-12 gap-2 px-2 py-2 bg-gray-100 border-b border-black text-xs font-bold uppercase">
          <div className="col-span-1">ID</div>
          <div className="col-span-4">ファイル名</div>
          <div className="col-span-4">詳細</div>
          <div className="col-span-3 text-center">操作</div>
        </div>

        {files.map((file) => (
          <div
            key={file.id}
            className="grid grid-cols-12 gap-2 px-2 py-3 border-b border-gray-300 last:border-b-0 items-center text-sm hover:bg-gray-50"
          >
            <div className="col-span-1 text-gray-400 font-mono">{file.id}</div>
            <div className="col-span-4 font-bold font-mono text-xs">{file.filename}</div>
            <div className="col-span-4 text-xs text-gray-600 truncate pr-2">{file.display_name}</div>
            <div className="col-span-3 flex gap-1">
              <button
                onClick={() => setSelectedFile(file)}
                className="directive-btn-outline !py-1 !px-2 text-xs text-center break-keep min-w-max font-mono tracking-tighter flex-1"
              >
                READ
              </button>
              <a
                href={`/api/${questionId}/download?file=${file.filename}`}
                target="_blank"
                className="directive-btn-outline !py-1 !px-2 text-xs text-center break-keep min-w-max font-mono tracking-tighter flex-1"
              >
                DL
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedFile(null)}>
          <div 
            className="bg-[#f4f4f5] border-2 border-black max-w-2xl w-full p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-lg mb-2 pb-2 border-b-2 border-black text-black">
              {selectedFile.display_name}
            </div>
            <div className="text-gray-500 text-xs font-mono mb-6">
              File: {selectedFile.filename}
            </div>
            
            <pre className="font-mono text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto mb-8 p-6 bg-white border border-gray-300 leading-relaxed shadow-inner">
              {selectedFile.content}
            </pre>

            <div className="text-right border-t border-black pt-4">
              <button onClick={() => setSelectedFile(null)} className="directive-btn !py-2 !px-8 text-xs">
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
