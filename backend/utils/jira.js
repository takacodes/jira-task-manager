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

module.exports = {
  extractJiraDescription,
};
