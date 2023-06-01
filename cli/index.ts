import { deploy } from "./deploy";

export const main = async () => {
  await deploy();
};

main().catch(console.error).finally(process.exit);
