package jat.tests.core.coordinates;

import jat.core.coordinates.Angle;

public class AngleTest01 {

	public static void main(final String[] args) {

		System.out.println("Angle class test");

		// Angle alpha = new Angle(1.5, Angle.RADIANS);
		Angle alpha = new Angle(59.51, Angle.DEGREES);
		printTable(alpha, 1.038645438,59.51 , "59 30 36", 3.967333333 ,"03:58:02");
		// alpha.println();

		
		Angle negAngle = new Angle(-1.34, Angle.RADIANS);
		printTable(negAngle, -1.34,-76.776 , "283 13 26", -5.1184 ,"18:52:54");
		// outOfRange.println();

		
		
		//System.out.println(1002.23 + " arcseconds ");
		Angle beta = new Angle(0, 0, 1002.23, Angle.ARCDEGREES);
		// Angle beta = new Angle(0,16,42.23, Angle.ARCDEGREES);
		// Angle beta = new Angle(0,0,20.04, Angle.ARCDEGREES);
		// beta.println();

		// Example from Duffett-Smith
		//System.out.println(18.52417 + " decimal hours");
		Angle gamma = new Angle(18.52417, Angle.DECIMALHOURS);
		// gamma.println();

		//System.out.println("18 h 31 m 27.012 s");
		Angle delta = new Angle(18, 31, 27.012, Angle.HOURANGLE);
		// delta.println();

		// /System.out.println("");
		Angle n_1960 = new Angle(0, 0, 1.33612, Angle.HOURANGLE);
		// n_1960.println();

		Angle a1 = new Angle(40., Angle.DEGREES);
		Angle a2 = new Angle(45., Angle.DEGREES);
		// a1.add(a2).println();

		Angle outOfRange = new Angle(-1.34, Angle.RADIANS);
		// outOfRange.println();
	}
	
	public static void printTable(Angle alpha, double eRad, double eDeg, String eArcDeg, double eHours ,String eHA)
	{
		String s, t;

		s = String.format("%-12s%-10s%-10s", "", "Expected", "Actual");
		System.out.println(s);
		t = String.format("%-12s%-10.7s%-10.7s", "Radians", eRad, alpha.getRadians());
		System.out.println(t);
		t = String.format("%-12s%-10.7s%-10.7s", "Degrees", eDeg, alpha.getDegrees());
		System.out.println(t);
		t = String.format("%-12s%-10s%-10s", "Arc Degrees", eArcDeg, alpha.getArcDegString());
		System.out.println(t);
		t = String.format("%-12s%-10.7s%-10.7s", "Hours", eHours, alpha.getHours());
		System.out.println(t);
		t = String.format("%-12s%-10s%-10s", "Hour Angle", eHA, alpha.getHAString());
		System.out.println(t);
		
	}
	
	
}
