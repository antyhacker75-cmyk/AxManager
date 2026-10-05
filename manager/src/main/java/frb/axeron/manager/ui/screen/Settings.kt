package frb.axeron.manager.ui.screen

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Adb
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Coffee
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.FolderDelete
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.PowerSettingsNew
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.rememberLifecycleOwner
import com.ramcosta.composedestinations.annotation.Destination
import com.ramcosta.composedestinations.annotation.RootGraph
import com.ramcosta.composedestinations.generated.destinations.AppearanceScreenDestination
import com.ramcosta.composedestinations.generated.destinations.DeveloperScreenDestination
import com.ramcosta.composedestinations.generated.destinations.FlashScreenDestination
import com.ramcosta.composedestinations.generated.destinations.SettingsEditorScreenDestination
import com.ramcosta.composedestinations.navigation.DestinationsNavigator
import frb.axeron.adb.util.AdbEnvironment
import frb.axeron.api.Axeron
import frb.axeron.manager.R
import frb.axeron.manager.ui.component.ConfirmResult
import frb.axeron.manager.ui.component.rememberConfirmDialog
import frb.axeron.manager.ui.viewmodel.ViewModelGlobal
import frb.axeron.shared.AxeronApiConstant
import frb.axeron.shared.PathHelper
import kotlinx.coroutines.launch

private val SwitchGreen = Color(0xFF4ADE80)

@OptIn(ExperimentalMaterial3Api::class)
@Destination<RootGraph>
@Composable
fun SettingsScreen(navigator: DestinationsNavigator, viewModelGlobal: ViewModelGlobal) {
    val activateViewModel = viewModelGlobal.activateViewModel
    val settings = viewModelGlobal.settingsViewModel
    val confirmDialog = rememberConfirmDialog()
    val scope = rememberCoroutineScope()

    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    var showDevDialog by remember { mutableStateOf(false) }

    DeveloperInfo(showDevDialog) {
        showDevDialog = false
    }

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(horizontal = 20.dp)
                    .padding(top = 20.dp, bottom = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        painter = painterResource(R.drawable.ic_axeron),
                        contentDescription = null,
                        tint = primary,
                        modifier = Modifier.size(46.dp)
                    )
                    Spacer(Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Row {
                            Text(
                                text = "ASTRO ",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.5.sp,
                                color = onSurface
                            )
                            Text(
                                text = "STAR",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.5.sp,
                                color = primary
                            )
                        }
                        Text(
                            text = "SETTINGS",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Medium,
                            letterSpacing = 4.sp,
                            color = onSurfaceVariant
                        )
                    }
                    IconButton(onClick = { showDevDialog = true }) {
                        Icon(
                            imageVector = Icons.Outlined.Info,
                            contentDescription = null,
                            tint = onSurface
                        )
                    }
                }

                Spacer(Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(1.dp)
                            .background(primary.copy(alpha = 0.5f))
                    )
                    Spacer(Modifier.width(10.dp))
                    Text(
                        text = "SYSTEM MANAGER",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp,
                        fontSize = 10.sp,
                        color = SwitchGreen
                    )
                }
            }
        }
    ) { paddingValues ->

        val axeronRunning = activateViewModel.axeronInfo.isRunning()

        Column(
            modifier = Modifier
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp)
                .padding(top = 12.dp, bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {

            // ===== Axeron Permission =====
            AnimatedVisibility(visible = axeronRunning) {
                val lifecycleOwner = rememberLifecycleOwner()
                DisposableEffect(Unit) {
                    val observer = object : androidx.lifecycle.DefaultLifecycleObserver {
                        override fun onResume(owner: androidx.lifecycle.LifecycleOwner) {
                            activateViewModel.checkShizukuIntercept()
                        }
                    }
                    lifecycleOwner.lifecycle.addObserver(observer)
                    onDispose {
                        lifecycleOwner.lifecycle.removeObserver(observer)
                    }
                }
                SettingCard {
                    SettingRow(
                        iconPainter = painterResource(R.drawable.ic_axeron),
                        title = stringResource(R.string.axeron_permission),
                        description = stringResource(R.string.axeron_permission_desc),
                        trailing = {
                            AxSwitch(
                                checked = activateViewModel.isShizukuActive,
                                onCheckedChange = { activateViewModel.setShizukuIntercept(it) }
                            )
                        }
                    )
                }
            }

            // ===== TCP Mode =====
            SettingCard {
                SettingRow(
                    iconVector = Icons.Filled.Adb,
                    title = stringResource(R.string.tcp_mode),
                    description = stringResource(R.string.tcp_mode_desc),
                    trailing = {
                        AxSwitch(
                            checked = settings.isTcpModeEnabled,
                            onCheckedChange = { settings.setTcpMode(it) }
                        )
                    }
                )

                AnimatedVisibility(visible = settings.isTcpModeEnabled) {
                    TcpPortSubCard(settings)
                }
            }

            // ===== Activate on Boot =====
            SettingCard {
                SettingRow(
                    iconVector = Icons.Filled.PowerSettingsNew,
                    title = stringResource(R.string.active_on_boot),
                    description = stringResource(R.string.active_on_boot_desc),
                    trailing = {
                        AxSwitch(
                            checked = settings.isActivateOnBootEnabled,
                            onCheckedChange = { settings.setActivateOnBoot(it) }
                        )
                    }
                )
            }

            // ===== Relog to Ignite =====
            SettingCard {
                SettingRow(
                    iconVector = Icons.Filled.Refresh,
                    title = stringResource(R.string.ignite_when_relog),
                    description = stringResource(R.string.ignite_when_relog_desc),
                    trailing = {
                        AxSwitch(
                            checked = settings.isIgniteWhenRelogEnabled,
                            onCheckedChange = { settings.setIgniteWhenRelog(it) }
                        )
                    }
                )
            }

            // ===== Reset Astro Star =====
            AnimatedVisibility(visible = axeronRunning) {
                val title = stringResource(R.string.ask_reset_path)
                val content = stringResource(R.string.ask_reset_path_desc)
                val confirm = stringResource(R.string.reset)
                val dismiss = stringResource(R.string.cancel)

                SettingCard(
                    onClick = {
                        scope.launch {
                            val confirmResult = confirmDialog.awaitConfirm(
                                title,
                                content = content.format(
                                    PathHelper.getWorkingPath(
                                        Axeron.getAxeronInfo().isRoot(),
                                        AxeronApiConstant.folder.PARENT
                                    ).absolutePath
                                ),
                                confirm = confirm,
                                dismiss = dismiss
                            )
                            if (confirmResult == ConfirmResult.Confirmed) {
                                navigator.navigate(
                                    FlashScreenDestination(FlashIt.FlashUninstall)
                                )
                            }
                        }
                    }
                ) {
                    SettingRow(
                        iconVector = Icons.Filled.FolderDelete,
                        title = stringResource(R.string.reset_path),
                        description = stringResource(R.string.reset_path_desc),
                        trailing = {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                                contentDescription = null,
                                tint = onSurfaceVariant.copy(alpha = 0.5f),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    )
                }
            }

            // ===== Bottom grouped card =====
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, primary.copy(alpha = 0.35f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    AnimatedVisibility(visible = axeronRunning) {
                        Column {
                            SettingRowWithChevron(
                                iconVector = Icons.Filled.Edit,
                                title = stringResource(R.string.settings_editor),
                                onClick = { navigator.navigate(SettingsEditorScreenDestination) }
                            )
                            DividerLine()
                        }
                    }

                    SettingRowWithChevron(
                        iconVector = Icons.Filled.Palette,
                        title = stringResource(R.string.appearance),
                        onClick = { navigator.navigate(AppearanceScreenDestination) }
                    )
                    DividerLine()

                    SettingRowWithChevron(
                        iconVector = Icons.Filled.BugReport,
                        title = stringResource(R.string.developer),
                        onClick = { navigator.navigate(DeveloperScreenDestination) }
                    )
                }
            }
        }
    }
}

