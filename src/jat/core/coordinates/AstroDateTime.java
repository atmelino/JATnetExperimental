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
 * Greenwich mean sidereal time (GST)<br>
 * Local sidereal time (LST)<br>
 * International Atomic Time (TAI)<br>
 * Terrestrial Dynamic Time (TDT)<br>
 * Ephemeris Time (ET)<br>
 * 
 * @author Tobias Berthold
 * 
 */
public class AstroDateTime {

	private DateTime localDateTime;
	private DateTime UTCDateTime;
	private double JD;
	private Angle GST;
	private Angle LST;
	private Angle localLongitude;

	public AstroDateTime(int year, int month, int day, int hour, int minute, int second, String TZString) {

		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, chrono);
		convert();
	}

	public AstroDateTime(int year, int month, int day, int hour, int minute, int second, String TZString, Angle localLongitude) {
		this(year, month, day, hour, minute, second, TZString);
		this.localLongitude = localLongitude;
		convert();
	}

	public DateTime getLocalDateTime() {
		return localDateTime;
	}

	public void setLocalDateTime(DateTime localDateTime) {
		this.localDateTime = localDateTime;
		convert();
	}

	public DateTime getUTCDateTime() {
		return UTCDateTime;
	}

	public void setUTCDateTime(DateTime uTCDateTime) {
		UTCDateTime = uTCDateTime;
		convert();
	}

	public double getJD() {
		return JD;
	}

	public void setJD(double jD) {
		JD = jD;
		convert();
	}

	public Angle getGST() {
		return GST;
	}

	public void setGST(Angle gST) {
		GST = gST;
		convert();
	}

	public Angle getLST() {

		try {
			LST.toString();
		} catch (NullPointerException e) {
			System.out.println("LST not set! Make sure observer longitude is set.");
			e.printStackTrace();
			System.exit(0);
		}

		return LST;
	}

	public void setLST(Angle lST) {
		LST = lST;
		convert();
	}

	private void convert() {

		UTCDateTime = new DateTime(localDateTime.toDateTime(DateTimeZone.forID("UTC")));
		julianDate();
		GST();
		if (localLongitude != null) {
			//System.out.println("localLongitude found");
			LST();
		}
	}

	private void julianDate() {

		long millis = localDateTime.getMillis();
		JD = DateTimeUtils.toJulianDay(millis);

	}

	private void GST() {
		int y = UTCDateTime.getYear();
		int m = UTCDateTime.getMonthOfYear();
		int d = UTCDateTime.getDayOfMonth();
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID("UTC"));
		DateTime dtZeroHour = new DateTime(y, m, d, 0, 0, 0, chrono);
		long millis = dtZeroHour.getMillis();
		double JDZeroHour = DateTimeUtils.toJulianDay(millis);

		// System.out.println("JDZeroHour=" + JDZeroHour);

		double T = (JDZeroHour - 2451545.0) / 36525.0;
		// System.out.println("T=" + T);

		double T0a = 6.697374558 + T * (2400.051336 + T * 0.000025862);
		// System.out.println("T0a=" + T0a);

		double T0 = AstroUtil.limitHoursTo24(T0a);
		// System.out.println("T0=" + T0);

		// double
		// UTDecimalHours=UTCDateTime.getHourOfDay()+UTCDateTime.getMinuteOfHour();
		double UTDecimalHours = UTCDateTime.getSecondOfDay() / 3600.;
		// System.out.println("UTDecimalHours=" + UTDecimalHours);

		double sum = T0 + UTDecimalHours * 1.002737909;
		// System.out.println("sum=" + sum);

		double sumLim = AstroUtil.limitHoursTo24(sum);

		GST = new Angle(sumLim, Angle.DECIMALHOURS);

	}

	private void LST() {
		try {
			localLongitude.getHAString();
			//System.out.println(localLongitude.getDegrees());
		} catch (NullPointerException e) {
			System.out.println("Observer longitude not set!");
			e.printStackTrace();
			System.exit(0);
		}
		
		
		LST=GST.add(localLongitude);
		
	}

	public void println() {
		String s;

		s = String.format("%-30s%-25s", "localDateTime", localDateTime);
		System.out.println(s);
		s = String.format("%-30s%-25s", "UTCDateTime", UTCDateTime);
		System.out.println(s);
		s = String.format("%-30s%-25s", "Julian Date", JD);
		System.out.println(s);
		s = String.format("%-30s%-25s", "Greenwich mean sidereal time", GST.getHAString());
		System.out.println(s);
		if (LST != null) {
			s = String.format("%-30s%-25s", "Local sidereal time", LST.getHAString());
			System.out.println(s);
		}
	}

}
