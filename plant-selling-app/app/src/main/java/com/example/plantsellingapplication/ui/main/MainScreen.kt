package com.example.plantsellingapplication.ui.main

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.LocalFlorist
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation3.runtime.NavKey
import com.example.plantsellingapplication.data.CartItem
import com.example.plantsellingapplication.data.DefaultDataRepository
import com.example.plantsellingapplication.data.MaintenanceVisit
import com.example.plantsellingapplication.data.Plant
import com.example.plantsellingapplication.data.PlantCategory
import com.example.plantsellingapplication.data.SubscriptionTier
import com.example.plantsellingapplication.theme.ForestGreen
import com.example.plantsellingapplication.theme.LeafGreen
import com.example.plantsellingapplication.theme.MintAccent
import com.example.plantsellingapplication.theme.SoftMint
import com.example.plantsellingapplication.theme.Terracotta

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    onItemClick: (NavKey) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: MainScreenViewModel = viewModel { MainScreenViewModel(DefaultDataRepository()) }
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    var selectedTab by remember { mutableIntStateOf(0) }
    var selectedPlantDetails by remember { mutableStateOf<Plant?>(null) }
    var isCartOpen by remember { mutableStateOf(false) }
    var showBookingModal by remember { mutableStateOf(false) }
    var checkoutSuccessAmount by remember { mutableStateOf<Double?>(null) }

    Scaffold(
        topBar = {
            Column {
                TopAppBar(
                    title = {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.LocalFlorist,
                                    contentDescription = null,
                                    tint = ForestGreen,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Leafy Haven",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 20.sp,
                                    color = ForestGreen
                                )
                            }
                            Text(
                                text = "Plant Rentals & Maintenance Subscriptions",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.Gray
                            )
                        }
                    },
                    actions = {
                        val cartCount = uiState.cartItems.sumOf { it.quantity }
                        IconButton(onClick = { isCartOpen = true }) {
                            BadgedBox(
                                badge = {
                                    if (cartCount > 0) {
                                        Badge(containerColor = LeafGreen, contentColor = Color.White) {
                                            Text("$cartCount")
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ShoppingBag,
                                    contentDescription = "Cart",
                                    tint = ForestGreen
                                )
                            }
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.background
                    )
                )

                // Navigation Tabs
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = MaterialTheme.colorScheme.background,
                    contentColor = ForestGreen,
                    indicator = { tabPositions ->
                        TabRowDefaults.SecondaryIndicator(
                            Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                            color = ForestGreen
                        )
                    }
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        text = { Text("Rent Plants", fontWeight = if (selectedTab == 0) FontWeight.Bold else FontWeight.Normal) }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        text = { Text("Subscriptions", fontWeight = if (selectedTab == 1) FontWeight.Bold else FontWeight.Normal) }
                    )
                    Tab(
                        selected = selectedTab == 2,
                        onClick = { selectedTab = 2 },
                        text = { Text("My Garden & Care", fontWeight = if (selectedTab == 2) FontWeight.Bold else FontWeight.Normal) }
                    )
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background,
        modifier = modifier
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when (selectedTab) {
                0 -> RentalCatalogTab(
                    uiState = uiState,
                    onSearchQueryChange = { viewModel.onSearchQueryChange(it) },
                    onCategorySelect = { viewModel.onCategorySelect(it) },
                    onToggleFavorite = { viewModel.onToggleFavorite(it) },
                    onAddToCart = { plant, isRental -> viewModel.onAddToCart(plant, isRental) },
                    onPlantClick = { selectedPlantDetails = it }
                )
                1 -> SubscriptionsTab(
                    tiers = uiState.subscriptionTiers,
                    activeTier = uiState.activeSubscription,
                    onSubscribe = { viewModel.onSubscribeTier(it) }
                )
                2 -> MyGardenAndCareTab(
                    uiState = uiState,
                    onBookMaintenanceClick = { showBookingModal = true }
                )
            }
        }
    }

    // Plant Detail Dialog
    selectedPlantDetails?.let { plant ->
        PlantRentalDetailModal(
            plant = plant,
            onDismiss = { selectedPlantDetails = null },
            onRent = {
                viewModel.onAddToCart(plant, isRental = true)
                selectedPlantDetails = null
            },
            onBuy = {
                viewModel.onAddToCart(plant, isRental = false)
                selectedPlantDetails = null
            },
            onToggleFavorite = { viewModel.onToggleFavorite(plant.id) }
        )
    }

    // Cart Sheet
    if (isCartOpen) {
        CartBottomSheet(
            cartItems = uiState.cartItems,
            onDismiss = { isCartOpen = false },
            onUpdateQuantity = { id, isRental, q -> viewModel.onUpdateQuantity(id, isRental, q) },
            onRemoveItem = { id, isRental -> viewModel.onRemoveFromCart(id, isRental) },
            onCheckout = {
                val total = viewModel.onCheckout()
                isCartOpen = false
                checkoutSuccessAmount = total
            }
        )
    }

    // Book Maintenance Dialog
    if (showBookingModal) {
        BookMaintenanceModal(
            onDismiss = { showBookingModal = false },
            onConfirmBooking = { service, date, time ->
                viewModel.onScheduleMaintenance(service, date, time)
                showBookingModal = false
            }
        )
    }

    // Order Success Dialog
    checkoutSuccessAmount?.let { total ->
        AlertDialog(
            onDismissRequest = { checkoutSuccessAmount = null },
            icon = {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = LeafGreen,
                    modifier = Modifier.size(48.dp)
                )
            },
            title = { Text("Rental & Order Confirmed!", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "Your plant rental order has been placed ($${String.format("%.2f", total)}).\nOur care specialist will deliver your plants and setup your monthly maintenance schedule."
                )
            },
            confirmButton = {
                Button(
                    onClick = { checkoutSuccessAmount = null },
                    colors = ButtonDefaults.buttonColors(containerColor = ForestGreen)
                ) {
                    Text("Awesome!")
                }
            }
        )
    }
}

