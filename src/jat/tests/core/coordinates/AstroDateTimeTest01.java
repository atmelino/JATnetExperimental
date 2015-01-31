package jat.tests.core.coordinates;

import jat.core.coordinates.AstroDateTime;

public class AstroDateTimeTest01 {

	public static void main(final String[] args) {
		AstroDateTime adt;
		double JD_CST;
		String s, t;

		System.out.println("AstroDateTimeTest01");

		adt=new AstroDateTime(1985, 2, 17, 6, 0, 0, "CST6CDT");
		JD_CST = adt.getJD();

		s = String.format("%-30s%-12s%-12s", "", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-30s%-12.2f%-12.2f", "2/17/1985 06:00:00 CST -> JD", 2446114.00, JD_CST);
		System.out.println(t);
		System.out.println(adt.getUTCDateTime());

	}

}
