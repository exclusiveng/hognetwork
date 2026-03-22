import { execSync } from 'child_process';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load env variables for local testing
dotenv.config();

const API_KEY = process.env.KEDGR_API_KEY;
const PROJECT_ID = process.env.KEDGR_PROJECT_ID;
const BACKEND_URL = process.env.KEDGR_BACKEND_URL || 'http://localhost:3000';

async function runScan() {
  if (!API_KEY || !PROJECT_ID) {
    console.error('❌ Error: KEDGR_API_KEY and KEDGR_PROJECT_ID environment variables must be set.');
    process.exit(1);
  }

  console.log('🚀 Starting Kedgr CI/CD Scan...');
  console.log(`📂 Project ID: ${PROJECT_ID}`);
  console.log(`🌐 Backend: ${BACKEND_URL}`);

  let eslintOutput = '[]';
  try {
    console.log('🔍 Running ESLint...');
    // Run eslint on the current directory, ignoring node_modules, output format as JSON
    eslintOutput = execSync('npx eslint -f json .', { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  } catch (error: any) {
    // execSync throws on non-zero exit code (which happens if ESLint finds errors)
    // We can still process the stdout if it exists
    if (error.stdout) {
      eslintOutput = error.stdout.toString();
    } else {
      console.error('❌ ESLint execution failed with no output:', error.message);
      // We'll still send an empty result if it fails completely, or exit
    }
  }

  try {
    const results = JSON.parse(eslintOutput);
    let totalWarnings = 0;
    let totalErrors = 0;
    const details: any[] = [];

    results.forEach((fileResult: any) => {
      fileResult.messages.forEach((msg: any) => {
        if (msg.severity === 1) totalWarnings++;
        if (msg.severity === 2) totalErrors++;

        details.push({
          file: fileResult.filePath.replace(process.cwd(), ''),
          line: msg.line,
          column: msg.column,
          message: msg.message,
          ruleId: msg.ruleId,
          severity: msg.severity === 1 ? 'warning' : 'error'
        });
      });
    });

    console.log(`📊 Scan Complete: ${totalErrors} Errors, ${totalWarnings} Warnings`);

    // Bundle Payload
    const payload = {
      projectId: PROJECT_ID,
      results: {
        warnings: totalWarnings,
        errors: totalErrors,
        details
      },
      metadata: {
        timestamp: new Date().toISOString(),
        runner: 'github-actions',
        commit: process.env.GITHUB_SHA || 'local',
        branch: process.env.GITHUB_REF || 'local'
      }
    };

    console.log('📤 Sending reports to Kedgr API...');
    const response = await axios.post(`${BACKEND_URL}/api/scans/results`, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ Success: ' + response.data.message);
    } else {
      console.warn('⚠️ API Response:', response.data);
    }

  } catch (error: any) {
    console.error('❌ Failed to process or send scan results:', error.response?.data || error.message);
    process.exit(1);
  }
}

runScan();
