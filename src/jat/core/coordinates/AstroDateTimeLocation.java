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
public class AstroDateTimeLocation {
	// public final static int GSTmode = 1, LSTmode = 2;
	private DateTime localDateTime;
	private DateTime UTCDateTime;
	private double JD;
	private Angle GST;
	private Angle LST;
	private Angle localLongitude;
	private Angle localLatitude;

	public AstroDateTimeLocation(int year, int month, int day, int hour, int minute, int second, String TZString) {
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, chrono);
		convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, int hour, int minute, int second, int millis,
			String TZString) {
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, millis, chrono);
		convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, int hour, int minute, int second, String TZString,
			Angle localLongitude) {
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, chrono);
		this.localLongitude = localLongitude;
		convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, int hour, int minute, int second, int millis,
			String TZString, Angle localLongitude) {
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, millis, chrono);
		this.localLongitude = localLongitude;
		convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, int hour, int minute, int second, String TZString,
			Angle localLongitude, Angle localLatitude) {
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, chrono);
		this.localLongitude = localLongitude;
		this.localLatitude = localLatitude;
		convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, int hour, int minute, int second, int millis,
			String TZString, Angle localLongitude, Angle localLatitude) {
		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID(TZString));
		localDateTime = new DateTime(year, month, day, hour, minute, second, millis, chrono);
		this.localLongitude = localLongitude;
		this.localLatitude = localLatitude;
		convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, Angle GST) {
		this.GST = GST;
		GSTToUT(year, month, day, GST);
		// convert();
	}

	public AstroDateTimeLocation(int year, int month, int day, Angle GST, Angle localLongitude, Angle localLatitude) {
		this.GST = GST;
		this.localLongitude = localLongitude;
		this.localLatitude = localLatitude;
		GSTToUT(year, month, day, GST);
		LST();
		// convert();
	}

	public AstroDateTimeLocation(Angle localLongitude, Angle localLatitude) {
		this.localLongitude = localLongitude;
		this.localLatitude = localLatitude;
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

	public void advanceJD(double days) {
		JD += days;
		//convert();
	}

	public Angle getGST() {
		return GST;
	}

	public void setGST(Angle GST) {
		this.GST = GST;
		convert();
	}

	public boolean isLSTNull() {
		boolean retval = (LST == null ? true : false);
		return retval;
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

	public Angle getLocalLongitude() {
		return localLongitude;
	}

	public Angle getLocalLatitude() {
		return localLatitude;
	}

	public void setLocalLatitude(Angle localLatitude) {
		this.localLatitude = localLatitude;
	}

	public void setLocalLongitude(Angle localLongitude) {
		this.localLongitude = localLongitude;
	}

	private void convert() {
		UTCDateTime = new DateTime(localDateTime.toDateTime(DateTimeZone.forID("UTC")));
		julianDate();
		GST();
		if (localLongitude != null) {
			// System.out.println("localLongitude found");
			LST();
		}
	}

	//private void convertFromGST() {
	//}

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
		double T = (JDZeroHour - 2451545.0) / 36525.0;
		double T0a = 6.697374558 + T * (2400.051336 + T * 0.000025862);
		double T0 = AstroUtil.limitHoursTo24(T0a);
		double UTDecimalHours = UTCDateTime.getMillisOfDay() / 3600000.;
		double sum = T0 + UTDecimalHours * 1.002737909;
		double sumLim = AstroUtil.limitHoursTo24(sum);

		GST = new Angle(sumLim, Angle.DECIMALHOURS);
		// System.out.println("JDZeroHour=" + JDZeroHour);
		// System.out.println("T=" + T);
		// System.out.println("T0a=" + T0a);
		// System.out.println("T0=" + T0);
		// System.out.println("UTDecimalHours=" + UTDecimalHours);
		// System.out.println("sum=" + sum);
		// System.out.println("sumLim=" + sumLim);
	}

	private void GSTToUT(int year, int month, int day, Angle GST) {

		Chronology chrono = GregorianChronology.getInstance(DateTimeZone.forID("UTC"));
		DateTime dtZeroHour = new DateTime(year, month, day, 0, 0, 0, chrono);
		long millis = dtZeroHour.getMillis();
		double JDZeroHour = DateTimeUtils.toJulianDay(millis);
		double T = (JDZeroHour - 2451545.0) / 36525.0;
		double T0a = 6.697374558 + T * (2400.051336 + T * 0.000025862);
		double T0 = AstroUtil.limitHoursTo24(T0a);
		double UT = 0.9972695663 * (AstroUtil.limitHoursTo24(GST.getHours() - T0));
		Angle UTAngle = new Angle(UT, Angle.DECIMALHOURS);
		int hour = UTAngle.getHA().hours;
		int minute = UTAngle.getHA().minutes;
		int second = (int) UTAngle.getHA().seconds;
		int ms = (int) (1000. * AstroUtil.Frac(UTAngle.getHA().seconds));
		// UTCDateTime = new DateTime(year, month, day, hour, minute, second,
		// ms, chrono);
		UTCDateTime = new DateTime(year, month, day, hour, minute, second, ms, chrono);

		// System.out.println("JDZeroHour=" + JDZeroHour);
		// System.out.println("T=" + T);
		// System.out.println("T0a=" + T0a);
		// System.out.println("T0=" + T0);
		// System.out.println("GST=" + GST.getHours());
		// System.out.println("UT=" + UT);
		// System.out.println("ms=" + ms);
	}

	private void LST() {
		try {
			localLongitude.getHAString();
			// System.out.println(localLongitude.getDegrees());
		} catch (NullPointerException e) {
			System.out.println("Observer longitude not set!");
			e.printStackTrace();
			System.exit(0);
		}

		LST = GST.add(localLongitude);

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
