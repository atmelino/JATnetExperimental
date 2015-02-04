package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroDateTimeLocation;

public class PractAstrTest13 {

	public void run() {
		String s, t;

		System.out.println("Practical Astronomy 13 GST to UT");
		System.out.println("GST= 4h 40m 5.23s on 4/22/1980");

		AstroDateTimeLocation adt = new AstroDateTimeLocation(1980,4,22,new Angle(4,40,5.230,Angle.HOURANGLE));
		s = String.format("%-14s%-16s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-14s%-16.6f%-12s", "UTC", 14.614353, adt.getUTCDateTime().getMillisOfDay()/3600000.);
		System.out.println(t);
		t = String.format("%-14s%-16s%-12s", "UTC", "14h 36m 51.67s", adt.getUTCDateTime());
		System.out.println(t);
	}
	
	public static void main(final String[] args) {

		PractAstrTest13 p=new PractAstrTest13();
		p.run();
	}
}
