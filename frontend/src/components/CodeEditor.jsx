import { useEffect, useRef } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import {
  autocompletion, completionKeymap,
  closeBrackets, closeBracketsKeymap, acceptCompletion,
} from '@codemirror/autocomplete'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { indentOnInput, bracketMatching, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { abbreviationTracker } from '@emmetio/codemirror6-plugin'

// ── All HTML tags with descriptions ──────────────────────────────────────────
const HTML_TAGS = [
  ['html','Root element'],['head','Document metadata'],['body','Document body'],
  ['div','Division/container'],['span','Inline container'],['p','Paragraph'],
  ['h1','Heading 1'],['h2','Heading 2'],['h3','Heading 3'],['h4','Heading 4'],
  ['h5','Heading 5'],['h6','Heading 6'],
  ['a','Anchor/link'],['img','Image'],['ul','Unordered list'],['ol','Ordered list'],
  ['li','List item'],['table','Table'],['thead','Table head'],['tbody','Table body'],
  ['tr','Table row'],['th','Table header cell'],['td','Table data cell'],
  ['form','Form'],['input','Input field'],['button','Button'],['label','Label'],
  ['select','Dropdown'],['option','Option'],['textarea','Text area'],
  ['nav','Navigation'],['header','Header'],['footer','Footer'],['main','Main content'],
  ['section','Section'],['article','Article'],['aside','Sidebar'],
  ['strong','Bold/important'],['em','Italic/emphasis'],['br','Line break'],
  ['hr','Horizontal rule'],['pre','Preformatted text'],['code','Inline code'],
  ['blockquote','Block quote'],['figure','Figure'],['figcaption','Figure caption'],
  ['video','Video'],['audio','Audio'],['canvas','Canvas'],['iframe','Inline frame'],
  ['script','Script'],['link','Link resource'],['meta','Metadata'],['style','Style'],
  ['title','Page title'],['template','Template'],['slot','Slot'],
]

// Void elements (self-closing, no closing tag)
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])

// ── Custom HTML tag completion source ────────────────────────────────────────
// Triggers on any word typed anywhere — not just inside < >
const htmlTagCompletion = (context) => {
  // Match a word at cursor (letters only)
  const word = context.matchBefore(/[a-zA-Z]\w*/)
  if (!word || (word.from === word.to && !context.explicit)) return null

  const typed = word.text.toLowerCase()
  const matches = HTML_TAGS.filter(([tag]) => tag.startsWith(typed))
  if (!matches.length) return null

  return {
    from: word.from,
    options: matches.map(([tag, detail]) => ({
      label: tag,
      detail,
      type: 'keyword',
      // When accepted, insert <tag></tag> with cursor between tags
      // For void elements insert <tag />
      apply: (view, completion, from, to) => {
        const snippet = VOID.has(tag)
          ? `<${tag} />`
          : `<${tag}></${tag}>`
        const cursorPos = VOID.has(tag)
          ? from + snippet.length
          : from + tag.length + 2 // inside the opening tag content

        view.dispatch({
          changes: { from, to, insert: snippet },
          selection: { anchor: cursorPos },
        })
      },
    })),
    validFor: /^[a-zA-Z]\w*$/,
  }
}

// ── CSS property completion source ───────────────────────────────────────────
const CSS_PROPS = [
  'display','position','top','right','bottom','left','width','height',
  'min-width','max-width','min-height','max-height','margin','margin-top',
  'margin-right','margin-bottom','margin-left','padding','padding-top',
  'padding-right','padding-bottom','padding-left','border','border-radius',
  'background','background-color','background-image','color','font-size',
  'font-weight','font-family','line-height','text-align','text-decoration',
  'flex','flex-direction','flex-wrap','justify-content','align-items',
  'align-self','gap','grid','grid-template-columns','grid-template-rows',
  'overflow','z-index','opacity','transform','transition','animation',
  'box-shadow','cursor','visibility','content','list-style','outline',
]

const cssCompletion = (context) => {
  const word = context.matchBefore(/[\w-]+/)
  if (!word || (word.from === word.to && !context.explicit)) return null
  const typed = word.text.toLowerCase()
  const matches = CSS_PROPS.filter(p => p.startsWith(typed))
  if (!matches.length) return null
  return {
    from: word.from,
    options: matches.map(p => ({ label: p, type: 'property' })),
    validFor: /^[\w-]*$/,
  }
}

