package test;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import jat.core.cm.TwoBodyAPL;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.math3.ode.FirstOrderIntegrator;
import org.apache.commons.math3.ode.nonstiff.DormandPrince853Integrator;

@WebServlet("/TwoBodyFixed")
// defines a Servlet mapped to "/TwoBodyFixed"
public class TwoBodyFixed extends HttpServlet {

	private static final long serialVersionUID = -8693738797080608295L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		// Set response header
		response.setContentType("text/html;UTF-8");

		// Set response body content. response body is returned as Ajax Response
		// Text
		PrintWriter writer = response.getWriter();

		double a = 7000.0; // sma in km
		double e = 0.53; // eccentricity
		double inc = 0.4; // inclination in radians
		double raan = 0.; // right ascension of ascending node in radians
		double w = 0.; // argument of perigee in radians
		double ta = 0.; // true anomaly in radians

		// create a TwoBody orbit using orbit elements
		TwoBodyAPL sat = new TwoBodyAPL(a, e, inc, raan, w, ta);

		double[] y = sat.randv();

		// propagate the orbit
		FirstOrderIntegrator dp853 = new DormandPrince853Integrator(1.0e-8,
				100.0, 1.0e-10, 1.0e-10);
		dp853.addStepHandler(sat.stepHandler);
		// double[] y = new double[] { 7000.0, 0, 0, .0, 8, 0 }; // initial
		// state

		dp853.integrate(sat, 0.0, y, 4000, y); // now y contains final state at
												// tf

		Double[] objArray = sat.time.toArray(new Double[sat.time.size()]);
		double[] timeArray = ArrayUtils.toPrimitive(objArray);
		double[] xsolArray = ArrayUtils.toPrimitive(sat.xsol
				.toArray(new Double[sat.time.size()]));
		double[] ysolArray = ArrayUtils.toPrimitive(sat.ysol
				.toArray(new Double[sat.time.size()]));
		double[] zsolArray = ArrayUtils.toPrimitive(sat.zsol
				.toArray(new Double[sat.time.size()]));

		double[][] XY = new double[timeArray.length][2];

		for (int i = 0; i < timeArray.length; i++) {
			XY[i][0] = xsolArray[i];
			XY[i][1] = ysolArray[i];
			// writer.write(XY[i][0] + " " + XY[i][1] + "<br>");
		}

		JSONArray listx = new JSONArray();
		JSONArray listy = new JSONArray();
		JSONArray listz = new JSONArray();
		for (int i = 0; i < timeArray.length; i++) {
			listx.add(xsolArray[i]);
			listy.add(ysolArray[i]);
			listz.add(zsolArray[i]);
		}

		JSONObject obj = new JSONObject();

		obj.put("x", listx);
		obj.put("y", listy);
		obj.put("z", listz);

		// obj.put("name", "foo");
		// obj.put("num", new Integer(100));
		// obj.put("balance", new Double(1000.21));
		// obj.put("is_vip", new Boolean(true));

		writer.write(""+obj);

		writer.close();

	}
}
