const { spawn } = require('child_process');
const http = require('http');
const net = require('net');

async function run() {
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9233',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const list = await new Promise((resolve, reject) => {
    http.get('http://localhost:9233/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.type === 'page');
  if (!page) { chrome.kill(); return; }

  const url = new URL(page.webSocketDebuggerUrl);
  const client = net.createConnection({ port: url.port, host: url.hostname }, () => {
    const key = Buffer.from('test-key-12345678').toString('base64');
    const req = [
      `GET ${url.pathname} HTTP/1.1`,
      `Host: ${url.host}`,
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Key: ${key}`,
      'Sec-WebSocket-Version: 13',
      '\r\n'
    ].join('\r\n');
    client.write(req);
  });

  function sendWsText(text) {
    const payload = Buffer.from(text);
    const len = payload.length;
    let header;
    if (len < 126) {
      header = Buffer.from([0x81, 0x80 | len, 0, 0, 0, 0]);
    } else {
      header = Buffer.from([0x81, 0x80 | 126, (len >> 8) & 0xff, len & 0xff, 0, 0, 0, 0]);
    }
    client.write(Buffer.concat([header, payload]));
  }

  let buffer = Buffer.alloc(0);
  let id = 1;
  const pending = new Map();

  function sendCmd(method, params = {}) {
    const msgId = id++;
    return new Promise((resolve) => {
      pending.set(msgId, resolve);
      sendWsText(JSON.stringify({ id: msgId, method, params }));
    });
  }

  client.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    const httpEnd = buffer.indexOf('\r\n\r\n');
    if (httpEnd !== -1 && buffer.toString().startsWith('HTTP/1.1 101')) {
      buffer = buffer.slice(httpEnd + 4);
    }
    while (buffer.length >= 2) {
      const b0 = buffer[0];
      const b1 = buffer[1];
      const isMasked = (b1 & 0x80) !== 0;
      let len = b1 & 0x7f;
      let offset = 2;
      if (len === 126) {
        if (buffer.length < 4) break;
        len = buffer.readUInt16BE(2);
        offset = 4;
      } else if (len === 127) {
        if (buffer.length < 10) break;
        len = Number(buffer.readBigUInt64BE(2));
        offset = 10;
      }
      if (isMasked) offset += 4;
      if (buffer.length < offset + len) break;
      const data = buffer.slice(offset, offset + len);
      buffer = buffer.slice(offset + len);
      try {
        const json = JSON.parse(data.toString());
        if (json.id && pending.has(json.id)) {
          const fn = pending.get(json.id);
          pending.delete(json.id);
          fn(json.result);
        }
      } catch (e) {}
    }
  });

  await new Promise(r => setTimeout(r, 500));

  async function checkPage(path) {
    await sendCmd('Page.navigate', { url: `http://localhost:3000${path}` });
    await new Promise(r => setTimeout(r, 1200));

    const res = await sendCmd('Runtime.evaluate', {
      expression: `(() => {
        const h1 = document.querySelector('h1');
        const container = h1 ? h1.closest('main') || h1.parentElement : null;
        const main = document.querySelector('main');
        const h1Cs = h1 ? window.getComputedStyle(h1) : null;
        const mainCs = main ? window.getComputedStyle(main) : null;
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;

        return {
          path: window.location.pathname,
          hasNavbar: !!document.querySelector('header nav, header'),
          hasFooter: !!document.querySelector('footer'),
          h1: h1 ? {
            text: h1.textContent.trim().substring(0, 40),
            fontSize: h1Cs.fontSize,
            lineHeight: h1Cs.lineHeight,
            fontWeight: h1Cs.fontWeight,
            fontFamily: h1Cs.fontFamily.split(',')[0],
            color: h1Cs.color,
            x: h1Rect.x,
            y: h1Rect.y
          } : null,
          mainPadding: mainCs ? {
            paddingTop: mainCs.paddingTop,
            paddingLeft: mainCs.paddingLeft,
            paddingRight: mainCs.paddingRight
          } : null
        };
      })()`,
      returnByValue: true
    });
    return res.result.value;
  }

  const pages = ['/about', '/team', '/blog', '/pricing', '/templates'];
  for (const p of pages) {
    const info = await checkPage(p);
    console.log(`\nPage ${p}:`, JSON.stringify(info, null, 2));
  }

  client.destroy();
  chrome.kill();
}

run().catch(console.error);
