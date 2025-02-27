import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum OmeletteType {
  WITH_ONION = 'WITH_ONION',
  WITHOUT_ONION = 'WITHOUT_ONION',
}

@Entity()
export class DuacoderEntity {
  @PrimaryColumn()
  nif: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  biografia: string;

  @Column({ nullable: true })
  departamento: string;

  @Column({ nullable: true })
  puesto: string;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ nullable: true })
  foto: string;

  @Column({
    type: 'enum',
    enum: OmeletteType,
    nullable: false,
    default: OmeletteType.WITH_ONION,
  })
  OmeletteType: OmeletteType;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;
}
