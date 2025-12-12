import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Common company logos to download
const defaultLogos = [
  {
    name: 'microsoft',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
  },
  {
    name: 'google',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
  },
  {
    name: 'amazon',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    name: 'facebook',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg'
  },
  {
    name: 'apple',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  }
];

const downloadDir = join(__dirname, '../../public/images/company-logos');

// Create directory if it doesn't exist
if (!existsSync(downloadDir)) {
  mkdirSync(downloadDir, { recursive: true });
}

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      unlink(filepath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Download all default logos
async function downloadAllLogos() {
  for (const logo of defaultLogos) {
    const extension = extname(logo.url) || '.svg';
    const filename = `${logo.name}${extension}`;
    const filepath = join(downloadDir, filename);
    
    try {
      console.log(`Downloading ${logo.name} logo...`);
      await downloadImage(logo.url, filepath);
      console.log(`✅ Downloaded ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, error.message);
    }
  }
}

// Run the downloader
downloadAllLogos().then(() => {
  console.log('\n🎉 Logo download completed!');
}).catch(console.error);
