# WebScrapper

Web Scrapper to extract frequently asked questions and there answers
and puts the information into a JSON file.

Fork of the great repo https://github.com/jonaylor89/FAQ-Scrapper

## Changes:
- Answer detection - instead of searching answer using bounding boxes, we suppose, that the answer is the content of all text nodes between two questions.
- Answer precleaning - in some FAQ answer may be started with the same questions, if so - we are trimming this question from answer.
- Question detection - text is FAQ question only if it **ends with** '?'. To avoid cases like this _'For more information, see What Permissions Do I Need to Use SSE? in the Amazon SQS Developer Guide.'_ (in original code it was detected like a question)
- Question precleaning - removing non-meaning beginnings of question like 'Q:', 'Question:', etc.

## How to run
- Install `node.js`
- Inside index.js define FAQ links to scrap in targets variable
- run `node index.js` 
- results will be saved into FAQs.json
