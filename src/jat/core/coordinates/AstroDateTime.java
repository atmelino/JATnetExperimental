package jat.core.coordinates;

import org.joda.time.Chronology;
import org.joda.time.DateTime;
import org.joda.time.DateTimeUtils;
import org.joda.time.DateTimeZone;
import org.joda.time.chrono.GregorianChronology;

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

	private DateTime localDateTime;

	// Angle localLongitude;

	public AstroDateTime(DateTime localDateTime) {
		this.localDateTime = localDateTime;
	}

	public AstroDateTime(int year, int month, int day, int hour, int minute, int second, String TZString) {

		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, chrono);
		convert();
	}

	public double getJD() {
		return JD;
	}

	public void setJD(double jD) {
		JD = jD;
		convert();
	}

	private void convert() {

		julianDate();
	}

	private void julianDate() {

		long millis = localDateTime.getMillis();
		JD = DateTimeUtils.toJulianDay(millis);

	}

}
