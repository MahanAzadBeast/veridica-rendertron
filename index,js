const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

console.log('🚀 Starting Veridica-Optimized Rendertron Service...');

let browser = null;

// Initialize browser with optimized settings
async function initBrowser() {
  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ],
      headless: 'new'
    });
    console.log('✅ Browser initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize browser:', error);
  }
}

// Health check endpoint
app.get('/healthz', (req, res) => {
  const isHealthy = browser && browser.isConnected();
  res.status(isHealthy ? 200 : 503).json({ 
    status: isHealthy ? 'healthy' : 'unhealthy',
    service: 'veridica-optimized-rendertron',
    timestamp: new Date().toISOString(),
    browser: isHealthy ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Veridica-Optimized Rendertron',
    version: '1.0.0',
    optimizations: [
      'Spline 3D animation handling',
      'Extended timeouts for heavy assets',
      'Smart waiting strategies',
      'Resource blocking for faster renders'
    ],
    endpoints: {
      health: '/healthz',
      render: '/render/<url>'
    }
  });
});

// Render endpoint optimized for Veridica AI
app.get('/render/*', async (req, res) => {
  const url = req.params[0];
  
  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ 
      error: 'Invalid URL', 
      message: 'URL must start with http:// or https://',
      provided: url
    });
  }

  if (!browser || !browser.isConnected()) {
    return res.status(503).json({ 
      error: 'Service unavailable', 
      message: 'Browser not initialized' 
    });
  }

  console.log(`🎯 Rendering (Veridica-optimized): ${url}`);
  const startTime = Date.now();
  
  let page = null;
  try {
    page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (compatible; Rendertron/3.0.0; +https://veridicaai.com/bot)');
    
    // Block heavy resources for faster rendering (optional - for SEO we just need text/HTML)
    if (url.includes('veridicaai.com')) {
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const resourceType = request.resourceType();
        const requestUrl = request.url();
        
        // Block heavy Spline assets but allow essential scripts
        if (resourceType === 'image' && requestUrl.includes('spline')) {
          console.log(`⚡ Blocking heavy Spline asset: ${requestUrl.substring(0, 50)}...`);
          request.abort();
        } else if (requestUrl.includes('prod.spline.design') && requestUrl.includes('.splinecode')) {
          console.log(`⚡ Blocking Spline scene: ${requestUrl.substring(0, 50)}...`);
          request.abort();
        } else {
          request.continue();
        }
      });
    }
    
    // Navigate with extended timeout for Veridica sites
    const timeout = url.includes('veridicaai.com') ? 45000 : 30000;
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', // Don't wait for all network requests
      timeout: timeout 
    });
    
    // For Veridica sites, wait for React to render but don't wait for Spline
    if (url.includes('veridicaai.com')) {
      console.log('🎨 Waiting for Veridica content to render...');
      
      // Wait for main content to appear
      try {
        await page.waitForSelector('h1, .content, main, [class*="hero"]', { timeout: 10000 });
        console.log('✅ Main content detected');
      } catch (e) {
        console.log('⚠️ Main content selector timeout, continuing anyway');
      }
      
      // Give React a moment to render
      await page.waitForTimeout(3000);
      
      // Inject CSS to hide Spline loading indicators for cleaner HTML
      await page.addStyleTag({
        content: `
          spline-viewer { 
            display: none !important; 
          }
          .spline-loading, .spline-background { 
            background: rgb(20, 20, 30) !important; 
          }
          [style*="spline"] {
            background: rgb(20, 20, 30) !important;
          }
        `
      });
      
    } else {
      // For other sites, use standard waiting
      await page.waitForTimeout(2000);
    }
    
    // Get the HTML content
    const html = await page.content();
    
    const renderTime = Date.now() - startTime;
    console.log(`✅ Rendered ${url} in ${renderTime}ms (${html.length} chars)`);
    
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('X-Rendered-By', 'Veridica-Optimized-Rendertron');
    res.set('X-Render-Time', `${renderTime}ms`);
    res.status(200).send(html);
    
  } catch (error) {
    const renderTime = Date.now() - startTime;
    console.error(`❌ Error rendering ${url} after ${renderTime}ms:`, error.message);
    res.status(500).json({ 
      error: 'Render failed', 
      message: error.message,
      url: url,
      renderTime: `${renderTime}ms`,
      timestamp: new Date().toISOString()
    });
  } finally {
    if (page) {
      await page.close();
    }
  }
});

// Initialize and start server
async function start() {
  await initBrowser();
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🌐 Veridica-Optimized Rendertron running on port ${port}`);
    console.log(`📊 Health check: /healthz`);
    console.log(`🎨 Optimized for: veridicaai.com (Spline handling)`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

start().catch(error => {
  console.error('💥 Failed to start service:', error);
  process.exit(1);
});
