package frb.axeron.manager.ui.screen

import android.os.Build
import android.os.SystemClock
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.OpenInNew
import androidx.compose.material.icons.filled.Android
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.PowerSettingsNew
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material.icons.outlined.Build
import androidx.compose.material.icons.outlined.Cancel
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.Update
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ramcosta.composedestinations.annotation.Destination
import com.ramcosta.composedestinations.annotation.RootGraph
import com.ramcosta.composedestinations.generated.destinations.ActivateScreenDestination
import com.ramcosta.composedestinations.generated.destinations.QuickShellScreenDestination
import com.ramcosta.composedestinations.navigation.DestinationsNavigator
import frb.axeron.api.Axeron
import frb.axeron.api.AxeronCommandSession
import frb.axeron.api.AxeronPluginService
import frb.axeron.api.core.Starter
import frb.axeron.manager.BuildConfig
import frb.axeron.manager.R
import frb.axeron.manager.ui.component.PluginCard
import frb.axeron.manager.ui.component.PowerDialog
import frb.axeron.manager.ui.component.PrivilegeCard
import frb.axeron.manager.ui.component.rememberConfirmDialog
import frb.axeron.manager.ui.component.rememberLoadingDialog
import frb.axeron.manager.ui.util.checkNewVersion
import frb.axeron.manager.ui.util.module.LatestVersionInfo
import frb.axeron.manager.ui.viewmodel.ActivateViewModel
import frb.axeron.manager.ui.viewmodel.ViewModelGlobal
import frb.axeron.shared.AxeronApiConstant.server.VERSION_CODE
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

private val GreenOnline = Color(0xFF4ADE80)

@OptIn(ExperimentalMaterial3Api::class)
@Destination<RootGraph>(start = true)
@Composable
fun HomeScreen(navigator: DestinationsNavigator, viewModelGlobal: ViewModelGlobal) {
    val scrollBehavior = TopAppBarDefaults.pinnedScrollBehavior(rememberTopAppBarState())
    val pluginViewModel = viewModelGlobal.pluginViewModel
    val privilegeViewModel = viewModelGlobal.privilegeViewModel
    val activateViewModel = viewModelGlobal.activateViewModel

    val isRunning = activateViewModel.activateStatus is ActivateViewModel.ActivateStatus.Running

    val loadingDialog = rememberLoadingDialog()
    val scope = rememberCoroutineScope()
    var showDialog by remember { mutableStateOf(false) }

    if (showDialog) {
        PowerDialog(
            onDismiss = { showDialog = false },
            onReignite = {
                scope.launch {
                    val success = loadingDialog.withLoading {
                        AxeronPluginService.igniteSuspendService()
                    }
                    if (success) pluginViewModel.fetchModuleList()
                }
            },
            onShutdown = { Axeron.destroy() },
            onRestart = {
                Axeron.newProcess(
                    AxeronCommandSession.getQuickCmd(Starter.internalCommand, true, false),
                    null,
                    null
                )
            }
        )
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
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(46.dp)
                    )
                    Spacer(Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = stringResource(R.string.app_name).uppercase(),
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.5.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "SYSTEM SHELL",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Medium,
                            letterSpacing = 3.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    AnimatedVisibility(visible = isRunning) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .background(GreenOnline, CircleShape)
                            )
                            Text(
                                text = "ONLINE",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = GreenOnline,
                                letterSpacing = 1.2.sp
                            )
                        }
                    }
                    Spacer(Modifier.width(14.dp))
                    AnimatedVisibility(visible = isRunning) {
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .background(
                                    MaterialTheme.colorScheme.primary.copy(alpha = 0.14f),
                                    CircleShape
                                )
                                .clickable { showDialog = true },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.PowerSettingsNew,
                                contentDescription = "Shutdown",
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                }
                Spacer(Modifier.height(10.dp))
                Text(
                    text = "v${BuildConfig.VERSION_NAME} (${BuildConfig.VERSION_CODE})",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Medium
                )
            }
        },
        floatingActionButton = {
            AnimatedVisibility(visible = isRunning) {
                FloatingActionButton(
                    onClick = { navigator.navigate(QuickShellScreenDestination) },
                    shape = RoundedCornerShape(18.dp),
                    containerColor = MaterialTheme.colorScheme.primary
                ) {
                    Icon(Icons.Filled.Terminal, null)
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .nestedScroll(scrollBehavior.nestedScrollConnection)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp)
                .padding(top = 8.dp)
                .padding(bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            StatusCard(activateViewModel = activateViewModel) {
                if (!it) navigator.navigate(ActivateScreenDestination)
            }

            AnimatedVisibility(visible = isRunning) {
                Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    PluginCard(Modifier.weight(1f), pluginViewModel)
                    PrivilegeCard(Modifier.weight(1f), privilegeViewModel)
                }
            }

            UpdateCard()
            InfoCard(activateViewModel)
            LearnCard()
            IssueReportCard()
        }
    }
}

