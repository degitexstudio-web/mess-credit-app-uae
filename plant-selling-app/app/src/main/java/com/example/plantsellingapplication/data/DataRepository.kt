package com.example.plantsellingapplication.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.update

interface DataRepository {
    val searchQuery: StateFlow<String>
    val selectedCategory: StateFlow<PlantCategory>
    val filteredPlants: Flow<List<Plant>>
    val subscriptionTiers: StateFlow<List<SubscriptionTier>>
    val activeSubscriptionTier: StateFlow<SubscriptionTier?>
    val rentedPlants: StateFlow<List<Plant>>
    val maintenanceVisits: StateFlow<List<MaintenanceVisit>>
    val cartItems: StateFlow<List<CartItem>>
    val favoritePlantIds: StateFlow<Set<String>>

    fun setSearchQuery(query: String)
    fun setCategory(category: PlantCategory)
    fun toggleFavorite(plantId: String)
    fun addToCart(plant: Plant, isRental: Boolean)
    fun removeFromCart(plantId: String, isRental: Boolean)
    fun updateQuantity(plantId: String, isRental: Boolean, quantity: Int)
    fun subscribeToTier(tier: SubscriptionTier)
    fun scheduleMaintenance(serviceType: String, date: String, timeSlot: String)
    fun requestPlantSwap(oldPlantId: String, newPlant: Plant)
    fun checkout(): Double
}

class DefaultDataRepository : DataRepository {

    private val allPlants = listOf(
        Plant(
            id = "p1",
            name = "Monstera Deliciosa",
            scientificName = "Monstera deliciosa",
            purchasePrice = 49.99,
            monthlyRentalPrice = 8.99,
            rating = 4.9,
            category = PlantCategory.INDOOR,
            description = "Iconic Swiss Cheese plant. Full monthly maintenance included with rental: leaf polishing, hydration & soil nutrients.",
            careLevel = "Easy",
            light = "Bright Indirect",
            water = "Weekly Visit",
            heightCm = 75
        ),
        Plant(
            id = "p2",
            name = "Fiddle Leaf Fig",
            scientificName = "Ficus lyrata",
            purchasePrice = 69.99,
            monthlyRentalPrice = 12.99,
            rating = 4.7,
            category = PlantCategory.INDOOR,
            description = "Stunning architectural tree with lush violin leaves. Includes monthly health audit & pruning service.",
            careLevel = "Moderate",
            light = "Bright Direct",
            water = "Bi-Weekly",
            heightCm = 110
        ),
        Plant(
            id = "p3",
            name = "Snake Plant Laurentii",
            scientificName = "Sansevieria trifasciata",
            purchasePrice = 29.99,
            monthlyRentalPrice = 5.99,
            rating = 4.9,
            category = PlantCategory.LOW_LIGHT,
            description = "Ultra durable air purifier. Zero stress rental: includes seasonal fertilizer & free replacements.",
            careLevel = "Very Easy",
            light = "Low Light OK",
            water = "Monthly Check",
            heightCm = 50
        ),
        Plant(
            id = "p4",
            name = "Golden Pothos Totem",
            scientificName = "Epipremnum aureum",
            purchasePrice = 24.99,
            monthlyRentalPrice = 4.99,
            rating = 4.8,
            category = PlantCategory.LOW_LIGHT,
            description = "Lush climbing vine on moss pole. Great for offices and apartments. Includes regular moss hydration.",
            careLevel = "Easy",
            light = "Medium",
            water = "Weekly",
            heightCm = 60
        ),
        Plant(
            id = "p5",
            name = "Peace Lily Sense",
            scientificName = "Spathiphyllum wallisii",
            purchasePrice = 34.99,
            monthlyRentalPrice = 6.99,
            rating = 4.7,
            category = PlantCategory.INDOOR,
            description = "Elegant blooming plant. Subscription covers blooming booster care & pest prevention.",
            careLevel = "Easy",
            light = "Medium Indirect",
            water = "Weekly",
            heightCm = 55
        ),
        Plant(
            id = "p6",
            name = "Calathea Orbifolia",
            scientificName = "Goeppertia orbifolia",
            purchasePrice = 44.99,
            monthlyRentalPrice = 9.99,
            rating = 4.6,
            category = PlantCategory.RARE,
            description = "Exotic striped foliage. Comes with automated humidity misting consultation & expert care.",
            careLevel = "Moderate",
            light = "Shaded",
            water = "Bi-Weekly",
            heightCm = 45
        ),
        Plant(
            id = "p7",
            name = "Japanese Maple Bonsai",
            scientificName = "Acer palmatum",
            purchasePrice = 119.99,
            monthlyRentalPrice = 19.99,
            rating = 4.9,
            category = PlantCategory.OUTDOOR,
            description = "Premium living art piece. Complete bonsai master trimming & soil conditioning included.",
            careLevel = "Advanced",
            light = "Partial Sun",
            water = "Weekly Visit",
            heightCm = 40
        )
    )

