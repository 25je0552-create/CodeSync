import { useState, useEffect } from "react";

function BattleTerminal({
  problem = null,
  programInput = "",
  setProgramInput = () => {},
  output = "",
  runResult = null,
  submissionResult = null,
  running = false,
  submitting = false,
  onClear = () => {},
}) {
  const [activeTab, setActiveTab] = useState("testcases"); // "testcases" | "results"
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  // Extract public sample cases from problem
  const publicCases =
    problem?.testCases?.filter((tc) => !tc.isHidden) ||
    problem?.examples?.map((ex, idx) => ({
      input: ex.input,
      expectedOutput: ex.output,
      isHidden: false,
      points: 10,
    })) ||
    [];

  // Auto-switch to results tab when execution/submission finishes
  useEffect(() => {
    if (runResult || submissionResult || output) {
      setActiveTab("results");
    }
  }, [runResult, submissionResult, output]);

  // When problem or active public case changes, initialize input if not custom
  useEffect(() => {
    if (publicCases.length > 0 && selectedCaseIdx < publicCases.length) {
      setProgramInput(publicCases[selectedCaseIdx].input);
    }
  }, [selectedCaseIdx, problem?._id]);

  const handleSelectCase = (idx) => {
    setSelectedCaseIdx(idx);
    if (idx < publicCases.length) {
      setProgramInput(publicCases[idx].input);
    }
  };

  const activeResult = submissionResult || runResult;
  const isEvaluating = running || submitting;

  const currentStatus = isEvaluating
    ? running
      ? "EXECUTING CODE"
      : "EVALUATING TEST CASES"
    : activeResult?.overallStatus
    ? String(activeResult.overallStatus).toUpperCase()
    : output
    ? "OUTPUT READY"
    : "READY";

  const statusColor = isEvaluating
    ? "text-[#d4a017]"
    : activeResult?.overallStatus === "Accepted"
    ? "text-[#5fa657]"
    : activeResult?.overallStatus
    ? "text-[#ff5f57]"
    : "text-[#999999]";

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-none overflow-hidden font-bugatti-mono">
      {/* HEADER WITH VIEW TABS */}
      <div className="bg-[#0d0d0d] border-b border-[#262626] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${
                isEvaluating
                  ? "bg-[#d4a017] animate-pulse"
                  : activeResult?.overallStatus === "Accepted"
                  ? "bg-[#5fa657]"
                  : activeResult?.overallStatus
                  ? "bg-[#ff5f57]"
                  : "bg-white"
              }`}
            />
            <span className="text-xs uppercase tracking-[2px] text-white">
              LEETCODE RUNNER
            </span>
          </div>

          {/* MAIN TABS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("testcases")}
              className={`px-3 py-1 text-xs uppercase tracking-[1.5px] border transition-colors cursor-pointer ${
                activeTab === "testcases"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#999999] border-[#262626] hover:text-white"
              }`}
            >
              TESTCASES
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("results")}
              className={`px-3 py-1 text-xs uppercase tracking-[1.5px] border transition-colors cursor-pointer ${
                activeTab === "results"
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#999999] border-[#262626] hover:text-white"
              }`}
            >
              TEST RESULT
            </button>
          </div>
        </div>

        {/* STATUS & ACTIONS */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-[1.5px]">
          <span className={statusColor}>{currentStatus}</span>

          {(output || activeResult) && !isEvaluating && (
            <button
              type="button"
              onClick={onClear}
              className="text-[#999999] hover:text-white transition-colors cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* BODY CONTENT */}
      {activeTab === "testcases" ? (
        <div className="p-5 space-y-4 bg-[#000000]">
          {/* CASE SELECTOR BUTTONS */}
          <div className="flex items-center gap-2 pb-3 border-b border-[#262626] overflow-x-auto">
            {publicCases.map((tc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectCase(idx)}
                className={`px-3 py-1.5 text-xs uppercase tracking-[1.5px] border transition-colors cursor-pointer ${
                  selectedCaseIdx === idx
                    ? "bg-[#141414] border-white text-white font-semibold"
                    : "bg-transparent border-[#262626] text-[#999999] hover:border-[#3a3a3a] hover:text-white"
                }`}
              >
                CASE {idx + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedCaseIdx(publicCases.length)}
              className={`px-3 py-1.5 text-xs uppercase tracking-[1.5px] border transition-colors cursor-pointer ${
                selectedCaseIdx >= publicCases.length
                  ? "bg-[#141414] border-white text-white font-semibold"
                  : "bg-transparent border-[#262626] text-[#999999] hover:border-[#3a3a3a] hover:text-white"
              }`}
            >
              + CUSTOM STDIN
            </button>
          </div>

          {/* TESTCASE INPUT & EXPECTED OUTPUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Gutter Box */}
            <div>
              <label className="text-[10px] uppercase tracking-[2px] text-[#666666] block mb-2 font-semibold">
                INPUT (STDIN)
              </label>
              <div className="relative flex border border-[#262626] bg-[#0d0d0d]">
                <div className="select-none py-2 px-3 text-right bg-[#000000] border-r border-[#262626] text-[#666666] text-xs leading-6">
                  {(programInput || "").split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                  spellCheck={false}
                  placeholder="Testcase standard input..."
                  className="
                    flex-1
                    bg-transparent
                    text-[#e6e6e6]
                    font-bugatti-mono
                    text-xs
                    leading-6
                    outline-none
                    border-none
                    p-2
                    resize-none
                    min-h-[140px]
                    caret-white
                  "
                />
              </div>
            </div>

            {/* Expected Output Box */}
            <div>
              <label className="text-[10px] uppercase tracking-[2px] text-[#666666] block mb-2 font-semibold">
                EXPECTED OUTPUT
              </label>
              <div className="bg-[#0d0d0d] border border-[#262626] p-3 min-h-[140px] text-xs text-[#5fa657] leading-6 font-bugatti-mono overflow-auto whitespace-pre-wrap">
                {selectedCaseIdx < publicCases.length
                  ? publicCases[selectedCaseIdx]?.expectedOutput || "None specified"
                  : "Custom case — user defined"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS TAB (LEETCODE EVALUATION VIEW) */
        <div className="p-5 space-y-4 bg-[#000000] min-h-[220px]">
          {isEvaluating ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-7 h-7 border-2 border-[#262626] border-t-white rounded-full animate-spin" />
              <div className="text-xs text-[#d4a017] tracking-[2px] uppercase">
                {running
                  ? "RUNNING CODE AGAINST TEST SUITE..."
                  : "EVALUATING SUBMISSION VIA JUDGE0..."}
              </div>
            </div>
          ) : activeResult ? (
            <div className="space-y-4">
              {/* STATUS HEADER */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#262626] gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl font-bold uppercase tracking-[2px] ${
                      activeResult.overallStatus === "Accepted"
                        ? "text-[#5fa657]"
                        : "text-[#ff5f57]"
                    }`}
                  >
                    {activeResult.overallStatus}
                  </span>
                  {activeResult.score !== undefined && (
                    <span className="text-xs text-[#cccccc] bg-[#141414] border border-[#262626] px-3 py-1">
                      SCORE: {activeResult.score} /{" "}
                      {activeResult.totalPossiblePoints || 100} PTS
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#999999]">
                  PASSED: {activeResult.passedTests} / {activeResult.totalTests}{" "}
                  TEST CASES
                </div>
              </div>

              {/* TEST RESULTS CASE TABS & DETAILS */}
              {activeResult.testResults && activeResult.testResults.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#262626]">
                    {activeResult.testResults.map((tr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCaseIdx(idx)}
                        className={`px-3 py-1 text-xs uppercase tracking-[1.5px] border cursor-pointer ${
                          selectedCaseIdx === idx
                            ? "bg-[#141414] border-white text-white font-semibold"
                            : tr.passed
                            ? "border-[#5fa657]/40 text-[#5fa657] bg-[#5fa657]/5"
                            : "border-[#ff5f57]/40 text-[#ff5f57] bg-[#ff5f57]/5"
                        }`}
                      >
                        CASE {tr.testCaseIndex} {tr.passed ? "✓" : "✗"}
                      </button>
                    ))}
                  </div>

                  {/* ACTIVE CASE DETAILS */}
                  {(() => {
                    const tr =
                      activeResult.testResults[selectedCaseIdx] ||
                      activeResult.testResults[0];
                    if (!tr) return null;

                    return (
                      <div className="bg-[#0d0d0d] border border-[#262626] p-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-white uppercase tracking-[1.5px]">
                            TEST CASE {tr.testCaseIndex}{" "}
                            {tr.isHidden ? "(HIDDEN)" : "(PUBLIC)"}
                          </span>
                          <span
                            className={`font-semibold uppercase tracking-[1.5px] ${
                              tr.passed ? "text-[#5fa657]" : "text-[#ff5f57]"
                            }`}
                          >
                            {tr.status}
                          </span>
                        </div>

                        {tr.isHidden && !tr.passed ? (
                          <div className="text-xs text-[#ff5f57] py-2">
                            Hidden Test Case Failed. Details hidden to prevent hardcoding.
                          </div>
                        ) : (
                          <div className="space-y-2.5 text-xs font-bugatti-mono">
                            <div>
                              <div className="text-[10px] uppercase text-[#666666] tracking-[1.5px] mb-1">
                                INPUT
                              </div>
                              <div className="bg-[#000000] border border-[#262626] p-2 text-[#cccccc] whitespace-pre-wrap">
                                {tr.input}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase text-[#666666] tracking-[1.5px] mb-1">
                                YOUR OUTPUT
                              </div>
                              <div
                                className={`border p-2 whitespace-pre-wrap ${
                                  tr.passed
                                    ? "bg-[#000000] border-[#262626] text-[#5fa657]"
                                    : "bg-[#ff5f57]/5 border-[#ff5f57]/30 text-[#ff5f57]"
                                }`}
                              >
                                {tr.actualOutput || "<no output>"}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase text-[#666666] tracking-[1.5px] mb-1">
                                EXPECTED OUTPUT
                              </div>
                              <div className="bg-[#000000] border border-[#262626] p-2 text-[#5fa657] whitespace-pre-wrap">
                                {tr.expectedOutput}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : output ? (
            <div className="bg-[#0d0d0d] border border-[#262626] p-4 text-xs font-bugatti-mono text-[#e6e6e6] whitespace-pre-wrap leading-6">
              {output}
            </div>
          ) : (
            <div className="text-center py-12 text-[#666666] text-xs leading-6">
              NO EXECUTION RESULTS YET.
              <br />
              CLICK <span className="text-white font-semibold">▶ RUN CODE</span> TO TEST AGAINST SAMPLE CASES OR <span className="text-white font-semibold">SUBMIT SOLUTION</span> TO COMPETE.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BattleTerminal;
