import { PrimaryGeneratedColumn, Column, Entity, Index } from 'typeorm';

/**
 * A bot presence at a specific point in time.
 */
@Entity()
export class Presence {
  /**
   * Auto-generated ID per presence record.
   */
  @PrimaryGeneratedColumn('increment', { type: 'int4' })
  id: number;

  /**
   * Discord snowflake of the bot.
   * Represented as a string due to a typeorm issue that doesn't allow deserializing into a `BigInt`.
   * @example '388191157869477888'
   */
  @Index()
  @Column({ type: 'bigint' })
  bot_id: string;

  /**
   * Discord snowflake of the guild.
   * Represented as a string due to a typeorm issue that doesn't allow deserializing into a `BigInt`.
   * @example '714745044984135680'
   */
  @Index()
  @Column({ type: 'bigint' })
  guild_id: string;

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
