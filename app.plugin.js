const { withAndroidManifest, withAppBuildGradle } = require('expo/config-plugins');

/**
 * Expo Config Plugin pro Android Health Connect
 * Přidává potřebné závislosti a oprávnění
 */
const withHealthConnect = (config) => {
  // Přidání oprávnění do AndroidManifest
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    // Přidání oprávnění pro Health Connect
    const permissions = [
      'android.permission.health.READ_STEPS',
      'android.permission.health.WRITE_STEPS',
    ];

    permissions.forEach((permission) => {
      if (!manifest['uses-permission'].find((p) => p.$['android:name'] === permission)) {
        manifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
      }
    });

    // Přidání Health Connect provider
    if (!manifest.application) {
      manifest.application = [{}];
    }
    const application = manifest.application[0];
    if (!application['queries']) {
      application['queries'] = [{}];
    }
    const queries = application['queries'][0];
    if (!queries.package) {
      queries.package = [];
    }
    
    // Health Connect package query
    if (!queries.package.find((p) => p.$['android:name'] === 'com.google.android.apps.healthdata')) {
      queries.package.push({
        $: { 'android:name': 'com.google.android.apps.healthdata' },
      });
    }

    return config;
  });

  // Přidání Health Connect SDK a minSdkVersion do build.gradle
  config = withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;
    
    // Nastavení minSdkVersion na 26
    if (!buildGradle.includes('minSdkVersion')) {
      const defaultConfigMatch = buildGradle.match(/defaultConfig\s*\{/);
      if (defaultConfigMatch) {
        const insertIndex = buildGradle.indexOf('\n', defaultConfigMatch.index + defaultConfigMatch[0].length);
        const minSdkLine = '        minSdkVersion 26\n';
        config.modResults.contents = 
          buildGradle.slice(0, insertIndex) + 
          minSdkLine + 
          buildGradle.slice(insertIndex);
      }
    }
    
    // Přidání závislosti Health Connect SDK
    if (!buildGradle.includes('androidx.health.connect:connect-client')) {
      const dependenciesMatch = buildGradle.match(/dependencies\s*\{/);
      if (dependenciesMatch) {
        const insertIndex = buildGradle.indexOf('}', dependenciesMatch.index);
        const healthConnectDependency = '    implementation "androidx.health.connect:connect-client:1.1.0-alpha07"\n';
        config.modResults.contents = 
          config.modResults.contents.slice(0, insertIndex) + 
          healthConnectDependency + 
          config.modResults.contents.slice(insertIndex);
      }
    }

    return config;
  });

  return config;
};

module.exports = withHealthConnect;

