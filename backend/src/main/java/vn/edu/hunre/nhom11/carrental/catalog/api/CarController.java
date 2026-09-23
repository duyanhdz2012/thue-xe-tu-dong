package vn.edu.hunre.nhom11.carrental.catalog.api;
import org.springframework.data.domain.*; import org.springframework.data.web.PageableDefault; import org.springframework.http.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*;
import vn.edu.hunre.nhom11.carrental.catalog.domain.*; import vn.edu.hunre.nhom11.carrental.catalog.service.CarService;
@RestController @RequestMapping("/api/cars") public class CarController { private final CarService service; public CarController(CarService s){service=s;}
 @GetMapping Object all(@RequestParam(required=false)String q,@RequestParam(required=false)Long brandId,@RequestParam(required=false)Long typeId,@RequestParam(required=false)CarStatus status,@PageableDefault(size=9,sort="dailyPrice")Pageable p){return service.search(q,brandId,typeId,status,p);}
 @GetMapping("/{id}") Object one(@PathVariable Long id){return service.get(id);} @PostMapping @PreAuthorize("hasRole('ADMIN')") ResponseEntity<?> create(@RequestBody CarService.CarCommand r){return ResponseEntity.status(201).body(service.save(null,r));}
 @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") Object update(@PathVariable Long id,@RequestBody CarService.CarCommand r){return service.save(id,r);} @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") ResponseEntity<?> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
}
