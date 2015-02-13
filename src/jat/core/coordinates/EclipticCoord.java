package jat.core.coordinates;

public class EclipticCoord {
	public Angle lambda; // ecliptic longitude
	public Angle beta; // ecliptic latitude beta

	public EclipticCoord() {
	}

	public EclipticCoord(Angle lambda, Angle beta) {
		this.lambda = lambda;
		this.beta = beta;
	}

	public void println() {
		lambda.println("ecliptic longitude", Angle.DEGREES);
		beta.println("ecliptic latitude", Angle.DEGREES);
	}
}
