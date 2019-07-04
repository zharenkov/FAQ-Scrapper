const Puppeteer = require('puppeteer');
const ScrapeFaqs = require('./ScrapeFaq.js');
const fs = require('fs');

const targets = [
    'https://www.delta.com/content/www/en_US/support/faqs/during-your-trip/baggage-faqs.html',
    'https://www.aeroflot.ru/ru-en/afl_bonus/questions_answers'
];
const output = 'FAQs.json';

let faqs = [];
const grabFAQs = function(question) {
  Puppeteer.launch({ignoreHTTPSErrors: true}).then((browser) => {
    Promise.all(targets.map(i => new Promise((resolve, reject) => {
      browser.newPage().then((page) => {
        page.setUserAgent("Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)");
        page.goto(i).then(() => {
          page.evaluate(()=> {
              Array.from(document.querySelectorAll('*')).filter(e => !['script', 'style',
                    'link', 'meta', 'embed', 'object'].includes(e.tagName.toLowerCase()) &&
                  getComputedStyle(e).display == 'none').forEach(e => e.style.display =
                  'block');
          })
          page.evaluate(ScrapeFaqs).then(details => {
            resolve(details);
          });
        }).catch(console.error);
      }).catch(console.error);
    }))).then(resolvedFaqs => {
      resolvedFaqs.forEach(faq => faqs = faqs.concat(faq));
      let faqStr = JSON.stringify(faqs);
      fs.writeFile(output, faqStr, e => e ? console.error(e) + browser.close() : browser.close());
    }).catch(console.error);
  }).catch(console.error);
};

grabFAQs();
