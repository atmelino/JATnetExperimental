package celestjava.main;

import celestjava.astro.data.ephemerides.CelestialComputer;
import celestjava.astro.data.Data;
import java.text.SimpleDateFormat;
import java.util.Date;
import celestjava.user.util.TimeUtil;

/**
 * This is a class showing the way to use the CelestialComputer
 * 
 * @author olivier@lediouris.net
 * 
 * @see astro.data.ephemerides.CelestialComputer
 * @see astro.data.Data
 */
public class Main 
{
  public static void main(String[] args)
  {
    String y = "", m = "", d = "", 
           h = "", mn = "", s = "";

    Date now = new Date();
    SimpleDateFormat dateFmt = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z");
    String strNow = dateFmt.format(now);
    System.out.println("Current Time:" + strNow);

    Date gmt = TimeUtil.getGMT();

    y =  (new SimpleDateFormat("yyyy")).format(gmt);
    m =  (new SimpleDateFormat("MM")).format(gmt);
    d =  (new SimpleDateFormat("d")).format(gmt);
    h =  (new SimpleDateFormat("HH")).format(gmt);
    mn = (new SimpleDateFormat("mm")).format(gmt);
    s =  (new SimpleDateFormat("ss")).format(gmt);
     
    System.out.println("Required date and time (current GMT) :\n" + 
                       y + "-" + m + "-" + d + " " + h + ":" + mn + ":" + s);    
    // Process Begin
    long start = System.currentTimeMillis();
    CelestialComputer cc = new CelestialComputer(y, m, d, h, mn, s, "");
    long finish = System.currentTimeMillis();
    Data data = cc.getData();
    // Process End

    data.setHorizontalDisplay(Data.HA);
    data.setMinuteDisplay(Data.DMD);
    
    System.out.println("GHA Sun   : " + Data.formatHA(data.getGHAsun()));
    System.out.println("SHA Sun   : " + Data.formatHA(data.getSHAsun()));
    System.out.println("DEC Sun   : " + Data.formatDec(data.getDECsun()));
    System.out.println("SD Sun    : " + Data.formatSDHP(data.getSDsun()));
    System.out.println("HP Sun    : " + Data.formatSDHP(data.getHPsun()));
    System.out.println("EOT       : " + Data.formatEoT(data.getEOT()));
    System.out.println("GHAmoon   : " + Data.formatHA(data.getGHAmoon()));
    System.out.println("SHAmoon   : " + Data.formatHA(data.getSHAmoon()));
    System.out.println("DECmoon   : " + Data.formatDec(data.getDECmoon()));
    System.out.println("SDmoon    : " + Data.formatSDHP(data.getSDmoon()));
    System.out.println("HPmoon    : " + Data.formatSDHP(data.getHPmoon()));
    System.out.println("Illum     : " + Data.formatIllum(data.getIllum(), data.getQuarter()));
    System.out.println("GHA Aries : " + Data.formatHA(data.getAR()));
    System.out.println("GHApolaris: " + Data.formatHA(data.getGHApolaris()));
    System.out.println("SHApolaris: " + Data.formatHA(data.getSHApolaris()));
    System.out.println("DECpolaris: " + Data.formatDec(data.getDECpolaris()));
    System.out.println("GMST      : " + Data.formatHA(data.getGHAAmean()));
    System.out.println("GAST      : " + Data.formatHA(data.getGHAAtrue()));
    System.out.println("EoE       : " + Data.formatEoE(data.getEoE()));
    System.out.println("delta_psi : " + Data.formatDelta(data.getDelta_psi()));
    System.out.println("delta_eps : " + Data.formatDelta(data.getDelta_eps()));
    System.out.println("OoE       : " + Data.formatECL(data.getOoE()));
    System.out.println("tOoE      : " + Data.formatECL(data.getTOoE()));
    System.out.println("JD        : " + Data.formatJulian(data.getJD()));
    System.out.println("JDE       : " + Data.formatJulian(data.getJDE()));
    System.out.println("LDS       : " + Data.formatHA(data.getLDist()));
    System.out.println("DoW       : " + data.getDoW());
    System.out.println("(Process completed in " + Long.toString(finish - start) + " ms)");
  }
}