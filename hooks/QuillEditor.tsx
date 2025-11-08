import React, { useEffect } from 'react'

import dynamic from 'next/dynamic'

import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
})

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false
    }
}

const formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'align',
    'color',
    'background',
    'link',
    'image',
    'video'
]

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    height?: string;
}

export default function QuillEditor({
    value,
    onChange,
    placeholder = "Enter content...",
    className = "",
    height = "400px"
}: QuillEditorProps) {
    useEffect(() => {
        // Add theme-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .dark .ql-toolbar.ql-snow {
                border-color: var(--color-border) !important;
                background: var(--color-card) !important;
            }
            .dark .ql-container.ql-snow {
                border-color: var(--color-border) !important;
                background: var(--color-card) !important;
                color: var(--color-foreground) !important;
            }
            .dark .ql-toolbar.ql-snow .ql-picker-label {
                color: var(--color-foreground) !important;
            }
            .dark .ql-toolbar.ql-snow .ql-stroke {
                stroke: var(--color-foreground) !important;
            }
            .dark .ql-toolbar.ql-snow .ql-fill {
                fill: var(--color-foreground) !important;
            }
            .dark .ql-editor.ql-blank::before {
                color: var(--color-muted-foreground) !important;
            }
            .ql-editor pre.ql-syntax {
                background-color: #23241f;
                color: #f8f8f2;
                overflow: visible;
                border-radius: 4px;
                padding: 12px;
                margin: 8px 0;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 14px;
                line-height: 1.5;
            }
            .dark .ql-editor pre.ql-syntax {
                background-color: #1a1a1a;
                color: #e6e6e6;
                border: 1px solid var(--color-border);
            }
            .ql-editor code {
                background-color: #f3f4f6;
                color: #e11d48;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.9em;
            }
            .dark .ql-editor code {
                background-color: #374151;
                color: #fbbf24;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className={`min-h-[700px] border rounded-lg overflow-hidden ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ height }}
            />
        </div>
    )
} 