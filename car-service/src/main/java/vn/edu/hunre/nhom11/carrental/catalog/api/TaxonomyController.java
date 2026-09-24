package vn.edu.hunre.nhom11.carrental.catalog.api;
import org.springframework.http.ResponseEntity; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*; import vn.edu.hunre.nhom11.carrental.catalog.domain.*; import vn.edu.hunre.nhom11.carrental.catalog.repository.*;
@RestController public class TaxonomyController { private final BrandRepository brands; private final CarTypeRepository types; public TaxonomyController(BrandRepository b,CarTypeRepository t){brands=b;types=t;}
 @GetMapping("/api/brands")Object brands(){return brands.findAll();}@PostMapping("/api/brands")@PreAuthorize("hasRole('ADMIN')")ResponseEntity<?> brand(@RequestBody Brand b){return ResponseEntity.status(201).body(brands.save(b));}
 @GetMapping("/api/car-types")Object types(){return types.findAll();}@PostMapping("/api/car-types")@PreAuthorize("hasRole('ADMIN')")ResponseEntity<?> type(@RequestBody CarType t){return ResponseEntity.status(201).body(types.save(t));}
}

