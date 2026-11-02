export type Readiness = { wordCount: number; headingCount: number; sourceLinkCount: number; checks: Array<{ label: string; status: string; detail: string }> };

/** Bounded traversal of text, HTML, Markdown, and Portable Text. No execution or networking. */
export function analyzeContent(value: unknown): Readiness {
  let visited = 0;
  let remaining = 200000;
  const chunks: string[] = [];
  let headingCount = 0;
  const sources = new Set<string>();
  function visit(node: unknown, depth: number) {
    if (++visited > 10000 || depth > 16 || remaining <= 0) return;
    if (typeof node === 'string') { const chunk = node.slice(0, Math.min(remaining, 100000)); chunks.push(chunk); remaining -= chunk.length; return; }
    if (Array.isArray(node)) { for (const child of node.slice(0, 2000)) visit(child, depth + 1); return; }
    if (!node || typeof node !== 'object') return;
    const item = node as Record<string, unknown>;
    if (typeof item.style === 'string' && /^h[1-6]$/.test(item.style)) headingCount++;
    if (typeof item.href === 'string' && /^https?:\/\//i.test(item.href)) sources.add(item.href);
    for (const key of ['title', 'text', 'content', 'body', 'excerpt', 'description', 'children', 'markDefs']) if (key in item) visit(item[key], depth + 1);
  }
  visit(value, 0);
  const raw = chunks.join('\n').slice(0, 200000);
  headingCount += (raw.match(/<h[1-6]\b|^#{1,6}\s+/gim) ?? []).length;
  for (const link of raw.matchAll(/https?:\/\/[^\s<>"')\]]+/gi)) sources.add(link[0]);
  const text = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
  const wordCount = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const question = /\?|\b(faq|frequently asked|how to|what is|why does)\b/i.test(text);
  return { wordCount, headingCount, sourceLinkCount: sources.size, checks: [
    { label: 'Substantive text', status: wordCount >= 150 ? 'Present' : 'Review', detail: wordCount >= 150 ? 'Enough text for an editorial review; verify it answers the reader’s actual question.' : 'Add a useful direct answer and supporting detail where the topic warrants it. Length alone does not improve visibility.' },
    { label: 'Readable structure', status: headingCount ? 'Present' : 'Review', detail: headingCount ? 'Heading markers were found. Check that their sequence and labels are useful.' : 'Use descriptive headings for longer content. Short answers may not need them.' },
    { label: 'Supporting sources', status: sources.size ? 'Present' : 'Review', detail: sources.size ? 'HTTP links were found. Their accuracy, independence, and authority have not been verified.' : 'Add primary-source links for factual claims where appropriate.' },
    { label: 'Explicit questions', status: question ? 'Present' : 'Review', detail: question ? 'Question or FAQ wording was found. Check that the nearby answer is clear and complete.' : 'Consider naming the buyer question this page answers when useful.' },
  ] };
}
