const Puppeteer = require('puppeteer');
const ScrapeFaqs = require('./ScrapeFaq.js');
const fs = require('fs');

const target = ['https://www.ugrad.vcu.edu/why/faqs/admissions.html'];
const output = 'FAQs.json';

let faqs = {};

const grabFAQs = function(question) {
  Puppeteer.launch().then((browser) => {
    browser.newPage().then((page) => {
      Promise.all(target.map(i => new Promise((resolve, reject) => {
        page.goto(i).then(() => {
          page.evaluate(ScrapeFaqs).then(faq => {
            faqs = {
              faq,
              ...faqs
            }
            resolve();
          });
        }).catch(console.error);
      }))).then(i => {
        let faqStr = JSON.stringify(faqs);
        fs.writeFile(output, faqStr, e => e ? console.error(e) + browser.close() : browser.close());
      }).catch(console.error);
    }).catch(console.error);
  }).catch(console.error);
};

grabFAQs();
