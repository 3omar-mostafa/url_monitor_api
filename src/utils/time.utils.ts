export class TimeUtils {
  public static readonly MILLISECONDS_PER_SECOND = 1000;
  public static readonly SECONDS_PER_MINUTE = 60;
  public static readonly MINUTES_PER_HOUR = 60;
  public static readonly HOURS_PER_DAY = 24;
  public static readonly DAYS_PER_WEEK = 7;
  public static readonly MONTHS_PER_YEAR = 12;

  public static readonly SECOND = TimeUtils.MILLISECONDS_PER_SECOND;
  public static readonly MINUTE = TimeUtils.SECOND * TimeUtils.SECONDS_PER_MINUTE;
  public static readonly HOUR = TimeUtils.MINUTE * TimeUtils.MINUTES_PER_HOUR;
  public static readonly DAY = TimeUtils.HOUR * TimeUtils.HOURS_PER_DAY;
  public static readonly WEEK = TimeUtils.DAY * TimeUtils.DAYS_PER_WEEK;

  /**
   * Convert Milliseconds to seconds
   * @param milliseconds Milliseconds to convert from
   */
  static ms_to_s(milliseconds: number) {
    return milliseconds / TimeUtils.MILLISECONDS_PER_SECOND;
  }

  /**
   * Convert seconds to milliseconds
   * @param seconds Seconds to convert from
   */
  static s_to_ms(seconds: number) {
    return seconds * TimeUtils.MILLISECONDS_PER_SECOND;
  }

  /**
   * Convert minutes to milliseconds
   * @param minutes Minutes to convert from
   */
  static m_to_ms(minutes: number) {
    return minutes * TimeUtils.MINUTE;
  }

  /**
   * Convert milliseconds to minutes
   * @param milliseconds Milliseconds to convert from
   */
  static ms_to_m(milliseconds: number) {
    return milliseconds / TimeUtils.MINUTE;
  }

  /**
   * Convert minutes to seconds
   * @param minutes Minutes to convert from
   */
  static m_to_s(minutes: number) {
    return minutes * TimeUtils.SECONDS_PER_MINUTE;
  }

  /**
   * Convert seconds to minutes
   * @param seconds Seconds to convert from
   */
  static s_to_m(seconds: number) {
    return seconds / TimeUtils.SECONDS_PER_MINUTE;
  }

  /**
   * Convert hours to milliseconds
   * @param hours Hours to convert from
   */
  static h_to_ms(hours: number) {
    return hours * TimeUtils.HOUR;
  }

  /**
   * Convert milliseconds to hours
   * @param milliseconds Milliseconds to convert from
   */
  static ms_to_h(milliseconds: number) {
    return milliseconds / TimeUtils.HOUR;
  }
}
