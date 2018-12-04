const puppeteer = require('puppeteer');

module.exports = class Printer {
  constructor() {
    // eager mode, launch browser right away.
    this.getBrowser();
  }

  getBrowser() {
    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    return this.browserPromise;
  }

  async getNewPage() {
    const browser = await this.getBrowser();
    return browser.newPage();
  }

  async print(url) {
    const page = await this.getNewPage();
    try {
      // const url = 'http://localhost:4000'; // TODO configure port
      await page.goto(url, { waitUntil: 'networkidle2' });
      const pdfOptions = {};
      const pdf = await page.pdf(pdfOptions);
      return pdf;
    } catch (error) {
      throw error;
    } finally {
      page.close();
    }
  }

  async close() {
    if (this.browserPromise) {
      const browser = await this.browserPromise;
      this.browserPromise = null;
      browser.close();
    }
  }
};
