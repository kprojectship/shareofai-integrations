import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { endpoint, rpcResult, toolArguments, type Tool } from './rpc';

export class ShareofAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ShareofAI', name: 'shareofAi', icon: { light: 'file:shareofai.svg', dark: 'file:shareofai.svg' }, group: ['transform'], version: 1,
		description: 'Read AI visibility, competitors, citations, prompts, and recommended actions',
		subtitle: '={{$parameter["operation"]}}', defaults: { name: 'ShareofAI' }, usableAsTool: true,
		inputs: [NodeConnectionTypes.Main], outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'shareofAiOAuth2Api', required: true }],
		properties: [
{ displayName: 'Resource', name: 'resource', type: 'options', noDataExpression: true, default: 'analytics', options: [{ name: 'Analytics', value: 'analytics' }, { name: 'Project', value: 'project' }] },
			{ displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true, default: 'list_projects', displayOptions: { show: { resource: ['project'] } }, options: [{ name: 'Get Many', value: 'list_projects', action: 'Get many projects', description: 'Read accessible active projects and their IDs' }] },
{ displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true, default: 'get_visibility_overview', displayOptions: { show: { resource: ['analytics'] } }, options: [
				{ name: 'Compare Competitors', value: 'compare_competitors', action: 'Compare competitors', description: 'Compare observed brand visibility with competitors' },
				{ name: 'Get Cited Sources', value: 'get_cited_sources', action: 'Get cited sources', description: 'Read cited sources and confirmed citation gaps' },
				{ name: 'Get Prompt Performance', value: 'get_prompt_performance', action: 'Get prompt performance', description: 'Read visibility for tracked buyer prompts' },
				{ name: 'Get Recommended Actions', value: 'get_recommended_actions', action: 'Get recommended actions', description: 'Read open evidence-backed actions' },
				{ name: 'Get Visibility Overview', value: 'get_visibility_overview', action: 'Get visibility overview', description: 'Read observed visibility and model breakdowns' },
			] },
			{ displayName: 'Project ID', name: 'projectId', type: 'string', required: true, default: '', description: 'Project UUID returned by List Projects', displayOptions: { hide: { operation: ['list_projects'] } } },
			{ displayName: 'Days', name: 'days', type: 'number', default: 30, typeOptions: { minValue: 1, maxValue: 365 }, description: 'Number of days of observations to include', displayOptions: { hide: { operation: ['list_projects', 'get_recommended_actions'] } } },
			{ displayName: 'Limit', name: 'limit', type: 'number', default: 50, typeOptions: { minValue: 1, maxValue: 30 }, description: 'Max number of results to return', displayOptions: { show: { operation: ['get_cited_sources', 'get_prompt_performance', 'get_recommended_actions'] } } },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const output: INodeExecutionData[] = [];
		// MCP requires initialization before tool calls, so this is a programmatic node.
		rpcResult(await this.helpers.httpRequestWithAuthentication.call(this, 'shareofAiOAuth2Api', {
			method: 'POST', url: endpoint, headers: { Accept: 'application/json, text/event-stream' }, json: true,
			body: { jsonrpc: '2.0', id: 'initialize', method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'n8n-nodes-shareofai', version: '0.1.0' } } },
		}));
		await this.helpers.httpRequestWithAuthentication.call(this, 'shareofAiOAuth2Api', {
			method: 'POST', url: endpoint, headers: { Accept: 'application/json, text/event-stream' }, json: true,
			body: { jsonrpc: '2.0', method: 'notifications/initialized' },
		});
		for (let i = 0; i < this.getInputData().length; i++) {
			try {
				const tool = this.getNodeParameter('operation', i) as Tool;
				const args = toolArguments(tool, this.getNodeParameter('projectId', i, '') as string, this.getNodeParameter('days', i, 30) as number, this.getNodeParameter('limit', i, 10) as number);
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'shareofAiOAuth2Api', {
					method: 'POST', url: endpoint, headers: { Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-06-18' }, json: true,
					body: { jsonrpc: '2.0', id: i + 1, method: 'tools/call', params: { name: tool, arguments: args } },
				});
				output.push({ json: rpcResult(response), pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) { output.push({ json: { error: (error as Error).message }, pairedItem: { item: i } }); continue; }
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
		return [output];
	}
}
