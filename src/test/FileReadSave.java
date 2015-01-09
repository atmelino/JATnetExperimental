package test;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class FileReadSave extends HttpServlet {
	private static final long serialVersionUID = 3715277455767621921L;
	int count;

	public void init() throws ServletException {
		FileReader fileReader = null;
		BufferedReader bufferedReader = null;
		try {
			fileReader = new FileReader("InitDestroyCounter.initial");
			bufferedReader = new BufferedReader(fileReader);
			String initial = bufferedReader.readLine();
			count = Integer.parseInt(initial);
			bufferedReader.close();
			return;
		} catch (Exception ignored) {
		}

		String initial = getInitParameter("initial");
		try {
			count = Integer.parseInt(initial);
			return;
		} catch (NumberFormatException ignored) {
		} // null or non-integer value
		count = 0;
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		res.setContentType("text/plain");
		PrintWriter out = res.getWriter();
		count++;
		out.println("Since the beginning, this servlet has been accessed "
				+ count + " times.");
	}

	public void destroy() {
		super.destroy();
		saveState();
	}

	public void saveState() {
		FileWriter fileWriter = null;
		PrintWriter printWriter = null;
		try {
			fileWriter = new FileWriter("InitDestroyCounter.initial");
			printWriter = new PrintWriter(fileWriter);
			printWriter.println(count);
			printWriter.close();
			return;
		} catch (IOException e) {
		}
	}
}