// ── JS globals completion source ─────────────────────────────────────────────
const JS_GLOBALS = [
  'console','document','window','navigator','location','history',
  'localStorage','sessionStorage','fetch','setTimeout','setInterval',
  'clearTimeout','clearInterval','Promise','Array','Object','String',
  'Number','Boolean','Math','Date','JSON','Error','Map','Set',
  'parseInt','parseFloat','isNaN','isFinite','encodeURIComponent',
  'decodeURIComponent','alert','confirm','prompt',
]

const jsCompletion = (context) => {
  const word = context.matchBefore(/\w+/)
  if (!word || (word.from === word.to && !context.explicit)) return null
  const typed = word.text.toLowerCase()
  const matches = JS_GLOBALS.filter(g => g.toLowerCase().startsWith(typed))
  if (!matches.length) return null
  return {
    from: word.from,
    options: matches.map(g => ({ label: g, type: 'function' })),
    validFor: /^\w*$/,
  }
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const baseTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '14px' },
  '.cm-scroller': { fontFamily: "Consolas,'Courier New',monospace", lineHeight: '1.7', overflow: 'auto' },
  '.cm-content': { padding: '14px 0', minHeight: '100%' },
  '.cm-line': { padding: '0 18px' },
  '.cm-gutters': { minWidth: '50px', borderRight: '1px solid #2a2a45', background: '#0f0f1a' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 6px', color: '#475569' },
  '.cm-activeLine': { background: 'rgba(99,102,241,0.06)' },
  '.cm-tooltip.cm-tooltip-autocomplete': {
    border: '1px solid #2a2a45', borderRadius: '8px',
    background: '#13131f', boxShadow: '0 12px 32px rgba(0,0,0,0.7)', fontSize: '13px',
  },
  '.cm-tooltip-autocomplete ul': { maxHeight: '260px' },
  '.cm-tooltip-autocomplete ul li': { padding: '6px 14px', fontFamily: "Consolas,'Courier New',monospace" },
  '.cm-tooltip-autocomplete ul li[aria-selected]': { background: '#6366f1 !important', color: '#fff' },
  '.cm-completionDetail': { color: '#64748b', marginLeft: '8px', fontStyle: 'italic' },
})

// ── Compartment ───────────────────────────────────────────────────────────────
const acCompartment = new Compartment()

const makeAC = (language, enabled) => {
  if (!enabled) return autocompletion({ activateOnTyping: false, override: [] })

  const sources = {
    html:       [htmlTagCompletion],
    css:        [cssCompletion],
    javascript: [jsCompletion],
  }

  return autocompletion({
    activateOnTyping: true,
    selectOnOpen: true,
    override: sources[language] || [],
  })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CodeEditor({ language, value, onChange, autocomplete }) {
  const containerRef = useRef(null)
  const viewRef      = useRef(null)
  const onChangeRef  = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    if (!containerRef.current) return
    viewRef.current?.destroy()

    const langExt = {
      html:       [html({ autoCloseTags: true }), abbreviationTracker()],
      css:        [css()],
      javascript: [javascript()],
    }[language] || [html({ autoCloseTags: true })]

    const view = new EditorView({
      state: EditorState.create({
        doc: value ?? '',
        extensions: [
          oneDark, baseTheme,
          ...langExt,
          lineNumbers(), highlightActiveLine(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          bracketMatching(), indentOnInput(), closeBrackets(), history(),
          acCompartment.of(makeAC(language, autocomplete)),
          keymap.of([
            { key: 'Tab', run: acceptCompletion },
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...completionKeymap,
          ]),
          EditorView.updateListener.of(u => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString())
          }),
          EditorView.lineWrapping,
        ],
      }),
      parent: containerRef.current,
    })

    viewRef.current = view
    return () => { view.destroy(); viewRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Toggle live
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: acCompartment.reconfigure(makeAC(language, autocomplete)),
    })
  }, [autocomplete, language])

  // Sync external value
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const cur = view.state.doc.toString()
    if (cur === (value ?? '')) return
    view.dispatch({ changes: { from: 0, to: cur.length, insert: value ?? '' } })
  }, [value])

  return (
    <div ref={containerRef} style={{ flex: 1, minHeight: 0, height: '100%', overflow: 'hidden' }} />
  )
}
