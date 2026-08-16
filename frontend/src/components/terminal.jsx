import { useEffect, useRef, useState } from "react";

const STATUS_RESET_DELAY_MS = 3000;

function Terminal({
  programInput = "",
  setProgramInput = () => {},
  output = "",
  runInfo = null,
  running = false,
  onClear = () => {},
}) {
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, running]);

  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (running) {
      setSettled(false);
      return;
    }
    if (output === "") {
      setSettled(false);
      return;
    }
    setSettled(false);
    const timer = setTimeout(() => setSettled(true), STATUS_RESET_DELAY_MS);
    return () => clearTimeout(timer);
  }, [running, output]);

  const hasOutput = output !== "";
  const looksLikeError =
    hasOutput &&
    /(error|exception|traceback|segmentation fault|failed)/i.test(output);

  const status = running
    ? "running"
    : settled
    ? "ready"
    : looksLikeError
    ? "failed"
    : hasOutput
    ? "completed"
    : "ready";

  const statusConfig = {
    ready: { label: "READY", color: "text-[#999999]" },
    running: { label: "EXECUTING", color: "text-[#d4a017]" },
    completed: { label: "COMPLETED", color: "text-[#5fa657]" },
    failed: { label: "FAILED", color: "text-[#ff5f57]" },
  }[status];

  return (
    <div className="h-72 bg-[#000000] text-white flex flex-col border-t border-[#262626] font-bugatti-mono selection:bg-white selection:text-black">
      {/* HEADER */}
      <div className="h-10 bg-[#0d0d0d] border-b border-[#262626] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white rounded-full" />
          <span className="text-[11px] uppercase tracking-[2.5px] text-white">
            TERMINAL // RUNNER ENGINE
          </span>
        </div>

        {hasOutput && (
          <button
            onClick={onClear}
            className="text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors cursor-pointer"
          >
            CLEAR OUTPUT
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* INPUT */}
        <div className="w-1/2 flex flex-col border-r border-[#262626] min-w-0 bg-[#000000]">
          <div className="px-4 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#666666]">
            PROGRAM INPUT (STDIN)
          </div>

          <textarea
            value={programInput}
            onChange={(e) => setProgramInput(e.target.value)}
            spellCheck={false}
            className="
              flex-1
              resize-none
              bg-transparent
              text-[#e6e6e6]
              font-bugatti-mono
              text-[13px]
              leading-6
              outline-none
              border-0
              px-4
              pb-2
              caret-white
              placeholder:text-[#666666]
            "
            placeholder="Provide standard input here..."
          />

          <div className="h-7 border-t border-[#262626]/50 flex items-center px-4 text-[10px] uppercase tracking-[1.5px] text-[#666666]">
            {programInput === "" ? "0 LINES" : `${programInput.split("\n").length} LINES`}
          </div>
        </div>

        {/* OUTPUT */}
        <div className="w-1/2 flex flex-col min-w-0 bg-[#000000]">
          <div className="px-4 pt-3 pb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#666666]">
            STDOUT / DIAGNOSTICS
          </div>

          <div
            ref={outputRef}
            className="flex-1 overflow-auto px-4 pb-2 font-bugatti-mono text-[13px] leading-6"
          >
            {running ? (
              <div className="flex items-center gap-2 text-[#d4a017]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                EXECUTING CODE...
              </div>
            ) : hasOutput ? (
              <pre
                className={`whitespace-pre-wrap break-words m-0 ${
                  looksLikeError ? "text-[#ff5f57]" : "text-[#e6e6e6]"
                }`}
              >
                {output}
              </pre>
            ) : (
              <div className="text-[#666666] text-xs">
                NO OUTPUT GENERATED.
                <br />
                CLICK RUN CODE TO EXECUTE.
              </div>
            )}
          </div>

          <div className="h-7 border-t border-[#262626]/50 flex items-center justify-between px-4 text-[10px] uppercase tracking-[1.5px]">
            <span className={`flex items-center gap-2 ${statusConfig.color}`}>
              STATUS // {statusConfig.label}
            </span>

            {runInfo && !running && (
              <span className="text-[#666666]">
                TIME: {runInfo.time}S · MEM: {runInfo.memory} KB
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terminal;
