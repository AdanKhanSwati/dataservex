import c0 from '../netolyst-media/feed-0.js';
import c1 from '../netolyst-media/feed-1.js';
import c2 from '../netolyst-media/feed-2.js';
import c3 from '../netolyst-media/feed-3.js';

export default function handler(req, res) {
  const img = Buffer.from(c0 + c1 + c2 + c3, 'base64');
  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Content-Length', String(img.length));
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(img);
}
