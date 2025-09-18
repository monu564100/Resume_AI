const axios = require('axios');

function localOverlapScore(candidateSkills = [], jobSkills = []) {
  if (!candidateSkills.length || !jobSkills.length) return 0;
  const set = new Set(candidateSkills.map((s) => s.toLowerCase()));
  const matched = jobSkills.filter((s) => set.has(String(s).toLowerCase()));
  return Math.round((matched.length / jobSkills.length) * 100);
}

exports.scoreCandidateForJob = async ({ candidateSkills, jobDescription }) => {
  const apiKey = process.env.SKILLRANK_API_KEY;
  const base = process.env.SKILLRANK_BASE_URL;
  if (!apiKey || !base) {
    // naive extraction of job skills words
    const words = (jobDescription || '').match(/[a-zA-Z0-9+.#]+/g) || [];
    const jobSkills = Array.from(new Set(words.filter((w) => w.length > 2))).slice(0, 20);
    return { score: localOverlapScore(candidateSkills, jobSkills), matched: [], missing: [] };
  }
  try {
    const res = await axios.post(`${base}/score`, { candidateSkills, jobDescription }, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 10000,
    });
    return res.data; // expect { score, matched, missing }
  } catch (e) {
    const words = (jobDescription || '').match(/[a-zA-Z0-9+.#]+/g) || [];
    const jobSkills = Array.from(new Set(words.filter((w) => w.length > 2))).slice(0, 20);
    return { score: localOverlapScore(candidateSkills, jobSkills), matched: [], missing: [] };
  }
};
