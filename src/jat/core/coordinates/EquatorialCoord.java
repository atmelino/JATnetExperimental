package jat.core.coordinates;

public class EquatorialCoord {
	public Angle HA; // Hour Angle: angle between observer and object
	public Angle RA; // Right Ascension: angle between vernal equinox and object
	public Angle dec; // Declination

	public EquatorialCoord() {
	}

	public EquatorialCoord(Angle HA, Angle dec) {
		this.HA = HA;
		this.dec = dec;
	}

	public void println() {
		HA.println("Hour Angle", Angle.HOURANGLE);
		if (RA!=null)
			RA.println("Right Ascension", Angle.DEGREES);
		dec.println("Declination", Angle.DEGREES);

	}
}
