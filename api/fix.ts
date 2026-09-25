import { fixPromptWithFallback } from '../lib/fixPrompt';

// Helper to buffer stream if req.body is not automatically parsed by the host runtime
async function parseRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  if (typeof req.json === 'function') {
    try {
      return await req.json();
    } catch {
      return {};
    }
  }

  if (typeof req.on === 'function') {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk: any) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({});
        }
      });
      req.on('error', () => {
        resolve({});
      });
    });
  }

  return {};
}

function sendResponse(res: any, status: number, body: Record<string, any>) {
  if (!res) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (typeof res.setHeader === 'function') {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch {
      // Header setting failed or headers already sent
    }
  }

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(body);
  }

  if (typeof res.writeHead === 'function' && typeof res.end === 'function') {
    try {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      res.end(JSON.stringify(body));
      return;
    } catch {
      // Fallback
    }
  }

  if (typeof res.end === 'function') {
    res.end(JSON.stringify(body));
  }
}

export default async function handler(req: any, res: any) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function' && typeof res.end === 'function') {
      return res.status(200).end();
    }
    if (typeof res.writeHead === 'function' && typeof res.end === 'function') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      return res.end();
    }
    return new Response(null, { status: 200 });
  }

  if (req.method !== 'POST') {
    return sendResponse(res, 405, {
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasGroq = Boolean(process.env.GROQ_API_KEY);

    if (!hasGemini && !hasGroq) {
      return sendResponse(res, 500, {
        success: false,
        error:
          'Neither GEMINI_API_KEY nor GROQ_API_KEY is configured on the server. Please add them in your Vercel Project Settings > Environment Variables, then redeploy.',
      });
    }

    const body = await parseRequestBody(req);
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Prompt text is required.',
      });
    }

    const improvedPrompt = await fixPromptWithFallback(prompt.trim());

    return sendResponse(res, 200, {
      success: true,
      improvedPrompt,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to rewrite prompt. Please try again.';
    return sendResponse(res, 500, {
      success: false,
      error: message,
    });
  }
}
