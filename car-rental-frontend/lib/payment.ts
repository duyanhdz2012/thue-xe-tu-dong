export const BANK_TRANSFER = {
  bank: "VietinBank",
  accountNumber: "108879925432",
  accountHolder: "VU VAN DUY ANH",
} as const;

export function transferContent(transactionCode: string) {
  return `SEVQR ${transactionCode.replaceAll("-", "")}`;
}

export function vietQrUrl(amount: number, description: string) {
  const params = new URLSearchParams({
    bank: BANK_TRANSFER.bank,
    acc: BANK_TRANSFER.accountNumber,
    amount: String(Math.round(amount)),
    template: "compact",
    des: transferContent(description),
    showinfo: "true",
    holder: BANK_TRANSFER.accountHolder,
  });
  return `https://vietqr.app/img?${params.toString()}`;
}
