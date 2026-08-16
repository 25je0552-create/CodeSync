export function requiresInput(code, language) {
  const patterns = {
    python: [
      /\binput\s*\(/,
    ],

    cpp: [
      /\bcin\s*>>/,
      /\bgetline\s*\(/,
    ],

    c: [
      /\bscanf\s*\(/,
      /\bfgets\s*\(/,
      /\bgetchar\s*\(/,
    ],

    java: [
      /\bScanner\b/,
      /\.next(Int|Line|Double|Float|Long|Short|Byte|Boolean)?\s*\(/,
      /\bBufferedReader\b/,
    ],

    javascript: [
      /\bprompt\s*\(/,
    ],

    typescript: [
      /\bprompt\s*\(/,
    ],
  };

  const checks = patterns[language] || [];

  return checks.some((regex) => regex.test(code));
}