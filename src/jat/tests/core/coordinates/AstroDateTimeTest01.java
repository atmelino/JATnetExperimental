package jat.tests.core.coordinates;

import jat.core.coordinates.AstroDateTime;

public class AstroDateTimeTest01 {

	public static void main(final String[] args) {
		AstroDateTime adt;
		double JD;
		String s, t;

		System.out.println("AstroDateTimeTest01");

		//adt=new AstroDateTime(1985, 2, 17, 6, 0, 0, "CST6CDT");
		adt=new AstroDateTime(1985, 2, 17, 6, 0, 0, "EST");
		JD = adt.getJD();

		s = String.format("%-32s%-25s%-25s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-32s%-25.2f%-25.2f", "2/17/1985 06:00:00 CST -> JD", 2446113.96, JD);
		System.out.println(t);
		//System.out.println(adt.getUTCDateTime());
		t = String.format("%-32s%-25s%-25s", "2/17/1985 06:00:00 CST -> UTC", "2/17/1985 11:00:00 UTC", adt.getUTCDateTime());
		System.out.println(t);

	}

}
