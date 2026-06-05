import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, Copy, Check, Trash2, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function DraftsPanel() {
  const draftsList = useAppStore((state) => state.draftsList);
  const deleteDraft = useAppStore((state) => state.deleteDraft);
  const searchQuery = useAppStore((state) => state.searchQuery);

  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Filter drafts list based on search query
  const filteredDrafts = draftsList.filter((draft) => 
    draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.output.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async (id, text, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 max-w-5xl select-none">
      
      {/* Drafts List Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stitch-muted">
          Showing {filteredDrafts.length} drafts
        </span>
      </div>

      {/* Empty State */}
      {filteredDrafts.length === 0 && (
        <div className="bg-white border border-stitch-border rounded-2xl p-10 text-center shadow-sm">
          <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-stitch-text">No drafts found</h4>
          <p className="text-xs text-stitch-muted mt-1 max-w-xs mx-auto">
            {searchQuery ? "Try altering your search keywords or clear the filter." : "Once you generate polished text drafts, they will show up here."}
          </p>
        </div>
      )}

      {/* Draft cards list */}
      <div className="space-y-3">
        {filteredDrafts.map((draft) => {
          const isExpanded = expandedId === draft.id;
          const isCopied = copiedId === draft.id;
          return (
            <div 
              key={draft.id} 
              onClick={() => handleToggleExpand(draft.id)}
              className="bg-white border border-stitch-border rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="p-2 rounded-xl bg-stitch-primary/5 text-stitch-primary shrink-0 border border-stitch-primary/10">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-stitch-text truncate pr-4">{draft.title}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-stitch-muted font-semibold mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{draft.date}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{draft.mode.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleCopy(draft.id, draft.output, e)}
                    className="p-2 hover:bg-slate-50 border border-stitch-border rounded-lg text-stitch-muted hover:text-stitch-text transition-all"
                    title="Copy output"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this draft?")) {
                        deleteDraft(draft.id);
                      }
                    }}
                    className="p-2 hover:bg-red-50 border border-stitch-border hover:border-red-200 rounded-lg text-stitch-muted hover:text-red-600 transition-all"
                    title="Delete draft"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="p-1 text-stitch-muted">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded contents */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-stitch-border space-y-3 cursor-text" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted block mb-1">Raw thoughts</span>
                    <div className="p-3 bg-slate-50 rounded-lg text-xs text-stitch-text select-text leading-relaxed">
                      {draft.input}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stitch-muted block mb-1">Polished Draft</span>
                    <div className="p-3 bg-slate-100 border border-stitch-border rounded-lg text-xs font-medium text-stitch-text select-text whitespace-pre-wrap leading-relaxed">
                      {draft.output}
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
