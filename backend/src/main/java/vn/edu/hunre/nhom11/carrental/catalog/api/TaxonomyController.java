package vn.edu.hunre.nhom11.carrental.catalog.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.hunre.nhom11.carrental.catalog.domain.*;
import vn.edu.hunre.nhom11.carrental.catalog.repository.*;
import vn.edu.hunre.nhom11.carrental.shared.exception.ApiException;

@RestController
public class TaxonomyController {
    private final BrandRepository brands;
    private final CarTypeRepository types;
    public TaxonomyController(BrandRepository brands, CarTypeRepository types) { this.brands=brands; this.types=types; }
    public record BrandCommand(@NotBlank @Size(max=255) String name) {}
    public record TypeCommand(@NotBlank @Size(max=255) String name, @NotNull @Min(2) @Max(50) Integer seats) {}
    private ApiException missing() { return new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục"); }
    @GetMapping("/api/brands") Object brands() { return brands.findAll(); }
    @GetMapping("/api/car-types") Object types() { return types.findAll(); }
    @PostMapping("/api/brands") @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> createBrand(@Valid @RequestBody BrandCommand r) {
        Brand b=new Brand(); b.setName(r.name().trim()); return ResponseEntity.status(201).body(brands.save(b));
    }
    @PutMapping("/api/brands/{id}") @PreAuthorize("hasRole('ADMIN')")
    Object updateBrand(@PathVariable Long id,@Valid @RequestBody BrandCommand r) {
        Brand b=brands.findById(id).orElseThrow(this::missing); b.setName(r.name().trim()); return brands.save(b);
    }
    @DeleteMapping("/api/brands/{id}") @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> deleteBrand(@PathVariable Long id) {
        brands.delete(brands.findById(id).orElseThrow(this::missing)); return ResponseEntity.noContent().build();
    }
    @PostMapping("/api/car-types") @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> createType(@Valid @RequestBody TypeCommand r) {
        CarType t=new CarType(); t.setName(r.name().trim()); t.setSeats(r.seats()); return ResponseEntity.status(201).body(types.save(t));
    }
    @PutMapping("/api/car-types/{id}") @PreAuthorize("hasRole('ADMIN')")
    Object updateType(@PathVariable Long id,@Valid @RequestBody TypeCommand r) {
        CarType t=types.findById(id).orElseThrow(this::missing); t.setName(r.name().trim()); t.setSeats(r.seats()); return types.save(t);
    }
    @DeleteMapping("/api/car-types/{id}") @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<?> deleteType(@PathVariable Long id) {
        types.delete(types.findById(id).orElseThrow(this::missing)); return ResponseEntity.noContent().build();
    }
}
