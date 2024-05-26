import { typeORMConfig } from "src/config/ormconfig";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";

export const getEnvFilePath = () => {
  const NODE_ENV = process.env.NODE_ENV;
  return ".env" + (NODE_ENV == "local" ? ".local" : NODE_ENV == "development" ? ".development" : "");
};

config({ path: getEnvFilePath() });
const configService = new ConfigService();
export const dataSource = new DataSource(typeORMConfig(configService));
