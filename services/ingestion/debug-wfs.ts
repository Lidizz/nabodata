// Run: npx tsx services/ingestion/debug-wfs.ts
import { DOMParser } from '@xmldom/xmldom';

const url =
  'https://wfs.geonorge.no/skwms1/wfs.administrative_enheter?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=Fylke&COUNT=1';

const res = await fetch(url);
const text = await res.text();

console.log('STATUS:', res.status);
console.log('\n--- FULL RESPONSE (first 5000 chars) ---\n');
console.log(text.slice(0, 5000));

// Also try parsing and listing all element local names found
const doc = new DOMParser().parseFromString(text, 'text/xml');
const APP_NS = 'https://skjema.geonorge.no/SOSI/produktspesifikasjon/AdmEnheter/20240101';

console.log('\n--- getElementsByTagNameNS with * ---');
const byWild = doc.getElementsByTagNameNS('*', 'Fylke');
console.log('Found with (*,Fylke):', byWild.length);

console.log('\n--- getElementsByTagNameNS with actual NS ---');
const byNs = doc.getElementsByTagNameNS(APP_NS, 'Fylke');
console.log('Found with (APP_NS,Fylke):', byNs.length);

// Walk the first member and list all child element localNames
console.log('\n--- Child element localNames inside first wfs:member ---');
const members = doc.getElementsByTagNameNS('*', 'member');
console.log('members found:', members.length);
if (members.length > 0) {
  const m = members[0]!;
  function walk(node: Element, depth: number) {
    const indent = '  '.repeat(depth);
    const attrs = Array.from(node.attributes ?? [])
      .map((a) => `${a.name}="${a.value}"`)
      .join(' ');
    console.log(`${indent}<${node.localName} ${attrs}>`.slice(0, 120));
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child && child.nodeType === 1) walk(child as unknown as Element, depth + 1);
    }
  }
  walk(m as unknown as Element, 0);
}
