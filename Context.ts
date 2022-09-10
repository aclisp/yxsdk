import { Fetcher } from "./Fetcher.ts";

/** 账号密码 */
export type Account = {
  appkey: string;
  secret: string;
};

interface TokenRetrieveRequest extends Record<string, string> {
  grant_type: string;
  appkey: string;
  secret: string;
  client_id: string;
}

interface TokenRefreshRequest extends Record<string, string> {
  grant_type: string;
  refresh_token: string;
  client_id: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
}

export class Context {
  protected tokenTimestamp = 0; // 获取到token时刻的时间戳
  protected accessToken = "";
  protected refreshToken = "";
  protected expires = 0; // token过期时间，秒
  protected account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  async init() {
    const fetcher = new Fetcher("/oauth/token");
    const req: TokenRetrieveRequest = {
      grant_type: "keysecret",
      client_id: "drp",
      appkey: this.account.appkey,
      secret: this.account.secret,
    };
    const res = await fetcher.fetchForm(req) as TokenResponse;
    this.assign(res);
  }

  async refresh() {
    const fetcher = new Fetcher("/oauth/token");
    const req: TokenRefreshRequest = {
      grant_type: "refresh_token",
      refresh_token: this.refreshToken,
      client_id: "drp",
    };
    const res = await fetcher.fetchForm(req) as TokenResponse;
    this.assign(res);
  }

  protected assign(res: TokenResponse) {
    this.accessToken = res.access_token;
    this.refreshToken = res.refresh_token;
    this.expires = res.expires_in;
    this.tokenTimestamp = Date.now() / 1000;
  }

  getAccessToken(): string {
    return this.accessToken;
  }
}
