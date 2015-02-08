package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroCoordinate;
import jat.core.coordinates.AstroDateTimeLocation;
import jat.core.coordinates.solarPositioning.SPA;

public class SunPosLoop {
	public static void main(String[] args) {
		String s;
		AstroDateTimeLocation adt;
		AstroCoordinate ac;

		Angle longitude = new Angle(-97., Angle.DEGREES);
		Angle latitude = new Angle(30., Angle.DEGREES);
		adt = new AstroDateTimeLocation(2003, 3, 1, 0, 0, 0, "CST6CDT", longitude, latitude);
		ac = SPA.getSolarPosition(adt, 1830.14, 67., 820., 11.);
		System.out.println(adt.getLocalDateTime() + " observer longitude " + longitude.getArcDegString() + " latitude "
				+ latitude.getArcDegString());

		s = String.format("%-12s%-14s%-14s%-14s%-14s%-14s%-14s", "JD", "lambda", "beta", "RA", "dec", "az", "alt");
		System.out.println(s);

		// for (double increment = 0; increment < 1.; increment += (1/24.0)) {
		for (int i = 0; i < 24; i++) {
			adt.advanceJD(1 / 24.);
			ac = SPA.getSolarPosition(adt, 1830.14, 67., 820., 11.);
			printTable(adt, ac);
		}

	}

	private static void printTable(AstroDateTimeLocation adt, AstroCoordinate ac) {
		String t;

		String tf = "%-12.2f%-14s%-14s%-14s%-14s%-14s%-14s";

		t = String.format(tf, adt.getJD(), ac.eclipticCoord.lambda.getArcDegString(),
				ac.eclipticCoord.beta.getArcDegString(), ac.equatorialCoord.RA.getHAString(),
				ac.equatorialCoord.dec.getArcDegString(), ac.horizontalCoord.azimuth.getArcDegString(),
				ac.horizontalCoord.altitude.getArcDegString());
		System.out.println(t);
	}

}
