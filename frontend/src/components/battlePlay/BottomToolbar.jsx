import toast from "react-hot-toast";
import { runCodeService } from "../../services/executionService";
import { submitSolutionService } from "../../services/submissionService";

function BottomToolbar({
  code,
  language,
  battleId,
  problem,
  problemId,
  username,
  customInput = "",
  setOutput = () => {},
  setRunResult = () => {},
  setSubmissionResult = () => {},
  running = false,
  setRunning = () => {},
  submitting = false,
  setSubmitting = () => {},
}) {
  const handleRun = async () => {
    if (running || submitting) return;

    if (!code || !code.trim()) {
      toast.error("Please enter code before running.");
      return;
    }

    try {
      setRunning(true);
      setSubmissionResult(null);
      setRunResult(null);
      setOutput("");

      toast.loading("Running code against test cases...", { id: "runCode" });

      const testCasesToRun =
        problem?.testCases && problem.testCases.length > 0
          ? problem.testCases
          : problem?.examples?.map((ex) => ({
              input: ex.input,
              expectedOutput: ex.output,
              isHidden: false,
              points: 10,
            })) || [];

      const data = await runCodeService({
        code,
        language,
        input: customInput || "",
        testCases: testCasesToRun.length > 0 ? testCasesToRun : null,
        problemSlug: problem?.slug,
      });

      if (data.isBatch) {
        setRunResult(data);
        const passedCount = data.passedTests || 0;
        const totalCount = data.totalTests || 0;
        if (data.overallStatus === "Accepted") {
          toast.success(`Passed: ${passedCount}/${totalCount} test cases!`, { id: "runCode" });
        } else {
          toast.error(`${data.overallStatus}: ${passedCount}/${totalCount} passed`, { id: "runCode" });
        }
      } else {
        const outText = data.output || "Completed with no output.";
        setOutput(outText);
        toast.success("Execution completed!", { id: "runCode" });
      }
    } catch (error) {
      const errOut = error.response?.data?.output || "❌ Execution Failed.";
      setOutput(errOut);
      toast.error("Execution error", { id: "runCode" });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (running || submitting) return;

    if (!code || !code.trim()) {
      toast.error("Please write your solution before submitting.");
      return;
    }

    if (!battleId || !problemId || !username) {
      toast.error("Missing battle/problem parameters.");
      return;
    }

    try {
      setSubmitting(true);
      setOutput("");
      setRunResult(null);
      setSubmissionResult(null);

      toast.loading("Evaluating test cases against Judge0...", {
        id: "submitting",
      });

      const data = await submitSolutionService({
        battleId,
        problemId,
        username,
        language,
        code,
      });

      const isAccepted = data.overallStatus === "Accepted";
      if (isAccepted) {
        toast.success(`🎉 Accepted! Score: +${data.score} PTS`, {
          id: "submitting",
        });
      } else {
        toast.error(
          `${data.overallStatus}: ${data.passedTests}/${data.totalTests} test cases passed`,
          { id: "submitting" }
        );
      }

      setSubmissionResult(data);
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(
        error.response?.data?.message || "Submission evaluation failed.",
        { id: "submitting" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky bottom-4 bg-[#141414] border border-[#262626] rounded-none px-6 py-4 flex items-center justify-between gap-4 font-bugatti-mono shadow-2xl z-40">
      {/* Left Context */}
      <div className="hidden sm:flex items-center gap-3 text-xs uppercase tracking-[2px] text-[#666666]">
        <span
          className={`w-2 h-2 rounded-full ${
            running || submitting
              ? "bg-[#d4a017] animate-pulse"
              : "bg-[#5fa657]"
          }`}
        />
        <span>
          STATUS // {running ? "EXECUTING" : submitting ? "EVALUATING" : "READY"}
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button
          type="button"
          onClick={handleRun}
          disabled={running || submitting}
          className="bugatti-button-secondary text-xs min-w-[130px] text-center cursor-pointer disabled:opacity-50"
        >
          {running ? "EXECUTING..." : "▶ RUN CODE"}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={running || submitting}
          className="bugatti-button-primary text-xs min-w-[170px] text-center cursor-pointer disabled:opacity-50"
        >
          {submitting ? "SUBMITTING..." : "SUBMIT SOLUTION"}
        </button>
      </div>
    </div>
  );
}

export default BottomToolbar;
