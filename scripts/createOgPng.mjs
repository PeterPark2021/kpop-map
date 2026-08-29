import fs from 'fs';
import zlib from 'zlib';

function createStandardPng(width, height, outputPath) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // 다크 골드 그라데이션 테마
      const isBorder = (x < 12 || x > width - 13 || y < 12 || y > height - 13);
      if (isBorder) {
        rawData[pixelOffset] = 234;     // R (Gold)
        rawData[pixelOffset + 1] = 179; // G
        rawData[pixelOffset + 2] = 8;   // B
        rawData[pixelOffset + 3] = 255; // A
      } else {
        const factor = y / height;
        rawData[pixelOffset] = Math.floor(10 + factor * 15);   // Dark Blue
        rawData[pixelOffset + 1] = Math.floor(15 + factor * 20);
        rawData[pixelOffset + 2] = Math.floor(28 + factor * 35);
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG 헤더 및 청크 조합
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(outputPath, png);
  console.log(`✓ 1200x630 표준 PNG 파일 생성 완료: ${outputPath}`);
}

createStandardPng(1200, 630, 'public/og-preview.png');