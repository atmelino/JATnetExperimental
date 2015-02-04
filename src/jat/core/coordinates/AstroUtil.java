package jat.core.coordinates;

import static java.lang.Math.floor;

public class AstroUtil {

	public static double limitDegreesTo360(double degrees) {
		double dividedDegrees = degrees / 360.0;
		double limited = 360.0 * (dividedDegrees - floor(dividedDegrees));
		return (limited < 0) ? limited + 360.0 : limited;
	}

	public static double limitRadiansTo2PI(double radians) {
		double dividedradians = radians / (2 * Math.PI);
		double limited = 2 * Math.PI * (dividedradians - floor(dividedradians));
		return (limited < 0) ? limited + 2 * Math.PI : limited;
	}
	
	public static double limitHoursTo24(double hours) {
		double dividedhours = hours / (24.);
		double limited = 24. * (dividedhours - floor(dividedhours));
		return (limited < 0) ? limited + 24. : limited;
	}

	
	public static double Frac(double x) {
		return x - Math.floor(x);
	}

	public static Angle rightAscensionToHourAngle(AstroDateTimeLocation LST, Angle RA)
	{
		Angle HA=LST.getLST().subtract(RA);
		return HA;		
	}

	public static Angle hourAngleToRightAscension(AstroDateTimeLocation LST, Angle HA)
	{
		Angle RA=LST.getLST().subtract(HA);
		return RA;		
	}
	
	
}
