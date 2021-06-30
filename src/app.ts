import fetch from 'node-fetch';
import dotenv from 'dotenv';

import Parser, { Website } from './utils/Parser';
import Chat from './utils/Chat';
import Store from './utils/Store';

const getUpdates = async (website: Website, root: string) => {
  const store = new Store(`./data/${website}.json`);

  const chat = new Chat(process.env.API_KEY!, process.env.CHAT_ID!);

  const articles = Parser.parse(website, root).reverse();

  for (const a of articles) {
    const msg = `${a.price} - [${a.title}](${a.link})`;
    if (!store.contains(a)) await chat.sendMessage(msg);
  }

  store.update(articles);
};

const getUpdatesWithFetch = async (website: Website, root: string) => {
  try {
    const res = await fetch(root);
    const html = await res.text().then((text) => text);

    await getUpdates(website, html);
  } catch (e) {
    console.error(e);
  }
};

const app = () => {
  dotenv.config();

  if (process.env.NJUSKALO)
    getUpdatesWithFetch(Website.NJUSKALO, process.env.NJUSKALO);

  if (process.env.PLAVI_OGLASNIK)
    getUpdatesWithFetch(Website.PLAVI_OGLASNIK, process.env.PLAVI_OGLASNIK);

  if (process.env.INDEX) getUpdatesWithFetch(Website.INDEX, process.env.INDEX);
};

app();
