package test;

import jat.core.cm.TwoBodyAPL;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.math3.ode.FirstOrderIntegrator;
import org.apache.commons.math3.ode.nonstiff.DormandPrince853Integrator;

public class TwoBodyText extends HttpServlet {

	private static final long serialVersionUID = -8693738797080608295L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		// Set response header
		response.setContentType("text/html;UTF-8");

		// Set response body content. response body is returned as Ajax Response
		// Text
		PrintWriter writer = response.getWriter();

		double a = 7000.0; // sma in km
		//double e = 0.63; // eccentricity
		double e = 0.03; // eccentricity
		double inc = 1.4; // inclination in radians
		double raan = 0.; // right ascension of ascending node in radians
		double w = 0.; // argument of perigee in radians
		double ta = 0.; // true anomaly in radians

		// create a TwoBody orbit using orbit elements
		TwoBodyAPL sat = new TwoBodyAPL(a, e, inc, raan, w, ta);

		double[] y = sat.randv();

		// find out the period of the orbit
		double period = sat.period();

		// propagate the orbit
		FirstOrderIntegrator dp853 = new DormandPrince853Integrator(1.0e-8,
				100.0, 1.0e-10, 1.0e-10);
		dp853.addStepHandler(sat.stepHandler);
		dp853.integrate(sat, 0.0, y, period, y); // now y contains final state at
												// tf

		Double[] objArray = sat.time.toArray(new Double[sat.time.size()]);
		double[] timeArray = ArrayUtils.toPrimitive(objArray);
		double[] xsolArray = ArrayUtils.toPrimitive(sat.xsol
				.toArray(new Double[sat.time.size()]));
		double[] ysolArray = ArrayUtils.toPrimitive(sat.ysol
				.toArray(new Double[sat.time.size()]));
		double[] zsolArray = ArrayUtils.toPrimitive(sat.zsol
				.toArray(new Double[sat.time.size()]));

		double[][] XYZ = new double[timeArray.length][3];

		for (int i = 0; i < timeArray.length; i++) {
			XYZ[i][0] = xsolArray[i];
			XYZ[i][1] = ysolArray[i];
			XYZ[i][2] = zsolArray[i];
			writer.write(XYZ[i][0] + " " + XYZ[i][1] + " " + XYZ[i][2] + "<br>");
		}

		writer.close();

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}
}
