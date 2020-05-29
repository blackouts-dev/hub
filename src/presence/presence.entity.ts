import { PrimaryGeneratedColumn, Column, Entity, Index } from 'typeorm';

/**
 * A bot presence at a specific point in time (right? @MicroDroid)
 */
@Entity()
export class Presence {
  /**
   * Auto-generated ID per presence record.
   */
  @PrimaryGeneratedColumn('increment', {type: 'int4'})
  id: number;

  /**
   * Discord snowflake of the bot.
   * @example 388191157869477888n
   */
  @Index()
  @Column({type: 'bigint'})
  bot_id: bigint;

  /**
   * Whether or not the bot was online at this point in time.
   * @example true
   */
  @Column()
  online: boolean;

  /**
   * When the presence was recorded.
   */
  @Column({ type: 'timestamp with time zone' })
  when: Date;
}
