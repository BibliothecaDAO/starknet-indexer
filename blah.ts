import { NodeClient, credentials } from "@apibara/protocol";
import { StreamMessagesResponse__Output } from "@apibara/protocol/dist/proto/apibara/node/v1alpha1/StreamMessagesResponse";
import { Block } from "@apibara/starknet";

let blockNumber = 300_649;
async function main() {
  const node = new NodeClient(
    "goerli.starknet.stream.apibara.com:443",
    credentials.createSsl()
  );

  while (1) {
    try {
      await streamMessages(node);
    } catch (e) {
      console.log(e);
    }
  }
}

async function streamMessages(node: NodeClient) {
  const messages = node.streamMessages({ startingSequence: blockNumber });
  return new Promise((resolve, reject) => {
    messages.on("end", resolve);
    messages.on("error", reject);
    messages.on("data", (data: StreamMessagesResponse__Output) => {
      const value = data.data?.data?.value;
      if (value) {
        const block = Block.decode(value);
        blockNumber = block.blockNumber;
        // const events = block?.transactionReceipts
        //   .filter((o) => o.events?.length)
        //   .map((o) => o.events);

        // console.log(events);
        console.log(`${block.blockNumber} ${block.transactions.length}`);
      }
    });
  });
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
