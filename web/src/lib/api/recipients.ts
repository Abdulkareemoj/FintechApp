// ================================================================
// FILE: src/lib/api/recipients.ts
// NOTE: backend currently only supports email lookup. The Phone/
// Username tabs on send-money.tsx and top-up.tsx have no
// backend yet — leave them disabled or hide them until that's built.
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
				identifier,
			)}&currency=${currency}`,
		),
};
