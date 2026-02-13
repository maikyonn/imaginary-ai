import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from 'inngest/hono';
import { inngest } from './inngest/client.js';
import { bookPipeline } from './inngest/functions/book-pipeline.js';
import pipelineRoutes from './routes/pipeline.js';
import adminRoutes from './routes/admin.js';

const app = new Hono();

// CORS middleware
app.use(
	'/api/*',
	cors({
		origin: ['http://localhost:5173', 'https://imaginary-ai.onrender.com'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type'],
	}),
);

// Health check
app.get('/api/health', (c) => c.json({ ok: true }));

// Pipeline routes
app.route('/api/pipeline', pipelineRoutes);

// Admin routes
app.route('/api/admin', adminRoutes);

// Inngest serve handler
app.on(
	['GET', 'POST', 'PUT'],
	'/api/inngest',
	serve({ client: inngest, functions: [bookPipeline] }),
);

const port = Number(process.env.PORT) || 3000;

export default {
	port,
	fetch: app.fetch,
};

console.log(`Server running on http://localhost:${port}`);
