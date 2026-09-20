#!/usr/bin/env node
/* inner.html 을 다시 JSON 문자열로 감싸 index.html 382번째 줄에 써넣고 검증. 사용: node tools/pack.js [inner.html] [index.html] */
const fs = require('fs');
const inner = process.argv[2] || 'inner.html', dst = process.argv[3] || 'index.html';
const meta = JSON.parse(fs.readFileSync(inner + '.meta.json', 'utf8'));
const html = fs.readFileSync(inner, 'utf8');
const enc = JSON.stringify(html).replace(/<\//g, '<\\u002F');
const lines = fs.readFileSync(dst, 'utf8').split('\n');
const li = meta.line - 1;
if (!lines[li].includes('"<!DOCTYPE')) { console.error('대상 줄이 템플릿 줄이 아님'); process.exit(1); }
lines[li] = meta.prefix + enc + meta.suffix;
fs.writeFileSync(dst, lines.join('\n'));
// 검증: 다시 파싱 · 시작 태그 · 스크립트 태그 균형
const back = JSON.parse(lines[li].slice(lines[li].indexOf('"<!DOCTYPE'), lines[li].lastIndexOf('"') + 1));
const ok = back === html && /^<!DOCTYPE html>/.test(back) && (back.match(/<script/g) || []).length === (back.match(/<\/script>/g) || []).length;
console.log(`packed → ${dst} line ${meta.line} · ${enc.length} chars · verify ${ok ? 'OK' : 'FAIL'}`);
if (!ok) process.exit(2);
