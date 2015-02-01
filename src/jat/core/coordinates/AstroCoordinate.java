package jat.core.coordinates;

import static java.lang.Math.floor;

import org.joda.time.DateTime;
import org.joda.time.DateTimeUtils;
import org.joda.time.DateTimeZone;
import org.joda.time.Days;

/**
 * Coordinates typically used in Astronomy: <br>
 * Ecliptic coordinates: ecliptic longitude lambda, ecliptic latitude beta<br>
 * Equatorial coordinates: right ascension or hour angle, declination<br>
 * Horizontal coordinates: azimuth, altitude<br>
 * and conversions<br>
 * equatorial coordinates: you can get the hour angle if you have the latitude
 * of the observer. you also need the Local Sidereal Time LST if you want the
 * Right Ascension.
 * 
 * @author Tobias Berthold
 * 
 * 
 */
public class AstroCoordinate {

	private double latDeg;

	// azimuth, altitude
	public HorizontalCoord horizontalCoord;

	// right ascension, declination
	public EquatorialCoord equatorialCoord;

	// ecliptic longitude lambda, ecliptic latitude beta
	public EclipticCoord eclipticCoord;

	String s, t;

	public void equatorialToHorizon(int year, int month, int day, int hour, int minute, int second, double longitude, double latitude) {
		this.latDeg = latitude;
		double haDeg, haRad;
		double decRad;
		double latRad;
		double RADeg = equatorialCoord.RA.getDegrees();
		double decDeg = equatorialCoord.dec.getDegrees();

		// Hour angle
		// t = String.format("%-5d%-4d%-4d%-4d%-4d%-4d", year, month, day, hour,
		// minute, second);
		// System.out.println(t);
		haDeg = MST(year, month, day, hour, minute, second, longitude) - RADeg;

		haDeg = AstroUtil.limitDegreesTo360(haDeg);

		haRad = Math.toRadians(haDeg);
		decRad = Math.toRadians(decDeg);
		latRad = Math.toRadians(latDeg);

		double sin_alt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
		double altRad = Math.asin(sin_alt);

		double cos_azm = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (Math.cos(altRad) * Math.cos(latRad));
		double azRad = Math.acos(cos_azm);

		double altDeg = Math.toDegrees(altRad);
		double azDeg = Math.toDegrees(azRad);

		// hemisphere
		if (Math.sin(haRad) > 0.0)
			azDeg = 360.0 - azDeg;

		Angle az = new Angle(azDeg, Angle.DEGREES);
		Angle alt = new Angle(altDeg, Angle.DEGREES);
		horizontalCoord = new HorizontalCoord(az, alt);

	}

