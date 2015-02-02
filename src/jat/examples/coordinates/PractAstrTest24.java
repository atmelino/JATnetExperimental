package jat.examples.coordinates;

import jat.core.coordinates.Angle;
import jat.core.coordinates.AstroDateTime;
import jat.core.coordinates.AstroUtil;

public class PractAstrTest24 {

	public static void main(final String[] args) {
		String s, t;

		System.out.println("Practical Astronomy 24 RA to HA and HA to RA");

		Angle longitude = new Angle(-64, Angle.DEGREES);
		Angle RA = new Angle(18, 32, 21, Angle.HOURANGLE);
		AstroDateTime adt = new AstroDateTime(1980, 4, 22, 14, 36, 52, "UTC", longitude);
		Angle HA=AstroUtil.rightAscensionToHourAngle(adt, RA);

		adt.getLST().println("LST", Angle.DECIMALHOURS);
		RA.println("RA", Angle.DECIMALHOURS);		
		HA.println("HA", Angle.DECIMALHOURS);
		
		s = String.format("%-28s%-12s%-12s", "Hour Angle for Long -64:", "Expected", "JAT");
		System.out.println(s);
		t = String.format("%-28s%-12s%-12s", "4/22/1980 14:36:52 UTC", "5h51m44s", HA.getHAString());
		System.out.println(t);

	}
}
