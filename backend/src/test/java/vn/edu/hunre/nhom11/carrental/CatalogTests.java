package vn.edu.hunre.nhom11.carrental;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.fasterxml.jackson.databind.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
@SpringBootTest @AutoConfigureMockMvc
class CatalogTests {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper mapper;
 long create(String path,String json) throws Exception {
  return mapper.readTree(mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content(json)).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString()).get("id").asLong();
 }
 @Test @WithMockUser(roles="ADMIN") void fullCatalogLifecycle() throws Exception {
  long brand=create("/api/brands","{\"name\":\"Test brand\"}");
  long type=create("/api/car-types","{\"name\":\"Test type\",\"seats\":7}");
  String body="""
   {"name":"Catalog test car","licensePlate":"TEST-001","dailyPrice":750000,"description":"Test","imageUrl":"https://example.com/car.jpg","location":"Hanoi","modelYear":2025,"brandId":%d,"carTypeId":%d}
   """.formatted(brand,type);
  long car=create("/api/cars",body);
  mvc.perform(get("/api/cars").param("brandId",""+brand).param("typeId",""+type).param("q","Catalog test")).andExpect(status().isOk()).andExpect(jsonPath("$.totalElements").value(1));
  mvc.perform(get("/api/cars/"+car)).andExpect(status().isOk()).andExpect(jsonPath("$.dailyPrice").value(750000));
  mvc.perform(put("/api/cars/"+car).contentType(MediaType.APPLICATION_JSON).content(body.replace("750000","800000"))).andExpect(status().isOk()).andExpect(jsonPath("$.dailyPrice").value(800000));
  mvc.perform(delete("/api/brands/"+brand)).andExpect(status().isConflict());
  mvc.perform(delete("/api/car-types/"+type)).andExpect(status().isConflict());
  mvc.perform(put("/api/brands/"+brand).contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Updated brand\"}")).andExpect(status().isOk());
  mvc.perform(put("/api/car-types/"+type).contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Updated type\",\"seats\":4}")).andExpect(status().isOk());
  mvc.perform(post("/api/cars").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isConflict());
  mvc.perform(delete("/api/cars/"+car)).andExpect(status().isNoContent());
  mvc.perform(get("/api/cars/"+car)).andExpect(status().isNotFound());
  mvc.perform(delete("/api/brands/"+brand)).andExpect(status().isNoContent());
  mvc.perform(delete("/api/car-types/"+type)).andExpect(status().isNoContent());
 }
 @Test @WithMockUser(roles="ADMIN") void invalidInputRejected() throws Exception {
  mvc.perform(post("/api/cars").contentType(MediaType.APPLICATION_JSON).content("{\"dailyPrice\":-1}")).andExpect(status().isBadRequest());
  mvc.perform(post("/api/brands").contentType(MediaType.APPLICATION_JSON).content("{\"name\":\" \"}")).andExpect(status().isBadRequest());
  mvc.perform(post("/api/car-types").contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Bad\",\"seats\":0}")).andExpect(status().isBadRequest());
 }
 @Test @WithMockUser(roles="CUSTOMER") void customerCannotModifyCatalog() throws Exception {
  mvc.perform(delete("/api/cars/1")).andExpect(status().isForbidden());
  mvc.perform(post("/api/brands").contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"Blocked\"}")).andExpect(status().isForbidden());
  mvc.perform(delete("/api/car-types/1")).andExpect(status().isForbidden());
 }
}
