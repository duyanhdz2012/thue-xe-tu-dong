package vn.edu.hunre.nhom11.carrental;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowTests {
    @Autowired MockMvc mvc;

    @Test void publicCatalogIsAvailable() throws Exception {
        mvc.perform(get("/api/cars"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(3));
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
