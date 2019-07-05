module.exports = function ScrapeFaq() {
  class FaqScapper {
    constructor(target=document.body) {
      this.target = target;
    }
    containsTextNode(elem, tolerance=5) {
      return Array.from(elem.childNodes).filter(i => i.nodeType == 3)
        .map(i => i.textContent.trim()).join('').length > tolerance;
    };
    getLeafTextElements() {
      return Array.from(document.querySelectorAll('*'))
        .filter(i => ![
          'script',
          'noscript',
          'style',
          'iframe',
          'object',
          'audio',
          'video',
          'canvas',
          'img'
        ].includes(i.tagName.toLowerCase())
        && this.containsTextNode(i));
    };
    getQuestions() {
      return this.getLeafTextElements().filter(i => i.innerText.trim().endsWith('?'));
    };

    getTextNodesBetween  (rootNode, startNode, endNode) {
      var pastStartNode = false, reachedEndNode = false, textNodes = [];

      function getTextNodes(node) {
        if (node) {
          if (node == startNode) {
            pastStartNode = true;
          } else if (node == endNode) {
            reachedEndNode = true;
          } else if (node.nodeType == 3) {
            if (pastStartNode && !reachedEndNode && !/^\s*$/.test(node.nodeValue)) {
              textNodes.push(node);
            }
          } else {
            for (var i = 0, len = node.childNodes.length; !reachedEndNode && i < len; ++i) {
              getTextNodes(node.childNodes[i]);
            }
          }
        }
      }

      getTextNodes(rootNode);
      return textNodes;
    }

    getAnswersToQuestion(questions) {
      function removeQuestionFromAnswer(question,answer) {
        let flag = answer.toLowerCase().includes(question.toLowerCase());
        return flag ? answer.substr(question.length) : answer;
      }
      let questionAnswers = [];
      for (var i=0; i< questions.length-1; i++){
        let startNode = questions[i];
        let endNode = questions[i+1];
        let textNodes = this.getTextNodesBetween(this.target, startNode, endNode);
        let answer = textNodes.map(node => node.data.trim()).filter(text  => !text.startsWith('$')).join(' ');
          if (answer != '') {
            let question = startNode.innerText.replace(/(^(question)|^(q))(\s*\:*)/,'').trim();
            answer = removeQuestionFromAnswer(question, answer)
            questionAnswers.push({
              question: question,//node1.innerText.toLowerCase().replace(/[^\w\']/g, ' ').trim(),
              answer: answer,
              source: location.host
            })
          }
      }
      return questionAnswers
    }

    getFaqs() {
      return this.getAnswersToQuestion(this.getQuestions());
    }
  }
  return (new FaqScapper()).getFaqs();
}
