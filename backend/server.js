require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Modular Jira routes
const jiraRoutes = require('./routes/jira');
app.use('/api', jiraRoutes);

app.listen(3001, () => console.log('Proxy listening on port 3001'));