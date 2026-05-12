import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { SectionStyles } from '../../types/resume';

interface TextFormattingToolbarProps {
  selectedSection: string;
  styles: SectionStyles;
  onStyleChange: (styles: SectionStyles) => void;
}

const fontFamilies = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Palatino',
];

export default function TextFormattingToolbar({
  selectedSection,
  styles,
  onStyleChange
}: TextFormattingToolbarProps) {
  const handleStyleChange = (key: keyof SectionStyles, value: string | number) => {
    onStyleChange({ ...styles, [key]: value });
  };

  // Apply inline styles to the current selection by wrapping it in a span
  const applyInlineStyle = (style: Record<string, string | number>) => {
    if (typeof window === 'undefined') return
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    if (range.collapsed) return // nothing selected

    // Extract contents and wrap in a span with the styles
    const span = document.createElement('span')
    // Merge numeric values to px where appropriate
    Object.entries(style).forEach(([k, v]) => {
      const key = k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
      if (typeof v === 'number' && (key.includes('font-size') || key.includes('margin') || key.includes('padding'))) {
        ;(span.style as any)[k] = `${v}px`
      } else {
        ;(span.style as any)[k] = String(v)
      }
    })

    try {
      const content = range.extractContents()
      span.appendChild(content)
      range.insertNode(span)
      // Move selection to after the span
      selection.removeAllRanges()
      const newRange = document.createRange()
      newRange.selectNodeContents(span)
      selection.addRange(newRange)
    } catch (err) {
      console.error('applyInlineStyle error:', err)
    }
  }

  const toggleBold = () => {
    if (typeof document !== 'undefined') {
      document.execCommand('bold')
    }
  }

  const toggleItalic = () => {
    if (typeof document !== 'undefined') {
      document.execCommand('italic')
    }
  }

  const toggleUnderline = () => {
    if (typeof document !== 'undefined') {
      document.execCommand('underline')
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 mb-4">
      <div className="mb-2 text-sm font-semibold text-gray-700">
        Editing: <span className="text-blue-600">{selectedSection}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={styles.fontFamily || 'Arial'}
            onChange={(e) => {
              handleStyleChange('fontFamily', e.target.value)
              applyInlineStyle({ fontFamily: e.target.value })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Size: {styles.fontSize || 16}px
          </label>
          <input
            type="range"
            min="8"
            max="72"
            value={styles.fontSize || 16}
            onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Line Height: {styles.lineHeight || 1.5}
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={styles.lineHeight || 1.5}
            onChange={(e) => handleStyleChange('lineHeight', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={styles.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={styles.backgroundColor || '#ffffff'}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Styling
          </label>
          <div className="flex gap-2">
            <button
              onClick={toggleBold}
              className={`flex-1 p-2 border rounded ${
                styles.fontWeight === 'bold'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Bold className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={toggleItalic}
              className={`flex-1 p-2 border rounded ${
                styles.fontStyle === 'italic'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Italic className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={toggleUnderline}
              className={`flex-1 p-2 border rounded ${
                styles.textDecoration === 'underline'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Underline className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Alignment
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleStyleChange('textAlign', 'left')}
              className={`flex-1 p-2 border rounded ${
                styles.textAlign === 'left' || !styles.textAlign
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignLeft className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'center')}
              className={`flex-1 p-2 border rounded ${
                styles.textAlign === 'center'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignCenter className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'right')}
              className={`flex-1 p-2 border rounded ${
                styles.textAlign === 'right'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignRight className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => handleStyleChange('textAlign', 'justify')}
              className={`flex-1 p-2 border rounded ${
                styles.textAlign === 'justify'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <AlignJustify className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Margin Top: {styles.marginTop || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={styles.marginTop || 0}
            onChange={(e) => handleStyleChange('marginTop', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Margin Bottom: {styles.marginBottom || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={styles.marginBottom || 0}
            onChange={(e) => handleStyleChange('marginBottom', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Padding Top: {styles.paddingTop || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={styles.paddingTop || 0}
            onChange={(e) => handleStyleChange('paddingTop', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Padding Bottom: {styles.paddingBottom || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={styles.paddingBottom || 0}
            onChange={(e) => handleStyleChange('paddingBottom', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