@Composable
fun StatusCard(
    activateViewModel: ActivateViewModel,
    onClick: (Boolean) -> Unit = {}
) {
    val axeronInfo = activateViewModel.axeronInfo
    val context = LocalContext.current
    val isRunning = activateViewModel.activateStatus is ActivateViewModel.ActivateStatus.Running
    val isUpdating = activateViewModel.activateStatus is ActivateViewModel.ActivateStatus.Updating
    val isNeedExtraStep = activateViewModel.activateStatus is ActivateViewModel.ActivateStatus.NeedExtraStep

    val uriHandler = LocalUriHandler.current
    val extraStepUrl =
        "https://antyhacker75-cmyk.github.io/AxManager/guide/faq.html#start-via-wireless-debugging-start-by-connecting-to-a-computer-the-permission-of-adb-is-limited"

    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant
    val error = MaterialTheme.colorScheme.error
    val accent = if (isNeedExtraStep) error else primary
    val statusColor = when {
        isNeedExtraStep -> error
        isUpdating -> primary
        isRunning -> GreenOnline
        else -> error
    }

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.22f)
        ),
        border = BorderStroke(1.dp, accent.copy(alpha = 0.35f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        val scope = rememberCoroutineScope()
        val updating = stringResource(R.string.updating)
        var debugClickCount by remember { mutableIntStateOf(0) }
        var debugJob: Job? by remember { mutableStateOf(null) }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clickable {
                    if (isUpdating) {
                        Toast.makeText(context, updating, Toast.LENGTH_SHORT).show()
                        return@clickable
                    }
                    if (isNeedExtraStep) {
                        uriHandler.openUri(extraStepUrl)
                        return@clickable
                    }
                    if (isRunning) {
                        debugClickCount++
                        debugJob?.cancel()
                        debugJob = scope.launch {
                            delay(1000)
                            debugClickCount = 0
                        }
                        if (debugClickCount >= 8) {
                            throw RuntimeException("AxManager Manual Crash Test")
                        }
                    }
                    onClick(isRunning)
                }
        ) {
            // Watermark logo behind content
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp),
                contentAlignment = Alignment.TopEnd
            ) {
                Icon(
                    painter = painterResource(R.drawable.ic_axeron),
                    contentDescription = null,
                    tint = accent.copy(alpha = 0.18f),
                    modifier = Modifier
                        .size(200.dp)
                        .offset(x = 40.dp, y = (-30).dp)
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Status badge + mode pill
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(9.dp)
                            .background(statusColor, CircleShape)
                    )
                    Text(
                        text = when {
                            isUpdating -> stringResource(R.string.updating).uppercase()
                            isNeedExtraStep -> stringResource(R.string.home_need_fix).uppercase()
                            isRunning -> stringResource(R.string.home_running).uppercase()
                            else -> stringResource(R.string.home_not_running).uppercase()
                        },
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = statusColor,
                        letterSpacing = 1.8.sp
                    )
                    if (isRunning) {
                        Box(
                            modifier = Modifier
                                .border(1.dp, primary, RoundedCornerShape(percent = 50))
                                .padding(horizontal = 12.dp, vertical = 3.dp)
                        ) {
                            Text(
                                text = axeronInfo.serverInfo.getMode().label.uppercase(),
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                color = primary,
                                letterSpacing = 1.5.sp
                            )
                        }
                    }
                }

                // Title
                Text(
                    text = when {
                        isUpdating -> stringResource(R.string.updating)
                        isNeedExtraStep -> stringResource(R.string.home_need_fix)
                        isRunning -> "Astro Shell"
                        else -> stringResource(R.string.home_not_running)
                    },
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = onSurface
                )

                // Subtitle
                Text(
                    text = when {
                        isUpdating -> stringResource(R.string.server_updating_version)
                            .format(axeronInfo.getVersionCode(), VERSION_CODE)
                        isNeedExtraStep -> stringResource(R.string.home_need_fix_msg)
                        isRunning -> "PID ${axeronInfo.serverInfo.pid}"
                        else -> stringResource(R.string.home_not_running_msg)
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = onSurfaceVariant
                )

                Spacer(Modifier.height(4.dp))

                // Bottom row: uptime | VERSION | ARCH
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (isRunning) {
                        var time by remember { mutableLongStateOf(0) }
                        LaunchedEffect(Unit) {
                            while (true) {
                                time = SystemClock.elapsedRealtime() - axeronInfo.serverInfo.starting
                                delay(1000)
                            }
                        }
                        val daySingular = stringResource(R.string.day_singular)
                        val dayPlural = stringResource(R.string.day_plural)

                        fun formatUptime(millis: Long): String {
                            val totalSeconds = millis / 1000
                            val days = totalSeconds / 86400
                            val hours = (totalSeconds % 86400) / 3600
                            val minutes = (totalSeconds % 3600) / 60
                            val seconds = totalSeconds % 60
                            val dayPart = when {
                                days == 1L -> "1 $daySingular "
                                days > 1 -> "$days $dayPlural "
                                else -> ""
                            }
                            return "T+$dayPart%02d:%02d:%02d".format(hours, minutes, seconds)
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.Schedule,
                                contentDescription = null,
                                tint = primary,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = formatUptime(time).removePrefix("T+"),
                                style = MaterialTheme.typography.titleMedium,
                                fontFamily = FontFamily.Monospace,
                                color = onSurface,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    } else {
                        Spacer(Modifier.weight(1f))
                    }

                    if (isRunning) {
                        Box(
                            modifier = Modifier
                                .width(1.dp)
                                .height(46.dp)
                                .background(primary.copy(alpha = 0.3f))
                        )
                        Spacer(Modifier.width(16.dp))

                        Column(
                            verticalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            Text(
                                text = "VERSION",
                                style = MaterialTheme.typography.labelSmall,
                                color = onSurfaceVariant,
                                letterSpacing = 1.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = axeronInfo.getVersionCode().toString(),
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = onSurface
                            )
                        }
                        Spacer(Modifier.width(20.dp))
                        Column(
                            verticalArrangement = Arrangement.spacedBy(2.dp)
                        ) {
                            Text(
                                text = "ARCH",
                                style = MaterialTheme.typography.labelSmall,
                                color = onSurfaceVariant,
                                letterSpacing = 1.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = Build.SUPPORTED_ABIS.firstOrNull()
                                    ?.substringBefore("-")?.uppercase() ?: "—",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = onSurface
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun UpdateCard() {
    val latestVersionInfo = LatestVersionInfo()
    val newVersion by produceState(initialValue = latestVersionInfo) {
        value = withContext(Dispatchers.IO) { checkNewVersion() }
    }

    val currentVersionCode = BuildConfig.VERSION_CODE
    val newVersionCode = newVersion.versionCode
    val newVersionUrl = newVersion.downloadUrl
    val changelog = newVersion.changelog

    val uriHandler = LocalUriHandler.current
    val title = stringResource(R.string.changelog)
    val updateText = stringResource(R.string.update)
    val newVersionAvailable = stringResource(R.string.new_version_available)

    AnimatedVisibility(
        visible = newVersionCode > currentVersionCode,
        enter = fadeIn() + expandVertically(),
        exit = shrinkVertically() + fadeOut()
    ) {
        val updateDialog = rememberConfirmDialog(onConfirm = { uriHandler.openUri(newVersionUrl) })
        WarningCard(
            message = newVersionAvailable.format(newVersionCode),
            MaterialTheme.colorScheme.outlineVariant
        ) {
            if (changelog.isEmpty()) {
                uriHandler.openUri(newVersionUrl)
            } else {
                updateDialog.showConfirm(
                    title = title,
                    content = changelog,
                    markdown = true,
                    confirm = updateText
                )
            }
        }
    }
}

@Composable
fun WarningCard(
    message: String,
    color: Color = MaterialTheme.colorScheme.error,
    onClick: (() -> Unit)? = null
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = color)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .then(onClick?.let { Modifier.clickable { it() } } ?: Modifier)
                .padding(20.dp)
        ) {
            Text(text = message, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun InfoCard(activateViewModel: ActivateViewModel) {
    val axeronInfo = activateViewModel.axeronInfo
    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.22f)
        ),
        border = BorderStroke(1.dp, primary.copy(alpha = 0.2f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            // Header row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 18.dp, vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Outlined.Settings,
                    contentDescription = null,
                    tint = primary,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(Modifier.width(12.dp))
                Text(
                    text = "SYSTEM",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp,
                    color = onSurface
                )
                Spacer(Modifier.weight(1f))
                Text(
                    text = "Android ${Build.VERSION.RELEASE} / SDK ${Build.VERSION.SDK_INT}",
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurfaceVariant
                )
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(primary.copy(alpha = 0.15f))
            )

            @Composable
            fun InfoRow(
                label: String,
                content: String,
                icon: Any? = null,
                showDivider: Boolean = true
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 18.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (icon != null) {
                        when (icon) {
                            is ImageVector -> Icon(
                                imageVector = icon,
                                tint = onSurfaceVariant,
                                contentDescription = null,
                                modifier = Modifier
                                    .padding(end = 20.dp)
                                    .size(20.dp)
                            )
                            is Painter -> Icon(
                                painter = icon,
                                tint = onSurfaceVariant,
                                contentDescription = null,
                                modifier = Modifier
                                    .padding(end = 20.dp)
                                    .size(20.dp)
                            )
                        }
                    }
                    Text(
                        text = label,
                        style = MaterialTheme.typography.bodyMedium,
                        color = onSurfaceVariant
                    )
                    Spacer(Modifier.weight(1f))
                    Text(
                        text = content,
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.End,
                        fontWeight = FontWeight.SemiBold,
                        color = onSurface
                    )
                }
                if (showDivider) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 58.dp)
                            .height(1.dp)
                            .background(primary.copy(alpha = 0.08f))
                    )
                }
            }

            InfoRow(
                label = "Android",
                content = "${Build.VERSION.RELEASE} / SDK ${Build.VERSION.SDK_INT}",
                icon = Icons.Filled.Android,
            )
            InfoRow(
                label = "Architecture",
                content = Build.SUPPORTED_ABIS.joinToString(", "),
                icon = Icons.Filled.Memory,
            )
            InfoRow(
                label = "SELinux",
                content = axeronInfo.serverInfo.selinuxContext,
                icon = Icons.Filled.Security,
            )
            InfoRow(
                label = "Process",
                content = axeronInfo.serverInfo.pid.toString(),
                icon = Icons.Outlined.Description,
                showDivider = false
            )
        }
    }
}

