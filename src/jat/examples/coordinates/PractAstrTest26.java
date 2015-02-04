package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PractAstrTest26 {

	public void run() {
		Angle latitude = new Angle(52., Angle.DEGREES);
		String s, t;

		System.out.println("Practical Astronomy 26 horizon to equatorial coordinates conversion");
		System.out
				.println("Convert azimuth 283 16'16'' and altitude 19 20'04'' at latitude 52 to hour angle and declination");

		AstroCoordinate ac = new AstroCoordinate();
		Angle Az = new Angle(283, 16, 16, Angle.ARCDEGREES);
		Angle Alt = new Angle(19, 20, 4, Angle.ARCDEGREES);
		ac.horizontalCoord = new HorizontalCoord(Az, Alt);
		AstroDateTimeLocation adt = new AstroDateTimeLocation(null, latitude);
		ac.horizonToEquatorial(adt);
		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "HA", "5.862222", ac.equatorialCoord.HA.getHours());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "HA", "5h 51m 44s", ac.equatorialCoord.HA.getHAString());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12.6f", "dec", "23.219571", ac.equatorialCoord.dec.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "dec", "23 13'10''", ac.equatorialCoord.dec.getArcDegString());
		System.out.println(t);

		System.out.println("Same as above, but compute RA for longitude 0 and GST= 0h 24m 05s:");
		Angle longitude = new Angle(0., Angle.DEGREES);
		Angle GST = new Angle(0, 24, 5., Angle.HOURANGLE);
		AstroDateTimeLocation adt2 = new AstroDateTimeLocation(1980, 4, 22, GST, longitude, latitude);
		ac.horizonToEquatorial(adt2);
		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "LST", "0.401389", adt2.getLST().getHours());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12.6f", "RA", "18.539167", ac.equatorialCoord.RA.getHours());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "RA", "18h 32m 21s", ac.equatorialCoord.RA.getHAString());
		System.out.println(t);

	}

	public static void main(final String[] args) {

		PractAstrTest26 p = new PractAstrTest26();
		p.run();
	}

}
