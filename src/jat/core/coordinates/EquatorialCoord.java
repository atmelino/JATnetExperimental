package jat.core.coordinates;

public class EquatorialCoord {
	public Angle HA; // Hour Angle: angle between observer and object
	public Angle RA; // Right Ascension: angle between vernal equinox and object
	public Angle dec; // Declination

	public EquatorialCoord() {
	}

	public EquatorialCoord(Angle HA, Angle RA, Angle dec) {
		this.HA = HA;
		this.RA = RA;
		this.dec = dec;
	}

	public void println() {
		if (HA != null)
			HA.println("Hour Angle", Angle.HOURANGLE);
		if (RA != null)
			RA.println("Right Ascension", Angle.HOURANGLE);
		dec.println("Declination", Angle.ARCDEGREES);

	}
}
