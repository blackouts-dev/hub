/**
 * A less informative version of the {@link Presence} entity, designed for being sent in a JSON body to the web app.
 */
export interface UptimeStat {
  /**
   * Discord snowflake of the guild.
   * @example '714745044984135680'
   */
  guild_id: string;

  /**
   * Whether or not the bot was online at this point in time.
   * @example true
   */
  online: boolean;

  /**
   * When the presence was recorded.
   */
  when: Date;
}
