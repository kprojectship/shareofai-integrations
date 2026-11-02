import type { IDataObject } from 'n8n-workflow';

export const endpoint = 'https://www.shareof.ai/mcp';
export const tools = ['list_projects', 'get_visibility_overview', 'compare_competitors', 'get_cited_sources', 'get_prompt_performance', 'get_recommended_actions'] as const;
export type Tool = typeof tools[number];

export function toolArguments(tool: Tool, projectId: string, days: number, limit: number): IDataObject {
	if (!tools.includes(tool)) throw new Error('Unknown ShareofAI operation');
	if (tool === 'list_projects') return {};
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) throw new Error('Enter a project UUID returned by List Projects');
	const args: IDataObject = { project_id: projectId };
	if (tool !== 'get_recommended_actions') {
		if (!Number.isInteger(days) || days < 1 || days > 365) throw new Error('Days must be an integer from 1 to 365');
		args.days = days;
	}
	if (['get_cited_sources', 'get_prompt_performance', 'get_recommended_actions'].includes(tool)) {
		const maximum = tool === 'get_recommended_actions' ? 30 : 50;
		if (!Number.isInteger(limit) || limit < 1 || limit > maximum) throw new Error(`Limit must be an integer from 1 to ${maximum}`);
		args.limit = limit;
	}
	return args;
}

export function rpcResult(response: unknown): IDataObject {
	if (!response || typeof response !== 'object') throw new Error('ShareofAI returned an invalid JSON-RPC response');
	const rpc = response as { error?: { message?: string }; result?: IDataObject & { isError?: boolean; content?: Array<{ type: string; text?: string }>; structuredContent?: IDataObject } };
	if (rpc.error) throw new Error(rpc.error.message || 'ShareofAI JSON-RPC error');
	if (!rpc.result) throw new Error('ShareofAI returned no result');
	if (rpc.result.isError) throw new Error(rpc.result.content?.find(item => item.type === 'text')?.text || 'ShareofAI tool failed');
	return rpc.result.structuredContent ?? rpc.result;
}
