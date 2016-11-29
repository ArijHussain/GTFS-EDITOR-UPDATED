package controllers;

import org.apache.commons.io.FileUtils;
import play.*;
import play.i18n.Lang;
import play.mvc.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.*;

import jobs.ProcessGtfsSnapshotExport;
import jobs.ProcessGtfsSnapshotMerge;

import models.*;
import models.gtfs.GtfsSnapshot;
import models.gtfs.GtfsSnapshotExport;
import models.gtfs.GtfsSnapshotExportCalendars;
import models.gtfs.GtfsSnapshotMerge;
import models.gtfs.GtfsSnapshotSource;
import models.transit.Route;
import models.transit.RouteType;
import models.transit.StopType;
import models.transit.Agency;
import models.transit.Trip;

//@With(Secure.class)
public class Application extends Controller {

    @Before
    static void initSession() throws Throwable {

    	List<Agency> agencies = new ArrayList<Agency>();
    	
       if(Security.isConnected()) {
            renderArgs.put("user", Security.connected());
            
            Account account = Account.find("username = ?", Security.connected()).first();
            
            if(account == null && Account.count() == 0) {
            	account = new Account("admin", "admin", "admin@test.com", true, null);
            	account.save();
            }
            
            if(account.admin != null && account.admin)
            	agencies = Agency.find("order by name").fetch();
            else {
            	agencies.add(((Agency)Agency.findById(account.agency.id)));            	
            }
            
            renderArgs.put("agencies", agencies);
        }
        else {
        	Secure.login();
        }

        if(session.get("agencyId") == null) {
            
            Agency agency = agencies.get(0);

            session.put("agencyId", agency.id);
            session.put("agencyName", agency.name);
            session.put("lat", agency.defaultLat);
            session.put("lon", agency.defaultLon);
            session.put("zoom", 12);

            
        }
    }

    public static void index() {
        
        render();
    }

    public static void scaffolding() {
        render();
    }

    public static void search() {
       
        Long agencyId = Long.parseLong(session.get("agencyId"));
        Agency selectedAgency = Agency.findById(agencyId);
        List<Route> routes = Route.find("agency = ? order by routeShortName", selectedAgency).fetch();
        render(routes);
    }

    public static void route(Long id) {
    	List<RouteType> routeTypes = RouteType.findAll();
        render(routeTypes);
    }

    public static void manageRouteTypes() {
    	List<RouteType> routeTypes = RouteType.findAll();
        render(routeTypes);
    }

    public static void manageStopTypes() {
        List<StopType> routeTypes = StopType.findAll();
        render(routeTypes);
    }

    public static void manageAgencies() {
        List<RouteType> routeTypes = RouteType.findAll();
        render(routeTypes);
    }

    public static void setLang(String lang) {
    	Lang.change(lang);
    	ok();
    }

    public static void createAccount(String username, String password, String email, Boolean admin, Long agencyId)
	{
		if(!username.isEmpty() && !password.isEmpty() && !email.isEmpty() && Account.find("username = ?", username).first() == null )
			new Account(username, password, email, admin, agencyId);
		
		Application.index();
	}
    
    public static void setAgency(Long agencyId) {
        Agency agency = Agency.findById(agencyId);

        if(agency == null)
            badRequest();

        session.put("agencyId", agencyId);
        session.put("agencyName", agency.name);
        session.put("lat", agency.defaultLat);
        session.put("lon", agency.defaultLon);
        session.put("zoom", 12);

        ok();
    }

    public static void setMap(String zoom, String lat, String lon) {

        session.put("zoom", zoom);
        session.put("lat", lat);
        session.put("lon", lon);

        ok();
    }

    public static void importGtfs() {

        render();
    }
/*
    public static void uploadGtfs(File gtfsUpload) {

        validation.required(gtfsUpload).message("GTFS file required.");

        if(gtfsUpload != null && !gtfsUpload.getName().contains(".zip"))
            validation.addError("gtfsUpload", "GTFS must have .zip extension.");

        if(validation.hasErrors()) {
            params.flash();
            validation.keep();
            importGtfs();
        }
        else {
            ProcessGtfsSnapshotMerge merge;
            try {
                merge = new ProcessGtfsSnapshotMerge(gtfsUpload);
                merge.run();
            }
            catch (Exception e) {
                e.printStackTrace();
                validation.addError("gtfsUpload", "Unable to process file.");
                params.flash();
                validation.keep();
                importGtfs();
                return;
            }

            // if there are multiple agencies this will pick one randomly
            search(merge.agencyId);
        }
    }*/


    // import/export  functions
    public static void uploadGtfs(File gtfsUpload) {

        // tbd

        validation.required(gtfsUpload).message("GTFS file required.");

        if(gtfsUpload != null && !gtfsUpload.getName().contains(".zip"))
            validation.addError("gtfsUpload", "GTFS must have .zip extension.");

        if(validation.hasErrors()) {
            params.flash();
            validation.keep();
            importGtfs();
        }
        else {

            GtfsSnapshot snapshot = new GtfsSnapshot("", new Date(), GtfsSnapshotSource.UPLOAD);
            snapshot.save();
            GtfsSnapshotMerge merge = new GtfsSnapshotMerge(snapshot);
            merge.save();

            ProcessGtfsSnapshotMerge mergeJob = new ProcessGtfsSnapshotMerge(merge.id);
            mergeJob.doJob( gtfsUpload);
            render();
        }
        
    }
    
    public static void exportGtfs() {
    
        render();
                
    }
    
    
    
    public static void createGtfs(Long calendarFrom, Long calendarTo) {
        
    	// currently exports all agencies 
    	
        List<Agency> agencyObjects = Agency.findAll();
    
        GtfsSnapshotExportCalendars calendarEnum;
        calendarEnum = GtfsSnapshotExportCalendars.CURRENT_AND_FUTURE;
        
        Date calendarFromDate = new Date(calendarFrom);
        Date calendarToDate = new Date(calendarTo);
        
        GtfsSnapshotExport snapshotExport = new GtfsSnapshotExport(agencyObjects, calendarEnum, calendarFromDate, calendarToDate, "");
        
        ProcessGtfsSnapshotExport exportJob = new ProcessGtfsSnapshotExport(snapshotExport.id);
        
        // running as a sync task for now -- needs to be async for processing larger feeds.
        exportJob.doJob();

        render();
        
      //  redirect("/public/data/gtfs/"  + snapshotExport.getZipFilename());
    }



}