	public double MST(int year, int month, int day, int hour, int minute, int second, double longitude) {

		if (month <= 2) {
			year -= 1;
			month += 12;
		}

		double a = Math.floor(year / 100);
		double b = 2 - a + Math.floor(a / 4);
		double c = Math.floor(365.25 * year);
		double d = Math.floor(30.6001 * (month + 1));

		// Days since J2000.0
		double jd = b + c + d - 730550.5 + day + (hour + (minute / 60.0) + (second / 3600.0)) / 24.0;
		// System.out.println("julianday" + 2451545.0 + jd);

		// Julian centuries rel. to J2000.0
		double jt = jd / 36525.0;
		double jt2 = jt * jt;
		double jt3 = jt2 * jt;

		// Mean sideral time
		double Ds = Math.toRadians(297.85036 + 445267.11148 * jt - 0.0019142 * jt2 + jt3 / 189474);
		double Ms = Math.toRadians(357.52772 + 35999.05034 * jt - 0.0001603 * jt2 - jt3 / 300000);
		double M1s = Math.toRadians(134.96298 + 477198.867398 * jt + 0.0086972 * jt2 + jt3 / 56250);
		double DFs = Math.toRadians(93.27191 + 483202.017538 * jt - 0.0036825 * jt2 + jt3 / 327270);
		double OMs = Math.toRadians(125.04452 - 1934.136261 * jt + 0.0020708 * jt2 + jt3 / 450000);

		double deltaPsi = -(171996 + 174.2 * jt) * Math.sin(OMs) - (13187 + 1.6 * jt) * Math.sin(-2 * Ds + 2 * DFs + 2 * OMs) - (2274 + 0.2 * jt) * Math.sin(2 * DFs + 2 * OMs) + (2062 + 0.2 * jt)
				* Math.sin(2 * OMs) + (1426 - 3.4 * jt) * Math.sin(Ms) + (712 + 0.1 * jt) * Math.sin(M1s);
		deltaPsi += (-517 + 1.2 * jt) * Math.sin(-2 * Ds + Ms + 2 * DFs + 2 * OMs) - (386 + 0.4 * jt) * Math.sin(2 * DFs + OMs) - 301 * Math.sin(M1s + 2 * DFs + 2 * OMs) + (217 - 0.5 * jt)
				* Math.sin(-2 * Ds - Ms + 2 * DFs + 2 * OMs) - 158 * Math.sin(-2 * Ds + M1s);
		deltaPsi += (129 + 0.1 * jt) * Math.sin(-2 * Ds + 2 * DFs + OMs) + 123 * Math.sin(-M1s + 2 * DFs + 2 * OMs) + 63 * Math.sin(2 * Ds) + (63 + 0.1 * jt) * Math.sin(M1s + OMs) - 59
				* Math.sin(2 * Ds - M1s + 2 * DFs + 2 * OMs) - (58 + 0.1 * jt) * Math.sin(-M1s + OMs);
		deltaPsi -= 51 * Math.sin(M1s + 2 * DFs + OMs);
		deltaPsi += 48 * Math.sin(-2 * Ds + 2 * M1s) + 46 * Math.sin(-2 * M1s + 2 * DFs + OMs) - 38 * Math.sin(2 * Ds + 2 * DFs + 2 * OMs) - 31 * Math.sin(2 * M1s + 2 * DFs + 2 * OMs) + 29
				* Math.sin(2 * M1s) + 29 * Math.sin(-2 * Ds + M1s + 2 * DFs + 2 * OMs) + 26 * Math.sin(2 * DFs);
		deltaPsi -= 22 * Math.sin(2 * DFs - 2 * Ds) + 21 * Math.sin(2 * DFs - M1s) + (17 - 0.1 * jt) * Math.sin(2 * Ms) + 16 * Math.sin(2 * Ds - M1s + OMs) - (16 - 0.1 * jt)
				* Math.sin(2 * (OMs + DFs + Ms - Ds)) - 15 * Math.sin(Ms + OMs) - 13 * Math.sin(OMs + M1s - 2 * Ds) - 12 * Math.sin(OMs - Ms);
		deltaPsi += 11 * Math.sin(2 * (M1s - DFs)) - 10 * Math.sin(2 * Ds - M1s + 2 * DFs) - 8 * Math.sin(2 * Ds + M1s + 2 * DFs + 2 * OMs) + 7 * Math.sin(Ms + 2 * DFs + 2 * OMs) - 7
				* Math.sin(Ms + M1s - 2 * Ds) - 7 * Math.sin(2 * DFs + 2 * OMs - Ms) - 7 * Math.sin(2 * Ds + 2 * DFs + OMs);
		deltaPsi += 6 * Math.sin(2 * Ds + M1s);
		deltaPsi += 6 * Math.sin(2 * (OMs + DFs + M1s - Ds)) + 6 * Math.sin(OMs + 2 * DFs + M1s - 2 * Ds) - 6 * Math.sin(2 * Ds - 2 * M1s + OMs) - 6 * Math.sin(2 * Ds + OMs) + 5 * Math.sin(M1s - Ms)
				- 5 * Math.sin(OMs + 2 * DFs - Ms - 2 * Ds) - 5 * Math.sin(OMs - 2 * Ds) - 5 * Math.sin(OMs + 2 * DFs + 2 * M1s);
		deltaPsi += 4 * Math.sin(OMs - 2 * M1s - 2 * Ds) + 4 * Math.sin(OMs + 2 * DFs + Ms - 2 * Ds) + 4 * Math.sin(M1s - 2 * DFs) - 4 * Math.sin(M1s - Ds) - 4 * Math.sin(Ms - 2 * Ds) - 4
				* Math.sin(Ds) + 3 * Math.sin(2 * DFs + M1s) - 3 * Math.sin(2 * (OMs + DFs - M1s)) - 3 * Math.sin(M1s - Ms - Ds);
		deltaPsi -= 3 * Math.sin(M1s + Ms);
		deltaPsi -= 3 * Math.sin(2 * OMs + 2 * DFs + M1s - Ms) - 3 * Math.sin(2 * OMs + 2 * DFs - M1s - Ms + 2 * Ds) - 3 * Math.sin(2 * OMs + 2 * DFs + 3 * M1s) - 3
				* Math.sin(2 * OMs + 2 * DFs - Ms + 2 * Ds);
		deltaPsi *= 0.0001 / 3600;

		double deltaEps = (92025 + 8.9 * jt) * Math.cos(OMs) + (5736 - 3.1 * jt) * Math.cos(-2 * Ds + 2 * DFs + 2 * OMs) + (977 - 0.5 * jt) * Math.cos(2 * DFs + 2 * OMs) + (-895 + 0.5 * jt)
				* Math.cos(2 * OMs) + (54 - 0.1 * jt) * Math.cos(Ms) - 7 * Math.cos(M1s);
		deltaEps += (224 - 0.6 * jt) * Math.cos(-2 * Ds + Ms + 2 * DFs + 2 * OMs) + 200 * Math.cos(2 * DFs + OMs) + (129 - 0.1 * jt) * Math.cos(M1s + 2 * DFs + 2 * OMs) + (-95 + 0.3 * jt)
				* Math.cos(-2 * Ds - Ms + 2 * DFs + 2 * OMs) - 70 * Math.cos(-2 * Ds + 2 * DFs + OMs);
		deltaEps -= 53 * Math.cos(-M1s + 2 * DFs + 2 * OMs) - 33 * Math.cos(M1s + OMs) + 26 * Math.cos(2 * Ds - M1s + 2 * DFs + 2 * OMs) + 32 * Math.cos(-M1s + OMs) + 27
				* Math.cos(M1s + 2 * DFs + OMs) - 24 * Math.cos(-2 * M1s + 2 * DFs + OMs);
		deltaEps += 16 * Math.cos(2 * (Ds + DFs + OMs)) + 13 * Math.cos(2 * (M1s + DFs + OMs)) - 12 * Math.cos(2 * OMs + 2 * DFs + M1s - 2 * Ds) - 10 * Math.cos(OMs + 2 * DFs - M1s) - 8
				* Math.cos(2 * Ds - M1s + OMs) + 7 * Math.cos(2 * (OMs + DFs + Ms - Ds)) + 9 * Math.cos(Ms + OMs);
		deltaEps += 7 * Math.cos(OMs + M1s - 2 * Ds) + 6 * Math.cos(OMs - Ms) + 5 * Math.cos(OMs + 2 * DFs - M1s + 2 * Ds) + 3 * Math.cos(2 * OMs + 2 * DFs + M1s + 2 * Ds) - 3
				* Math.cos(2 * OMs + 2 * DFs + Ms) + 3 * Math.cos(2 * OMs + 2 * DFs - Ms) + 3 * Math.cos(OMs + 2 * DFs + 2 * Ds);
		deltaEps -= 3 * Math.cos(2 * (OMs + DFs + M1s - Ds)) - 3 * Math.cos(OMs + 2 * DFs + M1s - 2 * Ds) + 3 * Math.cos(OMs - 2 * M1s + 2 * Ds) + 3 * Math.cos(OMs + 2 * Ds) + 3
				* Math.cos(OMs + 2 * DFs - Ms - 2 * Ds) + 3 * Math.cos(OMs - 2 * Ds) + 3 * Math.cos(OMs + 2 * DFs + 2 * M1s);
		deltaEps *= 0.0001 / 3600;

		double eps = (21.448 / 60 + 26) / 60 + 23 + (-46.815 * jt - 0.00059 * jt2 + 0.001813 * jt3) / 3600;
		eps += deltaEps;
		double epsRad = Math.toRadians(eps);

		double gst = 280.46061837 + (360.98564736629 * jd) + (0.000387933 * jt2) - (jt3 / 38710000);
		gst += deltaPsi * Math.cos(epsRad);
		gst = AstroUtil.limitDegreesTo360(gst);
		// System.out.println("gst" + gst / 15);

		double d1 = ((gst / 15 - Math.floor(gst / 15)) * 60);
		double d2 = ((d1 - Math.floor(d1)) * 60);
		// System.out.println("gsth" + Math.floor(gst / 15) + "h" +
		// Math.floor(d1) + "m" + d2 + "s");

		double mst = gst + longitude;
		mst = AstroUtil.limitDegreesTo360(mst);
		// System.out.println("mst" + mst / 15);

		d1 = ((mst / 15 - Math.floor(mst / 15)) * 60);
		d2 = ((d1 - Math.floor(d1)) * 60);
		// System.out.println("lsth" + Math.floor(mst / 15) + "h" +
		// Math.floor(d1) + "m" + d2 + "s");

		return mst;
	}

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

