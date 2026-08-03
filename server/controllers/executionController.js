const axios = require("axios");
const { getQuestionById } = require("../models/questions");

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// Shared helper: submit code to Judge0 and poll until it finishes
async function executeOnJudge0(code, languageId, stdin = "") {
  const submitRes = await axios.post(
    "https://ce.judge0.com/submissions/?base64_encoded=false",
    { source_code: code, language_id: languageId, stdin }
  );
  const { token } = submitRes.data;

  let result;
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise((r) => setTimeout(r, 1000));
    const pollRes = await axios.get(
      `https://ce.judge0.com/submissions/${token}?base64_encoded=false`
    );
    result = pollRes.data;
    if (result.status.id > 2) break;
  }
  return result;
}

async function runCode(req, res) {
  const { code, language = "javascript", stdin = "" } = req.body;
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) return res.status(400).json({ error: "Unsupported language" });

  try {
    const result = await executeOnJudge0(code, languageId, stdin);
    res.json({
      stdout: result.stdout || "",
      stderr: result.stderr || result.compile_output || "",
      executionTimeMs: result.time ? Math.round(parseFloat(result.time) * 1000) : null,
      status: result.status?.description || "Unknown",
    });
  } catch (err) {
    console.error("Judge0 error:", err.response?.data || err.message);
    res.status(500).json({ error: "Code execution failed" });
  }
}

async function runTests(req, res) {
  const { code, questionId, language = "javascript" } = req.body;
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) return res.status(400).json({ error: "Unsupported language" });

  const question = getQuestionById(questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });
  if (!question.testCases?.length) {
    return res.status(400).json({ error: "This question has no test cases yet" });
  }

  // Append a harness that calls the candidate's function once per test case,
  // printing one JSON-stringified result per line
  const harness =
    code +
    "\n" +
    question.testCases
      .map(
        (tc) =>
          `try { console.log(JSON.stringify(${tc.call})); } catch (e) { console.log("ERROR: " + e.message); }`
      )
      .join("\n");

  try {
    const result = await executeOnJudge0(harness, languageId);

    if (result.stderr || result.compile_output) {
      return res.json({
        compileError: result.stderr || result.compile_output,
        results: [],
      });
    }

    const outputLines = (result.stdout || "").trim().split("\n");

    const results = question.testCases.map((tc, i) => {
      const actual = (outputLines[i] || "").trim();
      return {
        call: tc.call,
        expected: tc.expected,
        actual,
        passed: actual === tc.expected,
      };
    });

    res.json({ results });
  } catch (err) {
    console.error("Judge0 test error:", err.response?.data || err.message);
    res.status(500).json({ error: "Test execution failed" });
  }
}

module.exports = { runCode, runTests };