package jat.examples.coordinates;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import jat.core.coordinates.*;

public class PractAstrTest27 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 27 ecliptic to equatorial coordinates conversion");
		System.out.println("Convert ecliptic longitude 139 41'10'' and ecliptic latitude 4 52'31'' to Right ascension and Declination");

		DateTime currentDateTime = new DateTime(1979, 12, 31, 0, 0, DateTimeZone.forID("UTC"));
		AstroCoordinate ac = new AstroCoordinate();
		Angle lambda = new Angle( 139, 41, 10, Angle.ARCDEGREES);
		Angle beta = new Angle( 4, 52, 31, Angle.ARCDEGREES);
		ac.eclipticCoord = new EclipticCoord(lambda, beta);
		ac.eclipticCoord.println();
		ac.eclipticToEquatorial(currentDateTime);
		ac.equatorialCoord.println();

		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "RA", "9.581551", ac.equatorialCoord.RA.getHours());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "RA", "9 34'53.6''", ac.equatorialCoord.RA.getHAString());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12.6f", "dec", "19.537268", ac.equatorialCoord.dec.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "dec", "19 32'14.2''", ac.equatorialCoord.dec.getArcDegString());
		System.out.println(t);

	
	
	}
	
	public void run() {

		PractAstrTest27 p = new PractAstrTest27();
		p.run();
	}

	
}
