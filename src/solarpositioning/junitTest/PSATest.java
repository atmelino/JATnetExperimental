package solarpositioning.junitTest;

import static org.junit.Assert.assertEquals;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.SimpleTimeZone;

import org.junit.Test;

import solarpositioning.AzimuthZenithAngle;
import solarpositioning.PSA;

public class PSATest {
	private static final double TOLERANCE = 0.1;

	@Test
	public void testSpaExample() {
		GregorianCalendar time = new GregorianCalendar(new SimpleTimeZone(-7 * 60 * 60 * 1000, "LST"));
		time.set(2003, Calendar.OCTOBER, 17, 12, 30, 30); // 17 October 2003, 12:30:30 LST-07:00

		AzimuthZenithAngle result = PSA.calculateSolarPosition(time, 39.742476, -105.1786);

		assertEquals(194.34024, result.getAzimuth(), TOLERANCE); // reference values from SPA
		assertEquals(50.11162, result.getZenithAngle(), TOLERANCE);
	}
}
