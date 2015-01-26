package jat.examples.coordinates;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import jat.core.coordinates.*;


public class PractAstrTest46 {

	public static void main(final String[] args) {

		System.out.println("Practical Astronomy sun position");

		ReferenceFrame rf = new ReferenceFrame();
		DateTime epoch = new DateTime(1990, 1, 1, 0, 0, DateTimeZone.forID("UTC"));
		DateTime currentDateTime = new DateTime(1980, 7, 27, 0, 0);
		//DateTime dt = new DateTime(2004, 7, 27, 0, 0);
		rf.sunPosition(epoch, currentDateTime);

	}
}
