package com.example.plantsellingapplication.ui.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.plantsellingapplication.data.CartItem
import com.example.plantsellingapplication.data.DataRepository
import com.example.plantsellingapplication.data.MaintenanceVisit
import com.example.plantsellingapplication.data.Plant
import com.example.plantsellingapplication.data.PlantCategory
import com.example.plantsellingapplication.data.SubscriptionTier
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

enum class AppTab {
    RENTAL_CATALOG,
    SUBSCRIPTION_PLANS,
    MY_GARDEN_MAINTENANCE
}

data class PlantRentalUiState(
    val currentTab: AppTab = AppTab.RENTAL_CATALOG,
    val searchQuery: String = "",
    val selectedCategory: PlantCategory = PlantCategory.ALL,
    val plants: List<Plant> = emptyList(),
    val subscriptionTiers: List<SubscriptionTier> = emptyList(),
    val activeSubscription: SubscriptionTier? = null,
    val rentedPlants: List<Plant> = emptyList(),
    val maintenanceVisits: List<MaintenanceVisit> = emptyList(),
    val cartItems: List<CartItem> = emptyList(),
    val favoriteIds: Set<String> = emptySet()
)

class MainScreenViewModel(private val repository: DataRepository) : ViewModel() {

    private val catalogFlow = combine(
        repository.searchQuery,
        repository.selectedCategory,
        repository.filteredPlants,
        repository.favoritePlantIds
    ) { query, category, plants, favorites ->
        Triple(query, category, Pair(plants, favorites))
    }

    private val userGardenFlow = combine(
        repository.subscriptionTiers,
        repository.activeSubscriptionTier,
        repository.rentedPlants,
        repository.maintenanceVisits,
        repository.cartItems
    ) { tiers, activeSub, rented, visits, cart ->
        Pair(Pair(tiers, activeSub), Triple(rented, visits, cart))
    }

    val uiState: StateFlow<PlantRentalUiState> = combine(
        catalogFlow,
        userGardenFlow
    ) { catalog, garden ->
        val (query, category, plantsFavPair) = catalog
        val (plants, favorites) = plantsFavPair

        val (tierPair, gardenTriple) = garden
        val (tiers, activeSub) = tierPair
        val (rented, visits, cart) = gardenTriple

        PlantRentalUiState(
            searchQuery = query,
            selectedCategory = category,
            plants = plants,
            subscriptionTiers = tiers,
            activeSubscription = activeSub,
            rentedPlants = rented,
            maintenanceVisits = visits,
            cartItems = cart,
            favoriteIds = favorites
        )
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        PlantRentalUiState()
    )

    fun onSearchQueryChange(query: String) {
        repository.setSearchQuery(query)
    }

    fun onCategorySelect(category: PlantCategory) {
        repository.setCategory(category)
    }

    fun onToggleFavorite(plantId: String) {
        repository.toggleFavorite(plantId)
    }

    fun onAddToCart(plant: Plant, isRental: Boolean) {
        repository.addToCart(plant, isRental)
    }

    fun onRemoveFromCart(plantId: String, isRental: Boolean) {
        repository.removeFromCart(plantId, isRental)
    }

    fun onUpdateQuantity(plantId: String, isRental: Boolean, quantity: Int) {
        repository.updateQuantity(plantId, isRental, quantity)
    }

    fun onSubscribeTier(tier: SubscriptionTier) {
        repository.subscribeToTier(tier)
    }

    fun onScheduleMaintenance(serviceType: String, date: String, timeSlot: String) {
        repository.scheduleMaintenance(serviceType, date, timeSlot)
    }

    fun onRequestSwap(oldPlantId: String, newPlant: Plant) {
        repository.requestPlantSwap(oldPlantId, newPlant)
    }

    fun onCheckout(): Double {
        return repository.checkout()
    }
}
