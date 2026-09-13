import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  UserProfile: a
    .model({
      walletAddress: a.string().required(),
      profileName: a.string(),
      credits: a.integer().required(),
      experience: a.enum(["newcomer", "regular", "lite-degen", "full-degen"]),
      writingStyle: a.enum(["default", "journalist", "storytelling", "ct-vibes", "concise"]),
      sources: a.string().array(),
    })
    .authorization((allow) => [allow.publicApiKey().to(["read", "create", "update"])])
    .secondaryIndexes((index) => [index("walletAddress").queryField("byWallet")]),
});

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
