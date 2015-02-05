package jat.examples.coordinates;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import jat.core.coordinates.*;

public class PractAstrTest46 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 46 sun position");
		System.out.println("Find Right Ascension and Declination of sun on July 27 1980");

		AstroCoordinate ac = new AstroCoordinate();
		DateTime epoch = new DateTime(1990, 1, 1, 0, 0, DateTimeZone.forID("UTC"));
		DateTime currentDateTime = new DateTime(1980, 7, 27, 0, 0);
		// DateTime dt = new DateTime(2004, 7, 27, 0, 0);
		ac.sunPositionDS(epoch, currentDateTime);
		//ac.eclipticCoord.println();
		ac.eclipticToEquatorial(currentDateTime);
		//ac.equatorialCoord.println();
		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "lambda", "124.114347",ac.eclipticCoord.lambda.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12.6f", "beta", "0",ac.eclipticCoord.beta.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "RA", "8h 25m 46s",ac.equatorialCoord.RA.getHAString());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "dec", "19 13' 48''",ac.equatorialCoord.dec.getArcDegString());
		System.out.println(t);
	}
}
