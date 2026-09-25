/**
 * Utility for parsing and converting any Google Maps link into:
 * 1. An embeddable iframe URL (output=embed)
 * 2. A direct link to Google Maps
 */

export interface ParsedMapResult {
  embedUrl: string;
  directUrl: string;
  coordinates?: { lat: number; lng: number };
}

export async function processGoogleMapsInput(input: string): Promise<ParsedMapResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('URL Google Maps tidak boleh kosong');
  }

  // 1. Check if user pasted an <iframe> snippet
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    const src = iframeSrcMatch[1];
    return {
      embedUrl: src,
      directUrl: src.includes('embed') ? 'https://maps.google.com' : src,
    };
  }

  // 2. Check if user pasted plain coordinates (e.g. "-6.4725558, 110.8376500")
  const plainCoordMatch = trimmed.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  if (plainCoordMatch) {
    const lat = parseFloat(plainCoordMatch[1]);
    const lng = parseFloat(plainCoordMatch[2]);
    return {
      embedUrl: `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
      directUrl: `https://www.google.com/maps?q=${lat},${lng}`,
      coordinates: { lat, lng }
    };
  }

  // 3. If it is already an embed URL
  if (trimmed.includes('output=embed') || trimmed.includes('/maps/embed')) {
    return {
      embedUrl: trimmed,
      directUrl: trimmed,
    };
  }

  let finalUrl = trimmed;

  // 4. If it's a short link (maps.app.goo.gl or goo.gl/maps), resolve it via backend proxy
  if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
    try {
      const res = await fetch(`/api/resolve-map?url=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.finalUrl) {
          finalUrl = data.finalUrl;
        }
      }
    } catch (err) {
      console.warn('Could not resolve short URL via proxy, attempting direct parse:', err);
    }
  }

  // 5. Check for coordinates in URL (@lat,lng or q=lat,lng or ll=lat,lng)
  const atCoordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atCoordMatch) {
    const lat = parseFloat(atCoordMatch[1]);
    const lng = parseFloat(atCoordMatch[2]);
    return {
      embedUrl: `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
      directUrl: trimmed,
      coordinates: { lat, lng }
    };
  }

  const queryCoordMatch = finalUrl.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (queryCoordMatch) {
    const lat = parseFloat(queryCoordMatch[1]);
    const lng = parseFloat(queryCoordMatch[2]);
    return {
      embedUrl: `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
      directUrl: trimmed,
      coordinates: { lat, lng }
    };
  }

  // 6. Check for place name in URL (place/Name+Here)
  const placeMatch = finalUrl.match(/\/maps\/place\/([^/@?]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
      directUrl: trimmed,
    };
  }

  // 7. Check for general query (?q=...)
  const qMatch = finalUrl.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    const query = decodeURIComponent(qMatch[1].replace(/\+/g, ' '));
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
      directUrl: trimmed,
    };
  }

  // 8. Fallback: treat the trimmed input as a search query or use standard embed
  return {
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=16&ie=UTF8&iwloc=&output=embed`,
    directUrl: trimmed,
  };
}
