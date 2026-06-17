// Basic content filter using a small blacklist
// This is a simple example. For production, use a proper content moderation API.

const bannedPatterns = [
  /毒品/i,
  /自杀/i,
  /炸弹/i,
  /爆破/i,
  /非法/i
];

function contentFilter(req, res, next) {
  try {
    const text = (req.body.question || req.body.content || '') + '';
    const found = bannedPatterns.find((p) => p.test(text));
    if (found) {
      return res.status(400).json({ message: '检测到敏感或违规内容，无法处理该请求' });
    }
    next();
  } catch (err) {
    console.error('contentFilter error', err);
    next();
  }
}

module.exports = contentFilter;
