package com.jurado.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/jurado/pet")
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @PostMapping
    public Pet createPet(@RequestBody Pet pet) {
        return petRepository.save(pet);
    }

    @PostMapping("/bulk")
    public List<Pet> createPets(@RequestBody List<Pet> pets) {
        return petRepository.saveAll(pets);
    }

    // Delete method
    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Long id) {
        petRepository.deleteById(id);
    }

    // ✅ Update method
    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet updatedPet) {
        Optional<Pet> optionalPet = petRepository.findById(id);
        if (optionalPet.isPresent()) {
            Pet existingPet = optionalPet.get();
            existingPet.setName(updatedPet.getName());
            existingPet.setSpecies(updatedPet.getSpecies());
            existingPet.setBreed(updatedPet.getBreed());
            existingPet.setPrice(updatedPet.getPrice());
            existingPet.setDescription(updatedPet.getDescription());
            existingPet.setImageUrl(updatedPet.getImageUrl());
            return petRepository.save(existingPet);
        } else {
            throw new RuntimeException("Pet not found with id " + id);
        }
    }
}
