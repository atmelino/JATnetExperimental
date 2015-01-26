package jat.examples.coordinates;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import jat.core.coordinates.*;

public class PractAstrTest27 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy 27 ecliptic to equatorial coordinates conversion");

		DateTime currentDateTime = new DateTime(1979, 12, 31, 0, 0, DateTimeZone.forID("UTC"));
		ReferenceFrame rf = new ReferenceFrame();
		Angle lambda = new Angle(true, 139, 41, 10, Angle.ARCDEGREES);
		Angle beta = new Angle(true, 4, 52, 31, Angle.ARCDEGREES);
		rf.eclipticCoord = new EclipticCoord(lambda, beta);
		rf.eclipticCoord.println();
		rf.eclipticToEquatorial(currentDateTime);
		rf.equatorialCoord.println();
	}
}
