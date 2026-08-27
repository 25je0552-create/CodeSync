import { useState } from "react";

function CodeBlock({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-[#000000] border border-[#262626] rounded-none overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#262626] bg-[#0d0d0d]">
        <span className="font-bugatti-mono text-[10px] font-semibold uppercase tracking-[2px] text-[#666666]">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="font-bugatti-mono text-[10px] uppercase tracking-[1.5px] text-[#999999] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs font-bugatti-mono text-[#e6e6e6] whitespace-pre-wrap overflow-auto m-0">
        {value}
      </pre>
    </div>
  );
}

function ProblemPanel({ problem }) {
  if (!problem) {
    return (
      <div className="bg-[#141414] border border-[#262626] p-8 font-bugatti-mono text-xs text-[#999999] uppercase tracking-[2px]">
        NO PROBLEM SELECTED
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-none h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-6 pb-6 border-b border-[#262626] flex items-center justify-between shrink-0">
        <div>
          <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] block">
            PROBLEM SPECIFICATION
          </span>
          <h1 className="font-bugatti-display text-3xl tracking-[2px] text-white uppercase mt-1">
            {problem.title}
          </h1>
        </div>

        <span className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#5fa657] border border-[#262626] px-3 py-1 bg-[#000000]">
          {problem.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 max-h-[480px]">
        {/* Description */}
        <section>
          <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-3">
            DESCRIPTION
          </h2>
          <p className="font-bugatti-serif text-lg text-[#cccccc] leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>
        </section>

        {/* Input & Output Format */}
        {(problem.inputFormat || problem.outputFormat) && (
          <section className="space-y-4">
            {problem.inputFormat && (
              <div>
                <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-2">
                  INPUT FORMAT
                </h2>
                <div className="font-bugatti-mono text-xs text-[#cccccc] bg-[#000000] border border-[#262626] p-3 leading-relaxed whitespace-pre-line">
                  {problem.inputFormat}
                </div>
              </div>
            )}

            {problem.outputFormat && (
              <div>
                <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-2">
                  OUTPUT FORMAT
                </h2>
                <div className="font-bugatti-mono text-xs text-[#cccccc] bg-[#000000] border border-[#262626] p-3 leading-relaxed whitespace-pre-line">
                  {problem.outputFormat}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <section>
            <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-3">
              CONSTRAINTS
            </h2>
            <ul className="space-y-2">
              {problem.constraints.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 font-bugatti-mono text-xs text-[#e6e6e6]"
                >
                  <span className="text-[#666666]">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <section>
            <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-3">
              EXAMPLES
            </h2>
            <div className="space-y-4">
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="font-bugatti-mono text-[10px] uppercase tracking-[1.5px] text-[#999999]">
                    EXAMPLE {idx + 1}
                  </div>
                  <CodeBlock label="INPUT" value={ex.input} />
                  <CodeBlock label="OUTPUT" value={ex.output} />
                  {ex.explanation && (
                    <div className="font-bugatti-serif text-sm text-[#999999] italic mt-1">
                      Note: {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProblemPanel;
