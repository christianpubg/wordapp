import { getStore } from "@netlify/blobs";

/* how long an unconfirmed claim holds a word before anyone else can take it */
export const HOLD_MS = 10 * 60 * 1000;

export const words = () => getStore({ name: "words", consistency: "strong" });
export const keyOf = w => "w/" + w;
export const ticker = w => w.toUpperCase().slice(0, 10);
export const cleanWord = w => String(w || "").toLowerCase().trim();
export const validWord = w => /^[a-z]{1,20}$/.test(w);
export const expired = rec => rec.status !== "live" && Date.now() - rec.at > HOLD_MS;

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export const rpcUrl = () => process.env.RPC_URL || "https://api.mainnet-beta.solana.com";
export async function rpc(method, params){
  const r = await fetch(rpcUrl(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || "RPC error");
  return j.result;
}
