import { afterEach, describe, expect, it } from 'vitest';
import { createPluginTestHost, createPluginRuntimeTestHost, type PluginTestHost, type PluginRuntimeTestHost } from '@emdash-cms/plugin-test';
import { analyzeContent } from '../src/readiness';
let host: PluginTestHost | undefined;
let runtime: PluginRuntimeTestHost | undefined;
afterEach(async()=>{await host?.dispose();await runtime?.dispose();host=undefined;runtime=undefined;});
describe('content analysis',()=>{
 it('does not claim empty content is ready',()=>{const r=analyzeContent('');expect(r.wordCount).toBe(0);expect(r.checks.every(c=>c.status==='Review')).toBe(true);});
 it('recognizes Portable Text headings and linked sources',()=>{const r=analyzeContent({body:[{style:'h2',children:[{text:'What is AI visibility?'}],markDefs:[{href:'https://www.shareof.ai/docs/mcp'}]}]});expect(r.headingCount).toBe(1);expect(r.sourceLinkCount).toBe(1);expect(r.checks[3].status).toBe('Present');});
 it('ignores script text and does not return input HTML',()=>{const r=analyzeContent('<script>secret words here</script><p>Hello</p>');expect(r.wordCount).toBe(1);expect(JSON.stringify(r)).not.toContain('secret');});
 it('recognizes markdown and deduplicates source URLs',()=>{const r=analyzeContent('# Topic\nhttps://example.com https://example.com');expect(r.headingCount).toBe(1);expect(r.sourceLinkCount).toBe(1);});
 it('bounds deeply nested data',()=>{let value:unknown='text';for(let i=0;i<100;i++)value={body:value};expect(analyzeContent(value).wordCount).toBe(0);});
});
describe('production sandbox',()=>{
 it('renders private admin page with working navigation structure',async()=>{runtime=await createPluginRuntimeTestHost();const r=await runtime.admin.loadPage('/readiness');expect(JSON.stringify(r)).toContain('Local editorial checks only');expect(JSON.stringify(r)).toContain('https://www.shareof.ai/docs/mcp');});
 it('handles a local review through host form validation',async()=>{runtime=await createPluginRuntimeTestHost();const r=await runtime.admin.submit('/readiness','analyze',{content:'# What is visibility?\nUse a source: https://example.com'},{blockId:'review'});expect(JSON.stringify(r)).toContain('Supporting sources: Present');expect(await runtime.http.requests()).toHaveLength(0);});
 it('reviews a saved entry through host authorization without changing it',async()=>{
  runtime=await createPluginRuntimeTestHost();
  await runtime.fixtures.collection({slug:'posts',label:'Posts',fields:[{slug:'title',label:'Title',type:'text'},{slug:'body',label:'Body',type:'text'}]});
  const entry=await runtime.fixtures.content('posts',{data:{title:'How to compare hosting?',body:'# Evidence\nRead https://example.com'}});
  const r=await runtime.admin.loadEditorPanel('readiness','posts',entry.id);
  expect(JSON.stringify(r)).toContain('Supporting sources: Present');
  expect(JSON.stringify(r)).toContain('Reviewing the saved entry');
  expect(await runtime.http.requests()).toHaveLength(0);
 });
 it('rejects oversized form input',async()=>{host=await createPluginTestHost();await expect(host.invokeRoute('admin',{type:'form_submit',action_id:'analyze',values:{content:'x'.repeat(100001)}})).rejects.toThrow();});
 it('rejects a direct panel invocation lacking host entry identity',async()=>{host=await createPluginTestHost();await expect(host.invokeRoute('panel',{type:'panel_load',entry:{collection:'posts',id:'forged'}})).rejects.toThrow();});
});