    private val _subscriptionTiers = MutableStateFlow(
        listOf(
            SubscriptionTier(
                id = "tier_basic",
                name = "Green Starter",
                tagLine = "Perfect for apartments & small spaces",
                monthlyPrice = 19.99,
                yearlyPrice = 199.99,
                maxPlantsCount = 2,
                maintenanceFrequency = "Monthly Visit",
                benefits = listOf(
                    "2 Plant Rentals Included",
                    "Monthly Professional Specialist Visit",
                    "Free Soil & Nutrient Refills",
                    "Plant Replacement Guarantee"
                ),
                isPopular = false
            ),
            SubscriptionTier(
                id = "tier_urban",
                name = "Urban Oasis",
                tagLine = "Most popular for homes & office spaces",
                monthlyPrice = 39.99,
                yearlyPrice = 399.99,
                maxPlantsCount = 5,
                maintenanceFrequency = "Bi-Weekly Visits",
                benefits = listOf(
                    "5 Plant Rentals Included",
                    "Bi-Weekly Specialist Care & Pruning",
                    "Unlimited Plant Swaps (Decor Refresh)",
                    "Organic Pest Control Treatment",
                    "Designer Pots & Planters Included"
                ),
                isPopular = true
            ),
            SubscriptionTier(
                id = "tier_jungle",
                name = "Jungle Sanctuary",
                tagLine = "Full concierge green living experience",
                monthlyPrice = 79.99,
                yearlyPrice = 799.99,
                maxPlantsCount = 10,
                maintenanceFrequency = "Weekly Concierge Service",
                benefits = listOf(
                    "10 Premium & Rare Plant Rentals",
                    "Weekly Dedicated Botanist Visits",
                    "Priority Emergency Plant Care Response",
                    "Custom Interior Landscape Design",
                    "100% Replacement & Insurance Coverage"
                ),
                isPopular = false
            )
        )
    )
    override val subscriptionTiers: StateFlow<List<SubscriptionTier>> = _subscriptionTiers.asStateFlow()

    private val _activeSubscriptionTier = MutableStateFlow<SubscriptionTier?>(_subscriptionTiers.value[1])
    override val activeSubscriptionTier: StateFlow<SubscriptionTier?> = _activeSubscriptionTier.asStateFlow()

    private val _rentedPlants = MutableStateFlow<List<Plant>>(
        listOf(
            allPlants[0].copy(isRented = true),
            allPlants[2].copy(isRented = true),
            allPlants[3].copy(isRented = true)
        )
    )
    override val rentedPlants: StateFlow<List<Plant>> = _rentedPlants.asStateFlow()

