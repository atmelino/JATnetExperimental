package jat.core.coordinates;

import static java.lang.Math.floor;

/**
 * @author Tobias Berthold
 * 
 * 
 *         This class contains all typically used forms of an angle. The method
 *         convert() updates the internal forms. If you want to change the value
 *         of an angle, call the according setter method. The other forms will
 *         then automatically be updated.
 * 
 */
public class Angle {
	public final static int RADIANS = 1, DEGREES = 2, DECIMALHOURS = 3;
	public final static int ARCDEGREES = 4, HOURANGLE = 5, SHA = 6;
	private double radians;
	private double degrees; // decimal degrees
	private double hours;
	private HourAngle HA = new HourAngle();
	private ArcDegrees arcDeg = new ArcDegrees();
	private ArcDegrees sha = new ArcDegrees(); // sidereal hour angle

	// public boolean angleInRange = true; // automatically convert angle to be
	// in range 0..2pi for radians,
	// 0..360 for degrees, 0:0:0 .. 23:59:59 for hour, 0..23.9999 for hour

	public Angle(double angle, int mode) {
		if (mode == RADIANS)
			radians = angle;
		if (mode == DEGREES)
			radians = Math.toRadians(angle);
		if (mode == DECIMALHOURS)
			radians = Math.toRadians(angle * 15.);
		convert();
	}

	public Angle(int hours_arcdegrees, int minutes, double seconds, int mode) {
		if (mode == ARCDEGREES)
			radians = Math.toRadians(hours_arcdegrees + minutes / 60. + seconds / 3600.);
		if (mode == HOURANGLE)
			radians = Math.toRadians(15. * (hours_arcdegrees + minutes / 60. + seconds / 3600.));
		convert();
	}

	public double getRadians() {
		return radians;
	}

	public void setRadians(double radians) {
		this.radians = radians;
		convert();
	}

	public double getDegrees() {
		return degrees;
	}

	public void setDegrees(double degrees) {
		this.radians = Math.toRadians(degrees);
		convert();
	}

	public ArcDegrees getArcDeg() {
		return arcDeg;
	}

	public String getArcDegString() {
		return String.format("%2d %2d'%2d''", arcDeg.degrees, arcDeg.minutes, (int) arcDeg.seconds);
	}

	public void setArcDeg(ArcDegrees arcDeg) {
		this.arcDeg = arcDeg;
		convert();
	}

	public double getHours() {
		return hours;
	}

	public void setHours(double hours) {
		this.radians = Math.toRadians(15. * hours);
		convert();
	}

	public HourAngle getHA() {
		return HA;
	}

	public String getHAString() {

		return String.format("%2d:%2d:%2d", HA.hours, HA.minutes, (int) HA.seconds);
	}

	public void setHA(HourAngle hA) {
		HA = hA;
		convert();
	}

	void convert() {
		
		degrees = Math.toDegrees(radians);
		hours = degrees / 15.;


		// Angle expressed as SHA in degrees, minutes, seconds
		// double shadegrees=360.-degrees;
		double shadegrees = 360. - degrees;
		sha.degrees = (int) shadegrees;
		sha.minutes = (int) (Frac(shadegrees) * 60.0);
		sha.seconds = (shadegrees - sha.degrees - sha.minutes / 60.) * 3600.;

		// if(angleInRange)
		// below this, only positive angles allowed
		double tmpradians = limitRadiansTo2PI(radians);
		double tmpdegrees = Math.toDegrees(tmpradians);

		// Angle expressed in degrees, minutes, seconds
		arcDeg.degrees = (int) tmpdegrees;
		arcDeg.minutes = (int) (Frac(tmpdegrees) * 60.0);
		arcDeg.seconds = (tmpdegrees - arcDeg.degrees - arcDeg.minutes / 60.) * 3600.;

		// Angle expressed as hour angle in hours, minutes, seconds
		double tmphours = tmpdegrees / 15.;
		HA.hours = (int) tmphours;
		// System.out.println(decimalhours+ " decimal hours");
		double tmpminutes = 60. * Frac(tmphours);
		// System.out.println(decimalminutes+ " decimal minutes");
		HA.minutes = (int) (60. * Frac(tmphours));
		HA.seconds = 60. * Frac(tmpminutes);
	}

	private static double Frac(double x) {
		return x - Math.floor(x);
	}

	public Angle add(Angle b) {
		Angle result = new Angle(radians + b.radians, RADIANS);
		result.convert();
		return result;
	}

	public Angle subtract(Angle b) {
		double tmpRadians = radians - b.radians;
		if (tmpRadians < 0)
			tmpRadians += 2 * Math.PI;
		Angle result = new Angle(tmpRadians, RADIANS);
		result.convert();
		return result;
	}

	public double sin(Angle a) {
		return Math.sin(a.radians);
	}

	public double tan(Angle a) {
		return Math.tan(a.radians);
	}

	public double cos(Angle a) {
		return Math.cos(a.radians);
	}

	private double limitRadiansTo2PI(double radians) {
		double dividedradians = radians / (2 * Math.PI);
		double limited = 2 * Math.PI * (dividedradians - floor(dividedradians));
		return (limited < 0) ? limited + 2 * Math.PI : limited;
	}

	public void print() {
		System.out.println(radians + " Radians");
		System.out.println(degrees + " Decimal degrees");
		if (arcDeg.positive)
			System.out.print("+");
		else
			System.out.print("-");
		System.out.println(arcDeg.degrees + " degrees " + arcDeg.minutes + " minutes " + arcDeg.seconds + " seconds");

		System.out.println(HA.hours + " hours " + HA.minutes + " minutes " + HA.seconds + " seconds");
		System.out.println(hours + " Decimal hours");
	}

	public void println() {
		print();
		System.out.println();
	}

	public void println(String title) {
		System.out.println(title);
		println();
	}

	public void println(String title, int mode) {
		System.out.print(title + " = ");
		switch (mode) {
		case RADIANS:
			System.out.println(radians + " Radians");
			break;
		case DEGREES:
			System.out.println(degrees + " Decimal degrees");
			break;
		case DECIMALHOURS:
			System.out.println(hours + " Decimal hours");
			break;
		case ARCDEGREES:
			if (arcDeg.positive)
				System.out.print("+");
			else
				System.out.print("-");
			System.out.println(arcDeg.degrees + " Degrees " + arcDeg.minutes + " Minutes " + arcDeg.seconds + " Seconds");
			break;
		case SHA:
			if (sha.positive)
				System.out.print("+");
			else
				System.out.print("-");
			System.out.println(sha.degrees + " Degrees " + sha.minutes + " Minutes " + sha.seconds + " Seconds");
			break;
		case HOURANGLE:
			System.out.println(HA.hours + " Hours " + HA.minutes + " Minutes " + HA.seconds + " Seconds");
			break;
		}
	}

}
