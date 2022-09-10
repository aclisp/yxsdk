import { Account, Context } from "./Context.ts";
import { Fetcher } from "./Fetcher.ts";
import { DataObject } from "./DataObject.ts";
import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import "./Log.ts";

function setup(): Account {
  Fetcher.domainName = "http://oryx-open-gateway.preview.rongxin.tech";
  const account: Account = {
    appkey: "zV2l38i95i",
    secret: "c7375d8d27514f5fa4e2ce85b5de8e54",
  };
  return account;
}

Deno.test("DataObject List", async () => {
  const account = setup();
  const ctx = new Context(account);
  await ctx.init();
  const objs = await DataObject.list(ctx, { form_code: "zxy2__Dealer__c" });
  assertEquals(objs?.length, 10);
});

Deno.test("DataObject Detail", async () => {
  const account = setup();
  const ctx = new Context(account);
  await ctx.init();
  const obj = await DataObject.detail(ctx, {
    form_code: "zxy2__Dealer__c",
    record_id: 2402368,
  });
  assertEquals(obj?.recordId, 2402368);
});
