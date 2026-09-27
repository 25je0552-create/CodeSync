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
  const [terminalMode, setTerminalMode] = useState("output"); // "output" | "input"
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  // When execution or submission starts or produces results, switch to output mode
  useEffect(() => {
    if (running || submitting || runResult || submissionResult || output) {
      setTerminalMode("output");
    }
  }, [running, submitting, runResult, submissionResult, output]);

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
    <div className="bg-[#141414] border border-[#262626] rounded-none overflow-hidden font-bugatti-mono h-[340px] flex flex-col">
      {/* HEADER WITH UNIFIED CONTROLS */}
      <div className="bg-[#0d0d0d] border-b border-[#262626] px-5 py-2.5 flex items-center justify-between gap-4 shrink-0 h-11">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
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
            <span className="text-xs uppercase tracking-[2px] text-white font-semibold">
              TERMINAL
            </span>
          </div>

          {/* CUSTOM CHECK TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() =>
              setTerminalMode((prev) => (prev === "input" ? "output" : "input"))
            }
            className={`px-3 py-1 text-xs uppercase tracking-[1.5px] border transition-colors cursor-pointer flex items-center gap-2 ${
              terminalMode === "input"
                ? "bg-white text-black border-white font-semibold"
                : "bg-transparent text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
            }`}
          >
            <span>CUSTOM CHECK</span>
            <span
              className={`text-[9px] px-1 py-0.5 border ${
                terminalMode === "input"
                  ? "border-black text-black"
                  : "border-[#3a3a3a] text-[#666666]"
              }`}
            >
              {terminalMode === "input" ? "INPUT MODE" : "OFF"}
            </span>
          </button>
        </div>

        {/* STATUS & ACTIONS */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-[1.5px]">
          <span className={statusColor}>{currentStatus}</span>

          {(output || activeResult || programInput) && !isEvaluating && (
            <button
              type="button"
              onClick={onClear}
              className="text-[#999999] hover:text-white transition-colors cursor-pointer text-xs"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* BODY CONTENT - STABLE HEIGHT WITH INTERNAL SCROLL */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#000000]">
        {terminalMode === "input" ? (
          /* SINGLE TERMINAL: INPUT MODE */
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262626] text-[10px] text-[#666666] uppercase tracking-[2px]">
              <span>CUSTOM STDIN INPUT</span>
              <span>{(programInput || "").split("\n").filter(Boolean).length} LINES</span>
            </div>
            <textarea
              value={programInput}
              onChange={(e) => setProgramInput(e.target.value)}
              placeholder="Enter custom standard input here to test your solution..."
              spellCheck={false}
              className="flex-1 w-full bg-transparent text-[#e6e6e6] font-bugatti-mono text-xs leading-6 outline-none border-none resize-none p-1 caret-white"
            />
          </div>
        ) : (
          /* SINGLE TERMINAL: OUTPUT MODE */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isEvaluating ? (
              <div className="h-full flex flex-col items-center justify-center py-10 space-y-3">
                <div className="w-6 h-6 border-2 border-[#262626] border-t-white rounded-full animate-spin" />
                <div className="text-xs text-[#d4a017] tracking-[2px] uppercase font-semibold">
                  {running
                    ? "RUNNING CODE AGAINST PREDEFINED TEST CASES..."
                    : "EVALUATING SUBMISSION AGAINST TEST SUITE..."}
                </div>
              </div>
            ) : activeResult ? (
              <div className="space-y-4">
                {/* STATUS BAR */}
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#262626] gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-base font-bold uppercase tracking-[2px] ${
                        activeResult.overallStatus === "Accepted"
                          ? "text-[#5fa657]"
                          : "text-[#ff5f57]"
                      }`}
                    >
                      {activeResult.overallStatus}
                    </span>
                    {activeResult.score !== undefined && (
                      <span className="text-[11px] text-[#cccccc] bg-[#141414] border border-[#262626] px-2.5 py-0.5">
                        SCORE: {activeResult.score} / {activeResult.totalPossiblePoints || 100} PTS
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#999999] uppercase tracking-[1px]">
                    PASSED: {activeResult.passedTests} / {activeResult.totalTests} TEST CASES
                  </div>
                </div>

                {/* TEST RESULTS CASE TABS */}
                {activeResult.testResults && activeResult.testResults.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#262626]">
                      {activeResult.testResults.map((tr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedCaseIdx(idx)}
                          className={`px-3 py-1 text-xs uppercase tracking-[1.5px] border cursor-pointer whitespace-nowrap ${
                            selectedCaseIdx === idx
                              ? "bg-[#141414] border-white text-white font-semibold"
                              : tr.passed
                              ? "border-[#5fa657]/40 text-[#5fa657] bg-[#5fa657]/5"
                              : tr.status === "Did Not Run"
                              ? "border-[#3a3a3a] text-[#666666] bg-transparent"
                              : "border-[#ff5f57]/40 text-[#ff5f57] bg-[#ff5f57]/5"
                          }`}
                        >
                          CASE {tr.testCaseIndex}{" "}
                          {tr.passed ? "✓" : tr.status === "Did Not Run" ? "— DID NOT RUN" : "✗"}
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
                        <div className="bg-[#0d0d0d] border border-[#262626] p-3.5 space-y-2.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-white uppercase tracking-[1.5px]">
                              TEST CASE {tr.testCaseIndex} {tr.isHidden ? "(HIDDEN)" : "(PUBLIC)"}
                            </span>
                            <span
                              className={`font-semibold uppercase tracking-[1.5px] ${
                                tr.passed
                                  ? "text-[#5fa657]"
                                  : tr.status === "Did Not Run"
                                  ? "text-[#666666]"
                                  : "text-[#ff5f57]"
                              }`}
                            >
                              {tr.status}
                            </span>
                          </div>

                          {tr.status === "Did Not Run" ? (
                            <div className="text-xs text-[#666666] py-2">
                              Test case did not run due to previous execution error or failure.
                            </div>
                          ) : tr.isHidden && !tr.passed ? (
                            <div className="text-xs text-[#ff5f57] py-2">
                              Hidden Test Case Failed. Details hidden to prevent hardcoding.
                            </div>
                          ) : (
                            <div className="space-y-2 text-xs font-bugatti-mono">
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
              <div className="h-full flex flex-col items-center justify-center py-10 text-center text-[#666666] text-xs leading-6">
                NO EXECUTION RESULTS YET.
                <br />
                CLICK <span className="text-white font-semibold">▶ RUN CODE</span> TO TEST AGAINST PREDEFINED CASES, OR TOGGLE <span className="text-white font-semibold">CUSTOM CHECK</span> FOR INPUT.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BattleTerminal;
