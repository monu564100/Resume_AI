const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  available() {
    return !!this.client;
  }

  getModel(model = 'gemini-1.5-flash') {
    return this.client.getGenerativeModel({ model });
  }

  async safeJsonPrompt(prompt, { model = 'gemini-1.5-flash', maxRetries = 2 } = {}) {
    if (!this.available()) return null;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const m = this.getModel(model);
        const result = await m.generateContent(prompt);
        const text = (await result.response).text();
        const json = this.extractJson(text);
        if (json) return json;
        lastError = new Error('Failed to parse JSON from Gemini response');
      } catch (e) {
        lastError = e;
      }
    }
    if (lastError) console.error('Gemini safeJsonPrompt error:', lastError.message || lastError);
    return null;
  }

  extractJson(text) {
    if (!text) return null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    try {
      return JSON.parse(text.substring(start, end + 1));
    } catch {
      return null;
    }
  }

  async enrichParsedStructure(rawText, minimalParsed) {
    if (!this.available()) return minimalParsed;
    // Only enrich if we have very few skills & no experience
    const skillCount = (minimalParsed.skills || []).length;
    if (skillCount > 5 || (minimalParsed.experience || []).length > 0) return minimalParsed;
    const prompt = `Extract structured resume JSON with keys: personalInfo{name,email,phone,location,linkedin,github}, summary, skills[name,category,level], experience[company,position,startDate,endDate,description,achievements], education[institution,degree,field,startDate,endDate,gpa], certifications[name,issuer,date], projects[name,description,technologies]. Use numeric level 0-100. Return JSON only.\nResume Text:\n${rawText.slice(0,6000)}`;
    const json = await this.safeJsonPrompt(prompt, {});
    if (json) {
      return {
        ...minimalParsed,
        ...json,
        skills: (json.skills || []).map(s => ({ ...s, level: typeof s.level === 'number' ? s.level : 60 }))
      };
    }
    return minimalParsed;
  }
}

module.exports = GeminiService;