import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

const WFS_BASE = 'https://wfs.geonorge.no/skwms1/wfs.administrative_enheter';

export interface FylkeFeature {
  id: string;
  name: string;
  gml: string;
}

export interface KommuneFeature {
  id: string;
  name: string;
  fylkeId: string;
  gml: string;
}

function buildWfsUrl(typename: string): string {
  const params = new URLSearchParams({
    SERVICE: 'WFS',
    VERSION: '2.0.0',
    REQUEST: 'GetFeature',
    TYPENAME: typename,
    COUNT: '1000',
  });
  return `${WFS_BASE}?${params.toString()}`;
}

async function fetchGml(typename: string): Promise<Document> {
  const url = buildWfsUrl(typename);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WFS ${typename} failed: ${res.status} ${res.statusText}`);
  const text = await res.text();
  return new DOMParser().parseFromString(text, 'text/xml') as unknown as Document;
}

function textContent(el: Element, localName: string): string {
  const nodes = el.getElementsByTagNameNS('*', localName);
  return nodes.length > 0 ? (nodes[0]?.textContent?.trim() ?? '') : '';
}

function firstChildElement(node: Element): Element | null {
  // @xmldom/xmldom does not implement firstElementChild — traverse childNodes manually
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child && child.nodeType === 1) return child as unknown as Element;
  }
  return null;
}

function geomGml(el: Element): string {
  // Kartverket WFS uses 'område' as the geometry property name
  const geomProp = el.getElementsByTagNameNS('*', 'område')[0];
  if (!geomProp) throw new Error('No geometry property (område) found in feature');
  // Skip comment nodes (<!--Inlined geometry...-->) to reach the actual GML element
  const geomEl = firstChildElement(geomProp as unknown as Element);
  if (!geomEl) throw new Error('Geometry property (område) is empty');
  return new XMLSerializer().serializeToString(geomEl as unknown as Node);
}

export async function fetchFylker(): Promise<FylkeFeature[]> {
  const doc = await fetchGml('Fylke');
  const members = doc.getElementsByTagNameNS('*', 'Fylke');
  const results: FylkeFeature[] = [];

  for (let i = 0; i < members.length; i++) {
    const el = members[i] as unknown as Element;
    const id = textContent(el, 'fylkesnummer');
    const name = textContent(el, 'fylkesnavn');
    if (!id || !name) continue;
    try {
      results.push({ id, name, gml: geomGml(el) });
    } catch (err) {
      console.error(`Skipping fylke ${id}: ${String(err)}`);
    }
  }
  return results;
}

export async function fetchKommuner(): Promise<KommuneFeature[]> {
  const doc = await fetchGml('Kommune');
  const members = doc.getElementsByTagNameNS('*', 'Kommune');
  const results: KommuneFeature[] = [];

  for (let i = 0; i < members.length; i++) {
    const el = members[i] as unknown as Element;
    const id = textContent(el, 'kommunenummer');
    const name = textContent(el, 'kommunenavn');
    // fylkesnummer may be explicit on the feature, or derivable from the first 2 digits of kommunenummer
    const fylkeId = textContent(el, 'fylkesnummer') || id.slice(0, 2);
    if (!id || !name || !fylkeId) continue;
    try {
      results.push({ id, name, fylkeId, gml: geomGml(el) });
    } catch (err) {
      console.error(`Skipping kommune ${id}: ${String(err)}`);
    }
  }
  return results;
}
