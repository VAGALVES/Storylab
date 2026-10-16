# StoryLab — alternativa histórica de publicação (não ativa)

**STATUS 2026-10-16:** o usuário escolheu expressamente **manter o Netlify como hospedagem principal**. A automação do GitHub Pages foi desativada e não faz parte do fluxo de publicação. As instruções abaixo são apenas documentação de uma alternativa não habilitada; não representam publicação atual nem migração planejada.

## Por que existe esta alternativa

O Netlify Free trabalha com créditos mensais e pode pausar sites/publicações quando os créditos acabam. O StoryLab é estático: HTML, CSS e JavaScript sem backend, portanto também funciona no **GitHub Pages gratuito para repositórios públicos**.

O GitHub permanece como fonte única das alterações. Não é necessário apagar o projeto Netlify, mudar o repositório ou contratar um serviço de hospedagem.

## Ativação inicial — ação do responsável pelo repositório

1. Abra **https://github.com/VAGALVES/Storylab/settings/pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**. Não é necessário criar uma segunda workflow pelo GitHub: o projeto já fornece `.github/workflows/pages.yml`.
3. Acesse **https://github.com/VAGALVES/Storylab/actions/workflows/pages.yml** e, se ainda não houve execução, selecione **Run workflow → main → Run workflow**.
4. Confira o resultado na aba **Actions** e a URL efetivamente mostrada em **Settings → Pages**. O endereço esperado para um site de projeto é **https://vagalves.github.io/Storylab/**. O link só funcionará após o primeiro deploy aprovado.

## O que será automatizado

- A workflow `Verificar StoryLab` testa cada integração na `main`.
- **Não há publicação automática no GitHub Pages.** Uma eventual opção futura precisaria de nova aprovação e configuração explícita. O Netlify continua sendo o destino da aplicação.
- A página mantém links relativos e escopo relativo do PWA; por isso pode funcionar no subcaminho `/Storylab/`.
- Nenhuma build do GitHub Pages consome créditos do Netlify.

## Conteúdo publicado

O script `build_pages.py` copia o `index.html`, a lista de recursos usada no pré-cache do PWA, o `service-worker.js` e o `storylab-shanghai-offline.html` reconstruído a partir do código atual. Não publica a pasta de conteúdo editorial de trabalho, testes, credenciais ou backups privados.

## Observações de dados e domínio

**Dados locais não migram automaticamente entre domínios.** Progresso, favoritos e Dossiês de Campo salvos no navegador sob `*.netlify.app` não aparecerão sozinhos em `*.github.io`. É preciso exportar o backup JSON usando a versão anterior (se ainda estiver acessível, inclusive como PWA instalado/offline) e depois importar na nova URL. Se a versão Netlify estiver completamente pausada e o PWA não estiver acessível, preserve o armazenamento local do navegador e aguarde a retomada do ciclo para exportar.

O endereço `*.netlify.app` não pode ser transferido para o GitHub Pages. Com domínio próprio, é possível apontá-lo para outra hospedagem, mas isso é uma configuração separada. O GitHub Pages é público e não deve armazenar segredos ou dados comerciais sensíveis.

## Custos e alternativas

O GitHub Pages é gratuito em repositórios públicos e Actions em repositórios públicos está incluído sem cobrança de minutos nas condições de uso atuais. Existem limites de uso do serviço. Para projetos estáticos também é possível configurar o Cloudflare Pages Free como alternativa, com hospedagem separada.

Não desative automaticamente a versão Netlify: ela poderá voltar após a renovação de créditos, e manter a origem ajuda a recuperar dados locais.

Documentação oficial:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.netlify.com/manage/accounts-and-billing/billing/resume-paused-projects/
