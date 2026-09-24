package vn.edu.hunre.nhom11.carrental;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowTests {
    @Autowired MockMvc mvc;

    @Test void publicCatalogIsAvailable() throws Exception {
        mvc.perform(get("/api/cars"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isNotEmpty());
    }

    @Test void busyDatesArePubliclyVisible() throws Exception {
        mvc.perform(get("/api/bookings/cars/1/busy-dates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test void overlappingBookingIsRejectedAndBusyRangeIsVisible() throws Exception {
        String loginBody = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"customer@carrental.vn","password":"Customer@123"}
                                """))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String token = JsonPath.read(loginBody, "$.token");
        String booking = """
                {"carId":1,"pickupDate":"2030-06-10","returnDate":"2030-06-12",
                 "pickupLocation":"Hà Nội","returnLocation":"Hà Nội"}
                """;

        mvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(booking))
                .andExpect(status().isOk());

        mvc.perform(get("/api/bookings/cars/1/busy-dates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].pickupDate").value("2030-06-10"))
                .andExpect(jsonPath("$[0].returnDate").value("2030-06-12"));

        mvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(booking))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Xe đã được đặt trong khoảng thời gian này"));
    }

    @Test void seededCustomerCanLogin() throws Exception {
        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"customer@carrental.vn","password":"Customer@123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test void dashboardRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/dashboard")).andExpect(status().isForbidden());
    }
}
