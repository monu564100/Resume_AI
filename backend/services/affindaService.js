const axios = require('axios');

exports.parseWithAffinda = async (fileBuffer, fileName = 'resume.pdf') => {
  const apiKey = process.env.AFFINDA_API_KEY;
  if (!apiKey) throw new Error('Missing AFFINDA_API_KEY');
  const url = 'https://api.affinda.com/v3/documents';

  const form = new (require('form-data'))();
  form.append('file', fileBuffer, { filename: fileName });
  form.append('extractor', 'resume');

  const res = await axios.post(url, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${apiKey}`,
    },
    maxBodyLength: Infinity,
  });
  return res.data;
};
