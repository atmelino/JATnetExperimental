package test;

import java.io.IOException;
import java.io.PrintWriter;
 
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.math3.analysis.UnivariateFunction;
import org.apache.commons.math3.analysis.solvers.BrentSolver;
import org.apache.commons.math3.analysis.solvers.UnivariateSolver;


@WebServlet("/test/UseJar") 
public class UseJar extends HttpServlet {
 	private static final long serialVersionUID = 1L;
 
	private static class MyFunction implements UnivariateFunction {
		public double value(double x) {
			double y = x * x - 2.;
			return y;
		}
	}

 	
 	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
 
		// Set response header
		response.setContentType("text/html;UTF-8");
 
		// Set response body content. response body is returned as Ajax Response Text
		PrintWriter writer = response.getWriter();

		
		final double relativeAccuracy = 1.0e-12;
		final double absoluteAccuracy = 1.0e-8;

		UnivariateFunction function = new MyFunction();
		UnivariateSolver nonBracketing = new BrentSolver(relativeAccuracy, absoluteAccuracy);
//		double baseRoot = bs.solve(100, function, -2.0, 0);

		System.out.println("Roots of f(x)=x^2-2: " );
		double baseRoot;
		baseRoot= nonBracketing.solve(100, function, -2.0, 0);
		String message1="root1: " + baseRoot;
		//System.out.println("root1: " + baseRoot);
		baseRoot = nonBracketing.solve(100, function, 0, 2.0);
		String message2="root2: " + baseRoot;
		//System.out.println("root2: " + baseRoot);
		
		
		//writer.write("Hello World!!");    // "Hello World!!" is returned as Ajax Response Text in this example
		writer.write(message1);    // "Hello World!!" is returned as Ajax Response Text in this example
 
		writer.close();
	}
}