// ============================================================
// Layout helpers
// ============================================================

@Composable
private fun SettingCard(
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val primary = MaterialTheme.colorScheme.primary
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, primary.copy(alpha = 0.35f)),
        onClick = onClick ?: {},
        enabled = onClick != null,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp), content = content)
    }
}

@Composable
private fun SettingRow(
    iconVector: ImageVector? = null,
    iconPainter: Painter? = null,
    title: String,
    description: String? = null,
    trailing: @Composable (() -> Unit)? = null,
) {
    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(46.dp)
                .clip(RoundedCornerShape(13.dp))
                .background(primary.copy(alpha = 0.08f))
                .border(1.dp, primary.copy(alpha = 0.45f), RoundedCornerShape(13.dp)),
            contentAlignment = Alignment.Center
        ) {
            when {
                iconVector != null -> Icon(
                    imageVector = iconVector,
                    contentDescription = null,
                    tint = primary,
                    modifier = Modifier.size(24.dp)
                )
                iconPainter != null -> Icon(
                    painter = iconPainter,
                    contentDescription = null,
                    tint = primary,
                    modifier = Modifier.size(24.dp)
                )
            }
        }

        Spacer(Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = onSurface
            )
            if (!description.isNullOrBlank()) {
                Spacer(Modifier.height(2.dp))
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurfaceVariant,
                    lineHeight = 16.sp
                )
            }
        }

        if (trailing != null) {
            Spacer(Modifier.width(8.dp))
            trailing()
        }
    }
}

@Composable
private fun SettingRowWithChevron(
    iconVector: ImageVector,
    title: String,
    onClick: () -> Unit,
) {
    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.Transparent)
            .padding(horizontal = 4.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(primary.copy(alpha = 0.08f))
                .border(1.dp, primary.copy(alpha = 0.45f), RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = iconVector,
                contentDescription = null,
                tint = primary,
                modifier = Modifier.size(22.dp)
            )
        }

        Spacer(Modifier.width(14.dp))

        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = onSurface,
            modifier = Modifier.weight(1f)
        )

        IconButton(onClick = onClick, modifier = Modifier.size(28.dp)) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                contentDescription = null,
                tint = onSurfaceVariant.copy(alpha = 0.6f),
                modifier = Modifier.size(18.dp)
            )
        }
    }
}

