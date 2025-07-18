const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Existing /api/jira-tasks endpoint ...
// ...existing code...

// New endpoint to fetch issue changelog
app.get('/api/jira-issue/:id', async (req, res) => {
  try {
    const issueId = req.params.id;
    const url = `${JIRA_DOMAIN}/rest/api/3/issue/${issueId}?expand=changelog`;
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.errorMessages ? data.errorMessages.join(', ') : data.error || 'Unknown Jira error',
        status: response.status,
        jira: data,
      });
    }
    // Return only changelog and updated field
    res.json({
      updated: data.fields.updated,
      changelog: data.changelog,
      key: data.key,
      summary: data.fields.summary,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Jira issue', details: err instanceof Error ? err.message : String(err) });
  }
});

module.exports = app;
