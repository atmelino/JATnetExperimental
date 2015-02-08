package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroCoordinate;
import jat.core.coordinates.AstroDateTimeLocation;
import jat.core.coordinates.solarPositioning.SPA;

public class SunPos01 {
	public static void main(String[] args) {
		String s, t;

		Angle longitude = new Angle(-97., Angle.DEGREES);
		Angle latitude = new Angle(30., Angle.DEGREES);
		AstroDateTimeLocation adt = new AstroDateTimeLocation(2003, 3, 1, 0, 0, 0, "UTC", longitude, latitude);
		AstroCoordinate ac = SPA.getSolarPosition(adt, 1830.14, 67., 820., 11.);
		System.out.println(adt.getLocalDateTime() + " observer longitude " + longitude.getArcDegString() + " latitude " + latitude.getArcDegString());

		s = String.format("%-30s%-16s%-18s", "", "JAT", "Astronomical Almanac");
		System.out.println(s);
		t = String.format("%-30s%-16.2f%-18s", "Julian Date", adt.getJD(), "2452699.5");
		System.out.println(t);
		t = String.format("%-30s%-16s%-18s", "ecliptic longitude", ac.eclipticCoord.lambda.getArcDegString(), "339 59'22.16''");
		System.out.println(t);
		t = String.format("%-30s%-16s%-18s", "ecliptic latitude", ac.eclipticCoord.beta.getArcDegString(), "-0 0'0.28''");
		System.out.println(t);
		t = String.format("%-30s%-16s%-18s", "Equatorial Right Ascension", ac.equatorialCoord.RA.getHAString(), "22h 46m 03.67s");
		System.out.println(t);
		t = String.format("%-30s%-16s%-18s", "Equatorial Declination", ac.equatorialCoord.dec.getArcDegString(), "-7 49' 37.8''");
		System.out.println(t);
		t = String.format("%-30s%-16s%-18s", "horizontal coord azimuth", ac.horizontalCoord.azimuth.getArcDegString(), "n/a");
		System.out.println(t);
		t = String.format("%-30s%-16s%-18s", "horizontal coord altitude", ac.horizontalCoord.altitude.getArcDegString(), "n/a");
		System.out.println(t);

	}

}