	public void equatorialToHorizonDS(double latitude) {
		this.latDeg = latitude;

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

		azRad = AstroUtil.limitRadiansTo2PI(azRad);
		// if (azRad < 0)
		// azRad += 2 * Math.PI;
		// System.out.println(Math.toDegrees(azRad));

		Angle az = new Angle(azRad, Angle.RADIANS);
		Angle alt = new Angle(altRad, Angle.RADIANS);
		horizontalCoord = new HorizontalCoord(az, alt);

	}

	public void equatorialToHorizonDS(double LST, double latitude) {
		this.latDeg = latitude;

		Angle tmpLST = new Angle(LST, Angle.DECIMALHOURS);
		Angle HA = tmpLST.subtract(equatorialCoord.RA);
		// equatorialCoord.RA.println("RA", Angle.DECIMALHOURS);
		// tmpLST.println("LST", Angle.DECIMALHOURS);
		// HA.println("HA", Angle.HOURANGLE);
		Angle dec = equatorialCoord.dec;
		equatorialCoord = new EquatorialCoord(HA, null, dec);
		// equatorialCoord.println();
		equatorialToHorizonDS(latitude);
	}

	public void eclipticToEquatorial(DateTime currentDateTime) {
		// System.out.println("eclipticToEquatorial");

		// this.currentDateTime = currentDateTime;
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
		RARad = AstroUtil.limitRadiansTo2PI(RARad);
		Angle RA = new Angle(RARad, Angle.RADIANS);
		Angle dec = new Angle(decRad, Angle.RADIANS);
		equatorialCoord = new EquatorialCoord(null, RA, dec);

	}

