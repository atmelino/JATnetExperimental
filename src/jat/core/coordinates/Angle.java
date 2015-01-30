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
	private double degrees;
	private double hours;
	private HourAngle h = new HourAngle();
	private ArcDegrees a = new ArcDegrees();
	private ArcDegrees sha = new ArcDegrees();
	public boolean angleInRange = true; // automatically convert angle to be in range 0..2pi for radians, 
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

	public Angle(boolean positive, int hours_arcdegrees, int minutes, double seconds, int mode) {
		h.positive = positive;
		a.positive = positive;
		if (mode == ARCDEGREES)
			radians = Math.toRadians(hours_arcdegrees + minutes / 60. + seconds / 3600.);
		if (mode == HOURANGLE)
			radians = Math.toRadians(15. * (hours_arcdegrees + minutes / 60. + seconds / 3600.));
		if (!positive)
			radians = -radians;
		convert();
	}

	public double getRadians() {
		return radians;
	}

	public void setRadians(double radians) {
		this.radians = radians;
		convert();
	}

	public double getHours() {
		return hours;
	}

	public void setHours(double hours) {
		this.radians = Math.toRadians(15. * hours);
		convert();
	}

	public double getDegrees() {
		return degrees;
	}

	public void setDegrees(double degrees) {
		this.radians = Math.toRadians(degrees);
		convert();
	}

	void convert() {
		double tmpdegrees;
		double shadegrees;

		if(angleInRange)
			radians=limitRadiansTo2PI(radians);
		
		degrees = Math.toDegrees(radians);
		hours = degrees / 15.;

		if (radians > 0.) {
			a.positive = true;
			sha.positive = true;
			h.positive = true;
			tmpdegrees = degrees;
			shadegrees = 360. - degrees;
		} else {
			a.positive = false;
			sha.positive = false;
			h.positive = false;
			tmpdegrees = -degrees;
			shadegrees = -degrees;
		}
		// Angle expressed in degrees, minutes, seconds
		a.degrees = (int) tmpdegrees;
		a.minutes = (int) (Frac(tmpdegrees) * 60.0);
		a.seconds = (tmpdegrees - a.degrees - a.minutes / 60.) * 3600.;

		// Angle expressed as SHA in degrees, minutes, seconds
		// double shadegrees=360.-degrees;
		sha.degrees = (int) shadegrees;
		sha.minutes = (int) (Frac(shadegrees) * 60.0);
		sha.seconds = (shadegrees - sha.degrees - sha.minutes / 60.) * 3600.;

		// Angle expressed as hour angle in hours, minutes, seconds
		double tmphours = tmpdegrees / 15.;
		h.hours = (int) tmphours;
		// System.out.println(decimalhours+ " decimal hours");
		double tmpminutes = 60. * Frac(tmphours);
		// System.out.println(decimalminutes+ " decimal minutes");
		h.minutes = (int) (60. * Frac(tmphours));
		h.seconds = 60. * Frac(tmpminutes);
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
		if (a.positive)
			System.out.print("+");
		else
			System.out.print("-");
		System.out.println(a.degrees + " degrees " + a.minutes + " minutes " + a.seconds + " seconds");
		if (h.positive)
			System.out.print("+");
		else
			System.out.print("-");
		System.out.println(h.hours + " hours " + h.minutes + " minutes " + h.seconds + " seconds");
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
			if (a.positive)
				System.out.print("+");
			else
				System.out.print("-");
			System.out.println(a.degrees + " Degrees " + a.minutes + " Minutes " + a.seconds + " Seconds");
			break;
		case SHA:
			if (sha.positive)
				System.out.print("+");
			else
				System.out.print("-");
			System.out.println(sha.degrees + " Degrees " + sha.minutes + " Minutes " + sha.seconds + " Seconds");
			break;
		case HOURANGLE:
			if (h.positive)
				System.out.print("+");
			else
				System.out.print("-");
			System.out.println(h.hours + " Hours " + h.minutes + " Minutes " + h.seconds + " Seconds");
			break;
		}
	}

}
