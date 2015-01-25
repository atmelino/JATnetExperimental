package jat.core.coordinates;

public class EquatorialCoord {
	public Angle RA; // Right Ascension
	public Angle dec; // Declination

	public EquatorialCoord() {
	}

	public EquatorialCoord(Angle RA, Angle dec) {
		this.RA = RA;
		this.dec = dec;
	}


	public void println()
	{
		RA.println("Right Ascension");
		dec.println("Declination");
	}
}