@Composable
fun LearnCard() {
    val uriHandler = LocalUriHandler.current
    val learnAxManager = "https://github.com/antyhacker75-cmyk/AxManager"
    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    Card(
        onClick = { uriHandler.openUri(learnAxManager) },
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.22f)
        ),
        border = BorderStroke(1.dp, primary.copy(alpha = 0.2f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .background(primary.copy(alpha = 0.14f), RoundedCornerShape(14.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Outlined.OpenInNew,
                    contentDescription = null,
                    tint = primary,
                    modifier = Modifier.size(22.dp)
                )
            }
            Spacer(Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = stringResource(R.string.learn_more),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = onSurface
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = stringResource(R.string.learn_more_msg),
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun IssueReportCard() {
    val uriHandler = LocalUriHandler.current
    val githubIssueUrl = "https://github.com/antyhacker75-cmyk/AxManager/issues"
    val telegramUrl = "https://t.me/WashiWashi123"
    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.22f)
        ),
        border = BorderStroke(1.dp, primary.copy(alpha = 0.2f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = stringResource(R.string.report_issue),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = onSurface
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    text = stringResource(R.string.report_issue_msg),
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurfaceVariant
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    text = stringResource(R.string.report_issue_msg2),
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurfaceVariant
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .background(primary.copy(alpha = 0.14f), RoundedCornerShape(14.dp))
                        .clickable { uriHandler.openUri(githubIssueUrl) },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(R.drawable.ic_github),
                        contentDescription = "Report to github",
                        tint = primary,
                        modifier = Modifier.size(22.dp)
                    )
                }
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .background(primary.copy(alpha = 0.14f), RoundedCornerShape(14.dp))
                        .clickable { uriHandler.openUri(telegramUrl) },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(R.drawable.ic_telegram),
                        contentDescription = "Report to telegram",
                        tint = primary,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }
        }
    }
}