	public void sunPosition(DateTime epoch, DateTime currentDateTime) {
		// System.out.println("sunPosition");

		// this.currentDateTime = currentDateTime;

		Days days = Days.daysBetween(epoch, currentDateTime);

		// System.out.println("Days Since Epoch: " + days.getDays());

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
		// System.out.println("N: " + N % 360);

		// mean anomaly
		double M0 = N + Constants.eps_g_1990 - Constants.omega_g_1990;
		double M;
		if (M0 < 0)
			M = M0 + 360;
		else
			M = M0;
		// System.out.println("M: " + M);
		double MRad = org.apache.commons.math3.util.FastMath.toRadians(M);

		// true anomaly
		double E_c = (360 / Math.PI) * Constants.e_earth * Math.sin(MRad);
		// System.out.println("E_c: " + E_c);

		// Sun's geocentric ecliptic longitude
		double lambda0 = N + E_c + Constants.eps_g_1990;
		// System.out.println("lambda: " + lambda0);

		double lambda1 = lambda0 % 360;
		// System.out.println("lambda: " + lambda1);

		// eclipticCoord = new S2Point(lambda, 0);
		Angle lambda = new Angle(lambda1, Angle.DEGREES);
		Angle beta = new Angle(0, Angle.DEGREES);

		eclipticCoord = new EclipticCoord(lambda, beta);

	}


}