    private val _maintenanceVisits = MutableStateFlow<List<MaintenanceVisit>>(
        listOf(
            MaintenanceVisit(
                id = "v1",
                date = "Oct 5, 2026",
                timeSlot = "10:00 AM - 11:30 AM",
                serviceType = "Bi-Weekly Watering & Leaf Dusting",
                technicianName = "Elena Gomez (Certified Botanist)",
                status = "Scheduled"
            ),
            MaintenanceVisit(
                id = "v2",
                date = "Sep 18, 2026",
                timeSlot = "02:00 PM - 03:00 PM",
                serviceType = "Organic Soil Nutrition & Pruning",
                technicianName = "Mark Stevens",
                status = "Completed"
            )
        )
    )
    override val maintenanceVisits: StateFlow<List<MaintenanceVisit>> = _maintenanceVisits.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    override val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow(PlantCategory.ALL)
    override val selectedCategory: StateFlow<PlantCategory> = _selectedCategory.asStateFlow()

    private val _favoritePlantIds = MutableStateFlow<Set<String>>(setOf("p1", "p2"))
    override val favoritePlantIds: StateFlow<Set<String>> = _favoritePlantIds.asStateFlow()

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    override val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    override val filteredPlants: Flow<List<Plant>> = combine(
        searchQuery,
        selectedCategory,
        favoritePlantIds
    ) { query, category, favorites ->
        allPlants.filter { plant ->
            val matchesQuery = plant.name.contains(query, ignoreCase = true) ||
                    plant.scientificName.contains(query, ignoreCase = true) ||
                    plant.description.contains(query, ignoreCase = true)
            val matchesCategory = (category == PlantCategory.ALL) || (plant.category == category)
            matchesQuery && matchesCategory
        }.map { plant ->
            plant.copy(isFavorite = favorites.contains(plant.id))
        }
    }

    override fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    override fun setCategory(category: PlantCategory) {
        _selectedCategory.value = category
    }

    override fun toggleFavorite(plantId: String) {
        _favoritePlantIds.update { set ->
            if (set.contains(plantId)) set - plantId else set + plantId
        }
    }

    override fun addToCart(plant: Plant, isRental: Boolean) {
        _cartItems.update { items ->
            val existing = items.find { it.plant.id == plant.id && it.isRental == isRental }
            if (existing != null) {
                items.map {
                    if (it.plant.id == plant.id && it.isRental == isRental)
                        it.copy(quantity = it.quantity + 1)
                    else it
                }
            } else {
                items + CartItem(plant, isRental, 1)
            }
        }
    }

    override fun removeFromCart(plantId: String, isRental: Boolean) {
        _cartItems.update { items -> items.filterNot { it.plant.id == plantId && it.isRental == isRental } }
    }

    override fun updateQuantity(plantId: String, isRental: Boolean, quantity: Int) {
        if (quantity <= 0) {
            removeFromCart(plantId, isRental)
        } else {
            _cartItems.update { items ->
                items.map {
                    if (it.plant.id == plantId && it.isRental == isRental)
                        it.copy(quantity = quantity)
                    else it
                }
            }
        }
    }

    override fun subscribeToTier(tier: SubscriptionTier) {
        _activeSubscriptionTier.value = tier
    }

    override fun scheduleMaintenance(serviceType: String, date: String, timeSlot: String) {
        val newVisit = MaintenanceVisit(
            id = "v_${System.currentTimeMillis()}",
            date = date,
            timeSlot = timeSlot,
            serviceType = serviceType,
            technicianName = "Assigned Plant Specialist",
            status = "Scheduled"
        )
        _maintenanceVisits.update { listOf(newVisit) + it }
    }

    override fun requestPlantSwap(oldPlantId: String, newPlant: Plant) {
        _rentedPlants.update { list ->
            list.filterNot { it.id == oldPlantId } + newPlant.copy(isRented = true)
        }
    }

    override fun checkout(): Double {
        val total = _cartItems.value.sumOf {
            val price = if (it.isRental) it.plant.monthlyRentalPrice else it.plant.purchasePrice
            price * it.quantity
        }
        _cartItems.value.forEach { item ->
            if (item.isRental) {
                _rentedPlants.update { list -> list + item.plant.copy(isRented = true) }
            }
        }
        _cartItems.value = emptyList()
        return total
    }
}
