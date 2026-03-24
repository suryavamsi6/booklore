package org.booklore.service.appsettings;

import org.booklore.model.dto.settings.AppSettingKey;
import org.booklore.repository.AppSettingsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class SettingPersistenceHelperTest {

    @Mock
    private AppSettingsRepository appSettingsRepository;

    private SettingPersistenceHelper settingPersistenceHelper;

    @BeforeEach
    void setUp() {
        settingPersistenceHelper = new SettingPersistenceHelper(appSettingsRepository, new ObjectMapper());
    }

    @Test
    void shouldReuseMappedValueWithoutRepositoryLookup() {
        Map<String, String> settingsMap = new HashMap<>();
        settingsMap.put(AppSettingKey.OIDC_ENABLED.getDbKey(), "true");

        String value = settingPersistenceHelper.getOrCreateSetting(settingsMap, AppSettingKey.OIDC_ENABLED, "false");

        assertThat(value).isEqualTo("true");
        verifyNoInteractions(appSettingsRepository);
    }

    @Test
    void shouldPersistAndCacheDefaultWhenMappedValueMissing() {
        Map<String, String> settingsMap = new HashMap<>();

        String value = settingPersistenceHelper.getOrCreateSetting(settingsMap, AppSettingKey.OIDC_ENABLED, "false");

        assertThat(value).isEqualTo("false");
        assertThat(settingsMap).containsEntry(AppSettingKey.OIDC_ENABLED.getDbKey(), "false");
        verify(appSettingsRepository).save(argThat(setting ->
                AppSettingKey.OIDC_ENABLED.getDbKey().equals(setting.getName())
                        && "false".equals(setting.getVal())
        ));
    }
}
