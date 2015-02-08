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

		Angle longitude = new Angle(-97.733333, Angle.DEGREES);
		Angle latitude = new Angle(30,17,0, Angle.ARCDEGREES);
		adt = new AstroDateTimeLocation(2003, 3, 1, 0, 0, 0, "CST6CDT", longitude, latitude);

		System.out.println(adt.getLocalDateTime() + " observer longitude " + longitude.getDegrees() + " latitude "
				+ latitude.getArcDegString());

		s = String.format("%-12s%-14s%-14s%-14s%-14s%-14s%-14s", "JD", "lambda", "beta", "RA", "dec", "az", "alt");
		System.out.println(s);

		for (int i = 0; i < 24; i++) {
			ac = SPA.getSolarPosition(adt, 1830.14, 67., 820., 11.);
			adt.advanceJD(1 / 24.);
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
