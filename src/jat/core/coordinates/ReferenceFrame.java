package jat.core.coordinates;

import org.joda.time.DateTime;
import org.joda.time.DateTimeUtils;
import org.joda.time.DateTimeZone;
import org.joda.time.Days;

/**
 * @author Tobias Berthold
 * 
 *         equatorial coordinates: you can get the hour angle if you have the
 *         latitude of the observer. you also need the Local Sidereal Time LST
 *         if you want the Right Ascension.
 * 
 */
public class ReferenceFrame {

	public double latDeg;

	DateTime currentDateTime;

	// azimuth, altitude
	public HorizontalCoord horizontalCoord;

	// right ascension, declination
	public EquatorialCoord equatorialCoord;

	// ecliptic longitude lambda, ecliptic latitude beta
	public EclipticCoord eclipticCoord;

	String s, t;

	public void horizonToEquatorial() {
		// System.out.println("horizonToEquatorial");

		double azRad = horizontalCoord.azimuth.getRadians();
		double altRad = horizontalCoord.altitude.getRadians();
		double latRad = Math.toRadians(latDeg);

		double sinAlt = Math.sin(altRad);
		double cosAlt = Math.cos(altRad);
		double sinLat = Math.sin(latRad);
		double cosLat = Math.cos(latRad);
		double sinAz = Math.sin(azRad);
		double cosAz = Math.cos(azRad);

		double decRad = Math.asin(sinAlt * sinLat + cosAlt * cosLat * cosAz);
		double HAprimeRad = Math.acos((sinAlt - sinLat * Math.sin(decRad)) / (cosLat * Math.cos(decRad)));

		double HARad;

		// System.out.println(sinAz);
		if (sinAz < 0)
			HARad = HAprimeRad;
		else
			HARad = 2 * Math.PI - HAprimeRad;

		Angle HA = new Angle(HARad, Angle.RADIANS);
		Angle dec = new Angle(decRad, Angle.RADIANS);
		equatorialCoord = new EquatorialCoord(HA, null, dec);

	}

	public void horizonToEquatorial(double LST) {
		horizonToEquatorial();

		double RARad;
		// equatorialCoord.HA.println("HA");
		double temp = LST - equatorialCoord.HA.getHours();

		if (temp < 0)
			RARad = temp + 24;
		else
			RARad = temp;
		Angle RA = new Angle(RARad, Angle.DECIMALHOURS);
		Angle dec = equatorialCoord.dec;
		equatorialCoord = new EquatorialCoord(null, RA, dec);

	}

	public void equatorialToHorizon() {
		double HARAd = equatorialCoord.HA.getRadians();
		double decRad = equatorialCoord.dec.getRadians();
		double latRad = Math.toRadians(latDeg);

		double sinDec = Math.sin(decRad);
		double cosDec = Math.cos(decRad);
		double sinPhi = Math.sin(latRad);
		double cosPhi = Math.cos(latRad);
		double sinHA = Math.sin(HARAd);
		double cosHA = Math.cos(HARAd);

		double sinAltRad = sinDec * sinPhi + cosDec * cosPhi * cosHA;
		// System.out.println(sinAltRad);
		double altRad = Math.asin(sinAltRad);
		// System.out.println(Math.toDegrees(altRad));

		double tanAzy = -cosDec * cosPhi * sinHA;
		double tanAzx = sinDec - sinPhi * sinAltRad;

		double azRad = Math.atan2(tanAzy, tanAzx);
		if (azRad < 0)
			azRad += 2 * Math.PI;
		// System.out.println(Math.toDegrees(azRad));

		Angle az = new Angle(azRad, Angle.RADIANS);
		Angle alt = new Angle(altRad, Angle.RADIANS);
		horizontalCoord = new HorizontalCoord(az, alt);

	}

	public void equatorialToHorizon(double LST) {
		// equatorialCoord.HA.radians=equatorialCoord.RA.
		Angle tmpLST = new Angle(LST,Angle.DECIMALHOURS);
		Angle tmp = equatorialCoord.RA.subtract(tmpLST);

		tmp.println();
	}