@Composable
fun RentalCatalogTab(
    uiState: PlantRentalUiState,
    onSearchQueryChange: (String) -> Unit,
    onCategorySelect: (PlantCategory) -> Unit,
    onToggleFavorite: (String) -> Unit,
    onAddToCart: (Plant, Boolean) -> Unit,
    onPlantClick: (Plant) -> Unit
) {
    Column(modifier = Modifier.fillMaxSize()) {
        // Search Input
        OutlinedTextField(
            value = uiState.searchQuery,
            onValueChange = onSearchQueryChange,
            placeholder = { Text("Search plants for monthly rental...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = ForestGreen) },
            trailingIcon = {
                if (uiState.searchQuery.isNotEmpty()) {
                    IconButton(onClick = { onSearchQueryChange("") }) {
                        Icon(Icons.Default.Close, contentDescription = "Clear search")
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = ForestGreen,
                unfocusedBorderColor = Color.LightGray,
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        )

        // Category Filter Chips
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(PlantCategory.entries.toTypedArray()) { category ->
                val isSelected = uiState.selectedCategory == category
                FilterChip(
                    selected = isSelected,
                    onClick = { onCategorySelect(category) },
                    label = { Text(category.displayName) },
                    shape = RoundedCornerShape(20.dp),
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = ForestGreen,
                        selectedLabelColor = Color.White,
                        containerColor = Color.White,
                        labelColor = ForestGreen
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Grid of Plants
        if (uiState.plants.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No plants found", color = Color.Gray)
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(uiState.plants) { plant ->
                    RentalPlantCard(
                        plant = plant,
                        onCardClick = { onPlantClick(plant) },
                        onToggleFavorite = { onToggleFavorite(plant.id) },
                        onRentClick = { onAddToCart(plant, true) }
                    )
                }
            }
        }
    }
}

@Composable
fun RentalPlantCard(
    plant: Plant,
    onCardClick: () -> Unit,
    onToggleFavorite: () -> Unit,
    onRentClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(SoftMint),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.LocalFlorist,
                    contentDescription = plant.name,
                    tint = ForestGreen,
                    modifier = Modifier.size(50.dp)
                )

                IconButton(
                    onClick = onToggleFavorite,
                    modifier = Modifier.align(Alignment.TopEnd)
                ) {
                    Icon(
                        imageVector = if (plant.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (plant.isFavorite) Color.Red else Color.Gray
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = plant.name,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Text(
                text = plant.scientificName,
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(6.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFFFB300), modifier = Modifier.size(14.dp))
                Text(" ${plant.rating}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.width(6.dp))
                Text("• ${plant.water}", fontSize = 11.sp, color = LeafGreen)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "$${plant.monthlyRentalPrice}/mo",
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 14.sp,
                        color = ForestGreen
                    )
                    Text(
                        text = "Buy: $${plant.purchasePrice}",
                        fontSize = 10.sp,
                        color = Color.Gray
                    )
                }

                Button(
                    onClick = onRentClick,
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ForestGreen),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier.height(32.dp)
                ) {
                    Text("Rent", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun SubscriptionsTab(
    tiers: List<SubscriptionTier>,
    activeTier: SubscriptionTier?,
    onSubscribe: (SubscriptionTier) -> Unit
) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            Column {
                Text(
                    text = "Subscription Membership Tiers",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = ForestGreen
                )
                Text(
                    text = "Rent premium plants with guaranteed maintenance & specialist care included.",
                    fontSize = 13.sp,
                    color = Color.Gray
                )
            }
        }

        items(tiers) { tier ->
            val isActive = activeTier?.id == tier.id
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = if (tier.isPopular) androidx.compose.foundation.BorderStroke(2.dp, ForestGreen) else null,
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    if (tier.isPopular) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(ForestGreen)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("MOST POPULAR PLAN", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(tier.name, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = ForestGreen)
                            Text(tier.tagLine, fontSize = 12.sp, color = Color.Gray)
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text("$${tier.monthlyPrice}", fontWeight = FontWeight.ExtraBold, fontSize = 22.sp, color = ForestGreen)
                            Text("/ month", fontSize = 12.sp, color = Color.Gray)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    tier.benefits.forEach { benefit ->
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 3.dp)) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = LeafGreen, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(benefit, fontSize = 13.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = { onSubscribe(tier) },
                        enabled = !isActive,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = ForestGreen,
                            disabledContainerColor = SoftMint,
                            disabledContentColor = ForestGreen
                        ),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (isActive) "Active Current Plan" else "Subscribe Now")
                    }
                }
            }
        }
    }
}

@Composable
fun MyGardenAndCareTab(
    uiState: PlantRentalUiState,
    onBookMaintenanceClick: () -> Unit
) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        // Active Plan Banner
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = ForestGreen),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("ACTIVE SUBSCRIPTION", color = MintAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text(uiState.activeSubscription?.name ?: "No Active Plan", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                        Icon(Icons.Default.LocalFlorist, contentDescription = null, tint = MintAccent, modifier = Modifier.size(36.dp))
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        "Rented Plants: ${uiState.rentedPlants.size} of ${uiState.activeSubscription?.maxPlantsCount ?: 0} allowed",
                        color = Color.White,
                        fontSize = 13.sp
                    )
                    Text(
                        "Care Schedule: ${uiState.activeSubscription?.maintenanceFrequency ?: "N/A"}",
                        color = MintAccent,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        // Rented Plants Section
        item {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("My Rented Plants", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = ForestGreen)
                    Text("${uiState.rentedPlants.size} Active", fontSize = 12.sp, color = Color.Gray)
                }
                Spacer(modifier = Modifier.height(8.dp))

                LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(uiState.rentedPlants) { plant ->
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            modifier = Modifier.width(150.dp)
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(80.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(SoftMint),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.LocalFlorist, contentDescription = null, tint = ForestGreen, modifier = Modifier.size(40.dp))
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(plant.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                                Text("$${plant.monthlyRentalPrice}/mo", fontSize = 11.sp, color = LeafGreen, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
            }
        }

        // Scheduled Maintenance Visits Section
        item {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Specialist Maintenance Visits", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = ForestGreen)
                    Button(
                        onClick = onBookMaintenanceClick,
                        colors = ButtonDefaults.buttonColors(containerColor = ForestGreen),
                        shape = RoundedCornerShape(20.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Book Visit", fontSize = 12.sp)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                uiState.maintenanceVisits.forEach { visit ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(CircleShape)
                                        .background(SoftMint),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Build, contentDescription = null, tint = ForestGreen, modifier = Modifier.size(20.dp))
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(visit.serviceType, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text("${visit.date} • ${visit.timeSlot}", fontSize = 12.sp, color = Color.Gray)
                                    Text("Specialist: ${visit.technicianName}", fontSize = 11.sp, color = ForestGreen)
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (visit.status == "Completed") SoftMint else Color(0xFFFFF3E0))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    visit.status,
                                    color = if (visit.status == "Completed") LeafGreen else Terracotta,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PlantRentalDetailModal(
    plant: Plant,
    onDismiss: () -> Unit,
    onRent: () -> Unit,
    onBuy: () -> Unit,
    onToggleFavorite: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = onBuy,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Buy $${plant.purchasePrice}")
                }
                Button(
                    onClick = onRent,
                    colors = ButtonDefaults.buttonColors(containerColor = ForestGreen),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Rent $${plant.monthlyRentalPrice}/mo")
                }
            }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Close") } },
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(plant.name, fontWeight = FontWeight.Bold)
                IconButton(onClick = onToggleFavorite) {
                    Icon(
                        imageVector = if (plant.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (plant.isFavorite) Color.Red else Color.Gray
                    )
                }
            }
        },
        text = {
            Column {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(SoftMint),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.LocalFlorist, contentDescription = null, tint = ForestGreen, modifier = Modifier.size(64.dp))
                }

                Spacer(modifier = Modifier.height(10.dp))
                Text(plant.scientificName, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                Spacer(modifier = Modifier.height(6.dp))
                Text(plant.description, fontSize = 13.sp)

                Spacer(modifier = Modifier.height(10.dp))
                Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                    CareInfoTag(icon = Icons.Default.WbSunny, title = "Light", value = plant.light)
                    CareInfoTag(icon = Icons.Default.WaterDrop, title = "Water", value = plant.water)
                    CareInfoTag(icon = Icons.Default.LocalFlorist, title = "Care", value = plant.careLevel)
                }
            }
        }
    )
}

