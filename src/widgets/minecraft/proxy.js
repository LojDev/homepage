import { pingJava, pingBedrock } from '@minescope/mineping';

import createLogger from "utils/logger";
import getServiceWidget from "utils/config/service-helpers";

const proxyName = "minecraftProxyHandler";
const logger = createLogger(proxyName);

export default async function minecraftProxyHandler(req, res) {
  const { group, service } = req.query;
  const serviceWidget = await getServiceWidget(group, service);
  const url = new URL(serviceWidget.url);
  const edition = serviceWidget.edition || "java";

  try {
    let svrResponse;
    if (edition.toLowerCase() === "java") {
      svrResponse = await pingJava(url.hostname, Number(url.port));
    } else if (edition.toLowerCase() === "bedrock") {
      svrResponse = await pingBedrock(url.hostname, Number(url.port));
    }
    res.status(200).send({
      version: svrResponse.version.name || svrResponse.version.gameVersion,
      online: true,
      players: svrResponse.players,
    });
  } catch (e) {
    if (e) logger.error(e);
    res.status(200).send({
      version: undefined,
      online: false,
      players: undefined,
    });
  }
}