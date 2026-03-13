export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { imageBase64, mimeType } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              // 改善後的 prompt
{ text: `你是專業的鳥類辨識專家。這張照片是鳥類撞窗後的現場紀錄，鳥可能處於側躺、仰躺或羽毛凌亂的狀態。

請依照以下順序嘗試辨識：
1. 整體羽毛顏色與花紋
2. 嘴喙形狀與顏色
3. 腳爪特徵
4. 翅膀與尾羽的顏色花紋
5. 體型大小（若有參照物）

請只回答鳥類中文名稱。
若能辨識，格式為：「鳥類名稱」
若不確定，格式為：「可能是：鳥類名稱（不確定）」
若完全無法辨識，回答：「無法辨識」` }
            ]
          }]
        })
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
