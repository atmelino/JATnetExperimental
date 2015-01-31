package jat.core.coordinates;

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

	// int localYear;
	// int localMonth;
	// int localDay;
	// int localHour;
	// int localMinute;
	// int localSecond;

	private double JD;
	private GregorianCalendar localDateTime;

	// Angle localLongitude;

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

	public AstroDateTime(GregorianCalendar localDateTime) {
		this.localDateTime = localDateTime;
	}

	private void convert() {

	}

	private void julianDate() {
		if (month <= 2) {
			year -= 1;
			month += 12;
		}
		double A = Math.floor(year / 100);
		double B = 2 - A + Math.floor(A / 4);
		JD0h = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
		JD = JD0h + dayfraction;
	}

	// GregorianCalendar time = new GregorianCalendar(new
	// SimpleTimeZone(SimpleTimeZone.UTC_TIME, "UTC"));

}
