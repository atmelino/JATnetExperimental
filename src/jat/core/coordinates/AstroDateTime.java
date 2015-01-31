package jat.core.coordinates;

import java.util.Calendar;
import java.util.GregorianCalendar;

/**
 * 
 * Local Time<br>
 * Coordinated Universal Time (UTC)<br>
 * Julian Date (JD)<br>
 * Greenwich apparent sidereal time (GAST)<br>
 * Greenwich mean sidereal time (GMST)<br>
 * Greenwich sidereal time (GST)<br>
 * Local sidereal time (LST)<br>
 * International Atomic Time (TAI)<br>
 * Terrestrial Dynamic Time (TDT)<br>
 * Ephemeris Time (ET)<br>
 * 
 * @author Tobias Berthold
 * 
 */
public class AstroDateTime {

	private double JD;
	private GregorianCalendar localDateTime;

	// Angle localLongitude;

	public AstroDateTime(GregorianCalendar localDateTime) {
		this.localDateTime = localDateTime;
		convert();
	}

	public double getJD() {
		return JD;
	}

	public void setJD(double jD) {
		JD = jD;
		convert();
	}

	public GregorianCalendar getLocalDateTime() {
		return localDateTime;
	}

	public void setLocalDateTime(GregorianCalendar localDateTime) {
		this.localDateTime = localDateTime;
		convert();
	}

	private void convert() {

		julianDate();
	}

	private void julianDate() {

		int year = localDateTime.get(Calendar.YEAR);
		int month = localDateTime.get(Calendar.MONTH) + 1;
		int day = localDateTime.get(Calendar.DAY_OF_MONTH);
		int hour = localDateTime.get(Calendar.HOUR_OF_DAY);
		int minute = localDateTime.get(Calendar.MINUTE);
		int second = localDateTime.get(Calendar.SECOND);

		// if (month <= 2) {
		// year -= 1;
		// month += 12;
		// }
		// double A = Math.floor(year / 100);
		// double B = 2 - A + Math.floor(A / 4);
		// JD0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 *
		// (month + 1)) + day + B - 1524.5;
		// JD = JD0h + dayfraction;

		/* after Oct 15th, 1582 */
		long j_year = year;
		long j_month = month;
		long A, B, C, D;

		if (month == 1 || month == 2) {
			j_month = month + 12;
			j_year = year - 1;
		}
		A = (long) (j_year / 100);
		B = 2 - A + (long) (A / 4);
		C = (long) (365.25 * j_year);
		D = (long) (30.6001 * (j_month + 1));
		JD = B + C + D + decimal_day(day, hour, minute, second) + 1720994.5;

	}

	private double decimal_day(long day, long hour, long minute, long second) {
		double temp = day + decimal_hour(hour, minute, second) / 24;
		return temp;
	}

	private double decimal_hour(long hour, long minute, long second) {
		double temp = (double) hour + (double) minute / 60 + (double) second / 3600;
		return temp;
	}

	// GregorianCalendar time = new GregorianCalendar(new
	// SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC"));

}
