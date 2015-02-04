package jat.examples.coordinates;

import jat.core.coordinates.*;

public class PractAstrTest25 {

	public void run() {
		String s, t;

		System.out.println("Practical Astronomy 25 equatorial to horizon coordinates conversion");
		System.out.println("Convert hour angle 5h 51m 44s and declination 23 13' 10'' at latitude 52 to azimuth and altitude");

		AstroCoordinate ac = new AstroCoordinate();

		Angle HA = new Angle(5, 51, 44, Angle.HOURANGLE);
		Angle dec = new Angle(23, 13, 10, Angle.ARCDEGREES);
		ac.equatorialCoord = new EquatorialCoord(HA, null, dec);
		Angle latitude= new Angle(52.,Angle.DEGREES);
		AstroDateTimeLocation adt=new AstroDateTimeLocation(null, latitude);
		ac.equatorialToHorizonDS(adt);
		s = String.format("%-8s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-8s%-12s%-12.6f", "Az", "283.271027", ac.horizontalCoord.azimuth.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "Az", "283 16'16''", ac.horizontalCoord.azimuth.getArcDegString());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12.6f", "Alt", "19.334345", ac.horizontalCoord.altitude.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "Alt", "19 20'04''", ac.horizontalCoord.altitude.getArcDegString());
		System.out.println(t);

		System.out.println();
		System.out.println("Azimuth and altitude for latitude 52 deg and longitude 64 West:");
		System.out.println("Convert right ascension 18h 32m 21s and declination 23 13' 10'' at longitude 64 West and latitude 52 to azimuth and altitude");

		Angle longitude = new Angle(-64, Angle.DEGREES);
		Angle RA = new Angle(18, 32, 21, Angle.HOURANGLE);
		AstroDateTimeLocation adt2 = new AstroDateTimeLocation(1980, 4, 22, 14, 36, 52, "UTC", longitude,latitude);
		ac.equatorialCoord = new EquatorialCoord(null, RA, dec);
		ac.equatorialToHorizonDS(adt2);
		t = String.format("%-8s%-12s%-12.6f", "Az", "283.271027", ac.horizontalCoord.azimuth.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "Az", "283 16'16''", ac.horizontalCoord.azimuth.getArcDegString());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12.6f", "Alt", "19.334345", ac.horizontalCoord.altitude.getDegrees());
		System.out.println(t);
		t = String.format("%-8s%-12s%-12s", "Alt", "19 20'04''", ac.horizontalCoord.altitude.getArcDegString());
		System.out.println(t);

	}

	public static void main(final String[] args) {

		PractAstrTest25 p = new PractAstrTest25();
		p.run();
	}

}
