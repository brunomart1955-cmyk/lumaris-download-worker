# Lumaris Download Worker

Worker serverless para conectar o HTML publicado no Blogger a uma API de download.

## Publicação pelo painel da Cloudflare

1. Crie uma conta gratuita em https://dash.cloudflare.com/.
2. Abra **Workers & Pages**.
3. Clique em **Create application** e depois em **Create Worker**.
4. Dê um nome, por exemplo `lumaris-download`.
5. Abra **Edit code**.
6. Apague o código de exemplo e cole o conteúdo de `worker.js`.
7. Clique em **Deploy**.
8. Copie o endereço gerado, parecido com:

```text
https://lumaris-download.seu-subdominio.workers.dev
```

## Conectar ao HTML do Blogger

No arquivo `lumaris-download-blogger.html`, substitua:

```js
const API_ENDPOINT = 'https://api.cobalt.tools/';
```

por:

```js
const API_ENDPOINT = 'https://lumaris-download.seu-subdominio.workers.dev';
```

Depois copie o conteúdo para o editor HTML do Blogger.

## Observações

- O Worker não armazena vídeos e não precisa de banco de dados.
- O código não contém chaves secretas.
- `ALLOWED_ORIGIN` está como `*` para facilitar o primeiro teste. Depois de confirmar o domínio do blog, troque pelo endereço exato do Blogger, por exemplo `https://seublog.blogspot.com`.
- Use o serviço somente para conteúdo que você tenha autorização para baixar.
- A API externa pode mudar regras, exigir autenticação ou ficar indisponível; nesse caso, substitua `DOWNLOAD_API` por uma API compatível.
