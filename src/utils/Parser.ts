import jsdom from 'jsdom';
const { JSDOM } = jsdom;

/**
 * Parses web-pages and extracts articles
 */
export default class Parser {
  /**
   * Parse webpage and return list of articles
   * @param website which website to parse
   * @param root html of the webpage
   * @returns list of articles
   */
  static parse(website: Website, root: string): ParsedArticle[] {
    let lut: any = {};
    lut[Website.NJUSKALO] = this.parseNjuskalo;
    lut[Website.INDEX] = this.parseIndex;
    lut[Website.PLAVI_OGLASNIK] = this.parsePlaviOglasnik;

    return lut[website](root);
  }

  private static parseIndex = (root: string): ParsedArticle[] => {
    let parsedArticles: ParsedArticle[] = [];
    const { document } = new JSDOM(root).window;

    let articles = document
      .querySelector('.results')!
      .querySelectorAll('.OglasiRezHolder:not(.oglasiHolderBanners)');

    articles.forEach((a) => {
      const title = a.querySelector('img')?.getAttribute('alt') || 'No title';
      const link = a.querySelector('a')?.getAttribute('href') || '/';
      const price =
        a
          .querySelector('.result_body > .foot > .price')!
          .childNodes[1].textContent!.substring(2) || '?.??`';

      parsedArticles.push({ title, link, price });
    });

    return parsedArticles;
  };

  private static parseNjuskalo(root: string): ParsedArticle[] {
    let parsedArticles: ParsedArticle[] = [];
    const { document } = new JSDOM(root).window;

    const articles = document.querySelectorAll(
      '.EntityList--Regular .EntityList-item--Regular, .EntityList--Regular .EntityList-item--VauVau'
    );
    console.log(articles.length);

    articles.forEach((a) => {
      const title = a.querySelector('img')?.getAttribute('alt') || 'No title';
      const link =
        'https://www.njuskalo.hr' +
          a.querySelector('.entity-title > .link')!.getAttribute('href') || '/';
      const price =
        a.querySelector('.price--hrk')!.textContent!.trim() || '?.??';

      parsedArticles.push({ title, link, price });
    });

    return parsedArticles;
  }

  private static parsePlaviOglasnik(root: string): ParsedArticle[] {
    let parsedArticles: ParsedArticle[] = [];
    const { document } = new JSDOM(root).window;

    const articles = document.querySelectorAll(
      '.oglasnik-box a.classified-box, .izdvojeno-premium-box a.classified-box'
    );
    console.log(articles.length);

    articles.forEach((a) => {
      const title =
        a.querySelector('.classified-title')?.textContent || 'No title';
      const link = a.getAttribute('href') || '/';
      const price = a.querySelector('.price-kn')!.textContent!.trim() || '?.??';

      parsedArticles.push({ title, link, price });
    });

    return parsedArticles;
  }
}

export interface ParsedArticle {
  title: string;
  link: string;
  price: string;
}

export enum Website {
  NJUSKALO,
  PLAVI_OGLASNIK,
  INDEX,
}
