import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ShareofAiOAuth2Api implements ICredentialType {
	name = 'shareofAiOAuth2Api';
	displayName = 'ShareofAI OAuth2 API';
	extends = ['oAuth2Api'];
	documentationUrl = 'https://www.shareof.ai/docs/mcp';
	icon = 'file:../nodes/ShareofAI/shareofai.svg' as const;
	properties: INodeProperties[] = [
		{ displayName: 'Use Dynamic Client Registration', name: 'useDynamicClientRegistration', type: 'hidden', default: true },
		{ displayName: 'Server URL', name: 'serverUrl', type: 'hidden', default: 'https://www.shareof.ai/mcp' },
		{ displayName: 'Resource URL', name: 'resourceUrl', type: 'hidden', default: 'https://www.shareof.ai/mcp' },
		{ displayName: 'Grant Type', name: 'grantType', type: 'hidden', default: 'pkce' },
		{ displayName: 'Scope', name: 'scope', type: 'hidden', default: 'shareofai:read offline_access' },
	];
}
