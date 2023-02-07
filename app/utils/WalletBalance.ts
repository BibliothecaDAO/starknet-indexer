import { BigNumber } from "ethers";
import { Context } from "../context";

const NULL_ADDRESS = "0x00";

export async function updateWallet(
  context: Context,
  toAddress: string,
  fromAddress: string,
  resourceId: number,
  amount: string,
  eventId: string
) {
  if (toAddress === NULL_ADDRESS && fromAddress === NULL_ADDRESS) {
    return;
  }

  const walletBalance = context.prisma.walletBalance;
  if (toAddress !== NULL_ADDRESS) {
    const where = {
      address_tokenId: {
        address: toAddress,
        tokenId: resourceId,
      },
    };

    const balance = await walletBalance.findUnique({ where });
    const newAmount = balance
      ? BigNumber.from(balance.amount).add(BigNumber.from(amount)).toString()
      : BigNumber.from(amount).toString();

    await walletBalance.upsert({
      where,
      update: { amount: newAmount, lastEventId: eventId },
      create: {
        address: toAddress,
        tokenId: resourceId,
        amount: newAmount,
        lastEventId: eventId,
      },
    });
  }

  if (fromAddress !== NULL_ADDRESS) {
    const where = {
      address_tokenId: {
        address: fromAddress,
        tokenId: resourceId,
      },
    };
    const balance = await walletBalance.findUnique({ where });
    const newAmount = balance
      ? BigNumber.from(balance.amount).sub(BigNumber.from(amount)).toString()
      : BigNumber.from(amount).toString();
    await walletBalance.upsert({
      where,
      update: { amount: newAmount, lastEventId: eventId },
      create: {
        address: fromAddress,
        tokenId: resourceId,
        amount: newAmount,
        lastEventId: eventId,
      },
    });
  }
}
