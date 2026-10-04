package frb.axeron.manager.ui.screen.plugin

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Web
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Restore
import androidx.compose.material.icons.outlined.Terminal
import androidx.compose.material.icons.outlined.Tune
import androidx.compose.material.icons.outlined.Web
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DividerDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.ramcosta.composedestinations.generated.destinations.ExecutePluginActionScreenDestination
import com.ramcosta.composedestinations.navigation.DestinationsNavigator
import frb.axeron.api.Axeron
import frb.axeron.api.AxeronPluginService
import frb.axeron.manager.R
import frb.axeron.manager.ui.component.ConfirmResult
import frb.axeron.manager.ui.component.SettingsItem
import frb.axeron.manager.ui.component.SettingsItemType
import frb.axeron.manager.ui.component.createWebUIShortcut
import frb.axeron.manager.ui.component.formatSize
import frb.axeron.manager.ui.component.rememberConfirmDialog
import frb.axeron.manager.ui.component.rememberLoadingDialog
import frb.axeron.manager.ui.viewmodel.PluginViewModel
import frb.axeron.manager.ui.viewmodel.SettingsViewModel
import frb.axeron.server.PluginInfo
import frb.axeron.shared.AxeronApiConstant
import frb.axeron.shared.PathHelper
import kotlinx.coroutines.launch
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PluginConfig(
    showDialog: Boolean,
    plugin: PluginInfo,
    onDismissRequest: () -> Unit
) {
    if (showDialog) {
        ModalBottomSheet(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLowest,
            onDismissRequest = onDismissRequest
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(10.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                val context = LocalContext.current
                SettingsItem(
                    label = stringResource(R.string.web_ui_configuration),
                    iconVector = Icons.Outlined.Web,
                ) { _, _ ->
                    HorizontalDivider(
                        Modifier,
                        DividerDefaults.Thickness,
                        MaterialTheme.colorScheme.secondaryContainer
                    )
                    SettingsItem(
                        type = SettingsItemType.CHILD,
                        enabled = plugin.hasWebUi,
                        iconVector = Icons.Outlined.Home,
                        label = stringResource(R.string.add_web_ui_shortcut),
                        description = stringResource(R.string.add_web_ui_shortcut_msg),
                        onClick = {
                            createWebUIShortcut(context = context, plugin = plugin)
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun InfoLine(
    icon: ImageVector,
    label: String,
    value: String,
    color: Color,
) {
    Row(
        modifier = Modifier.padding(vertical = 1.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = color.copy(alpha = 0.7f),
            modifier = Modifier.size(12.dp)
        )
        Text(
            text = "$label: $value",
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontSize = 11.sp,
            lineHeight = 15.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
private fun Badge(
    text: String,
    color: Color,
    filled: Boolean = false,
    icon: ImageVector? = null,
    showDot: Boolean = false,
) {
    Row(
        modifier = Modifier
            .then(
                if (filled) Modifier.background(color.copy(alpha = 0.18f), RoundedCornerShape(50))
                else Modifier.border(1.dp, color.copy(alpha = 0.55f), RoundedCornerShape(50))
            )
            .padding(horizontal = 8.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        if (showDot) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .background(color, CircleShape)
            )
        }
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(11.dp)
            )
        }
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = color,
            fontSize = 10.sp,
            letterSpacing = 0.5.sp
        )
    }
}

@Composable
fun PluginItem(
    navigator: DestinationsNavigator?,
    settings: SettingsViewModel,
    viewModel: PluginViewModel,
    plugin: PluginInfo,
    updateUrl: String,
    onUninstall: (PluginInfo) -> Unit,
    onRestore: (PluginInfo) -> Unit,
    onCheckChanged: (Boolean) -> Unit,
    onUpdate: (PluginInfo) -> Unit,
    onClick: (PluginInfo) -> Unit,
    expanded: Boolean,
    onExpandToggle: () -> Unit,
) {
    var showExtraSetDialog by remember { mutableStateOf(false) }

    PluginConfig(showExtraSetDialog, plugin) {
        showExtraSetDialog = false
    }

    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    val confirmDialog = rememberConfirmDialog()
    val reigniteLoading = rememberLoadingDialog()
    val scope = rememberCoroutineScope()
    val interactionSource = remember { MutableInteractionSource() }

    val pluginVersion = stringResource(R.string.plugin_version)
    val pluginAuthor = stringResource(R.string.plugin_author)
    val pluginId = stringResource(R.string.plugin_id)
    val pluginVersionCode = stringResource(R.string.plugin_version_code)
    val pluginAxeronSupport = stringResource(R.string.plugin_axeron_support)
    val pluginUpdateJson = stringResource(R.string.plugin_update_json)
    val pluginUpdateJsonEmpty = stringResource(R.string.plugin_update_json_empty)

    val isActive = plugin.enabled && !plugin.remove

    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        border = BorderStroke(
            width = 1.dp,
            color = primary.copy(alpha = if (isActive) 0.55f else 0.20f)
        ),
        modifier = Modifier
            .fillMaxWidth()
            .combinedClickable(onClick = onExpandToggle)
    ) {
        Box {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                primary.copy(alpha = if (isActive) 0.14f else 0.04f),
                                Color.Transparent
                            ),
                            radius = 700f
                        )
                    )
            )

            Column(modifier = Modifier.padding(16.dp)) {

                Row(modifier = Modifier.fillMaxWidth()) {

                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(primary.copy(alpha = 0.10f))
                            .border(
                                1.5.dp,
                                primary.copy(alpha = 0.45f),
                                RoundedCornerShape(14.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        val banner = plugin.prop.banner
                        if (banner.isNotEmpty()) {
                            val iconModel = remember(plugin.prop.id, banner) {
                                if (banner.startsWith("http", true)) banner
                                else try {
                                    val path = File(
                                        PathHelper.getWorkingPath(
                                            Axeron.getAxeronInfo().isRoot(),
                                            AxeronApiConstant.folder.PARENT_PLUGIN
                                        ),
                                        plugin.prop.id
                                    )
                                    val file = File(path, banner)
                                    val stream = Axeron.newFileService()
                                        .setFileInputStream(file.absolutePath)
                                    stream?.use { it.readBytes() }
                                } catch (_: Exception) {
                                    null
                                }
                            }
                            if (iconModel != null) {
                                AsyncImage(
                                    model = ImageRequest.Builder(LocalContext.current)
                                        .data(iconModel)
                                        .crossfade(true)
                                        .build(),
                                    contentDescription = plugin.prop.name,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier
                                        .padding(6.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                )
                            } else {
                                Text(
                                    text = plugin.prop.name.firstOrNull()?.uppercase() ?: "?",
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = primary
                                )
                            }
                        } else {
                            Text(
                                text = plugin.prop.name.firstOrNull()?.uppercase() ?: "?",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = primary
                            )
                        }
                    }

                    Spacer(Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Badge(
                                text = plugin.prop.version.ifEmpty { formatSize(plugin.size) },
                                color = primary,
                                filled = false,
                                icon = Icons.Default.DateRange
                            )
                            Badge(
                                text = when {
                                    plugin.remove -> "REMOVED"
                                    plugin.update -> "UPDATE"
                                    plugin.enabled -> "LOADED"
                                    else -> "DISABLED"
                                },
                                color = if (isActive) primary else onSurfaceVariant,
                                filled = true,
                                showDot = true
                            )
                        }

                        Spacer(Modifier.height(8.dp))

                        Text(
                            text = plugin.prop.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = onSurface,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(Modifier.height(4.dp))

                        InfoLine(Icons.Default.DateRange, pluginVersion, plugin.prop.version, onSurfaceVariant)
                        InfoLine(Icons.Default.Person, pluginAuthor, plugin.prop.author, onSurfaceVariant)

                        if (settings.isDeveloperModeEnabled) {
                            InfoLine(Icons.Default.Info, pluginId, plugin.prop.id, onSurfaceVariant)
                            InfoLine(Icons.Default.Build, pluginVersionCode, plugin.prop.versionCode.toString(), onSurfaceVariant)
                            InfoLine(Icons.Outlined.Tune, pluginAxeronSupport, plugin.prop.axeronPlugin.toString(), onSurfaceVariant)
                            InfoLine(
                                Icons.Outlined.Download,
                                pluginUpdateJson,
                                if (plugin.prop.updateJson.isNotEmpty()) plugin.prop.updateJson else pluginUpdateJsonEmpty,
                                onSurfaceVariant
                            )
                        }
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Switch(
                            checked = isActive,
                            enabled = (if (plugin.enabled) !plugin.updateDisable else !plugin.updateEnable)
                                    && !plugin.remove && !plugin.updateInstall,
                            onCheckedChange = onCheckChanged,
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = primary,
                                checkedBorderColor = primary,
                                uncheckedThumbColor = onSurfaceVariant,
                                uncheckedTrackColor = Color.Transparent,
                                uncheckedBorderColor = onSurfaceVariant.copy(alpha = 0.5f)
                            ),
                            interactionSource = if (!plugin.hasWebUi) interactionSource else null
                        )
                        Badge(
                            text = if (isActive) "Active" else "Disabled",
                            color = if (isActive) primary else onSurfaceVariant,
                            filled = true,
                            showDot = true
                        )
                    }

                    Spacer(Modifier.width(4.dp))

                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                        contentDescription = null,
                        tint = onSurfaceVariant.copy(alpha = 0.55f),
                        modifier = Modifier
                            .size(20.dp)
                            .align(Alignment.CenterVertically)
                    )
                }

                Spacer(Modifier.height(10.dp))

                if (plugin.prop.description.isNotEmpty()) {
                    Text(
                        text = plugin.prop.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = onSurfaceVariant,
                        maxLines = if (expanded) 10 else 3,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                if (plugin.update) {
                    Spacer(Modifier.height(8.dp))
                    val title = stringResource(R.string.what_is_ignite)
                    val content = stringResource(R.string.what_is_ignite_msg)
                    val confirm = stringResource(R.string.understand)
                    val neutral = stringResource(R.string.re_ignite_now)
                    Badge(
                        text = stringResource(R.string.ignite) + when {
                            plugin.updateInstall -> " → ${stringResource(R.string.install)}"
                            plugin.updateRemove -> " → ${stringResource(R.string.uninstall)}"
                            plugin.updateDisable -> " → ${stringResource(R.string.disable)}"
                            plugin.updateEnable -> " → ${stringResource(R.string.enable)}"
                            else -> ""
                        },
                        color = MaterialTheme.colorScheme.error,
                        filled = true
                    )
                    Spacer(Modifier.height(6.dp))
                    FilledTonalButton(
                        onClick = {
                            scope.launch {
                                val result = confirmDialog.awaitConfirm(
                                    title,
                                    content = content,
                                    confirm = confirm,
                                    neutral = neutral
                                )
                                if (result == ConfirmResult.Neutral) {
                                    val success = reigniteLoading.withLoading {
                                        AxeronPluginService.igniteSuspendService()
                                    }
                                    if (success) viewModel.fetchModuleList()
                                }
                            }
                        },
                        modifier = Modifier.defaultMinSize(52.dp, 32.dp),
                        contentPadding = ButtonDefaults.TextButtonContentPadding
                    ) {
                        Icon(
                            modifier = Modifier.size(18.dp),
                            imageVector = Icons.Outlined.Tune,
                            contentDescription = null
                        )
                        Text(
                            modifier = Modifier.padding(start = 6.dp),
                            text = stringResource(R.string.re_ignite_now),
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }

                AnimatedVisibility(
                    visible = expanded,
                    enter = fadeIn() + expandVertically(),
                    exit = shrinkVertically() + fadeOut()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (plugin.hasActionScript && !plugin.updateInstall) {
                            FilledTonalButton(
                                modifier = Modifier.defaultMinSize(52.dp, 32.dp),
                                enabled = !plugin.remove && plugin.enabled && !plugin.update,
                                onClick = {
                                    navigator?.navigate(ExecutePluginActionScreenDestination(plugin))
                                    viewModel.markNeedRefresh()
                                },
                                contentPadding = ButtonDefaults.TextButtonContentPadding
                            ) {
                                Icon(
                                    modifier = Modifier.size(18.dp),
                                    imageVector = Icons.Outlined.Terminal,
                                    contentDescription = null
                                )
                                Text(
                                    modifier = Modifier.padding(start = 6.dp),
                                    text = stringResource(R.string.action),
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        }

                        if (plugin.hasWebUi && !plugin.updateInstall) {
                            FilledTonalButton(
                                modifier = Modifier.defaultMinSize(52.dp, 32.dp),
                                enabled = !plugin.remove && plugin.enabled && !plugin.update,
                                onClick = { onClick(plugin) },
                                interactionSource = interactionSource,
                                contentPadding = ButtonDefaults.TextButtonContentPadding
                            ) {
                                Icon(
                                    modifier = Modifier.size(18.dp),
                                    imageVector = Icons.Filled.Web,
                                    contentDescription = null
                                )
                                Text(
                                    modifier = Modifier.padding(start = 6.dp),
                                    text = stringResource(R.string.open),
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        }

                        Spacer(Modifier.weight(1f))

                        if (updateUrl.isNotEmpty() && !plugin.remove && !plugin.updateInstall) {
                            Button(
                                modifier = Modifier.defaultMinSize(52.dp, 32.dp),
                                enabled = !plugin.update,
                                onClick = { onUpdate(plugin) },
                                shape = ButtonDefaults.textShape,
                                contentPadding = ButtonDefaults.TextButtonContentPadding
                            ) {
                                Icon(
                                    modifier = Modifier.size(18.dp),
                                    imageVector = Icons.Outlined.Download,
                                    contentDescription = null
                                )
                                Text(
                                    modifier = Modifier.padding(start = 6.dp),
                                    text = stringResource(R.string.update),
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        }

                        if (plugin.remove) {
                            FilledTonalButton(
                                modifier = Modifier.defaultMinSize(52.dp, 32.dp),
                                onClick = { onRestore(plugin) },
                                contentPadding = ButtonDefaults.TextButtonContentPadding
                            ) {
                                Icon(
                                    modifier = Modifier.size(18.dp),
                                    imageVector = Icons.Outlined.Restore,
                                    contentDescription = null
                                )
                                Text(
                                    modifier = Modifier.padding(start = 6.dp),
                                    text = stringResource(R.string.restore),
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        } else {
                            FilledTonalButton(
                                modifier = Modifier.defaultMinSize(52.dp, 32.dp),
                                onClick = { onUninstall(plugin) },
                                contentPadding = ButtonDefaults.TextButtonContentPadding
                            ) {
                                Icon(
                                    modifier = Modifier.size(18.dp),
                                    imageVector = Icons.Outlined.Delete,
                                    contentDescription = null
                                )
                                Text(
                                    modifier = Modifier.padding(start = 6.dp),
                                    text = stringResource(R.string.uninstall),
                                    style = MaterialTheme.typography.labelMedium
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
