package vn.edu.hunre.nhom11.carrental.booking.api;

import java.security.Principal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.hunre.nhom11.carrental.booking.domain.BookingStatus;
import vn.edu.hunre.nhom11.carrental.booking.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService service;
    public BookingController(BookingService service){this.service=service;}

    @PostMapping
    Object create(Principal principal, @RequestHeader("Authorization") String authorization,
                  @RequestBody BookingService.BookingCommand request) {
        return service.create(principal.getName(), authorization, request);
    }
    @GetMapping("/cars/{carId}/busy-dates") Object busyDates(@PathVariable Long carId){return service.busyDates(carId);}
    @GetMapping("/mine") Object mine(Principal principal){return service.mine(principal.getName());}
    @GetMapping @PreAuthorize("hasRole('ADMIN')") Object all(){return service.all();}
    @GetMapping("/{id}") Object one(@PathVariable Long id){return service.get(id);}
    @PatchMapping("/{id}/status") @PreAuthorize("hasRole('ADMIN')") Object status(@PathVariable Long id,@RequestParam BookingStatus value){return service.status(id,value);}
    @DeleteMapping("/{id}") Object cancel(@PathVariable Long id,Principal principal){return service.cancel(id,principal.getName(),false);}
}
