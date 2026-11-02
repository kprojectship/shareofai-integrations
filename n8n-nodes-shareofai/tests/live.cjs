const { ShareofAi } = require('../dist/nodes/ShareofAI/ShareofAi.node');
const {tools}=require('../dist/nodes/ShareofAI/rpc');
const assert=require('node:assert/strict');
(async()=>{
 for(const operation of tools){
  const context={getInputData:()=>[{json:{}}],getNode:()=>({name:'ShareofAI',type:'shareofAi',typeVersion:1}),continueOnFail:()=>false,getNodeParameter:(key,index,fallback)=>({operation,projectId:process.env.SHAREOFAI_TEST_PROJECT,days:365,limit:10}[key]??fallback),helpers:{httpRequestWithAuthentication:async function(type,options){assert.equal(type,'shareofAiOAuth2Api');const response=await fetch(options.url,{method:options.method,headers:{...options.headers,'Content-Type':'application/json',Authorization:'Bearer '+process.env.SHAREOFAI_TEST_TOKEN},body:JSON.stringify(options.body)});assert(response.ok,'HTTP '+response.status);return response.status===202?{}:response.json();}}};
  const results=await ShareofAi.prototype.execute.call(context);assert.equal(results[0].length,1);assert(results[0][0].json);console.log(JSON.stringify({operation,node_execution:'passed'}));
 }
})().catch(e=>{console.error(e.message);process.exitCode=1});
