package test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.*;
import java.io.*;
import java.io.BufferedReader;
import java.io.FileReader;

public class FileRead3 extends HttpServlet {
	private static final long serialVersionUID = 4943165717907774780L;

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/html");
		// String filename = "/var/lib/tomcat7/webapps/JATServlet/test.txt";
		//String filename = "/var/lib/tomcat7/webapps/data/test.txt";
		String filename = "/var/lib/tomcat7/webapps/data/ascp2000.405";
		
		PrintWriter pw = response.getWriter();
		pw.println("Absolute path demo <br>");
		pw.println("path:" + filename + "<br>");

		try {
			BufferedReader br = new BufferedReader(new FileReader(filename));

			String line;
			while ((line = br.readLine()) != null) {
				pw.println(line + "<br>");
			}
			br.close();
		} catch (Exception e) {
		} // or write your own exceptions
	}

	/*
	 * String val = "";
	 * 
	 * String rsc = "test.txt"; ServletContext context = getServletContext();
	 * 
	 * try { // Class cls = Class.forName("FileRead3");
	 * 
	 * // returns the ClassLoader object associated with this Class //
	 * ClassLoader cLoader = cls.getClassLoader();
	 * 
	 * ClassLoader cLoader = Thread.currentThread() .getContextClassLoader();
	 * 
	 * // input stream InputStream i = cLoader.getResourceAsStream(rsc);
	 * BufferedReader r = new BufferedReader(new InputStreamReader(i));
	 * 
	 * // reads each line String l; while ((l = r.readLine()) != null) { val =
	 * val + l; } i.close(); } catch (Exception e) { pw.println("exception: " +
	 * e); }
	 */

	/*
	 * try { ClassLoader loader =
	 * Thread.currentThread().getContextClassLoader();
	 * 
	 * } catch (Exception e) { pw.println("exception" + e); }
	 */

	/*
	 * class ClassLoaderDemo {
	 * 
	 * static String getResource(String rsc) { String val = "";
	 * 
	 * try { Class cls = Class.forName("ClassLoaderDemo");
	 * 
	 * // returns the ClassLoader object associated with this Class ClassLoader
	 * cLoader = cls.getClassLoader(); // input stream InputStream i =
	 * cLoader.getResourceAsStream(rsc); BufferedReader r = new
	 * BufferedReader(new InputStreamReader(i));
	 * 
	 * // reads each line String l; while((l = r.readLine()) != null) { val =
	 * val + l; } i.close(); } catch(Exception e) { System.out.println(e); }
	 * return val; }
	 * 
	 * public static void main(String[] args) {
	 * 
	 * System.out.println("File1: " + getResource("file.txt"));
	 * System.out.println("File2: " + getResource("test.txt")); } }
	 */

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}
}
