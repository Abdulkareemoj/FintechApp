
// ================================================================
// FILE: lib/api/recipients.ts
// ================================================================

export interface RecipientLookup {
  userId: string;
  name: string;
  email: string;
  walletId: string;
  currencyCode: string;
}

export const recipientsApi = {
  lookupByEmail: (identifier: string, currency: string) =>
    api.get<RecipientLookup>(
      `/user/recipients/lookup?identifier=${encodeURIComponent(
        identifier
      )}&currency=${currency}`,
      { auth: true }
    ),
};
