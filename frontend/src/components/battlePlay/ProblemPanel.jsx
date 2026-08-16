import { useState } from "react";

const DIFFICULTY_STYLES = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

function CodeBlock({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">

      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-100/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>

        <button
          onClick={handleCopy}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition"
        >
          {copied ? "✓ Copied" : "⧉ Copy"}
        </button>
      </div>

      <pre className="px-4 py-3 text-sm font-mono text-slate-800 whitespace-pre-wrap overflow-auto m-0">
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

      "Only one valid answer exists."

    ],

    sampleInput:
`nums = [2,7,11,15]
target = 9`,

    sampleOutput:
`[0,1]`

  };

  const difficultyStyle =
    DIFFICULTY_STYLES[problem.difficulty] ??
    "bg-slate-100 text-slate-700";

  return (

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-center justify-between shrink-0">

        <h1 className="text-2xl font-bold text-slate-900">
          {problem.title}
        </h1>

        <span
          className={`
            ${difficultyStyle}
            px-4
            py-1.5
            rounded-full
            text-sm
            font-semibold
          `}
        >
          {problem.difficulty}
        </span>

      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

        {/* Description */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Problem
          </h2>
          <p className="text-slate-700 leading-7">
            {problem.description}
          </p>
        </section>

        {/* Constraints */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Constraints
          </h2>
          <ul className="space-y-2">
            {problem.constraints.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-slate-700 font-mono text-sm"
              >
                <span className="text-slate-300 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Example */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Example 1
          </h2>

          <div className="space-y-3">
            <CodeBlock label="Input" value={problem.sampleInput} />
            <CodeBlock label="Output" value={problem.sampleOutput} />
          </div>
        </section>

      </div>

    </div>

  );

}

export default ProblemPanel;
