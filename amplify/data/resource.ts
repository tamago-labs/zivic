import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { priceTracker } from "../functions/price-tracker/resource";

const schema = a.schema({
  PriceSnapshot: a
    .model({
      symbol: a.string().required(),
      rwa_id: a.integer().required(),
      price: a.float(),
      market_cap: a.float(),
      volume_24h: a.float(),
      tokens: a.json(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
    ])
    .secondaryIndexes((index) => [
      index("symbol").queryField("bySymbol"),
    ]),
  UserProfile: a
    .model({
      walletAddress: a.string().required(),
      profileName: a.string(),
      credits: a.float().required(),
      experience: a.enum(["newcomer", "regular", "lite_degen", "full_degen"]),
      writingStyle: a.enum(["default", "journalist", "storytelling", "ct_vibes", "concise"]),
      sources: a.string().array(),
    })
    .authorization((allow) => [allow.publicApiKey().to(["read", "create", "update"])])
    .secondaryIndexes((index) => [index("walletAddress").queryField("byWallet")]),

}).authorization((allow) => [
  allow.resource(priceTracker),
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
