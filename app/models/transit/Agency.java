package models.transit;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.*;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.hibernate.annotations.Type;

import play.db.jpa.Model;

@JsonIgnoreProperties({"entityId", "persistent"})
@Entity
public class Agency extends Model {
	
	public String gtfsAgencyId;
    public String name;
    public String url;
    public String timezone;
    public String lang;
    public String phone;
    
    public String color;
    
    public Boolean systemMap;

    public Double defaultLat;
    public Double defaultLon;

  /*  @JsonManagedReference
    @OneToMany
    public List<Route> routeList;

    @OneToMany
    public List<ServiceCalendar> serviceCalendarList;

    @OneToMany
    public List<Stop> stopList;

    @OneToMany
    public List<TripShape> tripShapeList;*/
    
    @ManyToOne(cascade = CascadeType.REMOVE)
    public RouteType defaultRouteType;

    @JsonCreator
    public static Agency factory(long id) {
      return Agency.findById(id);
    }

    @JsonCreator
    public static Agency factory(String id) {
      return Agency.findById(Long.parseLong(id));
    }
    
    public Agency(org.onebusaway.gtfs.model.Agency agency) {
        this.gtfsAgencyId = agency.getId();
        this.name = agency.getName();
        this.url = agency.getUrl();
        this.timezone = agency.getTimezone();
        this.lang = agency.getLang();
        this.phone = agency.getPhone();
    }
    
    public Agency(String gtfsAgencyId, String name, String url, String timezone, String lang, String phone) {
        this.gtfsAgencyId = gtfsAgencyId;
        this.name = name;
        this.url = url;
        this.timezone = timezone;
        this.lang = lang;
        this.phone = phone;
    }


    public Agency delete(){
       /* this.routeList=new ArrayList<>();
        this.save();*/

        List<Route> routes = Route.find("agency = ?", this).fetch();

        for(Route route:routes){
            route.delete();
        }

        List<ServiceCalendar> serviceCalendars = ServiceCalendar.find("agency = ?", this).fetch();

        for(ServiceCalendar serviceCalendar:serviceCalendars){
            serviceCalendar.delete();
        }

        List<Stop> stops = Stop.find("agency = ?", this).fetch();

        for(Stop stop:stops){
            stop.delete();
        }

        List<TripShape> tripShapes = TripShape.find("agency = ?", this).fetch();

        for(TripShape tripShape:tripShapes){
            tripShape.delete();
        }

        return super.delete();

    }

}
