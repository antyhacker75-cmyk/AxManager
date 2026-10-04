package frb.axeron.manager.ui.screen

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.material3.rememberTopAppBarState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.ramcosta.composedestinations.annotation.Destination
import com.ramcosta.composedestinations.annotation.RootGraph
import com.ramcosta.composedestinations.navigation.DestinationsNavigator
import frb.axeron.manager.R
import frb.axeron.manager.ui.component.UseLifecycle
import frb.axeron.manager.ui.viewmodel.ViewModelGlobal

private val GreenEnabled = Color(0xFF4ADE80)

@OptIn(ExperimentalMaterial3Api::class)
@Destination<RootGraph>
@Composable
fun PrivilegeScreen(
    navigator: DestinationsNavigator,
    viewModelGlobal: ViewModelGlobal
) {
    val privilegeViewModel = viewModelGlobal.privilegeViewModel
    val scrollBehavior = TopAppBarDefaults.pinnedScrollBehavior(rememberTopAppBarState())
    val listState = rememberLazyListState()

    val primary = MaterialTheme.colorScheme.primary
    val onSurface = MaterialTheme.colorScheme.onSurface
    val onSurfaceVariant = MaterialTheme.colorScheme.onSurfaceVariant

    UseLifecycle(
        {
            privilegeViewModel.loadInstalledApps(false)
        }
    )

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(horizontal = 16.dp)
                    .padding(top = 24.dp, bottom = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        painter = painterResource(R.drawable.ic_axeron),
                        contentDescription = null,
                        tint = primary,
                        modifier = Modifier.size(44.dp)
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
                            text = "PRIVILEGE MANAGER",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Medium,
                            letterSpacing = 2.5.sp,
                            color = onSurfaceVariant
                        )
                    }
                }

                Spacer(Modifier.height(14.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .border(
                            1.5.dp,
                            primary.copy(alpha = 0.55f),
                            RoundedCornerShape(percent = 50)
                        )
                        .padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = onSurfaceVariant,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(Modifier.width(12.dp))
                    BasicTextField(
                        value = privilegeViewModel.search,
                        onValueChange = { privilegeViewModel.search = it },
                        singleLine = true,
                        textStyle = MaterialTheme.typography.bodyLarge.copy(color = onSurface),
                        cursorBrush = SolidColor(primary),
                        modifier = Modifier.weight(1f),
                        decorationBox = { innerTextField ->
                            if (privilegeViewModel.search.isEmpty()) {
                                Text(
                                    text = stringResource(R.string.search_label_apps),
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = onSurfaceVariant
                                )
                            }
                            innerTextField()
                        }
                    )
                    if (privilegeViewModel.search.isNotEmpty()) {
                        IconButton(
                            onClick = { privilegeViewModel.search = "" },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = null,
                                tint = onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        PullToRefreshBox(
            modifier = Modifier.padding(paddingValues),
            isRefreshing = privilegeViewModel.isRefreshing,
            onRefresh = {
                privilegeViewModel.loadInstalledApps()
            }
        ) {
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .fillMaxSize()
                    .nestedScroll(scrollBehavior.nestedScrollConnection),
                contentPadding = remember {
                    PaddingValues(
                        start = 16.dp,
                        end = 16.dp,
                        top = 8.dp,
                        bottom = 120.dp
                    )
                },
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(
                    privilegeViewModel.privilegeList,
                    key = { it.packageName + it.uid }
                ) { app ->
                    PrivilegeAppCard(
                        label = app.label,
                        packageName = app.packageName,
                        packageInfo = app.packageInfo,
                        isAdded = app.isAdded,
                        primary = primary,
                        onSurface = onSurface,
                        onSurfaceVariant = onSurfaceVariant,
                        onToggle = { checked ->
                            if (checked) {
                                privilegeViewModel.grant(app.packageInfo.applicationInfo!!.uid)
                            } else {
                                privilegeViewModel.revoke(app.packageInfo.applicationInfo!!.uid)
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun PrivilegeAppCard(
    label: String,
    packageName: String,
    packageInfo: Any,
    isAdded: Boolean,
    primary: Color,
    onSurface: Color,
    onSurfaceVariant: Color,
    onToggle: (Boolean) -> Unit
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.18f)
        ),
        border = BorderStroke(1.dp, primary.copy(alpha = 0.30f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp, horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .width(3.dp)
                    .height(54.dp)
                    .background(primary, RoundedCornerShape(2.dp))
            )

            Spacer(Modifier.width(14.dp))

            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(primary.copy(alpha = 0.10f))
                    .border(
                        1.5.dp,
                        primary.copy(alpha = 0.40f),
                        RoundedCornerShape(14.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = ImageRequest.Builder(LocalContext.current)
                        .data(packageInfo)
                        .crossfade(true)
                        .build(),
                    contentDescription = label,
                    modifier = Modifier
                        .padding(6.dp)
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                )
            }

            Spacer(Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = onSurface,
                    maxLines = 1
                )
                Spacer(Modifier.height(2.dp))
                Text(
                    text = packageName,
                    style = MaterialTheme.typography.bodySmall,
                    color = onSurfaceVariant,
                    maxLines = 2
                )
            }

            Spacer(Modifier.width(6.dp))

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                Switch(
                    checked = isAdded,
                    onCheckedChange = onToggle,
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        checkedTrackColor = GreenEnabled,
                        checkedBorderColor = GreenEnabled,
                        uncheckedThumbColor = onSurfaceVariant,
                        uncheckedTrackColor = Color.Transparent,
                        uncheckedBorderColor = onSurfaceVariant.copy(alpha = 0.5f)
                    )
                )
                Text(
                    text = if (isAdded) "Enabled" else "Disabled",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.SemiBold,
                    color = if (isAdded) GreenEnabled else onSurfaceVariant
                )
            }

            Spacer(Modifier.width(2.dp))

            Icon(
                imageVector = Icons.AutoMirrored.Filled.KeyboardArrowRight,
                contentDescription = null,
                tint = onSurfaceVariant.copy(alpha = 0.6f),
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
