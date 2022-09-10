import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.154.0/testing/asserts.ts";
import * as log from "https://deno.land/std@0.154.0/log/mod.ts";
import { Account, Context } from "./Context.ts";
import { Fetcher } from "./Fetcher.ts";
import "./Log.ts";

function setup(): Account {
  Fetcher.domainName = "http://oryx-open-gateway.preview.rongxin.tech";
  const account: Account = {
    appkey: "zV2l38i95i",
    secret: "c7375d8d27514f5fa4e2ce85b5de8e54",
  };
  return account;
}

Deno.test("Context", async () => {
  const account = setup();
  const ctx = new Context(account);
  assertEquals(ctx.getAccessToken(), "");
  await ctx.init();
  const accessToken = ctx.getAccessToken();
  assertEquals(accessToken.length, 36);
  await ctx.refresh();
  assertNotEquals(ctx.getAccessToken(), accessToken);
});

Deno.test("Fetcher with Context", async () => {
  const account = setup();
  const ctx = new Context(account);
  await ctx.init();
  const fetcher = new Fetcher("/api/data/form/record/list");
  const data = await fetcher.fetchJson(ctx, {
    form_code: "zxy2__Dealer__c",
    num: 2,
  });
  log.info(`data is ${JSON.stringify(data, null, 2)}`);
});
