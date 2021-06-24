import fetch from 'node-fetch';

export default class Chat {
  private API_KEY: string;
  private chat_id: string;

  /**
   * Send messages to a specific chat
   * @param API_KEY API key for your Telegram bot
   * @param chat_id id of the chat you are sending a message to
   */
  constructor(API_KEY: string, chat_id: string) {
    this.API_KEY = API_KEY;
    this.chat_id = chat_id;
  }

  /**
   * Async function that sends desired message to object's Telegram chat_id
   * @param message message to send
   * @returns status code of the request to api (-1 for failed request)
   */
  public async sendMessage(message: string): Promise<number> {
    const params = new URLSearchParams({
      chat_id: this.chat_id,
      text: message,
      parse_mode: 'markdown',
    });

    try {
      return (
        await fetch(
          `https://api.telegram.org/bot${this.API_KEY}/sendMessage?${params}`
        )
      ).status;
    } catch {
      return -1;
    }
  }
}
