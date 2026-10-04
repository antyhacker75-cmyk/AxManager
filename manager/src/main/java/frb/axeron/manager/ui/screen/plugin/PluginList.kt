package frb.axeron.manager.ui.screen.plugin

import android.content.Context
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.ramcosta.composedestinations.navigation.DestinationsNavigator
import frb.axeron.api.Axeron
import frb.axeron.api.AxeronPluginService
import frb.axeron.manager.ui.component.AxSnackBarHost
import frb.axeron.manager.ui.component.ExtraLabel
import frb.axeron.manager.ui.component.ExtraLabelDefaults
import frb.axeron.manager.ui.viewmodel.PluginViewModel
import frb.axeron.manager.ui.viewmodel.SettingsViewModel
import frb.axeron.server.PluginInfo
import kotlinx.coroutines.launch

@Composable
fun PluginList(
    navigator: DestinationsNavigator?,
    settings: SettingsViewModel,
    viewModel: PluginViewModel,
    modifier: Modifier = Modifier,
    onInstallModule: (String) -> Unit = {},
    onClickModule: (PluginInfo) -> Unit = {},
    context: Context = LocalContext.current,
    snackBarHost: androidx.compose.material3.SnackbarHostState,
    listState: LazyListState,
) {
    val plugins = viewModel.plugins
    val search = viewModel.search

    val filtered = remember(plugins, search) {
        if (search.isEmpty()) plugins
        else plugins.filter {
            it.prop.name.contains(search, ignoreCase = true) ||
                    it.prop.id.contains(search, ignoreCase = true) ||
                    it.prop.author.contains(search, ignoreCase = true)
        }
    }

    val expandedIds = remember { mutableStateMapOf<String, Boolean>() }

    LazyColumn(
        state = listState,
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            start = 16.dp,
            end = 16.dp,
            top = 8.dp,
            bottom = 120.dp
        ),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            items = filtered,
            key = { it.prop.id }
        ) { plugin ->
            val updateUrl = plugin.prop.updateJson
            val expanded = expandedIds[plugin.prop.id] ?: false

            PluginItem(
                navigator = navigator,
                settings = settings,
                viewModel = viewModel,
                plugin = plugin,
                updateUrl = updateUrl,
                onUninstall = { p ->
                    viewModel.uninstallPlugin(p)
                },
                onRestore = { p ->
                    viewModel.restorePlugin(p)
                },
                onCheckChanged = { enabled ->
                    viewModel.setPluginEnabled(plugin, enabled)
                },
                onUpdate = { p ->
                    onInstallModule(p.prop.id)
                },
                onClick = onClickModule,
                expanded = expanded,
                onExpandToggle = {
                    expandedIds[plugin.prop.id] = !expanded
                }
            )
        }
    }
}