@Composable
fun CareInfoTag(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, value: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(SoftMint)
            .padding(6.dp)
    ) {
        Icon(icon, contentDescription = title, tint = ForestGreen, modifier = Modifier.size(18.dp))
        Text(title, fontSize = 9.sp, color = Color.Gray)
        Text(value, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = ForestGreen)
    }
}

@Composable
fun BookMaintenanceModal(
    onDismiss: () -> Unit,
    onConfirmBooking: (String, String, String) -> Unit
) {
    var serviceType by remember { mutableStateOf("Organic Hydration & Soil Conditioning") }
    var preferredDate by remember { mutableStateOf("Oct 12, 2026") }
    var preferredTime by remember { mutableStateOf("10:00 AM - 12:00 PM") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Book Specialist Care Visit", fontWeight = FontWeight.Bold) },
        text = {
            Column {
                Text("Select Care Service:", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ForestGreen)
                Spacer(modifier = Modifier.height(4.dp))
                listOf(
                    "Organic Hydration & Soil Conditioning",
                    "Pruning & Leaf Polishing",
                    "Plant Health Audit & Pest Inspection",
                    "Plant Decor Swap Request"
                ).forEach { service ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { serviceType = service }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (serviceType == service) Icons.Default.CheckCircle else Icons.Default.Check,
                            contentDescription = null,
                            tint = if (serviceType == service) ForestGreen else Color.Gray,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(service, fontSize = 12.sp)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = preferredDate,
                    onValueChange = { preferredDate = it },
                    label = { Text("Preferred Date") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = preferredTime,
                    onValueChange = { preferredTime = it },
                    label = { Text("Time Window") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onConfirmBooking(serviceType, preferredDate, preferredTime) },
                colors = ButtonDefaults.buttonColors(containerColor = ForestGreen)
            ) {
                Text("Schedule Visit")
            }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartBottomSheet(
    cartItems: List<CartItem>,
    onDismiss: () -> Unit,
    onUpdateQuantity: (String, Boolean, Int) -> Unit,
    onRemoveItem: (String, Boolean) -> Unit,
    onCheckout: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Text("Your Cart & Subscriptions", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = ForestGreen)
            Spacer(modifier = Modifier.height(12.dp))

            if (cartItems.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Your cart is empty.", color = Color.Gray)
                }
            } else {
                Column(modifier = Modifier.weight(1f, fill = false)) {
                    cartItems.forEach { item ->
                        val itemPrice = if (item.isRental) item.plant.monthlyRentalPrice else item.plant.purchasePrice
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(SoftMint),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.LocalFlorist, contentDescription = null, tint = ForestGreen)
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(item.plant.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(
                                        text = if (item.isRental) "$${itemPrice}/mo (Rental)" else "$${itemPrice} (Purchase)",
                                        fontSize = 12.sp,
                                        color = LeafGreen
                                    )
                                }
                            }

                            Row(verticalAlignment = Alignment.CenterVertically) {
                                IconButton(
                                    onClick = { onUpdateQuantity(item.plant.id, item.isRental, item.quantity - 1) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Default.Remove, contentDescription = "Decrease", modifier = Modifier.size(16.dp))
                                }

                                Text("${item.quantity}", fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp))

                                IconButton(
                                    onClick = { onUpdateQuantity(item.plant.id, item.isRental, item.quantity + 1) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = "Increase", modifier = Modifier.size(16.dp))
                                }

                                IconButton(
                                    onClick = { onRemoveItem(item.plant.id, item.isRental) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.Red, modifier = Modifier.size(16.dp))
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                val total = cartItems.sumOf {
                    val price = if (it.isRental) it.plant.monthlyRentalPrice else it.plant.purchasePrice
                    price * it.quantity
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Due Today:", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("$${String.format("%.2f", total)}", fontWeight = FontWeight.ExtraBold, fontSize = 18.sp, color = ForestGreen)
                }

                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = onCheckout,
                    colors = ButtonDefaults.buttonColors(containerColor = ForestGreen),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Checkout & Start Subscription", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
