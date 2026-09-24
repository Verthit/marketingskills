#!/usr/bin/env node
// Extracts a machine-readable index of every skill (frontmatter, sections,
// references, cross-skill links, tool mentions) into docs/skills-index.json.
// Zero dependencies. Usage: node scripts/extract-skills-index.mjs

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');
const integrationsDir = join(root, 'tools', 'integrations');

const skillNames = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
  .map((d) => d.name)
  .sort();
const toolNames = readdirSync(integrationsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { data: {}, body: src };
  const data = {};
  let parent = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\s*)([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, indent, key, raw] = kv;
    const value = raw.replace(/^["']|["']$/g, '');
    if (indent.length === 0) {
      if (value === '') { data[key] = {}; parent = key; } else { data[key] = value; parent = null; }
    } else if (parent) {
      data[parent][key] = value;
    }
  }
  return { data, body: src.slice(m[0].length) };
}

function section(body, heading) {
  const re = new RegExp(`^## ${heading}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'im');
  return body.match(re)?.[1] ?? '';
}

const skills = skillNames.map((name) => {
  const dir = join(skillsDir, name);
  const src = readFileSync(join(dir, 'SKILL.md'), 'utf8');
  const { data, body } = parseFrontmatter(src);
  const refsDir = join(dir, 'references');
  const references = existsSync(refsDir) ? readdirSync(refsDir).filter((f) => f.endsWith('.md')).sort() : [];

  const related = section(body, 'Related Skills');
  const relatedSkills = [...related.matchAll(/\*\*([a-z0-9-]+)\*\*/g)]
    .map((m) => m[1])
    .filter((s) => s !== name && skillNames.includes(s));
  const descriptionSeeAlso = [...(data.description ?? '').matchAll(/see ([a-z0-9-]+)/gi)]
    .map((m) => m[1].toLowerCase())
    .filter((s) => s !== name && skillNames.includes(s));

  const allText = src + references.map((r) => readFileSync(join(refsDir, r), 'utf8')).join('\n');
  const tools = toolNames.filter((t) => allText.includes(`integrations/${t}.md`) || allText.includes(`clis/${t}.js`));

  return {
    name,
    version: data.metadata?.version ?? null,
    description: data.description ?? '',
    descriptionLength: (data.description ?? '').length,
    lines: src.split('\n').length,
    sections: [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
    references,
    relatedSkills: [...new Set(relatedSkills)],
    descriptionSeeAlso: [...new Set(descriptionSeeAlso)],
    readsProductMarketingContext: /product-marketing\.md/.test(src),
    tools,
  };
});

// Inbound link counts: which skills are most depended on.
const inbound = Object.fromEntries(skillNames.map((n) => [n, 0]));
for (const s of skills) for (const r of new Set([...s.relatedSkills, ...s.descriptionSeeAlso])) inbound[r]++;
for (const s of skills) s.inboundLinks = inbound[s.name];

const out = {
  generatedFrom: 'skills/*/SKILL.md via scripts/extract-skills-index.mjs',
  counts: {
    skills: skills.length,
    referenceFiles: skills.reduce((n, s) => n + s.references.length, 0),
    integrationGuides: toolNames.length,
    clis: readdirSync(join(root, 'tools', 'clis')).filter((f) => f.endsWith('.js')).length,
  },
  skills,
};

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'skills-index.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote docs/skills-index.json (${skills.length} skills)`);
