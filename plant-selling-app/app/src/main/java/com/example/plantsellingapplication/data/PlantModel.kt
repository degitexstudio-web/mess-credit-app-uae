package com.example.plantsellingapplication.data

import kotlinx.serialization.Serializable

@Serializable
enum class PlantCategory(val displayName: String) {
    ALL("All Plants"),
    INDOOR("Indoor"),
    OUTDOOR("Outdoor"),
    SUCCULENT("Succulents"),
    LOW_LIGHT("Low Light"),
    RARE("Rare & Exotic")
}

data class Plant(
    val id: String,
    val name: String,
    val scientificName: String,
    val purchasePrice: Double,
    val monthlyRentalPrice: Double,
    val rating: Double,
    val category: PlantCategory,
    val description: String,
    val careLevel: String,
    val light: String,
    val water: String,
    val heightCm: Int,
    val isFavorite: Boolean = false,
    val isRented: Boolean = false
)

data class SubscriptionTier(
    val id: String,
    val name: String,
    val tagLine: String,
    val monthlyPrice: Double,
    val yearlyPrice: Double,
    val maxPlantsCount: Int,
    val maintenanceFrequency: String,
    val benefits: List<String>,
    val isPopular: Boolean = false
)

data class MaintenanceVisit(
    val id: String,
    val date: String,
    val timeSlot: String,
    val serviceType: String,
    val technicianName: String,
    val status: String
)

data class CartItem(
    val plant: Plant,
    val isRental: Boolean, // true = rent monthly, false = buy
    val quantity: Int
)
