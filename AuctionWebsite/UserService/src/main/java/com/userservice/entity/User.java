package com.userservice.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity class representing a User.
 */
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class User {
    /**
     * The username of the user.
     */
    @Id
    private String userName;

    /**
     * The first name of the user.
     */
    @NotNull
    private String firstName;

    /**
     * The last name of the user.
     */
    @NotNull
    private String lastName;

    /**
     * The email address of the user.
     */
    @Email
    @NotNull
    private String email;

    /**
     * The password of the user.
     * Must be at least 8 characters long and contain at least one digit and one letter.
     */
    @NotNull
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-zA-Z]).{8,}$", message = "Password must contain at least one digit, one letter, and be at least 8 characters long")
    private String password;

    /**
     * The contact number of the user.
     * Must be exactly 10 digits.
     */
    @NotNull
    @Pattern(regexp = "^\\d{10}$", message = "Contact number must be exactly 10 digits")
    private String contactNo;

    /**
     * The birth date of the user.
     * Formatted as dd-MM-yyyy.
     */
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date birthDate;

    /**
     * The gender of the user.
     */
    @NotNull
    private String gender;

    /**
     * The role of the user.
     * Defaults to Role.DEFAULT.
     */
    @Enumerated(EnumType.STRING)
    private Role role;
}