	public void eclipticToEquatorial(DateTime currentDateTime) {
		System.out.println("eclipticToEquatorial");

		this.currentDateTime = currentDateTime;
		long millis = currentDateTime.getMillis();
		double JD_cur = DateTimeUtils.toJulianDay(millis);
		// System.out.println("JD " + JD_cur);

		DateTime epochDateTime = new DateTime(2000, 1, 1, 12, 0, DateTimeZone.forID("UTC"));
		millis = epochDateTime.getMillis();
		double JD_epoch = DateTimeUtils.toJulianDay(millis);
		// System.out.println("JD epoch " + JD_epoch);

		// number of centuries since epoch
		// double daysDiff=JD_cur - JD_epoch;
		// System.out.println("daysDiff " + daysDiff);
		double T = (JD_cur - JD_epoch) / 36525;
		// System.out.println("T " + T);
		double eps = 23. + (26 + 21.45 / 60.) / 60. + T * (-46.815 + T * (-0.0006 + T * 0.00181)) / 3600.;
		double epsRad = Math.toRadians(eps);
		// System.out.println("eps " + eps);

		Angle lambda = eclipticCoord.lambda;
		Angle beta = eclipticCoord.beta;

		// lambda.println();
		// System.out.println("lambda " + lambda.degrees);
		// beta.println();
		// System.out.println("beta " + beta.degrees);

		double cosEps = Math.cos(epsRad);
		double sinEps = Math.sin(epsRad);
		double sinLambda = Math.sin(lambda.getRadians());
		double cosLambda = Math.cos(lambda.getRadians());
		double sinBeta = Math.sin(beta.getRadians());
		double cosBeta = Math.cos(beta.getRadians());
		double tanBeta = Math.tan(beta.getRadians());

		double termDec = sinBeta * cosEps + cosBeta * sinEps * sinLambda;
		// System.out.println("termDec " + termDec);
		double decRad = Math.asin(termDec);

		double termRAy = (sinLambda * cosEps - tanBeta * sinEps);
		double termRAx = cosLambda;
		// System.out.println("termRAy " + termRAy);
		// System.out.println("termRAx " + termRAx);
		double RARad = Math.atan2(termRAy, termRAx);
		// double RARad = Math.atan(termRAy / termRAx);
		// System.out.println("RARad " + RARad);
		Angle RA = new Angle(RARad, Angle.RADIANS);
		Angle dec = new Angle(decRad, Angle.RADIANS);
		equatorialCoord = new EquatorialCoord(null, RA, dec);

	}

	public void sunPosition(DateTime epoch, DateTime currentDateTime) {
		System.out.println("sunPosition");

		this.currentDateTime = currentDateTime;

		Days days = Days.daysBetween(epoch, currentDateTime);

		System.out.println("Days Since Epoch: " + days.getDays());

		double N0 = 360 / 365.242191 * days.getDays();
		// System.out.println("N: " + N0);

		double N1 = N0 % 360;
		double N;

		if (N1 < 0)
			N = N1 + 360;
		else
			N = N1;
		// for (int i = 0; i < 11; i++)
		// System.out.println("N in range: " + (N + i * 360));
		System.out.println("N: " + N % 360);

		// mean anomaly
		double M0 = N + Constants.eps_g_1990 - Constants.omega_g_1990;
		double M;
		if (M0 < 0)
			M = M0 + 360;
		else
			M = M0;
		System.out.println("M: " + M);
		double MRad = org.apache.commons.math3.util.FastMath.toRadians(M);

		// true anomaly
		double E_c = (360 / Math.PI) * Constants.e_earth * Math.sin(MRad);
		System.out.println("E_c: " + E_c);

		// Sun's geocentric ecliptic longitude
		double lambda0 = N + E_c + Constants.eps_g_1990;
		// System.out.println("lambda: " + lambda0);

		double lambda = lambda0 % 360;
		System.out.println("lambda: " + lambda);

		// eclipticCoord = new S2Point(lambda, 0);
		eclipticCoord = new EclipticCoord(new Angle(lambda, Angle.DEGREES), new Angle(0, Angle.DEGREES));

	}

}
