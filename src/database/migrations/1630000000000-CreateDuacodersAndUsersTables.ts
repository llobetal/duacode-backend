import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDuacodersAndUsersTables1630000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Creación de la tabla de duacoders
    await queryRunner.createTable(
      new Table({
        name: 'duacoder_entity',
        columns: [
          {
            name: 'nif',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'nombre',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'biografia',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'departamento',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'puesto',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'skills',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'foto',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'omeletteType',
            type: 'enum',
            enum: ['WITH_ONION', 'WITHOUT_ONION'],
            isNullable: false,
          },
          {
            name: 'fechaNacimiento',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Creación de la tabla de usuarios
    await queryRunner.createTable(
      new Table({
        name: 'user_entity',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('duacoder');
  }
}
