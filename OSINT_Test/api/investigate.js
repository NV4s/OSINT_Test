import axios from 'axios';

export default async function handler(req, res) {
  const { target } = req.query;

  if (!target) {
    return res.status(400).json({ error: 'Target email is required' });
  }

  try {
    const breachUrl = `https://api.xposedornot.com/v1/breach-analytics?email=${target}`;
    const response = await axios.get(breachUrl);
    const breachData = response.data;

    // Fixed the operator formatting here
    const breachesFound = breachData?.ExposedBreaches?.breaches_details?.length |

| 0;
    const aiSummary = `AI Analysis Complete: Found ${breachesFound} exposed records linked to this identifier.`;

    return res.status(200).json({
      target,
      aiSummary,
      breaches: breachData?.ExposedBreaches?.breaches_details ||
    });

  } catch (error) {
    if (error.response && error.response.status === 404) {
      // 404 means no breaches found on XposedOrNot
      return res.status(200).json({ target, aiSummary: "No breaches detected.", breaches: });
    }
    return res.status(500).json({ error: 'Failed to gather intelligence.' });
  }
}