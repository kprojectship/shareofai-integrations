import type { SandboxedPlugin } from 'emdash/plugin';
import type { BlockResponse } from '@emdash-cms/blocks/server';
import { analyzeContent, type Readiness } from './readiness';

function render(result?: Readiness, savedEntry = false): BlockResponse {
  return { blocks: [
    { type: 'header', text: 'ShareofAI Content Readiness' },
    { type: 'section', text: 'Local editorial checks only. These checks do not measure AI visibility, predict rankings, or guarantee citations. Use ShareofAI to monitor actual AI answers.' },
    ...(savedEntry ? [{ type: 'context' as const, text: 'Reviewing the saved entry. Save changes and reload this panel to review updated content. Custom fields outside title, content, body, excerpt, and description can be reviewed with the paste-text page.' }] : [{ type: 'form' as const, block_id: 'review', fields: [{ type: 'text_input' as const, action_id: 'content', label: 'Content to review', multiline: true, placeholder: 'Paste up to 100,000 characters of text, Markdown, or HTML.' }], submit: { label: 'Review locally', action_id: 'analyze' } }]),
    ...(result ? [
      { type: 'fields' as const, fields: [{ label: 'Words (approximate)', value: String(result.wordCount) }, { label: 'Heading markers', value: String(result.headingCount) }, { label: 'Distinct HTTP links', value: String(result.sourceLinkCount) }] },
      ...result.checks.map(check => ({ type: 'section' as const, text: `${check.label}: ${check.status}. ${check.detail}` })),
    ] : []),
    { type: 'actions', elements: [
      { type: 'link', label: 'Open ShareofAI', target: { kind: 'external', url: 'https://www.shareof.ai' }, appearance: 'primary' },
      { type: 'link', label: 'Connector setup', target: { kind: 'external', url: 'https://www.shareof.ai/docs/mcp' } },
      { type: 'link', label: 'Privacy', target: { kind: 'external', url: 'https://www.shareof.ai/privacy' } },
    ] },
    { type: 'context', text: 'Content stays on your EmDash host. This plugin stores no submitted content, sends no external requests, and does not modify or publish entries. Opening ShareofAI follows an external link; live monitoring requires a ShareofAI account.' },
  ] };
}

const plugin: SandboxedPlugin = {
  routes: {
    admin: {
      methods: ['POST'], request: { body: 'json', maxBytes: 450000 },
      handler: async ({ input }) => {
        if (!input || typeof input !== 'object') throw new Error('Invalid interaction');
        const interaction = input as { type?: string; action_id?: string; values?: { content?: unknown } };
        if (interaction.type === 'page_load') return render();
        if (interaction.type !== 'form_submit' || interaction.action_id !== 'analyze') throw new Error('Unsupported interaction');
        const content = interaction.values?.content;
        if (typeof content !== 'string' || content.length > 100000) throw new Error('Provide up to 100,000 characters of content');
        return render(analyzeContent(content));
      },
    },
    panel: {
      methods: ['POST'], request: { body: 'json' },
      handler: async (routeCtx, ctx) => {
        if (routeCtx.ui?.surface !== 'content-editor-panel') throw new Error('Open this panel from a saved entry');
        if (!ctx.content) throw new Error('Content read capability is unavailable');
        const entry = await ctx.content.get(routeCtx.ui.entry.collection, routeCtx.ui.entry.id);
        if (!entry) throw new Error('Saved entry not found');
        return render(analyzeContent(entry.data), true);
      },
    },
  },
};
export default plugin;
