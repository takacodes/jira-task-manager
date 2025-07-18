require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

app.get('/api/jira-tasks', async (req, res) => {
  try {
    const filterId = process.env.JIRA_FILTER_ID;
    const filterRes = await fetch(
      `${JIRA_DOMAIN}/rest/api/3/filter/${filterId}`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
          'Accept': 'application/json',
        },
      }
    );
    const filterData = await filterRes.json();
    if (!filterRes.ok) {
      return res.status(filterRes.status).json({
        error: filterData.errorMessages ? filterData.errorMessages.join(', ') : filterData.error || 'Unknown Jira error',
        status: filterRes.status,
        jira: filterData,
      });
    }

    const jql = encodeURIComponent(filterData.jql);
    const issuesRes = await fetch(
      `${JIRA_DOMAIN}/rest/api/3/search?jql=${jql}&fields=summary,status,created,updated,customfield_10020`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
          'Accept': 'application/json',
        },
      }
    );
    const issuesData = await issuesRes.json();
    if (!issuesRes.ok) {
    return res.status(issuesRes.status).json({
        error: issuesData.errorMessages ? issuesData.errorMessages.join(', ') : issuesData.error || 'Unknown Jira error',
        status: issuesRes.status,
        jira: issuesData,
    });
    }

    // Add a 'url' property to each issue
    if (issuesData.issues) {
    issuesData.issues = issuesData.issues.map(issue => ({
        ...issue,
        url: `${JIRA_DOMAIN}/browse/${issue.key}`,
        sprint: Array.isArray(issue.fields.customfield_10020) && issue.fields.customfield_10020.length > 0
        ? issue.fields.customfield_10020.map(s => s.name)
        : [],
    }));
    }

    res.json(issuesData);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch from Jira',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

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
    // Return changelog, updated, summary, and description fields
    res.json({
      updated: data.fields.updated,
      changelog: data.changelog,
      key: data.key,
      summary: data.fields.summary,
      description: typeof data.fields.description === 'string' ? data.fields.description : (data.fields.description?.content ? extractJiraDescription(data.fields.description) : ''),
    });

    // Helper to extract plain text from Jira's new format (if present)
    function extractJiraDescription(descObj) {
      if (!descObj || !descObj.content) return '';
      return descObj.content.map(block => {
        if (block.content) {
          return block.content.map(inline => inline.text || '').join('');
        }
        return '';
      }).join('\n');
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Jira issue', details: err instanceof Error ? err.message : String(err) });
  }
});

app.listen(3001, () => console.log('Proxy listening on port 3001'));