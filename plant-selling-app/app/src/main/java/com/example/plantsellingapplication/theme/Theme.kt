package com.example.plantsellingapplication.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = MintAccent,
    secondary = LeafGreen,
    tertiary = Terracotta,
    background = DarkLeaf,
    surface = Color(0xFF1B381C),
    onPrimary = DarkLeaf,
    onBackground = WarmSand,
    onSurface = WarmSand
)

private val LightColorScheme = lightColorScheme(
    primary = ForestGreen,
    secondary = LeafGreen,
    tertiary = Terracotta,
    background = BotanicalBackground,
    surface = BotanicalSurface,
    onPrimary = BotanicalOnPrimary,
    onSecondary = Color.White,
    onBackground = BotanicalOnSurface,
    onSurface = BotanicalOnSurface
)

@Composable
fun PlantSellingApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
