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

@WebServlet("/TwoBodyParam")
// defines a Servlet mapped to "/TwoBodyParam"
public class TwoBodyParam extends HttpServlet {

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

		// String paramName = "Eccentricity";
		// String paramValue = request.getParameter(paramName);
		// double e = Double.parseDouble(paramValue);

		double a = Double.parseDouble(request.getParameter("SemimajorAxis")); // sma in km
		double e = Double.parseDouble(request.getParameter("Eccentricity")); 
		double inc = Double.parseDouble(request.getParameter("Inclination"));
		double raan = Double.parseDouble(request.getParameter("raan"));
		double w = Double.parseDouble(request.getParameter("w"));
		double ta = Double.parseDouble(request.getParameter("ta"));
		
		//double a = 10000.0; // sma in km
		//double e = 0.63; // eccentricity
		//double inc = 1.4; // inclination in radians
		//double raan = 0.; // right ascension of ascending node in radians
		//double w = 0.; // argument of perigee in radians
		//double ta = 0.; // true anomaly in radians

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

		JSONArray listx = new JSONArray();
		JSONArray listy = new JSONArray();
		JSONArray listz = new JSONArray();
		for (int i = 0; i < timeArray.length; i++) {
			listx.add(xsolArray[i]);
			listy.add(ysolArray[i]);
			listz.add(zsolArray[i]);
		}

		//JSONArray list = new JSONArray();
		//list.add(listx);
		//list.add(listy);
		//list.add(listz);

		JSONObject obj = new JSONObject();

		JSONObject list = new JSONObject();
		list.put("x", listx);
		list.put("y", listy);
		list.put("z", listz);
		

		JSONObject TBE = new JSONObject();		
		TBE.put("a", a);
		TBE.put("ecc", e);
		TBE.put("inc", inc);

		JSONObject pos = new JSONObject();		
		pos.put("x", y[0]);
		pos.put("y", y[1]);
		pos.put("z", y[2]);
		
		
		obj.put("coords", list);
		//obj.put("x", listx);
		//obj.put("y", listy);
		//obj.put("z", listz);
		//obj.put("message", "hello");
		obj.put("message", "TwoBodyParam.java");
		obj.put("TBE", TBE);
		obj.put("pos", pos);

		
		writer.write(""+obj);

		writer.close();

	}
}
