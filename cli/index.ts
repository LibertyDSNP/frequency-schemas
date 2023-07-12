import { deploy } from "./deploy.js";

export const main = async () => {
  await deploy();
};

main().catch(console.error).finally(process.exit);
