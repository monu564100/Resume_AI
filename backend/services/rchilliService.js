const axios = require('axios');

exports.parseWithRChilli = async (fileBuffer) => {
  const url = process.env.RCHILLI_URL;
  const userkey = process.env.RCHILLI_USERKEY;
  const version = process.env.RCHILLI_VERSION || '3.0.0';
  const subuserid = process.env.RCHILLI_SUBUSERID;
  if (!url || !userkey || !subuserid) throw new Error('Missing RChilli credentials');

  const form = new (require('form-data'))();
  form.append('userkey', userkey);
  form.append('version', version);
  form.append('subuserid', subuserid);
  form.append('file', fileBuffer, { filename: 'resume.pdf' });

  const res = await axios.post(url, form, { headers: form.getHeaders(), maxBodyLength: Infinity });
  return res.data;
};
