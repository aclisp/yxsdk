import * as log from "https://deno.land/std@0.154.0/log/mod.ts";
import { Context } from "./Context.ts";

interface ResponseWrapper {
  code: number;
  msg: string;
  data: unknown;
}

export class Fetcher {
  static domainName: string;

  protected urlPath: string;

  constructor(urlPath: string) {
    this.urlPath = urlPath;
  }

  async fetchForm(params: Record<string, string>): Promise<unknown> {
    const url = Fetcher.domainName + this.urlPath;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.encodeFormBody(params),
    });
    return await this.parseResponse(url, response);
  }

  protected encodeFormBody(params: Record<string, string>): URLSearchParams {
    return new URLSearchParams(params);
  }

  async fetchJson(ctx: Context, req: unknown): Promise<unknown> {
    const url = Fetcher.domainName + this.urlPath;
    const response = await fetch(url, {
      method: "POST",
      headers: this.accessHeaders(ctx),
      body: JSON.stringify(req),
    });
    return await this.parseResponse(url, response);
  }

  protected accessHeaders(ctx: Context): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ctx.getAccessToken(),
    };
  }

  protected async parseResponse(
    url: string,
    response: Response,
  ): Promise<unknown> {
    if (!response.ok) {
      log.error(
        `can not fetch ${url}: ${response.status} ${response.statusText}`,
      );
      return null;
    }
    const wrapper = await response.json() as ResponseWrapper;
    if (wrapper.code !== 0) {
      log.error(`biz err: fetch ${url}: ${wrapper.code} ${wrapper.msg}`);
      return null;
    }
    log.debug(
      `fetch ${url}: got ${JSON.stringify(wrapper.data).substring(0, 100)}`,
    );
    return wrapper.data;
  }
}
