import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

import { DuacoderEntity } from 'src/modules/duacoders/entities/duacoder.entity/duacoder.entity';
import { UserEntity } from 'src/users/entities/user.entity/user.entity';

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [DuacoderEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
