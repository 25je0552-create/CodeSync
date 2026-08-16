import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

const DEFAULT_CODE = "// Start coding here...";

const ALL_LANGUAGES = [
  { value: "javascript", label: "JavaScript", monacoLanguage: "javascript" },
  { value: "python", label: "Python", monacoLanguage: "python" },
  { value: "cpp", label: "C++", monacoLanguage: "cpp" },
  { value: "c", label: "C", monacoLanguage: "cpp" },
  { value: "java", label: "Java", monacoLanguage: "java" },
  { value: "typescript", label: "TypeScript", monacoLanguage: "typescript" },
];

function BattleEditor({
  code,
  setCode,
  language,
  setLanguage,
  allowedLanguages,
}) {
  const languageOptions = useMemo(() => {
    if (!allowedLanguages || allowedLanguages.length === 0) {
      return ALL_LANGUAGES;
    }
    return ALL_LANGUAGES.filter((lang) =>
      allowedLanguages.includes(lang.value)
    );
  }, [allowedLanguages]);

  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

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
        bg-[#141414]
        border
        border-[#262626]
        rounded-none
        overflow-hidden
        flex
        flex-col
        ${isFullscreen ? "fixed inset-4 z-50 bg-[#000000]" : "relative"}
      `}
    >
      {/* TOP BAR */}
      <div className="bg-[#0d0d0d] border-b border-[#262626] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="font-bugatti-mono text-xs uppercase tracking-[2px] text-white">
            BATTLE EDITOR // {currentLanguage?.label}
          </span>
        </div>

        <div className="flex items-center gap-3 font-bugatti-mono">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={languageOptions.length === 0}
            className="
              bg-[#000000]
              text-white
              text-xs
              uppercase
              tracking-[1.5px]
              border
              border-[#262626]
              focus:border-white
              px-3
              py-1
              outline-none
              rounded-none
              cursor-pointer
            "
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <div className="w-px h-4 bg-[#262626]" />

          <div className="flex items-center gap-1 bg-[#000000] border border-[#262626] px-1 text-xs">
            <button
              onClick={() => setFontSize((s) => Math.max(12, s - 1))}
              className="text-[#999999] hover:text-white w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              A−
            </button>
            <span className="text-[#666666] w-6 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize((s) => Math.min(24, s + 1))}
              className="text-[#999999] hover:text-white w-6 h-6 flex items-center justify-center cursor-pointer"
            >
              A+
            </button>
          </div>

          <div className="w-px h-4 bg-[#262626]" />

          <button
            onClick={handleReset}
            className="text-[#999999] hover:text-white text-xs uppercase tracking-[1px] px-2 py-1 border border-[#262626] cursor-pointer"
          >
            RESET
          </button>

          <button
            onClick={handleCopy}
            className="text-[#999999] hover:text-white text-xs uppercase tracking-[1px] px-2 py-1 border border-[#262626] cursor-pointer"
          >
            {copied ? "COPIED" : "COPY"}
          </button>

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="text-[#999999] hover:text-white text-xs uppercase tracking-[1px] px-2 py-1 border border-[#262626] cursor-pointer"
          >
            {isFullscreen ? "EXIT" : "EXPAND"}
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="flex-1 min-h-[480px]">
        <Editor
          height="100%"
          language={currentLanguage?.monacoLanguage || language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize,
            lineHeight: fontSize * 1.6,
            minimap: { enabled: false },
            fontFamily: "'JetBrains Mono', monospace",
            automaticLayout: true,
            cursorBlinking: "blink",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* STATUS BAR */}
      <div className="bg-[#0d0d0d] border-t border-[#262626] px-4 py-1.5 flex items-center justify-between font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
        <span>LANG // {currentLanguage?.label}</span>
        <span>LINES // {lineCount}</span>
      </div>
    </div>
  );
}

export default BattleEditor;
