import { PrimaryGeneratedColumn, Column, Entity, Index } from 'typeorm';

/**
 * A bot presence at a specific point in time
 */
@Entity()
export class Presence {
  /**
   * Auto-generated ID per presence record.
   */
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: BigInt;

  /**
   * Discord snowflake of the bot.
   * @example 388191157869477888
   */
  @Index()
  @Column({ type: 'bigint' })
  bot_id: BigInt;

  /**
   * Whether or not the bot was online at this point in time.
   * @example true
   */
  @Column()
  online: boolean;

  /**
   * Timestamp at which then the event occurred.
   */
  @Column({ type: 'timestamp with time zone' })
  when: Date;
}
