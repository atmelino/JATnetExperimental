package jat.core.coordinates;

public class HorizontalCoord {
	public Angle azimuth; // horizontal plane azimuth
	public Angle altitude; // horizontal plane altitude

	public HorizontalCoord() {
	}

	public HorizontalCoord(Angle lambda, Angle beta) {
		this.azimuth = lambda;
		this.altitude = beta;
	}

	public void println() {
		azimuth.println("horizontal plane azimuth", Angle.DEGREES);
		altitude.println("horizontal plane altitude", Angle.DEGREES);
	}
}
