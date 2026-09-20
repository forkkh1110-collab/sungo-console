#!/usr/bin/env node
/* index.html 382번째 줄(템플릿 JSON 문자열)을 풀어 inner.html 로 저장. 사용: node tools/unpack.js [index.html] [inner.html] */
const fs = require('fs');
const src = process.argv[2] || 'index.html', out = process.argv[3] || 'inner.html';
const lines = fs.readFileSync(src, 'utf8').split('\n');
const li = lines.findIndex(l => l.includes('"<!DOCTYPE'));
if (li < 0) { console.error('템플릿 줄을 찾지 못함'); process.exit(1); }
const line = lines[li]; const a = line.indexOf('"<!DOCTYPE'), b = line.lastIndexOf('"');
const html = JSON.parse(line.slice(a, b + 1));
fs.writeFileSync(out, html);
fs.writeFileSync(out + '.meta.json', JSON.stringify({ src, line: li + 1, prefix: line.slice(0, a), suffix: line.slice(b + 1) }));
console.log(`unpacked line ${li + 1} → ${out} (${html.length} chars)`);
