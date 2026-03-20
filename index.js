const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());

// Sert les fichiers statiques depuis la racine du repo
app.use(express.static(path.join(__dirname)));

app.get('/chatbot/products', async (req, res) => {
  try {
    const domain = process.env.SHOPIFY_DOMAIN;
    const token = process.env.SHOPIFY_TOKEN;
    if (!domain || !token) return res.status(500).json({ error: 'Shopify non configuré' });
    const r = await fetch(`https://${domain}/admin/api/2024-01/products.json?limit=250&fields=id,title,product_type,tags,variants,images,handle,body_html`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const d = await r.json();
    res.json(d.products || []);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Chatbot API sur port ' + PORT));