@Composable
private fun DividerLine() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 62.dp)
            .height(1.dp)
            .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.10f))
    )
}

@Composable
private fun AxSwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    enabled: Boolean = true,
) {
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant
    Switch(
        checked = checked,
        enabled = enabled,
        onCheckedChange = onCheckedChange,
        colors = SwitchDefaults.colors(
            checkedThumbColor = Color.White,
            checkedTrackColor = SwitchGreen,
            checkedBorderColor = SwitchGreen,
            uncheckedThumbColor = onSurfaceVariant,
            uncheckedTrackColor = Color.Transparent,
            uncheckedBorderColor = onSurfaceVariant.copy(alpha = 0.5f)
        )
    )
}

@Composable
private fun TcpPortSubCard(
    settings: frb.axeron.manager.ui.viewmodel.SettingsViewModel,
) {
    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    var tcpPortText by remember { mutableStateOf(settings.tcpPortInt.toString()) }
    var isFocused by remember { mutableStateOf(false) }
    val focusManager = LocalFocusManager.current
    val context = LocalContext.current

    val portInt = tcpPortText.toIntOrNull()
    val isError = tcpPortText.isNotEmpty() && (portInt == null || portInt !in 1024..65535)

    Spacer(Modifier.height(12.dp))

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.25f))
            .border(1.dp, primary.copy(alpha = 0.18f), RoundedCornerShape(14.dp))
            .padding(horizontal = 14.dp, vertical = 10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = stringResource(R.string.tcp_port),
                    style = MaterialTheme.typography.labelSmall,
                    color = onSurfaceVariant
                )
                Spacer(Modifier.height(2.dp))
                BasicTextField(
                    value = tcpPortText,
                    onValueChange = { newValue ->
                        if (newValue.all { it.isDigit() } && newValue.length <= 5) {
                            tcpPortText = newValue
                        }
                    },
                    singleLine = true,
                    textStyle = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Bold,
                        color = onSurface
                    ),
                    cursorBrush = SolidColor(primary),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier
                        .fillMaxWidth()
                        .onFocusChanged { isFocused = it.isFocused }
                )
                if (isError) {
                    Spacer(Modifier.height(2.dp))
                    Text(
                        text = stringResource(R.string.invalid_port),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }

            Spacer(Modifier.width(8.dp))

            if (isFocused) {
                IconButton(
                    enabled = !isError && portInt != null,
                    onClick = {
                        portInt?.let {
                            settings.setTcpPort(it)
                            focusManager.clearFocus()
                        }
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Save,
                        contentDescription = "Save TCP port",
                        tint = primary
                    )
                }
            } else if (settings.tcpPortInt != AdbEnvironment.getAdbTcpPort()) {
                val reactiveToChange = stringResource(R.string.reactive_to_apply)
                IconButton(
                    onClick = {
                        Toast.makeText(context, reactiveToChange, Toast.LENGTH_SHORT).show()
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.RestartAlt,
                        contentDescription = "Re-Activate AxManager",
                        tint = onSurfaceVariant
                    )
                }
            }
        }
    }
}

// ============================================================
// Developer dialog (unchanged)
// ============================================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DeveloperInfo(
    showDialog: Boolean,
    onDismissRequest: () -> Unit
) {
    val uriHandler = LocalUriHandler.current
    val githubUrl = "https://github.com/fahrez182"
    val telegramUrl = "https://t.me/fahrezone"
    val sociabuzzUrl = "https://sociabuzz.com/fahrezone/tribe"

    if (showDialog) {
        ModalBottomSheet(
            sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true),
            containerColor = MaterialTheme.colorScheme.surfaceContainerLowest,
            onDismissRequest = onDismissRequest
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(110.dp)
                        .shadow(8.dp, CircleShape)
                        .clip(CircleShape)
                        .background(Color(0xFF303030)),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.fahrez182),
                        contentDescription = "Developer Profile Picture",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                            .background(Color(0xFF303030))
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "fahrez182 (FahrezONE)",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = stringResource(R.string.developer_and_maintainer),
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.primary
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "“Everything is an Idea”",
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.8f),
                    modifier = Modifier.padding(horizontal = 16.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                Row(
                    modifier = Modifier.padding(top = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    FilledTonalButton(
                        onClick = { uriHandler.openUri(githubUrl) },
                        modifier = Modifier.height(38.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_github),
                            contentDescription = "GitHub",
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(stringResource(R.string.github))
                    }

                    FilledTonalButton(
                        onClick = { uriHandler.openUri(telegramUrl) },
                        modifier = Modifier.height(38.dp)
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_telegram),
                            contentDescription = "Telegram",
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(Modifier.width(8.dp))
                        Text(stringResource(R.string.telegram))
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))

                FilledTonalButton(
                    onClick = { uriHandler.openUri(sociabuzzUrl) },
                    modifier = Modifier.height(38.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Coffee,
                        contentDescription = "Support / Donate",
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(stringResource(R.string.support_or_donate))
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
