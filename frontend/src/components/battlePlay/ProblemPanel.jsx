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

function ProblemPanel() {
  const problem = {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to the target.",
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    sampleInput: `nums = [2,7,11,15]\ntarget = 9`,
    sampleOutput: `[0,1]`,
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-none h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-6 pb-6 border-b border-[#262626] flex items-center justify-between shrink-0">
        <h1 className="font-bugatti-display text-2xl tracking-[2px] text-white uppercase">
          {problem.title}
        </h1>

        <span className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#5fa657] border border-[#262626] px-3 py-1 bg-[#000000]">
          {problem.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        <section>
          <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-3">
            PROBLEM SPECIFICATION
          </h2>
          <p className="font-bugatti-serif text-lg text-[#cccccc] leading-relaxed">
            {problem.description}
          </p>
        </section>

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

        <section>
          <h2 className="font-bugatti-mono text-[11px] font-semibold uppercase tracking-[2px] text-[#666666] mb-3">
            SAMPLE TESTCASE
          </h2>
          <div className="space-y-3">
            <CodeBlock label="INPUT" value={problem.sampleInput} />
            <CodeBlock label="OUTPUT" value={problem.sampleOutput} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProblemPanel;
