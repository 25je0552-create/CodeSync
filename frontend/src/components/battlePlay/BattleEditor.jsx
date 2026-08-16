import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

const DEFAULT_CODE = "// Start coding here...";

const ALL_LANGUAGES = [
  { value: "javascript", label: "JavaScript", monacoLanguage: "javascript" },
  { value: "python", label: "Python", monacoLanguage: "python" },
  { value: "cpp", label: "C++", monacoLanguage: "cpp" },
  // Monaco's bundled basic-languages don't include a separate C tokenizer —
  // "cpp" highlighting is the closest available stand-in for C syntax.
  { value: "c", label: "C", monacoLanguage: "cpp" },
  { value: "java", label: "Java", monacoLanguage: "java" },
  { value: "typescript", label: "TypeScript", monacoLanguage: "typescript" },
];

// allowedLanguages: array of language values (e.g. ["cpp", "python"])
// chosen by the host in battle settings. Participants can only pick
// among these — the dropdown never shows anything outside this set.
//
// code/language are now controlled by the parent (BattlePlay) so that
// BottomToolbar and BattleTerminal can read the same values — this
// component just displays and edits them via setCode/setLanguage.
function BattleEditor({
  code,
  setCode,
  language,
  setLanguage,
  allowedLanguages,
}) {

  const languageOptions = useMemo(() => {
    if (!allowedLanguages || allowedLanguages.length === 0) {
      // Battle settings haven't loaded yet — show everything rather
      // than an empty dropdown, then narrow down once they arrive.
      return ALL_LANGUAGES;
    }
    return ALL_LANGUAGES.filter((lang) =>
      allowedLanguages.includes(lang.value)
    );
  }, [allowedLanguages]);

  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // If the currently selected language ever falls outside the allowed
  // set (settings just loaded, or the host changed them), snap to the
  // first allowed language instead of leaving an invalid selection.
  useEffect(() => {
    const isStillAllowed = languageOptions.some(
      (lang) => lang.value === language
    );

    if (!isStillAllowed && languageOptions.length > 0) {
      setLanguage(languageOptions[0].value);
    }
  }, [languageOptions, language, setLanguage]);

  const lineCount = code === "" ? 0 : code.split("\n").length;

  const currentLanguage =
    languageOptions.find((lang) => lang.value === language) ||
    ALL_LANGUAGES.find((lang) => lang.value === language);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
  };

  return (

    <div
      className={`
        bg-[#1a1a1a]
        rounded-2xl
        border
        border-slate-800
        shadow-lg
        overflow-hidden
        flex
        flex-col
        ${isFullscreen ? "fixed inset-4 z-50" : "relative"}
      `}
    >

      {/* TOP BAR */}
      <div className="bg-[#1e1e1e] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3">

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-200 font-semibold text-sm">
            Battle Editor
          </span>
        </div>

        <div className="flex items-center gap-2">

          {/* Language select — only shows languages the host allowed */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={languageOptions.length === 0}
            className="
              bg-[#2a2a2a]
              text-slate-200
              text-xs
              font-medium
              border
              border-slate-700
              rounded-lg
              px-2.5
              py-1.5
              outline-none
              hover:border-slate-600
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <div className="w-px h-5 bg-slate-800" />

          {/* Font size */}
          <div className="flex items-center gap-1 bg-[#2a2a2a] border border-slate-700 rounded-lg px-1">
            <button
              onClick={() => setFontSize((s) => Math.max(12, s - 1))}
              className="text-slate-400 hover:text-white w-6 h-7 flex items-center justify-center text-xs font-bold"
              title="Decrease font size"
            >
              A−
            </button>
            <span className="text-[11px] text-slate-500 w-6 text-center">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(24, s + 1))}
              className="text-slate-400 hover:text-white w-6 h-7 flex items-center justify-center text-xs font-bold"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          <div className="w-px h-5 bg-slate-800" />

          <button
            onClick={handleReset}
            title="Reset to starter code"
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] transition"
          >
            ⟳
          </button>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] transition"
          >
            {copied ? "✓" : "⧉"}
          </button>

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] transition"
          >
            {isFullscreen ? "⤢" : "⛶"}
          </button>

        </div>

      </div>

      {/* EDITOR */}
      <div className="flex-1 min-h-[500px]">

        <Editor
          height="100%"
          language={currentLanguage?.monacoLanguage || language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize,
            lineHeight: fontSize * 1.6,

            minimap: {
              enabled: false,
            },

            fontFamily:
              "'Cascadia Code', Consolas, monospace",

            automaticLayout: true,

            cursorBlinking: "blink",

            padding: {
              top: 20,
            },

            scrollBeyondLastLine: false,

            renderLineHighlight: "gutter",
          }}
        />

      </div>

      {/* STATUS BAR */}
      <div className="bg-[#1e1e1e] border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {currentLanguage?.label}
        </span>
        <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
      </div>

    </div>

  );

}

export default BattleEditor;
