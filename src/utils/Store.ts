import { ParsedArticle } from './Parser';
import fs from 'fs';

export default class Store {
  private path: string;

  constructor(path: string) {
    this.path = path;

    //create file if not exists
    try {
      fs.writeFileSync(path, '[]', { flag: 'wx' });
    } catch {}
  }

  /**
   * Read contents of the store
   * @returns list of articles in the store
   */
  public read(): ParsedArticle[] {
    const fileData: ParsedArticle[] = JSON.parse(
      fs.readFileSync(this.path, { encoding: 'utf8' })
    );
    return fileData;
  }

  /**
   * Check if store contains an article
   */
  public contains(article: ParsedArticle): boolean {
    return !(
      this.read().filter((fileArticle) => fileArticle.link == article.link)
        .length === 0
    );
  }

  /**
   * Append the list of articles to provided file - handles duplicates
   * @param content list of articles to append
   * @returns 0 for sucess, -1 for failure
   */
  public update(content: ParsedArticle[]): number {
    try {
      let fileData = this.read();

      content.forEach((a) => {
        if (
          fileData.filter((fileArticle) => fileArticle.link == a.link)
            .length === 0
        )
          fileData.push(a);
      });

      fs.writeFileSync(this.path, JSON.stringify(fileData));
    } catch {
      return -1;
    }
    return 0;
  }
}
