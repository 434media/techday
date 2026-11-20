"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { 
  Pencil, 
  Check, 
  X, 
  Loader2, 
  Bold, 
  Italic, 
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react"
import { sanitizeHtml } from "@/lib/sanitize-html"

// Props for the rich editable text component
interface RichEditableTextProps {
  /** Unique identifier for this text block */
  id: string
  /** Fallback content if not stored in database (can include HTML) */
  defaultContent: string
  /** CSS classes to apply to the container */
  className?: string
  /** Page identifier for organization */
  page?: string
  /** Section identifier for organization */
  section?: string
  /** Whether admin is authenticated */
  isAdmin?: boolean
  /** Whether edit mode is active */
  isEditMode?: boolean
  /** Callback when content is saved successfully */
  onSave?: () => void
  /** Callback when an error occurs */
  onError?: (error: string) => void
}

// Formatting toolbar button
function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-1.5 rounded transition-colors
        ${active 
          ? "bg-blue-500 text-white" 
          : "bg-white hover:bg-gray-100 text-gray-700"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  )
}

export function RichEditableText({
  id,
  defaultContent,
  className = "",
  page = "",
  section = "",
  isAdmin = false,
  isEditMode = false,
  onSave,
  onError,
}: RichEditableTextProps) {
  const [content, setContent] = useState(defaultContent)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const editorRef = useRef<HTMLDivElement>(null)
  const originalContent = useRef(content)

  // Fetch content from DB on mount
  useEffect(() => {
    let isMounted = true
    
    async function fetchContent() {
      try {
        const res = await fetch(`/api/content/text/${encodeURIComponent(id)}`)
        if (res.ok && isMounted) {
          const data = await res.json()
          if (data.content) {
            const safe = sanitizeHtml(data.content)
            setContent(safe)
            originalContent.current = safe
          }
        }
      } catch {
        // Use default content on error
      }
    }
    
    fetchContent()
    
    return () => {
      isMounted = false
    }
  }, [id])

  // Update active formats based on selection
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>()
    
    if (document.queryCommandState("bold")) formats.add("bold")
    if (document.queryCommandState("italic")) formats.add("italic")
    
    setActiveFormats(formats)
  }, [])

  // Listen for selection changes
  useEffect(() => {
    if (!isEditing) return
    
    const handleSelectionChange = () => {
      updateActiveFormats()
    }
    
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [isEditing, updateActiveFormats])

  // Apply formatting
  const applyFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateActiveFormats()
  }, [updateActiveFormats])

  // Handle link insertion
  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:")
    if (url) {
      applyFormat("createLink", url)
    }
  }, [applyFormat])

  // Handle save
  const handleSave = useCallback(async () => {
    if (!editorRef.current) return
    
    const newContent = sanitizeHtml(editorRef.current.innerHTML.trim())
    
    // Don't save if content hasn't changed
    if (newContent === originalContent.current) {
      setIsEditing(false)
      setShowToolbar(false)
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch("/api/admin/content/text", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id,
          content: newContent,
          element: "rich",
          page,
          section,
        }),
      })

      if (res.ok) {
        setContent(newContent)
        originalContent.current = newContent
        setIsEditing(false)
        setShowToolbar(false)
        onSave?.()
      } else {
        const data = await res.json()
        console.error("Failed to save:", data.error)
        onError?.(data.error || "Failed to save changes")
        // Revert to original content
        if (editorRef.current) {
          editorRef.current.innerHTML = originalContent.current
        }
      }
    } catch (error) {
      console.error("Failed to save:", error)
      onError?.("Failed to save changes. Please try again.")
      // Revert to original content
      if (editorRef.current) {
        editorRef.current.innerHTML = originalContent.current
      }
    } finally {
      setIsSaving(false)
    }
  }, [id, page, section, onSave, onError])

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = originalContent.current
    }
    setContent(originalContent.current)
    setIsEditing(false)
    setShowToolbar(false)
  }, [])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel()
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSave()
      } else if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        applyFormat("bold")
      } else if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        applyFormat("italic")
      } else if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        insertLink()
      }
    },
    [handleCancel, handleSave, applyFormat, insertLink]
  )

  // Focus the editor when entering edit mode
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus()
      // Place cursor at the end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  // Check if we can edit (admin + edit mode)
  const canEdit = isAdmin && isEditMode

  // If not in admin edit mode, just render the content
  if (!canEdit) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    )
  }

  // Admin edit mode view with editing capability
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="relative">
          {/* Formatting Toolbar */}
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1.5 z-20">
            <div className="flex items-center gap-1">
              <ToolbarButton
                onClick={() => applyFormat("bold")}
                active={activeFormats.has("bold")}
                title="Bold (⌘B)"
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => applyFormat("italic")}
                active={activeFormats.has("italic")}
                title="Italic (⌘I)"
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarButton
                onClick={insertLink}
                title="Insert Link (⌘K)"
              >
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarButton
                onClick={() => applyFormat("undo")}
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => applyFormat("redo")}
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                title="Save (⌘↵)"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition-colors disabled:opacity-50"
                title="Cancel (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
          
          {/* Editable content */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            className={`${className} outline-none ring-2 ring-blue-500 ring-offset-2 rounded-sm px-2 py-1 bg-blue-50/50 min-h-[2em]`}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        </div>
      ) : (
        <div className="relative group">
          {/* Regular content with hover indicator */}
          <div
            className={`${className} ${isHovered ? "ring-2 ring-blue-300 ring-offset-1 rounded-sm bg-blue-50/30" : ""} transition-all cursor-pointer`}
            onClick={() => setIsEditing(true)}
            title="Click to edit (supports rich text)"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
          
          {/* Edit indicator on hover */}
          {isHovered && !isEditing && (
            <div
              className="absolute -top-2 -right-6 p-1 bg-blue-500 text-white rounded shadow-sm opacity-90 hover:opacity-100 cursor-pointer z-10"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3 h-3" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
